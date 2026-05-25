import requests

BASE_URL = "http://127.0.0.1:8000"

print("1. Logging in as admin...")
login_res = requests.post(f"{BASE_URL}/token", data={"username": "admin@apollo.com", "password": "apollo123"})
if login_res.status_code != 200:
    print("Login failed:", login_res.text)
    exit(1)

token = login_res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("2. Creating a test patient...")
patient_data = {
    "name": "Test Patient",
    "age": 65.0,
    "heart_rate": 88.0,
    "map": 75.0,
    "fio2": 0.4,
    "creatinine": 1.2,
    "albumin": 3.5,
    "aps_score": 40.0,
    "apache_iv_score": 60.0,
    "respiratory_rate": 18.0,
    "oxygen_saturation": 96.0,
    "blood_pressure": 120.0,
    "temperature": 37.2,
    "glucose": 110.0
}
patient_res = requests.post(f"{BASE_URL}/patients", json=patient_data, headers=headers)
if patient_res.status_code != 200:
    print("Patient creation failed:", patient_res.text)
    exit(1)
patient_id = patient_res.json()["id"]

print("3. Running prediction for patient ID", patient_id, "...")
predict_res = requests.post(f"{BASE_URL}/predict/{patient_id}", headers=headers)
if predict_res.status_code != 200:
    print("Prediction failed:", predict_res.text)
    exit(1)
print("Prediction Output:", predict_res.json())

print("4. Getting SHAP explanation...")
shap_res = requests.get(f"{BASE_URL}/predict/{patient_id}/shap?type=mortality", headers=headers)
if shap_res.status_code != 200:
    print("SHAP failed:", shap_res.text)
    exit(1)
print("SHAP Output:", shap_res.json())
