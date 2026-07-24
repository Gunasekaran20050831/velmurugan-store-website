import os
import pymysql
import razorpay
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for the frontend React app (running on localhost:5173 typically)
CORS(app)

# Razorpay Client Setup
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_mock_key_id")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "rzp_test_mock_secret")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# Database Setup
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "velmurugan_store")

def get_db_connection():
    # Attempt to connect to MySQL database
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if conn:
        with conn.cursor() as cursor:
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                razorpay_order_id VARCHAR(255) NOT NULL,
                razorpay_payment_id VARCHAR(255),
                amount DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(50),
                payment_status VARCHAR(50) DEFAULT 'Pending',
                transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                customer_id VARCHAR(255),
                internal_order_id VARCHAR(255)
            )
            """)
        conn.commit()
        conn.close()

# Initialize DB on startup
init_db()

@app.route('/api/payment/create-order', methods=['POST'])
def create_order():
    try:
        data = request.json
        amount = int(data.get('amount', 0)) * 100 # Razorpay expects amount in paise
        currency = data.get('currency', 'INR')

        if amount <= 0:
            return jsonify({"error": "Invalid amount"}), 400

        # Create order in Razorpay
        razorpay_order = razorpay_client.order.create({
            "amount": amount,
            "currency": currency,
            "payment_capture": 1 # Auto capture
        })

        # Return the order id to the frontend
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
        
        # Additional data to store
        amount = data.get('amount')
        internal_order_id = data.get('internal_order_id')
        customer_phone = data.get('customer_phone')
        
        # Verify Signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }

        try:
            razorpay_client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            # Payment signature mismatch
            return jsonify({"success": False, "error": "Signature verification failed"}), 400

        # Payment is authentic, store details in DB
        conn = get_db_connection()
        if conn:
            with conn.cursor() as cursor:
                sql = """
                INSERT INTO transactions 
                (razorpay_order_id, razorpay_payment_id, amount, payment_method, payment_status, customer_id, internal_order_id) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (
                    razorpay_order_id,
                    razorpay_payment_id,
                    amount,
                    'Razorpay',
                    'Paid',
                    customer_phone,
                    internal_order_id
                ))
            conn.commit()
            conn.close()
        else:
            print("Warning: Database not available, transaction not saved to MySQL.")

        return jsonify({"success": True, "message": "Payment verified and stored successfully"}), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask Backend for Velmurugan Store on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
