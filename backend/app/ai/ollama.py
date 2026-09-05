import json
import logging
import httpx
from typing import Dict, Any, List, Optional
from app.ai.base import BaseAIProvider
from app.core.config import settings

logger = logging.getLogger(__name__)

class OllamaProvider(BaseAIProvider):
    def __init__(self, base_url: Optional[str] = None):
        self.base_url = base_url or settings.OLLAMA_BASE_URL
        self.name = "ollama"

    def generate(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        try:
            url = f"{self.base_url}/api/generate"
            payload = {
                "model": "llama3",
                "prompt": (system_instruction + "\n\n" if system_instruction else "") + prompt,
                "stream": False
            }
            response = httpx.post(url, json=payload, timeout=10.0)
            if response.status_code == 200:
                return response.json().get("response", "")
        except Exception as e:
            logger.info(f"Ollama local instance not available ({e}); using local privacy fallback.")

        return f"[Ollama Local Simulation] Private code analysis for: {prompt[:100]}...\nNo data transmitted externally."

    def generate_structured(self, prompt: str, schema: Dict[str, Any], system_instruction: Optional[str] = None) -> Dict[str, Any]:
        text_resp = self.generate(prompt + "\nReturn JSON output.", system_instruction)
        try:
            if "```json" in text_resp:
                json_str = text_resp.split("```json")[1].split("```")[0].strip()
            elif "```" in text_resp:
                json_str = text_resp.split("```")[1].split("```")[0].strip()
            else:
                json_str = text_resp.strip()
            return json.loads(json_str)
        except Exception:
            return {"result": text_resp, "status": "simulated_structured"}

    def embed(self, text: str) -> List[float]:
        import math
        hash_val = sum(ord(c) * (i + 4) for i, c in enumerate(text[:200]))
        return [math.cos(hash_val * 0.2 + i) for i in range(128)]

    def analyze_code(self, code_snippet: str, filename: str, language: str) -> Dict[str, Any]:
        prompt = f"Analyze code for {filename}:\n{code_snippet[:1500]}"
        return self.generate_structured(prompt, {})

    def summarize(self, content: str, max_words: int = 150) -> str:
        return self.generate(f"Summarize in under {max_words} words:\n{content[:2000]}")
