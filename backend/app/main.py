from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import engine, Base
from app.api import (
    auth, profile, ideas, feasibility, blueprint,
    resources, roadmap, mentor, code_review,
    health, improvements, docs, settings as settings_api,
    reality_check
)

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="Backend services for AI Final-Year Project Mentor Platform"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(ideas.router, prefix=settings.API_V1_STR)
app.include_router(feasibility.router, prefix=settings.API_V1_STR)
app.include_router(blueprint.router, prefix=settings.API_V1_STR)
app.include_router(resources.router, prefix=settings.API_V1_STR)
app.include_router(roadmap.router, prefix=settings.API_V1_STR)
app.include_router(mentor.router, prefix=settings.API_V1_STR)
app.include_router(code_review.router, prefix=settings.API_V1_STR)
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(improvements.router, prefix=settings.API_V1_STR)
app.include_router(reality_check.router, prefix=settings.API_V1_STR)
app.include_router(docs.router, prefix=settings.API_V1_STR)
app.include_router(settings_api.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "AI Final-Year Project Mentor Backend Service",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
