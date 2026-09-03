import sys
import traceback

print("Testing app imports and endpoints...")

try:
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
    
    print("1. Health check:")
    res = client.get("/")
    print("   Status:", res.status_code, res.json())
    
    print("2. Register user:")
    res = client.post("/api/v1/auth/register", json={
        "email": "testuser@example.com",
        "full_name": "Test User",
        "password": "Password123!"
    })
    print("   Status:", res.status_code, res.text)
    token = None
    if res.status_code in (200, 201):
        token = res.json().get("access_token")
    elif res.status_code == 400:
        # maybe user already exists, try login
        res_login = client.post("/api/v1/auth/login", json={
            "email": "testuser@example.com",
            "password": "Password123!"
        })
        print("   Login status:", res_login.status_code, res_login.text)
        if res_login.status_code == 200:
            token = res_login.json().get("access_token")
            
    headers = {"Authorization": f"Bearer {token}"} if token else {}

    print("3. Get user profile /auth/me:")
    res = client.get("/api/v1/auth/me", headers=headers)
    print("   Status:", res.status_code, res.text)

    print("4. Scam detector analyze:")
    res = client.post("/api/v1/scam-detector/analyze", headers=headers, json={
        "channel_type": "SMS",
        "content": "URGENT: Your bank account will be blocked within 24 hours. Update KYC now at http://fake-bank-login.xyz",
        "sender_info": "+919876543210"
    })
    print("   Status:", res.status_code, res.text)

    print("5. Scam detector history:")
    res = client.get("/api/v1/scam-detector/history", headers=headers)
    print("   Status:", res.status_code, res.text)

    print("6. URL scanner scan:")
    res = client.post("/api/v1/url-scanner/scan", headers=headers, json={
        "url": "http://suspicious-bank-login.xyz/verify"
    })
    print("   Status:", res.status_code, res.text)

    print("7. URL scanner history:")
    res = client.get("/api/v1/url-scanner/history", headers=headers)
    print("   Status:", res.status_code, res.text)

    print("8. File scanner upload:")
    files = {"file": ("test.pdf", b"%PDF-1.4 Fake PDF Content with /JavaScript", "application/pdf")}
    res = client.post("/api/v1/file-scanner/upload", headers=headers, files=files)
    print("   Status:", res.status_code, res.text)

    print("9. File scanner history:")
    res = client.get("/api/v1/file-scanner/history", headers=headers)
    print("   Status:", res.status_code, res.text)

    print("10. Complaints create:")
    res = client.post("/api/v1/complaints/", headers=headers, data={
        "fraud_type": "Phishing Call",
        "description": "Scammer called pretending to be SBI manager asking for OTP",
        "transaction_id": "TXN998877",
        "bank_name": "State Bank of India",
        "phone_number": "+919876543210"
    })
    print("   Status:", res.status_code, res.text)

    print("11. Complaints list:")
    res = client.get("/api/v1/complaints/", headers=headers)
    print("   Status:", res.status_code, res.text)

    print("12. Chatbot message:")
    res = client.post("/api/v1/chatbot/message", headers=headers, json={
        "message": "What is digital arrest scam?"
    })
    print("   Status:", res.status_code, res.text)

    print("13. Chatbot history:")
    res = client.get("/api/v1/chatbot/history", headers=headers)
    print("   Status:", res.status_code, res.text)

    print("14. Register admin user:")
    res_admin = client.post("/api/v1/auth/register/admin", json={
        "email": "adminuser@example.com",
        "full_name": "Admin User",
        "password": "AdminPassword123!"
    })
    print("   Admin Register Status:", res_admin.status_code, res_admin.text)
    admin_token = None
    if res_admin.status_code in (200, 201):
        admin_token = res_admin.json().get("access_token")
    else:
        res_admin_login = client.post("/api/v1/auth/login", json={
            "email": "adminuser@example.com",
            "password": "AdminPassword123!"
        })
        if res_admin_login.status_code == 200:
            admin_token = res_admin_login.json().get("access_token")

    admin_headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}

    print("15. Admin stats:")
    res = client.get("/api/v1/admin/stats", headers=admin_headers)
    print("   Status:", res.status_code, res.text)

    print("16. Admin users:")
    res = client.get("/api/v1/admin/users", headers=admin_headers)
    print("   Status:", res.status_code, res.text)

    print("17. Admin complaints:")
    res = client.get("/api/v1/admin/complaints", headers=admin_headers)
    print("   Status:", res.status_code, res.text)

except Exception as e:
    print("EXCEPTION OCCURRED:", e)
    traceback.print_exc()
