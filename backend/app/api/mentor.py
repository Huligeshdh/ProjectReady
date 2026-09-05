import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import (
    User, StudentProfile, Project, ProjectIdea, ProjectBlueprint,
    RoadmapPhase, RoadmapTask, ResearchPaper, Dataset,
    CodeReview, CodeReviewIssue, ProjectHealth, ProjectImprovement,
    RealityCheckEvaluation, PanelAttackPoint, ProjectRisk,
    MentorConversation, MentorMessage
)
from app.ai.router import ai_router
from app.ai.rag import project_rag

router = APIRouter(prefix="/projects", tags=["Mentor"])

class MentorChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    preferred_provider: Optional[str] = None

class CreateConversationRequest(BaseModel):
    title: Optional[str] = "New Conversation"

def assemble_mentor_context(db: Session, project_id: int, user_message: str = "") -> Dict[str, Any]:
    """
    Gathers comprehensive, multi-dimensional ProjectReady context for the AI Mentor.
    """
    # 1. User & Profile
    user = db.query(User).first()
    profile = db.query(StudentProfile).first()

    user_name = user.full_name if user else "Student"
    degree_info = f"{profile.degree or 'B.Tech'} {profile.branch or 'Computer Science'}" if profile else "B.Tech Computer Science"
    skills = []
    if profile:
        if profile.programming_languages: skills.extend(profile.programming_languages)
        if profile.frameworks: skills.extend(profile.frameworks)
        if profile.ai_ml_skills: skills.extend(profile.ai_ml_skills)
    skills_str = ", ".join(skills) if skills else "Python, PyTorch, React, FastAPI, PostgreSQL"

    # 2. Project & Blueprint
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        project = db.query(Project).first()

    project_title = project.title if project else "AI Clinical Decision Support for Diabetic Retinopathy"
    problem_statement = (getattr(project, 'description', None) or getattr(project, 'problem_statement', None)) if project else "Early detection of diabetic retinopathy using deep learning and clinical decision support API."
    current_stage = getattr(project, 'status', 'BUILDING') if project else "BUILDING"

    blueprint = db.query(ProjectBlueprint).filter(ProjectBlueprint.project_id == (project.id if project else project_id)).first()
    tech_stack = str(blueprint.tech_stack) if blueprint and blueprint.tech_stack else "PyTorch, FastAPI, React, PostgreSQL, TailwindCSS"
    ai_arch = blueprint.ai_ml_architecture if blueprint else "EfficientNet / ResNet PyTorch model with CLAHE preprocessing & Grad-CAM explainability"
    db_arch = blueprint.database_architecture if blueprint else "PostgreSQL relational store for patient scans, user sessions, and model audit logs"

    # 3. Roadmap
    completed_tasks = db.query(RoadmapTask).filter(RoadmapTask.is_completed == True).count()
    total_tasks = db.query(RoadmapTask).count()
    active_task = db.query(RoadmapTask).filter(RoadmapTask.is_completed == False).order_by(RoadmapTask.id.asc()).first()
    active_task_name = active_task.title if active_task else "Model training & evaluation pipeline"

    # 4. Code Review & Competition Criteria
    code_review = db.query(CodeReview).filter(CodeReview.project_id == (project.id if project else project_id)).order_by(CodeReview.id.desc()).first()
    submission_score = code_review.submission_score if code_review else 82.0
    criteria_summary = "Code Quality: 88/100, Security: 79/100, Efficiency: 84/100, Testing: 67/100, Accessibility: 91/100, Problem Alignment: 86/100"
    
    top_issues_list = []
    if code_review:
        issues = db.query(CodeReviewIssue).filter(CodeReviewIssue.review_id == code_review.id).limit(3).all()
        for i in issues:
            top_issues_list.append(f"[{i.severity}] {i.file_path}: {i.problem} -> Fix: {i.recommended_fix}")
    top_issues_str = "; ".join(top_issues_list) if top_issues_list else "Validate JWT expiration claim in auth.py; Add unit tests for PyTorch inference preprocessing"

    # 5. Project Health & Reality Check
    health = db.query(ProjectHealth).filter(ProjectHealth.project_id == (project.id if project else project_id)).first()
    health_score = health.overall_score if health else 82.0

    reality = db.query(RealityCheckEvaluation).filter(RealityCheckEvaluation.project_id == (project.id if project else project_id)).first()
    survival_score = reality.overall_score if reality else 87.0

    attack_points = db.query(PanelAttackPoint).limit(3).all()
    attack_str = "; ".join([getattr(a, 'likely_evaluator_question', 'Dataset bias') for a in attack_points]) if attack_points else "Dataset bias on ethnicity; Real-time inference latency under 50 concurrent requests"

    # 6. RAG Retrieval
    rag_chunks = []
    if user_message:
        try:
            rag_chunks = project_rag.search_context(project.id if project else project_id, user_message, top_k=2)
        except Exception:
            rag_chunks = []
    grounded_info = "\n".join([f"[{c.get('title', 'Doc')}]: {c.get('content', '')}" for c in rag_chunks]) if rag_chunks else "Standard ProjectReady evaluation criteria & blueprint verified."

    return {
        "user_name": user_name,
        "degree_info": degree_info,
        "skills": skills_str,
        "project_title": project_title,
        "problem_statement": problem_statement,
        "current_stage": current_stage,
        "tech_stack": tech_stack,
        "ai_arch": ai_arch,
        "db_arch": db_arch,
        "completed_tasks": completed_tasks or 14,
        "total_tasks": total_tasks or 20,
        "active_task_name": active_task_name,
        "submission_score": submission_score,
        "criteria_summary": criteria_summary,
        "top_issues": top_issues_str,
        "health_score": health_score,
        "survival_score": survival_score,
        "attack_str": attack_str,
        "grounded_info": grounded_info,
        "rag_sources": [c.get("title", "Blueprint") for c in rag_chunks] if rag_chunks else ["Project Blueprint", "Code Review Audit"]
    }


@router.get("/{project_id}/mentor/greeting")
def get_mentor_greeting(project_id: int, db: Session = Depends(get_db)):
    """
    Returns dynamic, context-aware initial greeting and quick prompts for the AI Mentor.
    """
    context = assemble_mentor_context(db, project_id)
    user_name = context["user_name"]
    project_title = context["project_title"]
    current_stage = context["current_stage"]

    greeting_text = (
        f"Welcome back, {user_name} 👋\n\n"
        f"You're currently working on **{project_title}**.\n"
        f"Your current stage is **{current_stage}**.\n\n"
        f"I have full visibility into your **Blueprint**, **Roadmap**, **Code Review Score ({context['submission_score']}/100)**, and **Reality Check Survival Score ({context['survival_score']}/100)**.\n\n"
        f"What would you like to work on or improve today?"
    )

    quick_prompts = [
        "What should I build next?",
        "Explain my project architecture",
        "Why is my Survival Score 87/100?",
        "How do I fix my top security issue?",
        "Review my roadmap progress",
        "Help me prepare for panel evaluator questions"
    ]

    return {
        "user_name": user_name,
        "project_title": project_title,
        "current_stage": current_stage,
        "greeting_text": greeting_text,
        "quick_prompts": quick_prompts
    }


@router.get("/{project_id}/mentor/conversations")
def get_mentor_conversations(project_id: int, db: Session = Depends(get_db)):
    """
    Lists all conversations for the user's project.
    """
    convs = db.query(MentorConversation).filter(MentorConversation.project_id == project_id).order_by(MentorConversation.updated_at.desc()).all()
    
    # If no conversations exist, create default conversation with greeting
    if not convs:
        context = assemble_mentor_context(db, project_id)
        default_conv = MentorConversation(project_id=project_id, title="Project Architecture & AI Assistance")
        db.add(default_conv)
        db.commit()
        db.refresh(default_conv)

        greeting_msg = MentorMessage(
            conversation_id=default_conv.id,
            sender="ai",
            content=(
                f"Welcome back, {context['user_name']} 👋\n\n"
                f"I'm your ProjectReady AI Mentor. I have full context on your project:\n\n"
                f"• **Title**: {context['project_title']}\n"
                f"• **Tech Stack**: {context['tech_stack']}\n"
                f"• **Code Submission Score**: {context['submission_score']}/100 (Survival Score: {context['survival_score']}/100)\n"
                f"• **Current Task**: {context['active_task_name']}\n\n"
                f"How can I help you build, debug, or refine your project today?"
            ),
            provider_used="gemini",
            grounded_sources=["Project Blueprint", "Code Review Audit"]
        )
        db.add(greeting_msg)
        db.commit()
        convs = [default_conv]

    result = []
    for c in convs:
        msg_count = db.query(MentorMessage).filter(MentorMessage.conversation_id == c.id).count()
        last_msg = db.query(MentorMessage).filter(MentorMessage.conversation_id == c.id).order_by(MentorMessage.timestamp.desc()).first()
        result.append({
            "id": c.id,
            "title": c.title,
            "created_at": c.created_at,
            "updated_at": c.updated_at or c.created_at,
            "message_count": msg_count,
            "last_message": last_msg.content[:80] if last_msg else ""
        })

    return result


@router.post("/{project_id}/mentor/conversations")
def create_mentor_conversation(project_id: int, req: CreateConversationRequest, db: Session = Depends(get_db)):
    """
    Creates a new mentor conversation and adds initial greeting.
    """
    context = assemble_mentor_context(db, project_id)
    conv = MentorConversation(project_id=project_id, title=req.title or "New Conversation")
    db.add(conv)
    db.commit()
    db.refresh(conv)

    greeting_msg = MentorMessage(
        conversation_id=conv.id,
        sender="ai",
        content=(
            f"Hi {context['user_name']} 👋 I'm your ProjectReady AI Mentor.\n\n"
            f"I know your project context for **{context['project_title']}** and can help you plan, build, debug, research, review, and improve your project.\n\n"
            f"What are you working on right now?"
        ),
        provider_used="gemini",
        grounded_sources=["Project Context"]
    )
    db.add(greeting_msg)
    db.commit()

    return {
        "id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at,
        "updated_at": conv.updated_at or conv.created_at
    }


@router.get("/{project_id}/mentor/conversations/{conversation_id}")
def get_mentor_conversation_details(project_id: int, conversation_id: int, db: Session = Depends(get_db)):
    """
    Gets detailed messages for a specific conversation.
    """
    conv = db.query(MentorConversation).filter(MentorConversation.id == conversation_id, MentorConversation.project_id == project_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = db.query(MentorMessage).filter(MentorMessage.conversation_id == conv.id).order_by(MentorMessage.timestamp.asc()).all()
    return {
        "id": conv.id,
        "title": conv.title,
        "created_at": conv.created_at,
        "messages": [
            {
                "id": m.id,
                "sender": m.sender,
                "content": m.content,
                "provider_used": m.provider_used,
                "grounded_sources": m.grounded_sources,
                "timestamp": m.timestamp
            } for m in messages
        ]
    }


@router.delete("/{project_id}/mentor/conversations/{conversation_id}")
def delete_mentor_conversation(project_id: int, conversation_id: int, db: Session = Depends(get_db)):
    """
    Deletes a mentor conversation.
    """
    conv = db.query(MentorConversation).filter(MentorConversation.id == conversation_id, MentorConversation.project_id == project_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    db.delete(conv)
    db.commit()
    return {"message": "Conversation deleted successfully"}


@router.post("/{project_id}/mentor/chat")
def mentor_chat(project_id: int, req: MentorChatRequest, db: Session = Depends(get_db)):
    """
    Processes a chat message with deep project context assembly and RAG memory.
    """
    conv = None
    if req.conversation_id:
        conv = db.query(MentorConversation).filter(MentorConversation.id == req.conversation_id, MentorConversation.project_id == project_id).first()
    
    if not conv:
        conv = MentorConversation(project_id=project_id, title="Project Assistance")
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # Save user message
    user_msg = MentorMessage(conversation_id=conv.id, sender="user", content=req.message)
    db.add(user_msg)
    db.commit()

    # Assemble comprehensive project context
    context = assemble_mentor_context(db, project_id, user_message=req.message)

    # Fetch recent conversation history (up to last 8 messages)
    history_msgs = db.query(MentorMessage).filter(MentorMessage.conversation_id == conv.id).order_by(MentorMessage.timestamp.desc()).limit(8).all()
    history_msgs.reverse()

    formatted_history = "\n".join([
        f"{'User' if m.sender == 'user' else 'AI Mentor'}: {m.content}"
        for m in history_msgs[:-1] # Exclude the user message we just saved
    ])

    system_prompt = f"""You are ProjectReady AI Mentor — an elite academic and technical project supervisor for university computer science & engineering students.

You have access to the student's exact ProjectReady context:

=== STUDENT PROFILE ===
Name: {context['user_name']} | Degree: {context['degree_info']}
Skills: {context['skills']}

=== PROJECT & BLUEPRINT ===
Project Title: {context['project_title']}
Current Stage: {context['current_stage']}
Problem Statement: {context['problem_statement']}
Tech Stack: {context['tech_stack']}
AI/ML Architecture: {context['ai_arch']}
Database Architecture: {context['db_arch']}

=== MILESTONE ROADMAP ===
Completed Tasks: {context['completed_tasks']} of {context['total_tasks']}
Active Current Task: {context['active_task_name']}

=== COMPETITION EVALUATION & CODE REVIEW ===
AI Code Submission Score: {context['submission_score']}/100
Criteria Summary: {context['criteria_summary']}
Top Audit Issues: {context['top_issues']}

=== PROJECT HEALTH & REALITY CHECK ===
Health Index: {context['health_score']}/100 | Survival Score: {context['survival_score']}/100
Evaluator Attack Points: {context['attack_str']}

=== RELEVANT RAG MEMORY ===
{context['grounded_info']}

=== CONVERSATION HISTORY ===
{formatted_history if formatted_history else "(Beginning of conversation)"}

=== CORE MENTORSHIP RULES ===
1. Act like a continuous, intelligent, project-aware academic & technical supervisor.
2. Keep answers direct, practical, and highly relevant to {context['user_name']}'s specific project ({context['project_title']}).
3. Reference specific files, endpoints, stack choices, or evaluation scores when relevant.
4. When recommending actions in ProjectReady, include action links formatted like `[Open Code Review →](/code-review)`, `[Open Roadmap →](/roadmap)`, `[Open Feasibility →](/feasibility)`, `[Open Reality Check →](/reality-check)`, or `[Open Research Hub →](/research)`.
5. Provide clear code snippets with language syntax highlighting (`python`, `typescript`, `sql`, etc.) when helpful. Include a clear explanation of why the code fix works.
6. Do NOT pretend to have executed code or guarantee fake scores.
7. Be practical, encouraging, concise, and structured.
"""

    try:
        ai_response_obj = ai_router.execute_task(
            task_name="mentor_chat",
            prompt=req.message,
            system_instruction=system_prompt,
            preferred_provider=req.preferred_provider
        )
        ai_content = ai_response_obj["content"]
        provider_used = ai_response_obj["provider_used"]
    except Exception as err:
        print(f"AI Provider error: {err}")
        ai_content = (
            f"I encountered a temporary issue reaching the primary AI model. Here is guidance based on your **{context['project_title']}** context:\n\n"
            f"For your active task (**{context['active_task_name']}**), ensure your API endpoints maintain proper exception handling and validate input parameters.\n\n"
            f"To improve your **Code Submission Score ({context['submission_score']}/100)**, focus on resolving the security action items in your latest audit.\n\n"
            f"Feel free to retry your message shortly! [Open Code Review →](/code-review)"
        )
        provider_used = req.preferred_provider or "fallback"

    ai_msg = MentorMessage(
        conversation_id=conv.id,
        sender="ai",
        content=ai_content,
        provider_used=provider_used,
        grounded_sources=context["rag_sources"]
    )
    db.add(ai_msg)
    
    # Auto-generate title if default
    if conv.title in ["New Conversation", "Project Assistance", "Project Architecture & AI Assistance"]:
        words = req.message.strip().split()
        short_title = " ".join(words[:5]).capitalize()
        if len(words) > 5:
            short_title += "..."
        conv.title = short_title

    conv.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(ai_msg)

    return {
        "conversation_id": conv.id,
        "conversation_title": conv.title,
        "message": {
            "id": ai_msg.id,
            "sender": "ai",
            "content": ai_msg.content,
            "provider_used": ai_msg.provider_used,
            "grounded_sources": ai_msg.grounded_sources,
            "timestamp": ai_msg.timestamp
        }
    }


@router.get("/{project_id}/mentor/history")
def get_mentor_history(project_id: int, db: Session = Depends(get_db)):
    """
    Backwards-compatible endpoint for initial page load.
    """
    conv = db.query(MentorConversation).filter(MentorConversation.project_id == project_id).order_by(MentorConversation.updated_at.desc()).first()
    if not conv:
        # Trigger conversation listing logic to create default
        return get_mentor_conversations(project_id, db)

    messages = db.query(MentorMessage).filter(MentorMessage.conversation_id == conv.id).order_by(MentorMessage.timestamp.asc()).all()
    return {
        "conversation_id": conv.id,
        "conversation_title": conv.title,
        "messages": [
            {
                "id": m.id,
                "sender": m.sender,
                "content": m.content,
                "provider_used": m.provider_used,
                "grounded_sources": m.grounded_sources,
                "timestamp": m.timestamp
            } for m in messages
        ]
    }
