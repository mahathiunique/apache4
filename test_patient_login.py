import requests

BASE_URL = "http://127.0.0.1:8000"

print("Logging in as patient...")
login_res = requests.post(f"{BASE_URL}/token", data={"username": "patient_testpatient@apollo.com", "password": "patient123"})
print("Login status:", login_res.status_code)
if login_res.status_code == 200:
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    me_res = requests.get(f"{BASE_URL}/users/me", headers=headers)
    print("Users me status:", me_res.status_code)
    print("Users me output:", me_res.json())
    
    patient_res = requests.get(f"{BASE_URL}/patients/1", headers=headers)
    print("Patients 1 status:", patient_res.status_code)
    print("Patients 1 output:", patient_res.json())
else:
    print("Login output:", login_res.text)
