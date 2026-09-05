from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, StudentProfile

router = APIRouter(prefix="/profile", tags=["Profile"])

class ProfileUpdateSchema(BaseModel):
    degree: Optional[str] = None
    branch: Optional[str] = None
    academic_year: Optional[str] = None
    programming_languages: Optional[List[str]] = None
    frameworks: Optional[List[str]] = None
    databases: Optional[List[str]] = None
    ai_ml_skills: Optional[List[str]] = None
    cloud_skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    team_size: Optional[int] = None
    available_time_months: Optional[int] = None
    budget_usd: Optional[float] = None
    hardware_gpu: Optional[str] = None
    experience_level: Optional[str] = None
    preferred_project_type: Optional[str] = None

@router.get("/")
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).first()
    if not profile:
        user = db.query(User).first()
        if not user:
            user = User(email="student@university.edu", hashed_password="dummy", full_name="Alex Rivera")
            db.add(user)
            db.commit()
            db.refresh(user)
        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/")
def update_profile(data: ProfileUpdateSchema, db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).first()
    if not profile:
        user = db.query(User).first()
        profile = StudentProfile(user_id=user.id)
        db.add(profile)

    for field, val in data.dict(exclude_unset=True).items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile
