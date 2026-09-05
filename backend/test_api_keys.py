import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.ai.gemini import GeminiProvider
from app.ai.openai_provider import OpenAIProvider
from app.ai.nvidia import NvidiaProvider
from app.ai.ollama import OllamaProvider
from app.ai.router import ai_router

def test_all_providers():
    print("=" * 60)
    print("TESTING ALL CONFIGURED AI PROVIDERS WITH LIVE API KEYS")
    print("=" * 60)

    prompt = "Suggest 1 key feature for a final-year academic AI project in Healthcare."

    # 1. Gemini Provider
    print("\n--- [1] Testing Google Gemini API ---")
    gemini = GeminiProvider()
    resp_gemini = gemini.generate(prompt)
    print(f"Gemini Key Present: {bool(settings.GEMINI_API_KEY)}")
    print(f"Response: {resp_gemini[:200]}...\n")

    # 2. OpenAI Provider
    print("--- [2] Testing OpenAI API (GPT-4o) ---")
    openai_p = OpenAIProvider()
    resp_openai = openai_p.generate(prompt)
    print(f"OpenAI Key Present: {bool(settings.OPENAI_API_KEY)}")
    print(f"Response: {resp_openai[:200]}...\n")

    # 3. NVIDIA Provider
    print("--- [3] Testing NVIDIA API (Llama 3.1 70B) ---")
    nvidia_p = NvidiaProvider()
    resp_nvidia = nvidia_p.generate(prompt)
    print(f"NVIDIA Key Present: {bool(settings.NVIDIA_API_KEY)}")
    print(f"Response: {resp_nvidia[:200]}...\n")

    # 4. Ollama Provider
    print("--- [4] Testing Ollama Provider ---")
    ollama_p = OllamaProvider()
    resp_ollama = ollama_p.generate(prompt)
    print(f"Response: {resp_ollama[:200]}...\n")

    # 5. Testing Router Execution & Fallback Chain
    print("--- [5] Testing Intelligent AI Router Task Execution ---")
    routed_resp = ai_router.execute_task("idea_generation", "Generate a quick 1-line project summary")
    print(f"Task: idea_generation")
    print(f"Provider Selected: {routed_resp['provider_used']}")
    print(f"Latency: {routed_resp['latency_ms']} ms")
    print(f"Content: {routed_resp['content'][:200]}...\n")

    print("=" * 60)
    print("ALL AI PROVIDER TESTS COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_all_providers()
