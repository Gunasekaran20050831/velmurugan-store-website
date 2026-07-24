import jwt
import bcrypt
import datetime
from functools import wraps
from flask import request, jsonify
from config import Config

def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_tokens(user_id, role):
    # Access Token (Valid for 15 minutes)
    access_token_payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }
    access_token = jwt.encode(access_token_payload, Config.SECRET_KEY, algorithm='HS256')

    # Refresh Token (Valid for 7 days)
    refresh_token_payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    refresh_token = jwt.encode(refresh_token_payload, Config.SECRET_KEY, algorithm='HS256')

    return access_token, refresh_token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Extract Bearer token
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'success': False, 'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            current_user = {
                'user_id': data['user_id'],
                'role': data['role']
            }
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.get('role') != 'admin':
            return jsonify({'success': False, 'message': 'Admin privileges required!'}), 403
        return f(current_user, *args, **kwargs)
    return decorated
