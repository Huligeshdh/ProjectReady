from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import RoadmapPhase, RoadmapTask

router = APIRouter(prefix="/projects", tags=["Roadmap"])

class TaskUpdateSchema(BaseModel):
    is_completed: bool

@router.get("/{project_id}/roadmap")
def get_roadmap(project_id: int, db: Session = Depends(get_db)):
    phases = db.query(RoadmapPhase).filter(RoadmapPhase.project_id == project_id).all()
    if not phases:
        default_phases = [
            ("PHASE 1", "Literature Review & Research Paper Audit", [
                ("Analyze APTOS 2019 dataset distribution", "Check class balance and resolution variance across fundus images.", "High"),
                ("Review Grad-CAM paper mathematics", "Understand gradient flow backpropagation for heatmap generation.", "Medium")
            ]),
            ("PHASE 2", "Requirements & System Specifications", [
                ("Finalize non-functional specs", "Establish sub-500ms API latency requirement.", "High"),
                ("Define REST API route schema", "Map out /upload, /predict, and /report endpoints.", "Medium")
            ]),
            ("PHASE 3", "System & Database Architecture", [
                ("Design relational schema", "Create users, scans, and diagnostic_reports tables.", "High"),
                ("Set up FastAPI project scaffold", "Implement clean repository pattern with dependency injection.", "High")
            ]),
            ("PHASE 4", "Backend Service Implementation", [
                ("Build JWT authentication module", "Implement secure password hashing and token expiration validation.", "High"),
                ("Construct scan upload handler", "Implement strict MIME-type checks and file size limits.", "Medium")
            ]),
            ("PHASE 5", "Frontend SaaS Interface", [
                ("Build responsive clinician dashboard", "Create visual score metrics, upload zone, and scan table.", "High"),
                ("Implement Code Diff & Monaco viewer", "Integrate side-by-side code review viewer.", "Medium")
            ]),
            ("PHASE 6", "AI/ML Model Fine-Tuning", [
                ("Train EfficientNet-B0 backbone", "Achieve >90% validation accuracy on GPU cluster.", "High"),
                ("Implement Grad-CAM activation hook", "Extract heatmap overlays from last convolutional layer.", "High")
            ]),
            ("PHASE 7", "API & Frontend Integration", [
                ("Connect React TanStack Query client", "Wire up live REST endpoints with optimistic UI loading state.", "High")
            ]),
            ("PHASE 8", "Testing & Static Analysis", [
                ("Write pytest suite for backend endpoints", "Verify JWT protection and exception handling.", "High"),
                ("Run ZIP code analyzer security scan", "Check for hardcoded credentials and SQL injection risks.", "High")
            ]),
            ("PHASE 9", "Deployment & Containerization", [
                ("Dockerize FastAPI and React apps", "Create docker-compose configuration for local and cloud deployment.", "Medium")
            ]),
            ("PHASE 10", "Documentation & Export", [
                ("Generate Project Abstract & Technical Report", "Produce publication-grade project documentation.", "High")
            ])
        ]

        for p_idx, (p_num, p_title, tasks) in enumerate(default_phases, 1):
            phase = RoadmapPhase(project_id=project_id, phase_number=p_idx, title=f"{p_num}: {p_title}", description=p_title)
            db.add(phase)
            db.commit()
            db.refresh(phase)

            for t_idx, (t_title, t_desc, t_prio) in enumerate(tasks, 1):
                # Mark first few tasks as completed for realistic progress
                is_done = (p_idx == 1 or (p_idx == 2 and t_idx == 1))
                task = RoadmapTask(
                    phase_id=phase.id,
                    task_number=t_idx,
                    title=t_title,
                    description=t_desc,
                    priority=t_prio,
                    is_completed=is_done
                )
                db.add(task)
            db.commit()

        phases = db.query(RoadmapPhase).filter(RoadmapPhase.project_id == project_id).all()

    # Format return
    res = []
    for phase in phases:
        tasks = db.query(RoadmapTask).filter(RoadmapTask.phase_id == phase.id).all()
        res.append({
            "id": phase.id,
            "phase_number": phase.phase_number,
            "title": phase.title,
            "description": phase.description,
            "tasks": tasks
        })
    return res

@router.put("/tasks/{task_id}")
def update_task_status(task_id: int, data: TaskUpdateSchema, db: Session = Depends(get_db)):
    task = db.query(RoadmapTask).filter(RoadmapTask.id == task_id).first()
    if task:
        task.is_completed = data.is_completed
        db.commit()
        db.refresh(task)
    return task
