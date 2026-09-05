import json
import logging
import httpx
from typing import Dict, Any, List, Optional
from app.ai.base import BaseAIProvider
from app.core.config import settings

logger = logging.getLogger(__name__)

class NvidiaProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.NVIDIA_API_KEY
        self.name = "nvidia"

    def generate(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.api_key:
            return f"[NVIDIA Fallback Simulation] High performance response for: {prompt[:100]}..."
        
        try:
            url = "https://integrate.api.nvidia.com/v1/chat/completions"
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})

            payload = {"model": "nvidia/llama-3.1-nemotron-70b-instruct", "messages": messages, "max_tokens": 1024}
            response = httpx.post(url, headers=headers, json=payload, timeout=20.0)
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            logger.warning(f"NVIDIA API status {response.status_code}: {response.text}")
        except Exception as e:
            logger.error(f"NVIDIA error: {e}")

        return f"[NVIDIA Resilient Fallback] Task guidance: {prompt[:120]}..."

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
        hash_val = sum(ord(c) * (i + 3) for i, c in enumerate(text[:200]))
        return [math.sin(hash_val * 0.5 + i) for i in range(128)]

    def analyze_code(self, code_snippet: str, filename: str, language: str) -> Dict[str, Any]:
        prompt = f"Analyze code for {filename}:\n{code_snippet[:1500]}"
        return self.generate_structured(prompt, {})

    def summarize(self, content: str, max_words: int = 150) -> str:
        return self.generate(f"Summarize in under {max_words} words:\n{content[:2000]}")
