import pymysql
from config import Config
from utils import hash_password

def get_db_connection():
    try:
        # First connect without database to create it if it doesn't exist
        temp_conn = pymysql.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            cursorclass=pymysql.cursors.DictCursor
        )
        with temp_conn.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.DB_NAME}")
        temp_conn.commit()
        temp_conn.close()

        # Now connect to the specific database
        conn = pymysql.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME,
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except pymysql.err.OperationalError as e:
        if e.args[0] == 2003:
            print("\n" + "="*60)
            print("[CRITICAL ERROR]: MySQL service is not running!")
            print("Please start your local MySQL server (XAMPP, WAMP, or Docker).")
            print("="*60 + "\n")
        else:
            print(f"Database operational error: {e}")
        return None
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if not conn:
        return

    try:
        with conn.cursor() as cursor:
            # Users Table (covers Admins via role)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(20) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role ENUM('customer', 'admin') DEFAULT 'customer',
                avatar_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX(phone),
                INDEX(email)
            )
            """)

            # Categories Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                name_ta VARCHAR(255),
                image_url VARCHAR(500),
                icon VARCHAR(255),
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL
            )
            """)

            # Products Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT,
                slug VARCHAR(255) UNIQUE,
                name VARCHAR(255) NOT NULL,
                name_ta VARCHAR(255),
                brand VARCHAR(255),
                short_description TEXT,
                short_description_ta TEXT,
                description TEXT,
                description_ta TEXT,
                mrp DECIMAL(10,2),
                selling_price DECIMAL(10,2) NOT NULL,
                discount_percent INT DEFAULT 0,
                stock INT DEFAULT 0,
                sku VARCHAR(100),
                weight VARCHAR(50),
                dimensions VARCHAR(100),
                thumbnail VARCHAR(500),
                images JSON,
                featured BOOLEAN DEFAULT FALSE,
                trending BOOLEAN DEFAULT FALSE,
                best_seller BOOLEAN DEFAULT FALSE,
                active BOOLEAN DEFAULT TRUE,
                tags JSON,
                rating DECIMAL(2,1) DEFAULT 0.0,
                rating_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
                INDEX(name),
                INDEX(slug)
            )
            """)

            # Addresses Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                address_line TEXT NOT NULL,
                city VARCHAR(100),
                pincode VARCHAR(20),
                is_default BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """)

            # Orders Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(100) PRIMARY KEY,
                user_id INT,
                address_id INT,
                subtotal DECIMAL(10,2) NOT NULL,
                delivery_charge DECIMAL(10,2) DEFAULT 0,
                total_amount DECIMAL(10,2) NOT NULL,
                status ENUM('Pending', 'Accepted', 'Preparing', 'Out For Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
                payment_method VARCHAR(50),
                payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
                delivery_type ENUM('delivery', 'pickup') DEFAULT 'delivery',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE SET NULL,
                INDEX(status),
                INDEX(payment_status)
            )
            """)

            # Order Items Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(100) NOT NULL,
                product_id INT,
                quantity INT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
            )
            """)

            # Transactions Table (Razorpay)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                razorpay_order_id VARCHAR(255) NOT NULL,
                razorpay_payment_id VARCHAR(255),
                amount DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(50),
                payment_status VARCHAR(50) DEFAULT 'Pending',
                internal_order_id VARCHAR(100),
                transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (internal_order_id) REFERENCES orders(id) ON DELETE CASCADE
            )
            """)

            # Reviews Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                user_id INT NOT NULL,
                rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """)

            # Wishlist Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS wishlist (
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, product_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
            """)

            # Notifications Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """)

            # Seed default admin user
            cursor.execute("SELECT id FROM users WHERE email = %s OR phone = %s", ('guna123@gmail.com', '6381761104'))
            if not cursor.fetchone():
                admin_pw = hash_password('guna123')
                cursor.execute("""
                    INSERT INTO users (name, email, phone, password_hash, role)
                    VALUES (%s, %s, %s, %s, %s)
                """, ('Guna', 'guna123@gmail.com', '6381761104', admin_pw, 'admin'))
                print("Default admin user 'Guna' created successfully.")

        conn.commit()
    except Exception as e:
        print(f"Error initializing DB schema: {e}")
    finally:
        conn.close()
