from flask import Blueprint, request, jsonify
from database import get_db_connection
from utils import hash_password, check_password, generate_tokens, token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')

    if not all([name, phone, password]):
        return jsonify({'success': False, 'message': 'Missing required fields (name, phone, password)'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'MySQL service is not running. Please start your local MySQL server (XAMPP/Docker).'}), 503

    try:
        with conn.cursor() as cursor:
            # Check if user exists
            cursor.execute("SELECT id FROM users WHERE phone = %s OR email = %s", (phone, email))
            if cursor.fetchone():
                return jsonify({'success': False, 'message': 'User with this phone or email already exists'}), 409

            hashed_pw = hash_password(password)
            role = 'customer'

            # Insert user
            cursor.execute(
                "INSERT INTO users (name, email, phone, password_hash, role) VALUES (%s, %s, %s, %s, %s)",
                (name, email, phone, hashed_pw, role)
            )
            conn.commit()

            user_id = cursor.lastrowid
            
            # Generate Tokens
            access_token, refresh_token = generate_tokens(user_id, role)

            return jsonify({
                'success': True,
                'message': 'User registered successfully',
                'user': {
                    'id': user_id,
                    'name': name,
                    'email': email,
                    'phone': phone,
                    'role': role
                },
                'access_token': access_token,
                'refresh_token': refresh_token
            }), 201

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    login_id = data.get('login_id') # can be email or phone
    password = data.get('password')

    if not all([login_id, password]):
        return jsonify({'success': False, 'message': 'Missing credentials'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'MySQL service is not running. Please start your local MySQL server (XAMPP/Docker).'}), 503

    try:
        with conn.cursor() as cursor:
            # Fetch user
            cursor.execute(
                "SELECT id, name, email, phone, password_hash, role FROM users WHERE phone = %s OR email = %s",
                (login_id, login_id)
            )
            user = cursor.fetchone()

            if not user or not check_password(password, user['password_hash']):
                return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

            access_token, refresh_token = generate_tokens(user['id'], user['role'])

            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user['id'],
                    'name': user['name'],
                    'email': user['email'],
                    'phone': user['phone'],
                    'role': user['role']
                },
                'access_token': access_token,
                'refresh_token': refresh_token
            }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@auth_bp.route('/login-otp', methods=['POST'])
def login_otp():
    data = request.json
    phone = data.get('phone')
    otp = data.get('otp')

    if not phone or not otp:
        return jsonify({'success': False, 'message': 'Missing phone or OTP'}), 400

    # Development mode demo OTP
    if otp != '1234':
        return jsonify({'success': False, 'message': 'Invalid OTP. Use 1234 for demo.'}), 401

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'MySQL service is not running. Please start your local MySQL server (XAMPP/Docker).'}), 503

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, phone, role FROM users WHERE phone = %s",
                (phone,)
            )
            user = cursor.fetchone()

            if not user:
                return jsonify({'success': False, 'message': 'User not found with this mobile number.'}), 404

            access_token, refresh_token = generate_tokens(user['id'], user['role'])

            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': {
                    'id': user['id'],
                    'name': user['name'],
                    'email': user['email'],
                    'phone': user['phone'],
                    'role': user['role']
                },
                'access_token': access_token,
                'refresh_token': refresh_token
            }), 200

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT id, name, email, phone, role, avatar_url FROM users WHERE id = %s",
                (current_user['user_id'],)
            )
            user = cursor.fetchone()
            if not user:
                return jsonify({'success': False, 'message': 'User not found'}), 404
            
            return jsonify({'success': True, 'user': user}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()
