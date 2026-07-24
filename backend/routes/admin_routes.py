from flask import Blueprint, jsonify, request
from database import get_db_connection
from utils import admin_required
import datetime
from decimal import Decimal

admin_bp = Blueprint('admin', __name__)

def dict_fetch_all(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

# JSON encoder helper if needed for decimals or dates
def convert_types(obj):
    if isinstance(obj, list):
        return [convert_types(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_types(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, datetime.date):
        return obj.isoformat()
    return obj


@admin_bp.route('/dashboard-stats', methods=['GET'])
@admin_required
def get_dashboard_stats(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Today's Revenue & Orders
        today = datetime.date.today()
        cursor.execute("SELECT COUNT(id) as today_orders, SUM(total_amount) as today_revenue FROM Orders WHERE DATE(created_at) = %s", (today,))
        today_stats = cursor.fetchone()

        # Total Customers
        cursor.execute("SELECT COUNT(id) as total_customers FROM Users WHERE role = 'customer'")
        total_customers = cursor.fetchone()[0]

        # Total Products
        cursor.execute("SELECT COUNT(id) as total_products FROM Products")
        total_products = cursor.fetchone()[0]

        # Order Statuses
        cursor.execute("SELECT status, COUNT(id) as count FROM Orders GROUP BY status")
        statuses = cursor.fetchall()
        
        pending_orders = sum([row[1] for row in statuses if row[0] == 'Pending'])
        completed_orders = sum([row[1] for row in statuses if row[0] == 'Delivered'])

        # AOV (Average Order Value)
        cursor.execute("SELECT AVG(total_amount) as aov FROM Orders WHERE status != 'Cancelled'")
        aov = cursor.fetchone()[0]

        return jsonify({
            'today_orders': today_stats[0] or 0,
            'today_revenue': float(today_stats[1] or 0),
            'total_customers': total_customers,
            'total_products': total_products,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'aov': float(aov or 0)
        }), 200

    except Exception as e:
        print(f"Error fetching stats: {e}")
        return jsonify({'message': 'Server error fetching stats'}), 500
    finally:
        cursor.close()
        conn.close()


@admin_bp.route('/revenue-chart', methods=['GET'])
@admin_required
def get_revenue_chart(current_user):
    # Returns daily revenue and orders for the last 30 days
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        thirty_days_ago = datetime.date.today() - datetime.timedelta(days=30)
        
        # MySQL DATE() function extracts date from datetime
        cursor.execute("""
            SELECT DATE(created_at) as order_date, 
                   SUM(total_amount) as daily_revenue, 
                   COUNT(id) as order_count 
            FROM Orders 
            WHERE created_at >= %s AND status != 'Cancelled'
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        """, (thirty_days_ago,))
        
        results = dict_fetch_all(cursor)
        
        # Convert Decimal/Date to serializable formats
        formatted_results = convert_types(results)
        
        return jsonify({'chart_data': formatted_results}), 200

    except Exception as e:
        print(f"Error fetching chart data: {e}")
        return jsonify({'message': 'Server error fetching chart data'}), 500
    finally:
        cursor.close()
        conn.close()


@admin_bp.route('/analytics/distribution', methods=['GET'])
@admin_required
def get_distribution_analytics(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Payment Method Distribution
        cursor.execute("SELECT payment_method, COUNT(id) as count FROM Orders GROUP BY payment_method")
        payment_distribution = dict_fetch_all(cursor)

        # Delivery Type Distribution
        cursor.execute("SELECT delivery_type, COUNT(id) as count FROM Orders GROUP BY delivery_type")
        delivery_distribution = dict_fetch_all(cursor)

        return jsonify({
            'payments': payment_distribution,
            'deliveries': delivery_distribution
        }), 200
    except Exception as e:
        print(f"Error fetching distribution data: {e}")
        return jsonify({'message': 'Server error fetching distribution data'}), 500
    finally:
        cursor.close()
        conn.close()
