from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, StudentProfile
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

class RegisterSchema(BaseModel):
    email: str
    password: str
    full_name: str

class LoginSchema(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialize default student profile
    profile = StudentProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "full_name": user.full_name}}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "full_name": user.full_name}}

@router.post("/demo")
def demo_login(db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == "student@university.edu").first()
    if not user:
        user = User(
            email="student@university.edu",
            hashed_password=hash_password("demopassword123"),
            full_name="Alex Rivera"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()

    token = create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "full_name": user.full_name}}
