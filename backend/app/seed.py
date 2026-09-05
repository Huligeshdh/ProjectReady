import datetime
from app.db.database import SessionLocal, engine, Base
from app.db.models import (
    User, StudentProfile, Project, ProjectIdea, ProjectBlueprint,
    ResearchPaper, Repository, LearningResource, Dataset,
    RoadmapPhase, RoadmapTask, CodeReview, CodeReviewIssue,
    ProjectHealth, ProjectImprovement,
    RealityCheckEvaluation, RealityCheckDimension, ProjectRisk,
    PanelAttackPoint, EvaluatorQuestion, ProjectScoreHistory
)
from app.core.security import hash_password

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "student@university.edu").first():
            print("Database already seeded.")
            return

        print("Seeding database with realistic academic demo data...")

        # 1. User & Profile
        user = User(
            email="student@university.edu",
            hashed_password=hash_password("demopassword123"),
            full_name="Alex Rivera",
            role="student"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        profile = StudentProfile(
            user_id=user.id,
            degree="B.Tech Computer Science",
            branch="Computer Science & Engineering",
            academic_year="Final Year (4th Year)",
            programming_languages=["Python", "TypeScript", "C++"],
            frameworks=["React", "FastAPI", "PyTorch"],
            databases=["PostgreSQL", "Redis"],
            ai_ml_skills=["Deep Learning", "Computer Vision", "Grad-CAM XAI"],
            cloud_skills=["Docker", "AWS"],
            other_skills=["Git", "REST APIs"],
            interests=["Healthcare AI", "Explainable ML", "Web Applications"],
            team_size=3,
            available_time_months=4,
            budget_usd=100.0,
            hardware_gpu="NVIDIA RTX 4070 / Cloud GPU",
            experience_level="Intermediate",
            preferred_project_type="AI/ML Web App"
        )
        db.add(profile)

        # 2. Project
        project = Project(
            user_id=user.id,
            title="AI Clinical Decision Support for Diabetic Retinopathy",
            description="Deep learning retinal fundus image classification with explainable AI heatmaps and risk scoring.",
            domain="Healthcare AI",
            difficulty="Intermediate",
            status="in_progress"
        )
        db.add(project)
        db.commit()
        db.refresh(project)

        # 3. Blueprint
        blueprint = ProjectBlueprint(
            project_id=project.id,
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

        # 4. Research Papers & Resources
        p1 = ResearchPaper(
            project_id=project.id,
            title="Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs",
            authors="Gulshan V, Peng L, Coram M, et al.",
            year=2021,
            abstract="Evaluates deep convolutional neural network performance in screening diabetic retinopathy from fundus photographs with high sensitivity and specificity.",
            relevance_score=96.5,
            doi="10.1001/jama.2016.17216",
            source="JAMA / OpenAlex",
            url="https://doi.org/10.1001/jama.2016.17216"
        )
        p2 = ResearchPaper(
            project_id=project.id,
            title="Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization",
            authors="Selvaraju RR, Cogswell M, Das A, et al.",
            year=2020,
            abstract="Proposes technique for producing visual explanations for decisions from CNN-based models, making them interpretable and trustworthy for clinicians.",
            relevance_score=94.0,
            doi="10.1109/ICCV.2017.74",
            source="IEEE / arXiv",
            url="https://arxiv.org/abs/1610.02391"
        )
        db.add_all([p1, p2])

        r1 = Repository(
            project_id=project.id,
            name="pytorch/vision",
            description="Official PyTorch vision repository containing pre-trained EfficientNet, ResNet models and image processing pipelines.",
            language="Python",
            stars=15400,
            topics=["pytorch", "computer-vision", "deep-learning"],
            last_updated="2 days ago",
            relevance_reason="Use for model loading, transfer learning backbone, and data augmentation transforms.",
            url="https://github.com/pytorch/vision"
        )
        db.add(r1)

        # 5. Code Review & Issues
        review = CodeReview(
            project_id=project.id,
            run_number=1,
            zip_filename="diabetic_retinopathy_ai.zip",
            total_files=38,
            total_lines=3240,
            languages_detected=["Python", "TypeScript"],
            frameworks_detected=["FastAPI", "React", "PyTorch"],
            health_score=75.0
        )
        db.add(review)
        db.commit()

        issue1 = CodeReviewIssue(
            review_id=review.id,
            severity="HIGH",
            category="Security",
            file_path="backend/app/core/security.py",
            line_number=24,
            problem="Token expiration claim is not being validated.",
            why_it_matters="Expired authentication tokens may remain usable, allowing unauthorized access.",
            impact="Security vulnerability.",
            recommended_fix="Validate JWT expiration claim before accepting bearer token.",
            original_code='decoded = jwt.decode(token, SECRET_KEY, options={"verify_exp": False})',
            suggested_code='decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"], options={"verify_exp": True})'
        )
        db.add(issue1)

        # 6. Health & Improvements
        health = ProjectHealth(
            project_id=project.id,
            overall_score=82.0,
            code_quality_score=86.0,
            architecture_score=83.0,
            security_score=71.0,
            testing_score=68.0,
            performance_score=79.0,
            maintainability_score=84.0,
            documentation_score=91.0,
            innovation_score=88.0,
            feasibility_score=90.0,
            measured_metrics={
                "static_analysis_flaws": 2,
                "dependency_vulnerabilities": 0,
                "has_automated_tests": False,
                "total_lines_analyzed": 3240
            },
            ai_qualitative_assessment="The codebase demonstrates solid modular structure (FastAPI + React). Key areas for academic distinction: adding automated test coverage in tests/ and securing token expiration validation."
        )
        db.add(health)

        imp1 = ProjectImprovement(
            project_id=project.id,
            title="Implement JWT Token Expiration Validation",
            category="Security",
            priority="HIGH",
            problem_summary="Token expiration claim is not being checked during request authorization.",
            impact="Security vulnerability allowing expired user tokens to remain valid.",
            recommended_action="Add verify_exp=True in JWT decode function and check timestamp.",
            estimated_effort="2-4 hours",
            status="In Progress"
        )
        db.add(imp1)

        # 7. Project Reality Check & Survival Score
        eval_obj = RealityCheckEvaluation(
            project_id=project.id,
            evaluation_type="PLAN",
            overall_score=87.0,
            classification="Strong",
            planned_score=84.0,
            implemented_score=67.0,
            implementation_gap=-17.0,
            strengths=[
                "Strong technical architecture combining PyTorch deep learning with FastAPI & React.",
                "Well-defined clinical problem statement with high real-world demand.",
                "Research-backed methodology utilizing Grad-CAM explainable AI.",
                "Modular code structure adhering to clean separation of concerns."
            ],
            ai_summary="The project is technically robust with strong clinical validity. Focus on automated testing and token security before final evaluation."
        )
        db.add(eval_obj)
        db.commit()

        # Seed Attack Points
        ap1 = PanelAttackPoint(
            evaluation_id=eval_obj.id,
            severity="CRITICAL",
            issue_title="Unvalidated Model Evaluation Methodology & Test Dataset",
            why_evaluator_challenges="Evaluators frequently challenge projects that report high accuracy without proving strict separation of test dataset.",
            likely_evaluator_question="How do you guarantee that your model hasn't overfitted on the training data, and what is your out-of-sample test accuracy?",
            recommended_answer="We implemented a strict 80-10-10 stratified train-val-test split on the APTOS dataset, ensuring zero data leakage across fundus image series.",
            recommended_fix="Add a dedicated test evaluation script reporting Precision, Recall, F1-Score, and Confusion Matrix.",
            related_component="AI/ML Validation Pipeline"
        )
        ap2 = PanelAttackPoint(
            evaluation_id=eval_obj.id,
            severity="HIGH",
            issue_title="JWT Token Expiration & Authorization Vulnerability",
            why_evaluator_challenges="Security reviewers in evaluation panels check whether authorization tokens can be hijacked or reused indefinitely.",
            likely_evaluator_question="Does your authentication system enforce strict token expiration timestamps?",
            recommended_answer="Tokens are generated with HS256 HMAC signatures and 24-hour expiration claims validated on every request.",
            recommended_fix="Enforce verify_exp=True in JWT decode parameters in backend/app/core/security.py.",
            related_component="Authentication & Security Module"
        )
        db.add_all([ap1, ap2])

        # Seed Score History
        h1 = ProjectScoreHistory(project_id=project.id, run_number=1, stage_name="Initial Plan", overall_score=84.0, delta=0.0)
        h2 = ProjectScoreHistory(project_id=project.id, run_number=2, stage_name="First Build (ZIP Review)", overall_score=67.0, delta=-17.0)
        h3 = ProjectScoreHistory(project_id=project.id, run_number=3, stage_name="After Security Fix #1", overall_score=76.0, delta=+9.0)
        h4 = ProjectScoreHistory(project_id=project.id, run_number=4, stage_name="Final Re-Analysis", overall_score=87.0, delta=+11.0)
        db.add_all([h1, h2, h3, h4])

        db.commit()
        print("Database successfully seeded!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
