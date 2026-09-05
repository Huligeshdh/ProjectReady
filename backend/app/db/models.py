import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="student")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("StudentProfile", back_populates="user", uselist=False)
    projects = relationship("Project", back_populates="user")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    degree = Column(String, default="B.Tech Computer Science")
    branch = Column(String, default="Computer Science & Engineering")
    academic_year = Column(String, default="Final Year (4th Year)")
    programming_languages = Column(JSON, default=list) # ["Python", "TypeScript", "C++"]
    frameworks = Column(JSON, default=list) # ["React", "FastAPI", "PyTorch"]
    databases = Column(JSON, default=list) # ["PostgreSQL", "Redis"]
    ai_ml_skills = Column(JSON, default=list) # ["NLP", "Computer Vision", "LLMs"]
    cloud_skills = Column(JSON, default=list) # ["AWS", "Docker", "GCP"]
    other_skills = Column(JSON, default=list)
    interests = Column(JSON, default=list) # ["Healthcare", "Finance", "Cybersecurity"]
    team_size = Column(Integer, default=3)
    available_time_months = Column(Integer, default=4)
    budget_usd = Column(Float, default=100.0)
    hardware_gpu = Column(String, default="NVIDIA RTX 4070 / Cloud GPU")
    experience_level = Column(String, default="Intermediate") # Beginner, Intermediate, Advanced
    preferred_project_type = Column(String, default="AI/ML Web App")

    user = relationship("User", back_populates="profile")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    domain = Column(String, default="Artificial Intelligence")
    difficulty = Column(String, default="Intermediate")
    status = Column(String, default="planning") # planning, in_progress, code_reviewed, completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="projects")
    blueprint = relationship("ProjectBlueprint", back_populates="project", uselist=False)
    roadmaps = relationship("RoadmapPhase", back_populates="project")
    research_papers = relationship("ResearchPaper", back_populates="project")
    repositories = relationship("Repository", back_populates="project")
    learning_resources = relationship("LearningResource", back_populates="project")
    datasets = relationship("Dataset", back_populates="project")
    mentor_conversations = relationship("MentorConversation", back_populates="project")
    code_reviews = relationship("CodeReview", back_populates="project")
    health_reports = relationship("ProjectHealth", back_populates="project")
    improvements = relationship("ProjectImprovement", back_populates="project")

class ProjectIdea(Base):
    __tablename__ = "project_ideas"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    one_liner = Column(String, nullable=False)
    problem_statement = Column(Text, nullable=False)
    target_users = Column(Text)
    why_it_matters = Column(Text)
    core_features = Column(JSON, default=list)
    advanced_features = Column(JSON, default=list)
    required_skills = Column(JSON, default=list)
    recommended_tech = Column(JSON, default=list)
    dataset_api_requirements = Column(Text)
    estimated_duration_months = Column(Integer, default=4)
    difficulty = Column(String, default="Intermediate")
    
    # Quantitative Scores
    overall_score = Column(Float, default=85.0)
    skill_match_score = Column(Float, default=90.0)
    feasibility_score = Column(Float, default=85.0)
    innovation_score = Column(Float, default=80.0)
    time_fit_score = Column(Float, default=88.0)
    resource_availability_score = Column(Float, default=92.0)
    complexity_score = Column(Float, default=75.0)

class ProjectBlueprint(Base):
    __tablename__ = "project_blueprints"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), unique=True)
    overview = Column(Text)
    problem_statement = Column(Text)
    objectives = Column(JSON, default=list)
    target_users = Column(Text)
    functional_requirements = Column(JSON, default=list)
    non_functional_requirements = Column(JSON, default=list)
    tech_stack = Column(JSON, default=dict)
    system_architecture = Column(Text)
    database_architecture = Column(Text)
    api_architecture = Column(Text)
    ai_ml_architecture = Column(Text)
    security_considerations = Column(JSON, default=list)
    dataset_requirements = Column(Text)
    expected_results = Column(Text)
    risks = Column(JSON, default=list)
    future_scope = Column(JSON, default=list)

    project = relationship("Project", back_populates="blueprint")

class ResearchPaper(Base):
    __tablename__ = "research_papers"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    title = Column(String, nullable=False)
    authors = Column(String)
    year = Column(Integer)
    abstract = Column(Text)
    relevance_score = Column(Float, default=90.0)
    doi = Column(String)
    source = Column(String, default="OpenAlex/arXiv")
    url = Column(String)

    project = relationship("Project", back_populates="research_papers")

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    name = Column(String, nullable=False)
    description = Column(Text)
    language = Column(String)
    stars = Column(Integer, default=0)
    topics = Column(JSON, default=list)
    last_updated = Column(String)
    relevance_reason = Column(Text)
    url = Column(String)

    project = relationship("Project", back_populates="repositories")

class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    step_number = Column(Integer)
    topic = Column(String, nullable=False)
    description = Column(Text)
    video_title = Column(String)
    video_url = Column(String)
    duration = Column(String)
    channel = Column(String)

    project = relationship("Project", back_populates="learning_resources")

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    name = Column(String, nullable=False)
    source = Column(String)
    size = Column(String)
    format = Column(String)
    license = Column(String)
    recommended_usage = Column(Text)
    url = Column(String)

    project = relationship("Project", back_populates="datasets")

class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    phase_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)

    project = relationship("Project", back_populates="roadmaps")
    tasks = relationship("RoadmapTask", back_populates="phase")

class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(Integer, primary_key=True, index=True)
    phase_id = Column(Integer, ForeignKey("roadmap_phases.id"))
    task_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    estimated_days = Column(Integer, default=3)
    priority = Column(String, default="Medium") # High, Medium, Low
    is_completed = Column(Boolean, default=False)

    phase = relationship("RoadmapPhase", back_populates="tasks")

class MentorConversation(Base):
    __tablename__ = "mentor_conversations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    title = Column(String, default="Project Assistance")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="mentor_conversations")
    messages = relationship("MentorMessage", back_populates="conversation", cascade="all, delete-orphan")

class MentorMessage(Base):
    __tablename__ = "mentor_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("mentor_conversations.id"))
    sender = Column(String, nullable=False) # user, ai
    content = Column(Text, nullable=False)
    provider_used = Column(String, default="gemini")
    grounded_sources = Column(JSON, default=list)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("MentorConversation", back_populates="messages")

class CodeReview(Base):
    __tablename__ = "code_reviews"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    run_number = Column(Integer, default=1) # 1 for initial, 2+ for re-analysis
    zip_filename = Column(String, nullable=False)
    total_files = Column(Integer, default=0)
    total_lines = Column(Integer, default=0)
    languages_detected = Column(JSON, default=list)
    frameworks_detected = Column(JSON, default=list)
    health_score = Column(Float, default=75.0)
    submission_score = Column(Float, default=75.0)  # Weighted 6-criteria score
    criteria_scores = Column(JSON, default=dict)  # Per-criterion breakdown
    alignment_data = Column(JSON, default=dict)  # Problem Statement Alignment
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="code_reviews")
    issues = relationship("CodeReviewIssue", back_populates="review")

class CodeReviewIssue(Base):
    __tablename__ = "code_review_issues"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("code_reviews.id"))
    severity = Column(String, nullable=False) # CRITICAL, HIGH, MEDIUM, LOW, INFO
    category = Column(String, nullable=False) # Bug, Code Quality, Security, Architecture, Testing
    file_path = Column(String, nullable=False)
    line_number = Column(Integer, default=1)
    problem = Column(Text, nullable=False)
    why_it_matters = Column(Text, nullable=False)
    impact = Column(Text, nullable=False)
    recommended_fix = Column(Text, nullable=False)
    original_code = Column(Text)
    suggested_code = Column(Text)
    is_resolved = Column(Boolean, default=False)

    review = relationship("CodeReview", back_populates="issues")

class ProjectHealth(Base):
    __tablename__ = "project_health"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    overall_score = Column(Float, default=80.0)
    code_quality_score = Column(Float, default=82.0)
    architecture_score = Column(Float, default=85.0)
    security_score = Column(Float, default=70.0)
    testing_score = Column(Float, default=65.0)
    performance_score = Column(Float, default=78.0)
    maintainability_score = Column(Float, default=84.0)
    documentation_score = Column(Float, default=90.0)
    innovation_score = Column(Float, default=88.0)
    feasibility_score = Column(Float, default=92.0)
    measured_metrics = Column(JSON, default=dict)
    ai_qualitative_assessment = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="health_reports")

class ProjectImprovement(Base):
    __tablename__ = "project_improvements"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # Security, Performance, Testing, Architecture, Innovation
    priority = Column(String, default="HIGH") # CRITICAL, HIGH, MEDIUM, LOW
    problem_summary = Column(Text, nullable=False)
    impact = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    estimated_effort = Column(String, default="2-4 hours")
    status = Column(String, default="Not Started") # Not Started, In Progress, Completed

    project = relationship("Project", back_populates="improvements")

class AIProviderLog(Base):
    __tablename__ = "ai_provider_logs"

    id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String, nullable=False)
    provider_used = Column(String, nullable=False)
    success = Column(Boolean, default=True)
    latency_ms = Column(Integer, default=200)
    error_message = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class RealityCheckEvaluation(Base):
    __tablename__ = "reality_check_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    evaluation_type = Column(String, default="PLAN") # PLAN, IMPLEMENTATION, RE_ANALYSIS
    overall_score = Column(Float, default=84.0)
    classification = Column(String, default="Strong") # Excellent, Strong, Good, Risky, Weak, High Risk
    planned_score = Column(Float, default=84.0)
    implemented_score = Column(Float, default=67.0)
    implementation_gap = Column(Float, default=-17.0)
    strengths = Column(JSON, default=list)
    ai_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RealityCheckDimension(Base):
    __tablename__ = "reality_check_dimensions"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("reality_check_evaluations.id"))
    key = Column(String, nullable=False) # e.g. problem_validity, originality
    name = Column(String, nullable=False) # e.g. Problem Validity
    score = Column(Float, default=80.0)
    weight = Column(Float, default=0.08)
    measured_type = Column(String, default="AI Qualitative") # Measured, AI Qualitative
    strong_because = Column(Text)
    weakness_note = Column(Text)

class ProjectRisk(Base):
    __tablename__ = "project_risks"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("reality_check_evaluations.id"))
    category = Column(String, nullable=False) # Technical, Dataset, Security, Performance, Cost, Time
    risk_title = Column(String, nullable=False)
    severity = Column(String, default="High") # Critical, High, Medium, Low
    probability = Column(String, default="Medium") # High, Medium, Low
    impact_description = Column(Text, nullable=False)
    mitigation_strategy = Column(Text, nullable=False)

class PanelAttackPoint(Base):
    __tablename__ = "panel_attack_points"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("reality_check_evaluations.id"))
    severity = Column(String, default="HIGH") # CRITICAL, HIGH, MEDIUM
    issue_title = Column(String, nullable=False)
    why_evaluator_challenges = Column(Text, nullable=False)
    likely_evaluator_question = Column(Text, nullable=False)
    recommended_answer = Column(Text, nullable=False)
    recommended_fix = Column(Text, nullable=False)
    related_component = Column(String, default="System Architecture")

class EvaluatorQuestion(Base):
    __tablename__ = "evaluator_questions"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("reality_check_evaluations.id"))
    category = Column(String, default="Architecture") # Architecture, ML/AI, Security, Database
    question = Column(Text, nullable=False)
    context_reason = Column(Text, nullable=False)
    suggested_response_strategy = Column(Text, nullable=False)

class ProjectScoreHistory(Base):
    __tablename__ = "project_score_history"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    run_number = Column(Integer, default=1)
    stage_name = Column(String, nullable=False) # Initial Plan, First Build, After Fix #1, Final
    overall_score = Column(Float, default=80.0)
    delta = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

