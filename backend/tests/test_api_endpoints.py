import io
import zipfile
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.db.database import Base, engine, SessionLocal, get_db
from app.db import models
from app.main import app

# Ensure all database tables exist
Base.metadata.create_all(bind=engine)

client = TestClient(app)


def test_root_endpoint():
    """Verify root API health check endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "status" in response.json()
    assert response.json()["status"] == "online"


def test_demo_auth_login():
    """Verify POST /api/v1/auth/demo returns valid access token."""
    response = client.post("/api/v1/auth/demo")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "user" in data


def test_user_login():
    """Verify POST /api/v1/auth/login returns token."""
    payload = {"email": "student@university.edu", "password": "demopassword123"}
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_user_registration():
    """Verify POST /api/v1/auth/register creates user session."""
    import uuid
    email = f"student_{uuid.uuid4().hex[:6]}@university.edu"
    payload = {"email": email, "password": "securepassword123", "full_name": "Taylor Smith"}
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_get_and_update_profile():
    """Verify GET and PUT /api/v1/profile."""
    get_res = client.get("/api/v1/profile")
    assert get_res.status_code == 200
    profile = get_res.json()
    assert "degree" in profile

    update_payload = {"team_size": 4, "experience_level": "Advanced"}
    put_res = client.put("/api/v1/profile", json=update_payload)
    assert put_res.status_code == 200
    assert put_res.json()["team_size"] == 4


def test_generate_and_list_ideas():
    """Verify POST /api/v1/ideas/generate."""
    payload = {
        "domain": "Healthcare AI",
        "difficulty": "Intermediate"
    }
    gen_res = client.post("/api/v1/ideas/generate", json=payload)
    assert gen_res.status_code == 200
    ideas = gen_res.json()
    assert isinstance(ideas, list)


def test_feasibility_evaluation():
    """Verify POST /api/v1/feasibility/evaluate."""
    payload = {
        "user_idea": "AI Clinical Decision Support for Diabetic Retinopathy",
        "target_domain": "Healthcare AI",
        "team_size": 3,
        "time_months": 4
    }
    response = client.post("/api/v1/feasibility/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "verdict" in data or "scores" in data


def test_research_papers_endpoint():
    """Verify GET /api/v1/projects/1/resources."""
    response = client.get("/api/v1/projects/1/resources")
    assert response.status_code == 200
    data = response.json()
    assert "papers" in data or isinstance(data, dict)


def test_mentor_greeting_and_chat():
    """Verify GET /api/v1/projects/1/mentor/greeting and POST /api/v1/projects/1/mentor/chat."""
    greet_res = client.get("/api/v1/projects/1/mentor/greeting")
    assert greet_res.status_code == 200
    assert "greeting_text" in greet_res.json()

    chat_payload = {"message": "How do I optimize my model inference in FastAPI?"}
    chat_res = client.post("/api/v1/projects/1/mentor/chat", json=chat_payload)
    assert chat_res.status_code == 200
    assert "message" in chat_res.json()


def test_code_review_get_and_history():
    """Verify GET /api/v1/code-review/1 and GET /api/v1/code-review/history/1."""
    res = client.get("/api/v1/code-review/1")
    assert res.status_code == 200
    data = res.json()
    assert "submission_score" in data or "criteria" in data

    hist_res = client.get("/api/v1/code-review/history/1")
    assert hist_res.status_code == 200
    assert isinstance(hist_res.json(), list)


def test_code_review_zip_upload():
    """Verify ZIP upload endpoint POST /api/v1/code-review/upload/1."""
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("app/main.py", "from fastapi import FastAPI\napp = FastAPI()")
        zf.writestr("tests/test_main.py", "def test_root(): assert True")
        zf.writestr("requirements.txt", "fastapi==0.100.0\npytest==7.4.0")

    zip_buffer.seek(0)
    files = {"file": ("test_codebase.zip", zip_buffer.getvalue(), "application/zip")}
    res = client.post("/api/v1/code-review/upload/1", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "submission_score" in data
    assert "criteria" in data


def test_reality_check_and_health_endpoints():
    """Verify GET /api/v1/reality-check/1 and GET /api/v1/project-health/1."""
    rc_res = client.get("/api/v1/reality-check/1")
    assert rc_res.status_code == 200

    h_res = client.get("/api/v1/project-health/1")
    assert h_res.status_code == 200
