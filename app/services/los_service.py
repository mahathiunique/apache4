import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

model_path = os.path.join(
    BASE_DIR,
    "models/los/los_xgb_model.pkl"
)

scaler_path = os.path.join(
    BASE_DIR,
    "models/los/los_scaler.pkl"
)

model = joblib.load(model_path)

scaler = joblib.load(scaler_path)


def predict_los(data):

    arr = np.array(data).reshape(1, -1)

    scaled = scaler.transform(arr)

    pred = model.predict(scaled)[0]

    return round(float(pred), 1)