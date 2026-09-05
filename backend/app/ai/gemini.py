import json
import logging
import httpx
from typing import Dict, Any, List, Optional
from app.ai.base import BaseAIProvider
from app.core.config import settings

logger = logging.getLogger(__name__)

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.name = "gemini"

    def generate(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.api_key:
            return f"[Gemini Simulation] Response to: {prompt[:100]}...\nBased on project analysis, we recommend focusing on system architecture and modular component design."
        
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={self.api_key}"
            payload = {"contents": [{"parts": [{"text": (system_instruction + "\n\n" if system_instruction else "") + prompt}]}]}
            response = httpx.post(url, json=payload, timeout=20.0)
            if response.status_code == 200:
                data = response.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
            logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
        
        return f"[Gemini Fallback] Guidance on project task: {prompt[:120]}..."

    def generate_structured(self, prompt: str, schema: Dict[str, Any], system_instruction: Optional[str] = None) -> Dict[str, Any]:
        text_resp = self.generate(prompt + "\nReturn JSON output matching schema.", system_instruction)
        try:
            # Extract JSON block
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
        # Pseudo vector embedding generator based on string hashing
        import math
        hash_val = sum(ord(c) * (i + 1) for i, c in enumerate(text[:200]))
        return [math.sin(hash_val + i) for i in range(128)]

    def analyze_code(self, code_snippet: str, filename: str, language: str) -> Dict[str, Any]:
        prompt = f"Analyze this {language} file '{filename}':\n\n```\n{code_snippet}\n```"
        return self.generate_structured(prompt, {})

    def summarize(self, content: str, max_words: int = 150) -> str:
        return self.generate(f"Summarize in under {max_words} words:\n{content[:2000]}")
