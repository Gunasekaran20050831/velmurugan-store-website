import json
from flask import Blueprint, request, jsonify
from database import get_db_connection
from utils import token_required, admin_required

product_bp = Blueprint('products', __name__)

@product_bp.route('/', methods=['GET'])
def get_products():
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT p.*, c.name as category_name 
                FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id
            """)
            products = cursor.fetchall()
            
            # Parse JSON strings back to lists for frontend
            for p in products:
                if isinstance(p['images'], str):
                    p['images'] = json.loads(p['images'])
                else:
                    p['images'] = p['images'] or []

            return jsonify({'success': True, 'products': products}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
            product = cursor.fetchone()
            if not product:
                return jsonify({'success': False, 'message': 'Product not found'}), 404
            
            if isinstance(product['images'], str):
                product['images'] = json.loads(product['images'])

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
    data = request.json
    # Basic validation
    required = ['name', 'price', 'category_id']
    if not all(k in data for k in required):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            images_json = json.dumps(data.get('images', []))
            sql = """
                INSERT INTO products 
                (category_id, name, name_ta, price, stock, description, description_ta, images)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['category_id'],
                data['name'],
                data.get('name_ta', ''),
                data['price'],
                data.get('stock', 0),
                data.get('description', ''),
                data.get('description_ta', ''),
                images_json
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
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            # We will just dynamically build the update query based on provided fields
            update_fields = []
            values = []
            for key in ['category_id', 'name', 'name_ta', 'price', 'stock', 'description', 'description_ta']:
                if key in data:
                    update_fields.append(f"{key} = %s")
                    values.append(data[key])
            
            if 'images' in data:
                update_fields.append("images = %s")
                values.append(json.dumps(data['images']))

            if not update_fields:
                return jsonify({'success': False, 'message': 'No fields to update'}), 400

            values.append(product_id)
            sql = f"UPDATE products SET {', '.join(update_fields)} WHERE id = %s"
            
            cursor.execute(sql, values)
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({'success': False, 'message': 'Product not found or no changes made'}), 404

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
            cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({'success': False, 'message': 'Product not found'}), 404

            return jsonify({'success': True, 'message': 'Product deleted successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()
