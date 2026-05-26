# 🏥 Apollo ICU AI Decision Support System

An enterprise-grade AI-powered Clinical Decision Support System (CDSS) designed for Intensive Care Unit (ICU) monitoring, mortality prediction, Length of Stay (LOS) prediction, and explainable healthcare analytics.

This platform combines:

- XGBoost-based machine learning models
- SHAP explainability
- Real-time ICU analytics
- Enterprise hospital dashboards
- Interactive visualization systems
- Clinical decision support tools

The system is inspired by modern healthcare analytics platforms used in hospitals like Apollo Hospitals and Johns Hopkins Hospital.

---

# 🌟 Core Features

## 🧠 AI Clinical Prediction Engine

The platform predicts:

### ✅ Mortality Risk Prediction
Predicts the probability of patient mortality using ICU vitals and clinical parameters.

### ✅ ICU Length of Stay (LOS) Prediction
Predicts estimated ICU stay duration in:

- Hours
- Days

### ✅ SHAP Explainability
Explains:

- Why the AI predicted a certain risk
- Which clinical parameters influenced the prediction
- Positive vs negative contributors

---

# 📊 Enterprise Dashboard Features

## 🏥 Receptionist / Admin Dashboard

- Live ICU monitoring
- Patient management
- ICU occupancy analytics
- Bed utilization tracking
- Mortality trend monitoring
- Sepsis alert visualization
- Prediction management
- Clinical reporting

---

## 👨‍⚕️ Patient Dashboard

- Personalized mortality analysis
- Survival probability
- LOS prediction
- AI explainability insights
- Interactive charts
- Clinical trend visualization

---

# 🔬 Machine Learning Pipeline

The project uses multiple machine learning workflows built separately through Jupyter notebooks.

---

# 📘 Notebook Workflow

## 01_data_preprocessing.ipynb

### Purpose

Performs complete ICU dataset preprocessing.

### Includes

- Missing value handling
- Feature engineering
- Clinical feature selection
- Encoding categorical values
- ICU normalization
- Dataset splitting
- Saving processed datasets

### Output Files

```plaintext
data/processed/
├── mortality_processed.csv
├── los_regression_processed.csv
└── los_classification_processed.csv
```

---

## 02_mortality_model.ipynb

### Purpose

Trains the ICU mortality prediction model.

### Algorithm

- XGBoost Classifier

### Pipeline

- Feature loading
- Scaling
- Training
- Hyperparameter tuning
- Evaluation
- Model persistence

### Output Files

```plaintext
models/mortality/
├── mortality_xgb_model.pkl
├── mortality_scaler.pkl
└── mortality_features.pkl
```

### Metrics

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC

---

## 03_los_model.ipynb

### Purpose

Trains ICU Length of Stay prediction model.

### Algorithm

- XGBoost Regressor

### Output Files

```plaintext
models/los/
├── los_xgb_model.pkl
├── los_scaler.pkl
└── los_features.pkl
```

### Metrics

- RMSE
- MAE
- R² Score

---

## 04_shap_explainability.ipynb

### Purpose

Generates SHAP explainability analysis for both models.

### Includes

- SHAP summary plots
- Force plots
- Feature importance
- Clinical impact interpretation

---

# ⚙️ Tech Stack

## 🧠 Machine Learning

- XGBoost
- Scikit-learn
- SHAP
- Pandas
- NumPy

---

## 🎨 Dashboard & Visualization

- NiceGUI
- Plotly
- Matplotlib

---

## 🏥 Healthcare Analytics

- Clinical risk prediction
- ICU occupancy analytics
- Mortality trends
- LOS monitoring
- Explainable AI

---

# 📈 Dashboard Analytics Included

## 📊 Mortality Gauge
Dynamic gauge showing mortality percentage.

---

## 🍩 Survival Donut Analysis
Visual comparison of:

- Survival probability
- Mortality probability

---

## 📉 ICU Trend Monitoring
Tracks:

- ICU occupancy
- Mortality trends
- Admission flow
- Bed utilization

---

## 🚨 Sepsis Alerts
Risk-based alert categorization:

- High Risk
- Medium Risk
- Low Risk

---

## 🛏️ Bed Utilization Analytics
Monitors:

- Available beds
- Reserved beds
- ICU occupancy percentage

---

# 🧠 Explainable AI

SHAP analysis provides:

- Feature importance
- Clinical transparency
- Model interpretability
- AI trustworthiness

This helps clinicians understand:

- Why predictions are generated
- Which parameters influence outcomes most

---

# 📌 Clinical Parameters Used

The dashboard predicts outcomes using:

| Feature | Description |
|---|---|
| Age | Patient age |
| Heart Rate | BPM |
| MAP | Mean Arterial Pressure |
| FiO2 | Oxygen Fraction |
| Creatinine | Kidney function marker |
| APS Score | Acute Physiology Score |
| APACHE IV Score | ICU severity score |
| Albumin | Protein level |

---

# 🚀 Running the Project

## Activate Virtual Environment

### Mac/Linux

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

---

## Install Requirements

```bash
pip install -r requirements.txt
```

---

## Run the Dashboard

IMPORTANT:

Run using module mode:

```bash
python -m app.main
```

NOT:

```bash
python app/main.py
```

---

# 🌐 Dashboard URL

```plaintext
http://127.0.0.1:8080
```

---

# 🏥 Real-World Use Cases

This system can be used for:

- ICU monitoring systems
- Hospital analytics platforms
- Clinical decision support
- Healthcare AI research
- Smart ICU management

---

# 🔮 Future Enhancements

- Multi-hospital integration
- Cloud deployment
- Doctor login
- Receptionist authentication
- PDF clinical reports
- Real-time IoT monitoring
- HL7/FHIR integration
- AI chatbot assistant
- Voice-based ICU assistant

---

# ❤️ Acknowledgement

Inspired by enterprise ICU AI systems used in:

- Apollo Hospitals
- Modern AI-powered healthcare monitoring platforms

## 🔑 Login Accounts

The database initializes with a default admin receptionist account. Newly added patients have their login credentials dynamically generated upon creation.

| User Role | Login Email | Default Password |
| :--- | :--- | :--- |
| **Receptionist (Admin)** | `admin@apollo.com` | `apollo123` |
| **Patient (Test Patient)** | `patient_testpatient@apollo.com` | `patient123` |
| **Patient (mahathi)** | `patient_mahathi@apollo.com` | `patient123` |

*Note: Newly registered patient emails follow the format `patient_{fullname_without_spaces}@apollo.com`.*

---
# 👩‍💻 Developed By

Mahathi  
Computer Science and Business Systems (CSBS)  
Chennai Institute of Technology

---
