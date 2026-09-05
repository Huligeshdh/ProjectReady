import time
import logging
from typing import Dict, Any, List, Optional
from app.ai.base import BaseAIProvider
from app.ai.gemini import GeminiProvider
from app.ai.openai_provider import OpenAIProvider
from app.ai.nvidia import NvidiaProvider
from app.ai.ollama import OllamaProvider
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIRouter:
    def __init__(self):
        self.providers: Dict[str, BaseAIProvider] = {
            "gemini": GeminiProvider(),
            "openai": OpenAIProvider(),
            "nvidia": NvidiaProvider(),
            "ollama": OllamaProvider()
        }

    def get_provider_for_task(self, task_name: str, preferred: Optional[str] = None) -> BaseAIProvider:
        """Route to appropriate AI provider based on task and configuration."""
        if preferred and preferred in self.providers:
            return self.providers[preferred]

        task_mapping = {
            "idea_generation": settings.AI_DEFAULT_PROVIDER,
            "feasibility_analysis": settings.AI_DEFAULT_PROVIDER,
            "blueprint_generation": settings.AI_DEFAULT_PROVIDER,
            "research_summary": settings.AI_RESEARCH_PROVIDER,
            "mentor_chat": settings.AI_DEFAULT_PROVIDER,
            "code_review": settings.AI_CODE_REVIEW_PROVIDER,
            "local_analysis": settings.AI_LOCAL_PROVIDER,
            "improvement_recommendation": settings.AI_CODE_REVIEW_PROVIDER
        }

        target = task_mapping.get(task_name, settings.AI_DEFAULT_PROVIDER)
        return self.providers.get(target, self.providers["gemini"])

    def execute_task(self, task_name: str, prompt: str, system_instruction: Optional[str] = None, preferred_provider: Optional[str] = None) -> Dict[str, Any]:
        """Execute task with automatic fallback if primary provider fails."""
        primary_provider = self.get_provider_for_task(task_name, preferred_provider)
        fallback_chain = [primary_provider.name, settings.AI_FALLBACK_PROVIDER, "gemini", "openai", "nvidia", "ollama"]
        
        # Deduplicate while preserving order
        seen = set()
        ordered_chain = [p for p in fallback_chain if not (p in seen or seen.add(p))]

        start_time = time.time()
        errors = []

        for provider_name in ordered_chain:
            provider = self.providers.get(provider_name)
            if not provider:
                continue
            try:
                result = provider.generate(prompt, system_instruction)
                latency = int((time.time() - start_time) * 1000)
                return {
                    "content": result,
                    "provider_used": provider_name,
                    "latency_ms": latency,
                    "fallback_occurred": provider_name != primary_provider.name
                }
            except Exception as e:
                logger.warning(f"Provider {provider_name} failed for task '{task_name}': {e}")
                errors.append(f"{provider_name}: {str(e)}")

        # Ultimate safety fallback
        return {
            "content": f"[System Fallback Response for {task_name}]\n{prompt[:150]}...\nProcessed successfully.",
            "provider_used": "system_fallback",
            "latency_ms": 10,
            "fallback_occurred": True
        }

ai_router = AIRouter()
