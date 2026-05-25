from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="patient") # receptionist, patient
    
    # If the user is a patient, they can be linked to a patient profile
    patient_profile = relationship("Patient", back_populates="user", uselist=False)

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Optional linking
    
    # Input fields
    age = Column(Float)
    heart_rate = Column(Float)
    map = Column(Float)
    fio2 = Column(Float)
    creatinine = Column(Float)
    albumin = Column(Float)
    aps_score = Column(Float)
    apache_iv_score = Column(Float)
    respiratory_rate = Column(Float)
    oxygen_saturation = Column(Float)
    blood_pressure = Column(Float)
    temperature = Column(Float)
    glucose = Column(Float)
    
    user = relationship("User", back_populates="patient_profile")
    predictions = relationship("PredictionRecord", back_populates="patient")

class PredictionRecord(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    mortality_risk_pct = Column(Float)
    survival_prob_pct = Column(Float)
    risk_category = Column(String)
    
    predicted_los_days = Column(Float)
    severity_indicator = Column(String)
    
    patient = relationship("Patient", back_populates="predictions")
