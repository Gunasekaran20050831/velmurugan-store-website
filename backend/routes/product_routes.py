import json
import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database import get_db_connection
from utils import token_required, admin_required

product_bp = Blueprint('products', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def generate_slug(name, cursor):
    base_slug = name.lower().replace(' ', '-').replace('/', '-')
    slug = base_slug
    counter = 1
    while True:
        cursor.execute("SELECT id FROM products WHERE slug = %s", (slug,))
        if not cursor.fetchone():
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1

@product_bp.route('/', methods=['GET'])
def get_products():
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 50, type=int)
    offset = (page - 1) * limit
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'DESC')
    include_deleted = request.args.get('include_deleted', 'false').lower() == 'true'
    
    try:
        with conn.cursor() as cursor:
            query = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1"
            params = []
            
            if not include_deleted:
                query += " AND p.deleted_at IS NULL"
                
            if search:
                query += " AND (p.name LIKE %s OR p.description LIKE %s OR p.sku LIKE %s)"
                params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
                
            if category:
                query += " AND c.name = %s"
                params.append(category)

            allowed_sorts = ['id', 'name', 'selling_price', 'stock', 'created_at']
            if sort_by not in allowed_sorts:
                sort_by = 'created_at'
            if sort_order not in ['ASC', 'DESC']:
                sort_order = 'DESC'
                
            query += f" ORDER BY p.{sort_by} {sort_order} LIMIT %s OFFSET %s"
            params.extend([limit, offset])

            cursor.execute(query, params)
            products = cursor.fetchall()
            
            for p in products:
                if isinstance(p['images'], str):
                    p['images'] = json.loads(p['images'])
                else:
                    p['images'] = p['images'] or []
                
                if isinstance(p['tags'], str):
                    p['tags'] = json.loads(p['tags'])
                else:
                    p['tags'] = p['tags'] or []

            count_query = "SELECT COUNT(p.id) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1"
            count_params = []
            if not include_deleted:
                count_query += " AND p.deleted_at IS NULL"
            if search:
                count_query += " AND (p.name LIKE %s OR p.description LIKE %s OR p.sku LIKE %s)"
                count_params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
            if category:
                count_query += " AND c.name = %s"
                count_params.append(category)
                
            cursor.execute(count_query, count_params)
            total = cursor.fetchone()['total']

            return jsonify({
                'success': True, 
                'products': products, 
                'total': total,
                'page': page,
                'pages': (total + limit - 1) // limit if limit > 0 else 0
            }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@product_bp.route('/<identifier>', methods=['GET'])
def get_product(identifier):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            if identifier.isdigit():
                cursor.execute("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = %s", (identifier,))
            else:
                cursor.execute("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = %s", (identifier,))
                
            product = cursor.fetchone()
            if not product:
                return jsonify({'success': False, 'message': 'Product not found'}), 404
            
            if isinstance(product['images'], str):
                product['images'] = json.loads(product['images'])
            else:
                product['images'] = product['images'] or []
                
            if isinstance(product['tags'], str):
                product['tags'] = json.loads(product['tags'])
            else:
                product['tags'] = product['tags'] or []

            return jsonify({'success': True, 'product': product}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

# --- ADMIN ROUTES ---

@product_bp.route('/', methods=['POST'])
@token_required
@admin_required
def create_product(current_user):
    is_json = request.is_json
    data = request.json if is_json else request.form.to_dict()
    
    required = ['name', 'selling_price', 'category_id']
    if not all(k in data for k in required):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            image_urls = []
            if not is_json and 'files' in request.files:
                files = request.files.getlist('files')
                for file in files:
                    if file and file.filename:
                        filename = secure_filename(file.filename)
                        unique_filename = f"{uuid.uuid4().hex}_{filename}"
                        file.save(os.path.join(UPLOAD_FOLDER, unique_filename))
                        image_urls.append(f"/static/uploads/{unique_filename}")
            elif 'images' in data:
                imgs = data['images']
                if isinstance(imgs, str):
                    try: imgs = json.loads(imgs)
                    except: imgs = []
                image_urls = imgs

            thumbnail = data.get('thumbnail', image_urls[0] if image_urls else None)
            slug = data.get('slug') or generate_slug(data['name'], cursor)
            tags = data.get('tags', [])
            if isinstance(tags, str):
                try: tags = json.loads(tags)
                except: tags = []

            sql = """
                INSERT INTO products 
                (category_id, slug, name, name_ta, brand, short_description, short_description_ta, 
                 description, description_ta, mrp, selling_price, discount_percent, stock, sku, 
                 weight, dimensions, thumbnail, images, featured, trending, best_seller, active, tags)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['category_id'], slug, data['name'], data.get('name_ta', ''), data.get('brand', ''),
                data.get('short_description', ''), data.get('short_description_ta', ''),
                data.get('description', ''), data.get('description_ta', ''),
                data.get('mrp', None), data['selling_price'], data.get('discount_percent', 0),
                data.get('stock', 0), data.get('sku', ''), data.get('weight', ''),
                data.get('dimensions', ''), thumbnail, json.dumps(image_urls),
                bool(data.get('featured', False)), bool(data.get('trending', False)),
                bool(data.get('best_seller', False)), bool(data.get('active', True)), json.dumps(tags)
            ))
            conn.commit()
            return jsonify({'success': True, 'message': 'Product created successfully', 'product_id': cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@product_bp.route('/<int:product_id>', methods=['PUT'])
@token_required
@admin_required
def update_product(current_user, product_id):
    is_json = request.is_json
    data = request.json if is_json else request.form.to_dict()
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT images FROM products WHERE id = %s", (product_id,))
            existing = cursor.fetchone()
            if not existing:
                return jsonify({'success': False, 'message': 'Product not found'}), 404
            
            existing_images = json.loads(existing['images']) if isinstance(existing['images'], str) else (existing['images'] or [])
            image_urls = []
            if not is_json and 'files' in request.files:
                for file in request.files.getlist('files'):
                    if file and file.filename:
                        filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
                        file.save(os.path.join(UPLOAD_FOLDER, filename))
                        image_urls.append(f"/static/uploads/{filename}")
            
            if 'images' in data:
                imgs = data['images']
                image_urls = (json.loads(imgs) if isinstance(imgs, str) else imgs) + image_urls
            else:
                image_urls = existing_images + image_urls

            update_fields = []
            values = []
            for key in ['category_id', 'slug', 'name', 'name_ta', 'brand', 'short_description', 'short_description_ta', 'description', 'description_ta', 'mrp', 'selling_price', 'discount_percent', 'stock', 'sku', 'weight', 'dimensions', 'thumbnail']:
                if key in data:
                    update_fields.append(f"{key} = %s")
                    values.append(data[key])
            for key in ['featured', 'trending', 'best_seller', 'active']:
                if key in data:
                    update_fields.append(f"{key} = %s")
                    values.append(str(data[key]).lower() == 'true')
            if 'tags' in data:
                update_fields.append("tags = %s")
                values.append(json.dumps(json.loads(data['tags']) if isinstance(data['tags'], str) else data['tags']))
            if image_urls != existing_images or 'images' in data:
                update_fields.append("images = %s")
                values.append(json.dumps(image_urls))
            
            if not update_fields:
                return jsonify({'success': False, 'message': 'No fields to update'}), 400

            values.append(product_id)
            cursor.execute(f"UPDATE products SET {', '.join(update_fields)} WHERE id = %s", values)
            conn.commit()
            return jsonify({'success': True, 'message': 'Product updated successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@product_bp.route('/<int:product_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_product(current_user, product_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE products SET deleted_at = CURRENT_TIMESTAMP, active = FALSE WHERE id = %s", (product_id,))
            conn.commit()
            if cursor.rowcount == 0:
                return jsonify({'success': False, 'message': 'Product not found'}), 404
            return jsonify({'success': True, 'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@product_bp.route('/<int:product_id>/restore', methods=['PUT'])
@token_required
@admin_required
def restore_product(current_user, product_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE products SET deleted_at = NULL, active = TRUE WHERE id = %s", (product_id,))
            conn.commit()
            if cursor.rowcount == 0:
                return jsonify({'success': False, 'message': 'Product not found'}), 404
            return jsonify({'success': True, 'message': 'Product restored successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()
