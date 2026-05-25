import joblib
import numpy as np
import pandas as pd
import os
import shap

# Get absolute paths to models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

class MLService:
    def __init__(self):
        # Load mortality models
        self.mortality_model = joblib.load(os.path.join(MODELS_DIR, "mortality/mortality_xgb_model.pkl"))
        self.mortality_scaler = joblib.load(os.path.join(MODELS_DIR, "mortality/mortality_scaler.pkl"))
        self.mortality_features = joblib.load(os.path.join(MODELS_DIR, "mortality/mortality_features.pkl"))

        # Load LOS models
        self.los_model = joblib.load(os.path.join(MODELS_DIR, "los/los_xgb_model.pkl"))
        self.los_scaler = joblib.load(os.path.join(MODELS_DIR, "los/los_scaler.pkl"))
        self.los_features = joblib.load(os.path.join(MODELS_DIR, "los/los_features.pkl"))

        # Initialize SHAP Explainers
        self.mortality_explainer = shap.TreeExplainer(self.mortality_model)
        self.los_explainer = shap.TreeExplainer(self.los_model)

    def prepare_features(self, patient_data: dict, feature_list: list) -> pd.DataFrame:
        """Fills missing model features with default values and returns a DataFrame."""
        defaults = {
            'pO2': 80.0,
            'pCO2': 40.0,
            'ArterialpH': 7.4,
            'Sodium': 140.0,
            'UrineOutput': 1500.0,
            'Urea': 15.0,
            'Bilirubin': 1.0,
            'Hematocrit': 40.0,
            'WBC': 7.0,
            'IsGCSNotAvailable': 0,
            'GCSEyes': 4,
            'GCSVerbal': 5,
            'GCSMotor': 6,
            'MecanicalVentilation': 0,
            'CRF': 0,
            'Lymphoma': 0,
            'Cirrhosis': 0,
            'Leukemia': 0,
            'HepaticFailure': 0,
            'Immunosuppression': 0,
            'MetastaticCarcinoma': 0,
            'AIDS': 0,
            'PreICULengthOfStay': 0.0,
            'DiagnosisType': 0,
            'Origin': 0,
            'EmergencySurgery': 0,
            'Readmission': 0,
            'Thrombolysis': 0,
            'RespiratoryQuotient': 0.8,
            'AtmosphericPressure': 760.0,
            'SystemValue': 0,
            'DiagnosisValue': 0,
            'Gender': 1,
            'EstimatedMortalityRate': 0.1,
            'EstimatedLengthOfStay': 3.0,
            'APACHE_WARD': 0,
        }
        
        # Mapping patient data to model names where they differ
        mapped_data = {
            'Age': patient_data.get('age'),
            'HeartRate': patient_data.get('heart_rate'),
            'MeanArterialPressure': patient_data.get('map'),
            'FiO2': patient_data.get('fio2'),
            'Creatinine': patient_data.get('creatinine'),
            'Albumin': patient_data.get('albumin'),
            'ApsScore': patient_data.get('aps_score'),
            'ApacheivScore': patient_data.get('apache_iv_score'),
            'RespiratoryRate': patient_data.get('respiratory_rate'),
            'Temperature': patient_data.get('temperature'),
            'BSL': patient_data.get('glucose'), # mapped glucose to BSL
        }
        
        row_data = {}
        for feature in feature_list:
            if feature in mapped_data and mapped_data[feature] is not None:
                row_data[feature] = mapped_data[feature]
            else:
                row_data[feature] = defaults.get(feature, 0.0)
                
        df = pd.DataFrame([row_data])
        # Ensure column order matches exactly
        return df[feature_list]

    def predict(self, patient_data: dict):
        # Mortality Prediction
        mort_df = self.prepare_features(patient_data, self.mortality_features)
        mort_scaled = self.mortality_scaler.transform(mort_df)
        mortality_prob = self.mortality_model.predict_proba(mort_scaled)[0][1] * 100
        survival_prob = 100 - mortality_prob
        risk_category = "High" if mortality_prob > 30 else "Medium" if mortality_prob > 10 else "Low"

        # LOS Prediction
        los_df = self.prepare_features(patient_data, self.los_features)
        los_scaled = self.los_scaler.transform(los_df)
        los_pred = max(0.5, float(self.los_model.predict(los_scaled)[0])) # Prevent negative LOS
        severity_indicator = "Critical" if los_pred > 7 else "Moderate" if los_pred > 3 else "Stable"

        return {
            "mortality_risk_pct": round(mortality_prob, 2),
            "survival_prob_pct": round(survival_prob, 2),
            "risk_category": risk_category,
            "predicted_los_days": round(los_pred, 2),
            "severity_indicator": severity_indicator
        }
        
    def get_shap_explanation(self, patient_data: dict, model_type: str):
        if model_type == "mortality":
            df = self.prepare_features(patient_data, self.mortality_features)
            scaled = self.mortality_scaler.transform(df)
            shap_values = self.mortality_explainer.shap_values(scaled)
            features = self.mortality_features
        else:
            df = self.prepare_features(patient_data, self.los_features)
            scaled = self.los_scaler.transform(df)
            shap_values = self.los_explainer.shap_values(scaled)
            features = self.los_features
            
        # Get top 5 impacting features
        # For tree explainer, shap_values might be a list (for classification) or array
        if isinstance(shap_values, list):
            sv = shap_values[1][0] # class 1
        else:
            sv = shap_values[0]
            
        feature_importance = [(features[i], float(sv[i])) for i in range(len(features))]
        # Sort by absolute impact
        feature_importance.sort(key=lambda x: abs(x[1]), reverse=True)
        top_5 = feature_importance[:5]
        
        return [{"feature": f, "impact": i} for f, i in top_5]

ml_service = MLService()
