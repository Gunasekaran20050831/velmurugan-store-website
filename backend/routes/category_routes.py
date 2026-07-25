import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database import get_db_connection
from utils import token_required, admin_required

category_bp = Blueprint('categories', __name__)
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@category_bp.route('/', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500
        
    include_deleted = request.args.get('include_deleted', 'false').lower() == 'true'

    try:
        with conn.cursor() as cursor:
            query = "SELECT * FROM categories"
            if not include_deleted:
                query += " WHERE deleted_at IS NULL"
            cursor.execute(query)
            categories = cursor.fetchall()
            return jsonify({'success': True, 'categories': categories}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

# --- ADMIN ROUTES ---

@category_bp.route('/', methods=['POST'])
@token_required
@admin_required
def create_category(current_user):
    is_json = request.is_json
    data = request.json if is_json else request.form.to_dict()
    
    if 'name' not in data:
        return jsonify({'success': False, 'message': 'Missing category name'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            image_url = data.get('image_url')
            icon = data.get('icon')
            
            if not is_json:
                if 'image_file' in request.files and request.files['image_file'].filename:
                    file = request.files['image_file']
                    filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    image_url = f"/static/uploads/{filename}"
                if 'icon_file' in request.files and request.files['icon_file'].filename:
                    file = request.files['icon_file']
                    filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    icon = f"/static/uploads/{filename}"

            sql = "INSERT INTO categories (name, name_ta, image_url, icon, status) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(sql, (
                data['name'], 
                data.get('name_ta'), 
                image_url, 
                icon, 
                data.get('status', 'active')
            ))
            conn.commit()
            return jsonify({'success': True, 'message': 'Category created successfully', 'category_id': cursor.lastrowid}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@category_bp.route('/<int:category_id>', methods=['PUT'])
@token_required
@admin_required
def update_category(current_user, category_id):
    is_json = request.is_json
    data = request.json if is_json else request.form.to_dict()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            update_fields = []
            values = []
            
            for key in ['name', 'name_ta', 'status']:
                if key in data:
                    update_fields.append(f"{key} = %s")
                    values.append(data[key])
                    
            if not is_json:
                if 'image_file' in request.files and request.files['image_file'].filename:
                    file = request.files['image_file']
                    filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    update_fields.append("image_url = %s")
                    values.append(f"/static/uploads/{filename}")
                if 'icon_file' in request.files and request.files['icon_file'].filename:
                    file = request.files['icon_file']
                    filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
                    file.save(os.path.join(UPLOAD_FOLDER, filename))
                    update_fields.append("icon = %s")
                    values.append(f"/static/uploads/{filename}")
            
            if 'image_url' in data:
                update_fields.append("image_url = %s")
                values.append(data['image_url'])
            if 'icon' in data:
                update_fields.append("icon = %s")
                values.append(data['icon'])

            if not update_fields:
                return jsonify({'success': False, 'message': 'No fields to update'}), 400

            values.append(category_id)
            cursor.execute(f"UPDATE categories SET {', '.join(update_fields)} WHERE id = %s", values)
            conn.commit()
            
            return jsonify({'success': True, 'message': 'Category updated successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@category_bp.route('/<int:category_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_category(current_user, category_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE categories SET deleted_at = CURRENT_TIMESTAMP, status = 'inactive' WHERE id = %s", (category_id,))
            conn.commit()
            return jsonify({'success': True, 'message': 'Category soft deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()
