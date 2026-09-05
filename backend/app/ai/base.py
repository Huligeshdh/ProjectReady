from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class BaseAIProvider(ABC):
    """Abstract base interface for all AI Providers (Gemini, OpenAI, NVIDIA, Ollama)."""

    @abstractmethod
    def generate(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Generate raw text response."""
        pass

    @abstractmethod
    def generate_structured(self, prompt: str, schema: Dict[str, Any], system_instruction: Optional[str] = None) -> Dict[str, Any]:
        """Generate structured JSON matching given schema."""
        pass

    @abstractmethod
    def embed(self, text: str) -> List[float]:
        """Generate vector embedding for RAG similarity search."""
        pass

    @abstractmethod
    def analyze_code(self, code_snippet: str, filename: str, language: str) -> Dict[str, Any]:
        """Perform static & semantic AI code review."""
        pass

    @abstractmethod
    def summarize(self, content: str, max_words: int = 150) -> str:
        """Summarize text or document."""
        pass
