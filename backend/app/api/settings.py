from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.core.config import settings

router = APIRouter(prefix="/settings", tags=["Settings"])

class AISettingsUpdateSchema(BaseModel):
    AI_DEFAULT_PROVIDER: Optional[str] = None
    AI_CODE_REVIEW_PROVIDER: Optional[str] = None
    AI_LOCAL_PROVIDER: Optional[str] = None
    AI_RESEARCH_PROVIDER: Optional[str] = None
    AI_FALLBACK_PROVIDER: Optional[str] = None

@router.get("/ai")
def get_ai_settings():
    return {
        "providers_available": [
            {"id": "gemini", "name": "Google Gemini API", "status": "active" if settings.GEMINI_API_KEY else "simulation_fallback"},
            {"id": "openai", "name": "OpenAI API (GPT-4o)", "status": "active" if settings.OPENAI_API_KEY else "simulation_fallback"},
            {"id": "nvidia", "name": "NVIDIA API (Llama 3.1 70B)", "status": "active" if settings.NVIDIA_API_KEY else "simulation_fallback"},
            {"id": "ollama", "name": "Ollama (Local LLM)", "status": "active"}
        ],
        "routing": {
            "AI_DEFAULT_PROVIDER": settings.AI_DEFAULT_PROVIDER,
            "AI_CODE_REVIEW_PROVIDER": settings.AI_CODE_REVIEW_PROVIDER,
            "AI_LOCAL_PROVIDER": settings.AI_LOCAL_PROVIDER,
            "AI_RESEARCH_PROVIDER": settings.AI_RESEARCH_PROVIDER,
            "AI_FALLBACK_PROVIDER": settings.AI_FALLBACK_PROVIDER
        }
    }

@router.put("/ai")
def update_ai_settings(data: AISettingsUpdateSchema):
    for field, val in data.dict(exclude_unset=True).items():
        if hasattr(settings, field) and val:
            setattr(settings, field, val)
    return get_ai_settings()
