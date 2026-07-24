from flask import Blueprint, request, jsonify
from database import get_db_connection
from utils import token_required, admin_required
import uuid

order_bp = Blueprint('orders', __name__)

@order_bp.route('/', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.json
    
    # Needs: address_id, subtotal, delivery_charge, total_amount, payment_method, items: [{product_id, quantity, price}]
    required = ['subtotal', 'total_amount', 'payment_method', 'items']
    if not all(k in data for k in required):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        # Generate an internal Order ID if not provided (e.g. VMSXXXXX)
        order_id = data.get('id', f"VMS{str(uuid.uuid4().int)[:5]}")

        with conn.cursor() as cursor:
            # 1. Insert Order
            sql = """
                INSERT INTO orders 
                (id, user_id, subtotal, delivery_charge, total_amount, payment_method, payment_status, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            # Payment status logic based on method
            payment_status = 'Paid' if 'Razorpay' in data['payment_method'] else 'Pending'

            cursor.execute(sql, (
                order_id,
                current_user['user_id'],
                data['subtotal'],
                data.get('delivery_charge', 0),
                data['total_amount'],
                data['payment_method'],
                payment_status,
                'Pending'
            ))

            # 2. Insert Order Items
            for item in data['items']:
                cursor.execute("""
                    INSERT INTO order_items (order_id, product_id, quantity, price)
                    VALUES (%s, %s, %s, %s)
                """, (
                    order_id,
                    item.get('product_id'), # might be None if mock data is used currently
                    item['quantity'],
                    item['price']
                ))

                # Optional: Decrement stock
                if item.get('product_id'):
                    cursor.execute("UPDATE products SET stock = stock - %s WHERE id = %s", (item['quantity'], item['product_id']))

            conn.commit()
            
            return jsonify({'success': True, 'message': 'Order created successfully', 'order_id': order_id}), 201

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@order_bp.route('/my-orders', methods=['GET'])
@token_required
def get_my_orders(current_user):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC", (current_user['user_id'],))
            orders = cursor.fetchall()
            
            # Fetch items for each order
            for order in orders:
                cursor.execute("""
                    SELECT oi.*, p.name 
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = %s
                """, (order['id'],))
                order['items'] = cursor.fetchall()

            return jsonify({'success': True, 'orders': orders}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

# --- ADMIN ROUTES ---

@order_bp.route('/', methods=['GET'])
@token_required
@admin_required
def get_all_orders(current_user):
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT o.*, u.name as user_name, u.phone as user_phone 
                FROM orders o
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC
            """)
            orders = cursor.fetchall()
            
            for order in orders:
                cursor.execute("""
                    SELECT oi.*, p.name 
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = %s
                """, (order['id'],))
                order['items'] = cursor.fetchall()

            return jsonify({'success': True, 'orders': orders}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()

@order_bp.route('/<order_id>/status', methods=['PUT'])
@token_required
@admin_required
def update_order_status(current_user, order_id):
    data = request.json
    status = data.get('status')
    
    if not status:
        return jsonify({'success': False, 'message': 'Status is required'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database error'}), 500

    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE orders SET status = %s WHERE id = %s", (status, order_id))
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({'success': False, 'message': 'Order not found'}), 404

            return jsonify({'success': True, 'message': 'Order status updated successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        conn.close()
