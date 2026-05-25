from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "patient"

class UserOut(UserBase):
    id: int
    role: str
    patient_id: Optional[int] = None
    class Config:
        from_attributes = True

class PatientBase(BaseModel):
    name: str
    age: float
    heart_rate: float
    map: float
    fio2: float
    creatinine: float
    albumin: float
    aps_score: float
    apache_iv_score: float
    respiratory_rate: float
    oxygen_saturation: float
    blood_pressure: float
    temperature: float
    glucose: float

class PatientCreate(PatientBase):
    pass

class PatientOut(PatientBase):
    id: int
    user_id: Optional[int]
    class Config:
        from_attributes = True

class PredictionOut(BaseModel):
    id: int
    patient_id: int
    timestamp: datetime
    mortality_risk_pct: float
    survival_prob_pct: float
    risk_category: str
    predicted_los_days: float
    severity_indicator: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
