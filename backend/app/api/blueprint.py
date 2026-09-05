from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Project, ProjectBlueprint, RoadmapPhase, RoadmapTask

router = APIRouter(prefix="/projects", tags=["Blueprint"])

@router.post("/{project_id}/blueprint")
def create_project_blueprint(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        project = Project(
            id=project_id,
            title="AI Clinical Decision Support for Diabetic Retinopathy",
            description="Deep learning retinal image classification with explainable AI heatmaps and risk scoring.",
            domain="Healthcare AI",
            difficulty="Intermediate"
        )
        db.add(project)
        db.commit()
        db.refresh(project)

    blueprint = db.query(ProjectBlueprint).filter(ProjectBlueprint.project_id == project_id).first()
    if not blueprint:
        blueprint = ProjectBlueprint(
            project_id=project_id,
            overview="Production-grade AI medical image classification system for automated triaging of diabetic retinopathy.",
            problem_statement="Diabetic retinopathy causes irreversible vision loss if untreated. Early automated screening in primary healthcare clinics bridges the gap in specialist availability.",
            objectives=[
                "Build a 5-class DR classifier achieving >90% validation accuracy on APTOS 2019 dataset.",
                "Generate Grad-CAM heatmaps to visually highlight retinal lesions for clinical validation.",
                "Develop a high-performance FastAPI REST API backend with SQLite/PostgreSQL storage.",
                "Construct a modern responsive React SaaS frontend with patient history tracking and PDF reporting."
            ],
            target_users="Clinicians, Ophthalmologists, Healthcare Workers, Medical Researchers",
            functional_requirements=[
                "User authentication & clinician role management",
                "Retinal image upload & automated CLAHE preprocessing",
                "Real-time AI inference & confidence score generation",
                "Grad-CAM visual heatmap overlay generation",
                "Exportable PDF diagnostic report generation"
            ],
            non_functional_requirements=[
                "Sub-500ms AI inference latency on GPU / 2s on CPU",
                "HIPAA / GDPR compliant data encryption at rest and in transit",
                "99.9% REST API uptime with graceful error handling"
            ],
            tech_stack={
                "Frontend": "React, TypeScript, Vite, Tailwind CSS, Lucide, Recharts",
                "Backend": "Python, FastAPI, Pydantic, SQLAlchemy, Uvicorn",
                "AI_ML": "PyTorch, torchvision, OpenCV, Grad-CAM, NumPy",
                "Database": "PostgreSQL / SQLite with vector embeddings",
                "Deployment": "Docker, Nginx, GitHub Actions"
            },
            system_architecture="Client-Server Microservices Architecture. React frontend communicates via REST JSON API with FastAPI backend services.",
            database_architecture="Relational schema with normalized tables for Users, Patients, Scans, InferenceLogs, and DiagnosticReports.",
            api_architecture="OpenAPI 3.0 documented RESTful API endpoints with JWT bearer authentication.",
            ai_ml_architecture="EfficientNet-B0 backbone fine-tuned on APTOS dataset with categorical cross-entropy loss and Grad-CAM explainability hook.",
            security_considerations=[
                "JWT token expiration validation and SHA-256 password hashing",
                "Strict file type validation (PNG/JPG only, max 10MB)",
                "CORS restriction to trusted frontend domain",
                "SQL Injection protection via SQLAlchemy parameterization"
            ],
            dataset_requirements="APTOS 2019 Blindness Detection dataset (3,662 high-resolution retinal images with 5 DR severity labels).",
            expected_results="Automated triaging system reducing specialist screening backlog by 60% with full visual explainability.",
            risks=[
                "High variance in image lighting across different fundus camera models",
                "GPU memory limits during batch training"
            ],
            future_scope=[
                "Mobile camera adapter compatibility",
                "Multi-modal patient history integration"
            ]
        )
        db.add(blueprint)
        db.commit()
        db.refresh(blueprint)

    return blueprint

@router.get("/{project_id}/blueprint")
def get_project_blueprint(project_id: int, db: Session = Depends(get_db)):
    blueprint = db.query(ProjectBlueprint).filter(ProjectBlueprint.project_id == project_id).first()
    if not blueprint:
        return create_project_blueprint(project_id, db)
    return blueprint
