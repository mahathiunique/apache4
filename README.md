# Apollo ICU AI Decision Support System 🏥🔬

A complete, production-ready full-stack Clinical Decision Support System (CDSS) for Intelligent Intensive Care Unit monitoring. The application runs real-time mortality risk and Length of Stay (LOS) predictions using pre-trained, high-performance XGBoost models, providing interactive SHAP explainability visualizations for clinical transparency.

---

## 🌟 Key Features

*   **Role-Based Access Control (RBAC)**: Secure access tailored for hospital administrative staff (Receptionists) and patients.
*   **Receptionist Dashboard**:
    *   **Interactive ICU Patient Directory**: Instantly search, filter, and monitor active ICU patients.
    *   **Live ICU Metrics & Analytics**: Interactive clinical charts powered by Recharts (admission trends, LOS groupings, severity ratios).
    *   **Dynamic Inference Pipelines**: One-click triggering of Mortality and LOS XGBoost prediction pipelines.
*   **Patient Dashboard**:
    *   **Clinical Analytics**: Individualized patient gauges for mortality risk vs. survival probability and predicted length of stay.
    *   **SHAP Explainability**: Dynamic visualizations breakdown of top clinical factors impacting the AI models' decisions.
*   **Apollo AI Chatbot Widget**: A conversational chatbot to easily translate clinical metrics (like SHAP and LOS) into simple explanations for patients and families.
*   **JWT Authentication**: Advanced session-handling and password hashing powered by `argon2` to protect patient privacy.

---

## ⚙️ Architecture & Tech Stack

```
ICU_AI_SYSTEM/
├── backend/                  # FastAPI Web Server & ML Inference
│   ├── main.py               # Application routing and startup logic
│   ├── models.py             # SQLAlchemy DB schemas (Users, Patients, Predictions)
│   ├── schemas.py            # Pydantic data schemas
│   ├── auth.py               # JWT generation and Argon2 password security
│   ├── database.py           # SQLite connection pools
│   └── ml_service.py         # Read-only XGBoost loading and inference
│
├── frontend/                 # React & Vite Dashboard Application
│   ├── src/
│   │   ├── components/       # Chatbot, shared UI elements
│   │   ├── pages/            # Login, Receptionist, Patient dashboards
│   │   ├── App.jsx           # App routing with React Router Dom
│   │   ├── api.js            # Axios client with interceptors
│   │   └── index.css         # Styling system (Tailwind & custom glassmorphism)
│   └── tailwind.config.js    # Tailwind Apollo color system configs
│
├── models/                   # XGBoost Models, Features, & Scalers (Read-only)
│   ├── los/                  # Length of Stay model files
│   └── mortality/            # Mortality prediction model files
└── requirements.txt          # Root Python dependencies
```

*   **Backend**: FastAPI, Uvicorn, SQLAlchemy, SQLite, `passlib` (Argon2), `python-jose`, Scikit-Learn, XGBoost, SHAP.
*   **Frontend**: React (Vite), Tailwind CSS (v3), Framer Motion (premium UI animations), Recharts, Lucide Icons, Axios.

---

## 🚀 Quick Start & Setup

### Prerequisites
Make sure you have Python 3.10+ and Node.js (v18+) installed on your machine.

### 1. Setup the Backend API
1. Navigate to the root directory `ICU_AI_SYSTEM/`.
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   uvicorn backend.main:app --reload
   ```
The backend API will now be running at **`http://127.0.0.1:8000`**.

### 2. Setup the Frontend UI
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
The frontend UI will now be available in your browser at **`http://localhost:5173`**.

---

## 🔑 Login Accounts

The database initializes with a default admin receptionist account. Newly added patients have their login credentials dynamically generated upon creation.

| User Role | Login Email | Default Password |
| :--- | :--- | :--- |
| **Receptionist (Admin)** | `admin@apollo.com` | `apollo123` |
| **Patient (Test Patient)** | `patient_testpatient@apollo.com` | `patient123` |
| **Patient (mahathi)** | `patient_mahathi@apollo.com` | `patient123` |

*Note: Newly registered patient emails follow the format `patient_{fullname_without_spaces}@apollo.com`.*

---

## 🛡️ ML Integration Specifications
To prevent training/generalization mismatches, the system loads pre-trained model files (`los_xgb_model.pkl`, `mortality_xgb_model.pkl`) strictly in read-only mode using `joblib`. 
A clinical default feature-filler handles empty fields gracefully, supplementing the 13 dashboard fields to provide the required 47-feature matrix for inference.
