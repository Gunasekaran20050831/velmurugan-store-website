import os
import razorpay
from flask import Flask, request, jsonify
from flask_cors import CORS

from config import Config
from database import init_db, get_db_connection
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.order_routes import order_bp
from utils import token_required

app = Flask(__name__)
# Enable CORS for frontend
CORS(app)

# Initialize Database Schema
init_db()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(product_bp, url_prefix='/api/products')
app.register_blueprint(order_bp, url_prefix='/api/orders')

# Razorpay Client
razorpay_client = razorpay.Client(auth=(Config.RAZORPAY_KEY_ID, Config.RAZORPAY_KEY_SECRET))

# ---------------------------------------------------------
# RAZORPAY PAYMENT ROUTES (Moved here for now, can be extracted to payment_routes.py later)
# ---------------------------------------------------------

@app.route('/api/payment/create-order', methods=['POST'])
def create_order():
    try:
        data = request.json
        amount = int(data.get('amount', 0)) * 100 
        currency = data.get('currency', 'INR')

        if amount <= 0:
            return jsonify({"error": "Invalid amount"}), 400

        razorpay_order = razorpay_client.order.create({
            "amount": amount,
            "currency": currency,
            "payment_capture": 1
        })

        return jsonify({
            "success": True,
            "order_id": razorpay_order['id'],
            "amount": amount,
            "currency": currency
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/payment/verify-signature', methods=['POST'])
def verify_signature():
    try:
        data = request.json
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        
        amount = data.get('amount')
        internal_order_id = data.get('internal_order_id')
        customer_phone = data.get('customer_phone')
        
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            return jsonify({"success": False, "error": "Signature verification failed"}), 400

        conn = get_db_connection()
        if conn:
            with conn.cursor() as cursor:
                # Find user ID by phone if available (mocking customer_id link)
                cursor.execute("SELECT id FROM users WHERE phone = %s", (customer_phone,))
                user_res = cursor.fetchone()
                user_id = user_res['id'] if user_res else None

                sql = """
                INSERT INTO transactions 
                (razorpay_order_id, razorpay_payment_id, amount, payment_method, payment_status, internal_order_id) 
                VALUES (%s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    razorpay_order_id,
                    razorpay_payment_id,
                    amount,
                    'Razorpay',
                    'Paid',
                    internal_order_id
                ))
            conn.commit()
            conn.close()

        return jsonify({"success": True, "message": "Payment verified"}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Velmurugan Store API is running'}), 200

if __name__ == '__main__':
    print("Starting Velmurugan Store Production Backend...")
    app.run(host='0.0.0.0', port=5000, debug=True)
