"""FastAPI backend for the Job Recommendation System."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data_loader import load_jobs, get_form_options
from matcher import match_jobs

app = FastAPI(title="Job Recommendation System API")

# Allows the frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class CandidateRequest(BaseModel):
    """Input from the form"""
    job_role: str
    ai_specialization: str
    experience_level: str
    country: str | None = None
    industry: str | None = None
    work_mode: str | None = None
    min_salary: float | None = None


@app.get("/health")
def health_check():
    """Health check"""
    return {"status": "ok"}


@app.get("/options")
def options():
    """Dropdown values for the frontend form"""
    return get_form_options()


@app.post("/match")
def match(candidate: CandidateRequest):
    """Return top 10 matching jobs for the candidate"""
    jobs = load_jobs()
    results = match_jobs(candidate.model_dump(), jobs, top_n=10)
    return {"count": len(results), "results": results}