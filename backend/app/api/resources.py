from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import ResearchPaper, Repository, LearningResource, Dataset

router = APIRouter(prefix="/projects", tags=["Resources"])

@router.get("/{project_id}/resources")
def get_project_resources(project_id: int, db: Session = Depends(get_db)):
    papers = db.query(ResearchPaper).filter(ResearchPaper.project_id == project_id).all()
    repos = db.query(Repository).filter(Repository.project_id == project_id).all()
    videos = db.query(LearningResource).filter(LearningResource.project_id == project_id).all()
    datasets = db.query(Dataset).filter(Dataset.project_id == project_id).all()

    if not papers:
        # Seed realistic academic papers and resources
        p1 = ResearchPaper(
            project_id=project_id,
            title="Development and Validation of a Deep Learning Algorithm for Detection of Diabetic Retinopathy in Retinal Fundus Photographs",
            authors="Gulshan V, Peng L, Coram M, et al.",
            year=2021,
            abstract="Evaluates deep convolutional neural network performance in screening diabetic retinopathy from fundus photographs with high sensitivity and specificity.",
            relevance_score=96.5,
            doi="10.1001/jama.2016.17216",
            source="JAMA / OpenAlex",
            url="https://doi.org/10.1001/jama.2016.17216"
        )
        p2 = ResearchPaper(
            project_id=project_id,
            title="Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization",
            authors="Selvaraju RR, Cogswell M, Das A, et al.",
            year=2020,
            abstract="Proposes technique for producing visual explanations for decisions from CNN-based models, making them interpretable and trustworthy for clinicians.",
            relevance_score=94.0,
            doi="10.1109/ICCV.2017.74",
            source="IEEE / arXiv",
            url="https://arxiv.org/abs/1610.02391"
        )
        db.add_all([p1, p2])

    if not repos:
        r1 = Repository(
            project_id=project_id,
            name="pytorch/vision",
            description="Official PyTorch vision repository containing pre-trained EfficientNet, ResNet models and image processing pipelines.",
            language="Python",
            stars=15400,
            topics=["pytorch", "computer-vision", "deep-learning"],
            last_updated="2 days ago",
            relevance_reason="Use for model loading, transfer learning backbone, and data augmentation transforms.",
            url="https://github.com/pytorch/vision"
        )
        r2 = Repository(
            project_id=project_id,
            name="jacobgil/pytorch-grad-cam",
            description="Advanced AI Explainability library for PyTorch supporting GradCAM, GradCAM++, and ScoreCAM.",
            language="Python",
            stars=7200,
            topics=["gradcam", "explainable-ai", "pytorch"],
            last_updated="1 week ago",
            relevance_reason="Reference implementation for overlaying medical heatmap activations on fundus photos.",
            url="https://github.com/jacobgil/pytorch-grad-cam"
        )
        db.add_all([r1, r2])

    if not videos:
        v1 = LearningResource(
            project_id=project_id,
            step_number=1,
            topic="Medical Image Preprocessing & CLAHE in OpenCV",
            description="Learn how to enhance retinal vessel contrast and normalize lighting in fundus images using OpenCV CLAHE.",
            video_title="OpenCV Medical Image Enhancement Tutorial",
            video_url="https://www.youtube.com/watch?v=Kz69S2M_Y3o",
            duration="18:45",
            channel="PyImageSearch / FreeCodeCamp"
        )
        v2 = LearningResource(
            project_id=project_id,
            step_number=2,
            topic="Transfer Learning with EfficientNet in PyTorch",
            description="Step-by-step guide to fine-tuning pre-trained EfficientNet weights on custom medical classification datasets.",
            video_title="PyTorch Deep Learning for Medical Imaging",
            video_url="https://www.youtube.com/watch?v=V_xro1bcAuA",
            duration="32:10",
            channel="Aladdin Persson"
        )
        db.add_all([v1, v2])

    if not datasets:
        d1 = Dataset(
            project_id=project_id,
            name="APTOS 2019 Blindness Detection",
            source="Kaggle / Asia Pacific Tele-Ophthalmology Society",
            size="9.5 GB",
            format="JPEG images + CSV labels",
            license="CC BY-NC-SA 4.0",
            recommended_usage="Primary dataset for 5-class severity classification (0: No DR, 1: Mild, 2: Moderate, 3: Severe, 4: Proliferative DR).",
            url="https://www.kaggle.com/c/aptos2019-blindness-detection"
        )
        db.add(d1)

    db.commit()

    return {
        "papers": db.query(ResearchPaper).filter(ResearchPaper.project_id == project_id).all(),
        "repositories": db.query(Repository).filter(Repository.project_id == project_id).all(),
        "videos": db.query(LearningResource).filter(LearningResource.project_id == project_id).all(),
        "datasets": db.query(Dataset).filter(Dataset.project_id == project_id).all()
    }
