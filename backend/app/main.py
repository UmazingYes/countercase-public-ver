from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health
from app.api.routes import submissions
from app.api.routes import puzzles
from app.core.config import settings

app = FastAPI(title="Countercase API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")
app.include_router(puzzles.router, prefix="/api")
