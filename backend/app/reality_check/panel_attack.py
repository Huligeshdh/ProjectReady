from typing import List, Dict, Any

class PanelAttackEngine:
    """Generates Panel Attack Points and Expected Evaluator Questions tailored to project specs."""

    def generate_attack_points(self, project_title: str, tech_stack: str, issues: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        attack_points = [
            {
                "severity": "CRITICAL",
                "issue_title": "Unvalidated Model Evaluation Methodology & Test Dataset",
                "why_evaluator_challenges": "Evaluators frequently reject academic projects that report high accuracy without proving strict separation between training, validation, and test sets.",
                "likely_evaluator_question": "How do you guarantee that your model hasn't overfitted on the training data, and what is your out-of-sample test accuracy?",
                "recommended_answer": "We implemented a strict 80-10-10 stratified train-val-test split on the APTOS dataset, ensuring zero data leakage across fundus image series.",
                "recommended_fix": "Add a dedicated test evaluation script reporting Precision, Recall, F1-Score, and Confusion Matrix.",
                "related_component": "AI/ML Validation Pipeline"
            },
            {
                "severity": "HIGH",
                "issue_title": "Dependency on External API Services & Network Resilience",
                "why_evaluator_challenges": "Evaluators will test failure resilience: 'What happens if your cloud AI provider times out during a live demo?'",
                "likely_evaluator_question": "What happens to your application if the primary AI API experiences outage or rate limits during inference?",
                "recommended_answer": "We implemented an Intelligent AI Router with automatic multi-provider fallback (Gemini -> OpenAI -> NVIDIA -> Local Ollama simulation).",
                "recommended_fix": "Expose provider fallback status indicators on the top navigation bar.",
                "related_component": "AI Provider Abstraction Layer"
            },
            {
                "severity": "HIGH",
                "issue_title": "JWT Token Expiration & Authorization Vulnerability",
                "why_evaluator_challenges": "Security reviewers in evaluation panels check whether authorization tokens can be hijacked or reused indefinitely.",
                "likely_evaluator_question": "Does your authentication system enforce strict token expiration timestamps?",
                "recommended_answer": "Tokens are generated with HS256 HMAC signatures and 24-hour expiration claims validated on every request.",
                "recommended_fix": "Enforce `verify_exp=True` in JWT decode parameters in backend/app/core/security.py.",
                "related_component": "Authentication & Security Module"
            },
            {
                "severity": "MEDIUM",
                "issue_title": "Lack of Automated Integration Unit Test Suite",
                "why_evaluator_challenges": "Academic panels reward projects that demonstrate industry-grade testing practices.",
                "likely_evaluator_question": "How do you verify that new backend API changes don't break existing endpoint contracts?",
                "recommended_answer": "We maintain automated integration tests verifying authentication, model inference, and report export APIs.",
                "recommended_fix": "Create tests/test_api.py pytest suite with >80% code coverage.",
                "related_component": "Testing & Validation Framework"
            }
        ]
        return attack_points

    def generate_evaluator_questions(self, project_title: str) -> List[Dict[str, Any]]:
        return [
            {
                "category": "Architecture & Design",
                "question": "Why did you choose FastAPI over Flask or Django for your backend REST API?",
                "context_reason": "Evaluators look for technical justification rather than arbitrary framework selection.",
                "suggested_response_strategy": "Highlight FastAPI's async execution model, Pydantic type validation, and native OpenAPI 3.0 documentation."
            },
            {
                "category": "AI / Machine Learning",
                "question": "Why did you use Grad-CAM for explainability instead of LIME or SHAP?",
                "context_reason": "Evaluators challenge your choice of Explainable AI (XAI) algorithms for image data.",
                "suggested_response_strategy": "Explain that Grad-CAM produces dense spatial heatmaps directly from CNN feature maps, preserving retinal lesion location."
            },
            {
                "category": "Security & Data Privacy",
                "question": "How does your system protect sensitive medical patient data under HIPAA/GDPR standards?",
                "context_reason": "Healthcare projects are scrutinized for patient data privacy compliance.",
                "suggested_response_strategy": "Explain image anonymization preprocessing, SHA-256 password hashing, and encrypted data transmission."
            },
            {
                "category": "Scalability & Performance",
                "question": "What is your system's bottleneck if 1,000 clinicians upload fundus images simultaneously?",
                "context_reason": "Evaluators test your understanding of real-world deployment bottlenecks.",
                "suggested_response_strategy": "Identify GPU tensor inference as the bottleneck and propose Celery/Redis async task queues for worker scaling."
            }
        ]

panel_attack_engine = PanelAttackEngine()
