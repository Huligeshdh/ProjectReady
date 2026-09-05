import math
from typing import List, Dict, Any
from app.ai.router import ai_router

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.0
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm_a = math.sqrt(sum(a * a for a in vec1))
    norm_b = math.sqrt(sum(b * b for b in vec2))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)

class ProjectRAGStore:
    """Project-specific vector memory store for RAG grounding."""
    def __init__(self):
        self.documents: Dict[int, List[Dict[str, Any]]] = {} # project_id -> list of doc chunks

    def add_document_chunk(self, project_id: int, title: str, content: str, source_type: str):
        if project_id not in self.documents:
            self.documents[project_id] = []
        
        provider = ai_router.get_provider_for_task("mentor_chat")
        embedding = provider.embed(content[:500])
        
        self.documents[project_id].append({
            "title": title,
            "content": content,
            "source_type": source_type,
            "embedding": embedding
        })

    def search_context(self, project_id: int, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        chunks = self.documents.get(project_id, [])
        if not chunks:
            return []

        provider = ai_router.get_provider_for_task("mentor_chat")
        query_embedding = provider.embed(query[:500])

        scored_chunks = []
        for chunk in chunks:
            score = cosine_similarity(query_embedding, chunk["embedding"])
            scored_chunks.append({
                "title": chunk["title"],
                "content": chunk["content"],
                "source_type": chunk["source_type"],
                "score": score
            })

        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k]

project_rag = ProjectRAGStore()
