from typing import List, Dict, Any

class ProjectRiskEngine:
    """Identifies realistic project failure scenarios across Technical, Dataset, Security, Performance, and Time categories."""

    def evaluate_risks(self, project_title: str) -> List[Dict[str, Any]]:
        return [
            {
                "category": "Technical",
                "risk_title": "AI Model Inference Latency Overhead",
                "severity": "High",
                "probability": "Medium",
                "impact_description": "Synchronous PyTorch image preprocessing could cause HTTP request timeouts during live clinician demo.",
                "mitigation_strategy": "Implement model caching and lightweight OpenCV CLAHE resizing before neural pass."
            },
            {
                "category": "Dataset",
                "risk_title": "Fundus Image Lighting & Resolution Variance",
                "severity": "High",
                "probability": "High",
                "impact_description": "Images taken from different camera models may cause accuracy drop in uncalibrated inputs.",
                "mitigation_strategy": "Apply CLAHE histogram equalization and standard ImageNet normalization transforms."
            },
            {
                "category": "Security",
                "risk_title": "Unvalidated Bearer Token Hijacking",
                "severity": "Critical",
                "probability": "Low",
                "impact_description": "Expired user authentication tokens remain active if expiration claim isn't validated.",
                "mitigation_strategy": "Validate JWT exp claim on every API route using FastAPI dependency injection."
            },
            {
                "category": "Performance",
                "risk_title": "GPU Memory Bottleneck During Fine-Tuning",
                "severity": "Medium",
                "probability": "Medium",
                "impact_description": "Large batch sizes during EfficientNet training could crash local GPU instances.",
                "mitigation_strategy": "Use gradient accumulation steps and batch size = 16."
            }
        ]

risk_engine = ProjectRiskEngine()
