from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from . import models, schemas, database, auth
from .database import engine
from .ml_service import ml_service

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ICU AI System API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize a default receptionist
def init_db():
    db = database.SessionLocal()
    if not db.query(models.User).filter(models.User.email == "admin@apollo.com").first():
        hashed_password = auth.get_password_hash("apollo123")
        db_user = models.User(email="admin@apollo.com", hashed_password=hashed_password, role="receptionist")
        db.add(db_user)
        db.commit()
    db.close()
init_db()

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    user_dict = {
        "email": current_user.email,
        "id": current_user.id,
        "role": current_user.role,
        "patient_id": current_user.patient_profile.id if current_user.patient_profile else None
    }
    return user_dict

# Receptionist Routes
@app.post("/patients", response_model=schemas.PatientOut)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "receptionist":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db_patient = models.Patient(**patient.dict())
    
    # Optionally, create a patient user account as well
    hashed_password = auth.get_password_hash("patient123")
    patient_email = f"patient_{patient.name.lower().replace(' ', '')}@apollo.com"
    
    # Ensure unique email
    if not db.query(models.User).filter(models.User.email == patient_email).first():
        db_user = models.User(email=patient_email, hashed_password=hashed_password, role="patient")
        db.add(db_user)
        db.flush() # get id
        db_patient.user_id = db_user.id

    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.get("/patients", response_model=list[schemas.PatientOut])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "receptionist":
        raise HTTPException(status_code=403, detail="Not authorized")
    patients = db.query(models.Patient).offset(skip).limit(limit).all()
    return patients

@app.get("/patients/{patient_id}", response_model=schemas.PatientOut)
def get_patient(patient_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == "patient" and current_user.patient_profile.id != patient_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

# ML Prediction Endpoint
@app.post("/predict/{patient_id}", response_model=schemas.PredictionOut)
def predict_patient(patient_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "receptionist":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    patient_dict = {c.name: getattr(patient, c.name) for c in patient.__table__.columns}
    
    # Run ML Models
    prediction_result = ml_service.predict(patient_dict)
    
    # Save Prediction
    db_pred = models.PredictionRecord(
        patient_id=patient.id,
        mortality_risk_pct=prediction_result["mortality_risk_pct"],
        survival_prob_pct=prediction_result["survival_prob_pct"],
        risk_category=prediction_result["risk_category"],
        predicted_los_days=prediction_result["predicted_los_days"],
        severity_indicator=prediction_result["severity_indicator"]
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    return db_pred

@app.get("/predict/{patient_id}/history", response_model=list[schemas.PredictionOut])
def get_prediction_history(patient_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == "patient" and current_user.patient_profile.id != patient_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    preds = db.query(models.PredictionRecord).filter(models.PredictionRecord.patient_id == patient_id).order_by(models.PredictionRecord.timestamp.desc()).all()
    return preds

@app.get("/predict/{patient_id}/shap")
def get_shap_values(patient_id: int, type: str = "mortality", db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == "patient" and current_user.patient_profile.id != patient_id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    patient_dict = {c.name: getattr(patient, c.name) for c in patient.__table__.columns}
    shap_explanation = ml_service.get_shap_explanation(patient_dict, type)
    
    return {"explanation": shap_explanation}
