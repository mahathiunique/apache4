import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

model_path = os.path.join(
    BASE_DIR,
    "models/mortality/mortality_xgb_model.pkl"
)

scaler_path = os.path.join(
    BASE_DIR,
    "models/mortality/mortality_scaler.pkl"
)

model = joblib.load(model_path)

scaler = joblib.load(scaler_path)


def predict_mortality(data):

    arr = np.array(data).reshape(1, -1)

    scaled = scaler.transform(arr)

    prob = model.predict_proba(scaled)[0][1] * 100

    return round(prob, 2)