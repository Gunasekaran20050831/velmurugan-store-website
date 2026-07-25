import requests
import json
import uuid

BASE_URL = "http://localhost:5000/api"

print("=======================================")
print("  VELMURUGAN STORE - BACKEND QA TESTS  ")
print("=======================================\n")

# State to track
state = {
    "admin_token": None,
    "customer_token": None,
    "category_id": None,
    "product_id": None
}

def print_result(name, success, info=""):
    status = "[PASS]" if success else "[FAIL]"
    print(f"{status} | {name} {info}")

# --- 1. AUTHENTICATION TESTS ---
print("--- AUTHENTICATION ---")

# 1.1 Admin Login
try:
    res = requests.post(f"{BASE_URL}/auth/login", json={"login_id": "guna123@gmail.com", "password": "guna123"})
    if res.status_code == 200 and res.json().get('success'):
        state['admin_token'] = res.json()['access_token']
        print_result("Admin Login", True)
    else:
        print_result("Admin Login", False, res.text)
except Exception as e:
    print_result("Admin Login", False, str(e))

# 1.2 Customer Registration & Login
test_email = f"testuser_{uuid.uuid4().hex[:6]}@gmail.com"
try:
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Test Customer",
        "phone": f"98765{uuid.uuid4().hex[:5]}",
        "email": test_email,
        "password": "password123"
    })
    if res.status_code == 201:
        state['customer_token'] = res.json()['access_token']
        print_result("Customer Registration", True)
    else:
        print_result("Customer Registration", False, res.text)
except Exception as e:
    print_result("Customer Registration", False, str(e))

# --- 2. CATEGORY CRUD TESTS ---
print("\n--- CATEGORIES ---")
headers_admin = {"Authorization": f"Bearer {state['admin_token']}"} if state['admin_token'] else {}
headers_customer = {"Authorization": f"Bearer {state['customer_token']}"} if state['customer_token'] else {}

# 2.1 Create Category (Admin)
try:
    res = requests.post(f"{BASE_URL}/categories/", json={"name": "QA Test Category"}, headers=headers_admin)
    if res.status_code == 201:
        state['category_id'] = res.json()['category_id']
        print_result("Create Category (Admin)", True)
    else:
        print_result("Create Category (Admin)", False, res.text)
except Exception as e:
    print_result("Create Category (Admin)", False, str(e))

# 2.2 Get Categories (Public)
try:
    res = requests.get(f"{BASE_URL}/categories/")
    if res.status_code == 200 and len(res.json().get('categories', [])) > 0:
        print_result("Get Categories", True)
    else:
        print_result("Get Categories", False, res.text)
except Exception as e:
    print_result("Get Categories", False, str(e))

# --- 3. PRODUCT CRUD TESTS ---
print("\n--- PRODUCTS ---")

# 3.1 Create Product (Admin)
try:
    if state['category_id']:
        res = requests.post(f"{BASE_URL}/products/", json={
            "name": "QA Test Product",
            "category_id": state['category_id'],
            "selling_price": 99.99,
            "stock": 50,
            "description": "This is a QA test product."
        }, headers=headers_admin)
        if res.status_code == 201:
            state['product_id'] = res.json()['product_id']
            print_result("Create Product (Admin)", True)
        else:
            print_result("Create Product (Admin)", False, res.text)
    else:
        print_result("Create Product (Admin)", False, "Skipped due to missing category_id")
except Exception as e:
    print_result("Create Product (Admin)", False, str(e))

# 3.2 Create Product (Customer) -> Should Fail (Role-based testing)
try:
    if state['category_id']:
        res = requests.post(f"{BASE_URL}/products/", json={
            "name": "Hacked Product",
            "category_id": state['category_id'],
            "selling_price": 1.99
        }, headers=headers_customer)
        if res.status_code in [401, 403]:
            print_result("Create Product Auth Restriction (Customer)", True, "Properly Blocked")
        else:
            print_result("Create Product Auth Restriction (Customer)", False, "Allowed unauthorized access!")
except Exception as e:
    print_result("Create Product Auth Restriction (Customer)", False, str(e))

# 3.3 Get Products (Public)
try:
    res = requests.get(f"{BASE_URL}/products/")
    if res.status_code == 200:
        print_result("Get Products List", True)
    else:
        print_result("Get Products List", False, res.text)
except Exception as e:
    print_result("Get Products List", False, str(e))

# 3.4 Get Single Product
try:
    if state['product_id']:
        res = requests.get(f"{BASE_URL}/products/{state['product_id']}")
        if res.status_code == 200:
            print_result("Get Single Product", True)
        else:
            print_result("Get Single Product", False, res.text)
except Exception as e:
    print_result("Get Single Product", False, str(e))

# 3.5 Soft Delete Product
try:
    if state['product_id']:
        res = requests.delete(f"{BASE_URL}/products/{state['product_id']}", headers=headers_admin)
        if res.status_code == 200:
            print_result("Soft Delete Product", True)
        else:
            print_result("Soft Delete Product", False, res.text)
except Exception as e:
    print_result("Soft Delete Product", False, str(e))


# --- 4. ADMIN DASHBOARD TESTS ---
print("\n--- ADMIN DASHBOARD ---")
try:
    res = requests.get(f"{BASE_URL}/admin/dashboard-stats", headers=headers_admin)
    if res.status_code == 200:
        print_result("Dashboard Stats", True)
    else:
        print_result("Dashboard Stats", False, res.text)
except Exception as e:
    print_result("Dashboard Stats", False, str(e))

try:
    res = requests.get(f"{BASE_URL}/admin/customers", headers=headers_admin)
    if res.status_code == 200:
        print_result("Customer List", True)
    else:
        print_result("Customer List", False, res.text)
except Exception as e:
    print_result("Customer List", False, str(e))

print("\nQA Backend Tests Completed.")
