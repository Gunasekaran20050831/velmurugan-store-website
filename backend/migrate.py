import pymysql
from config import Config

def run_migrations():
    try:
        conn = pymysql.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )
        cursor = conn.cursor()
        
        # Alter categories
        print("Migrating categories...")
        try:
            cursor.execute("ALTER TABLE categories ADD COLUMN icon VARCHAR(255) AFTER image_url")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE categories ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active' AFTER icon")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE categories ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL")
        except pymysql.err.OperationalError: pass
        
        
        # Alter products
        print("Migrating products...")
        try:
            # We rename price to selling_price
            cursor.execute("ALTER TABLE products CHANGE COLUMN price selling_price DECIMAL(10,2) NOT NULL")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN slug VARCHAR(255) UNIQUE AFTER category_id")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN brand VARCHAR(255) AFTER name_ta")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN short_description TEXT AFTER brand")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN short_description_ta TEXT AFTER short_description")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN mrp DECIMAL(10,2) AFTER description_ta")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN discount_percent INT DEFAULT 0 AFTER selling_price")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN sku VARCHAR(100) AFTER stock")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN weight VARCHAR(50) AFTER sku")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN dimensions VARCHAR(100) AFTER weight")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN thumbnail VARCHAR(500) AFTER dimensions")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT FALSE AFTER images")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN trending BOOLEAN DEFAULT FALSE AFTER featured")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN best_seller BOOLEAN DEFAULT FALSE AFTER trending")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN active BOOLEAN DEFAULT TRUE AFTER best_seller")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN tags JSON AFTER active")
        except pymysql.err.OperationalError: pass
        
        try:
            cursor.execute("ALTER TABLE products ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL")
        except pymysql.err.OperationalError: pass
        
        conn.commit()
        print("Migration complete!")
    except Exception as e:
        print("Migration failed:", e)
    finally:
        if 'conn' in locals(): conn.close()

if __name__ == '__main__':
    run_migrations()
