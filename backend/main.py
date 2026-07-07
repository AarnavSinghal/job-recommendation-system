"""
main.py

FastAPI entry for the Job Recommendation System backend.

This module will:
    - GET  /health  -> simple health check
    - POST /match   -> accepts candidate skills/experience and returns ranked job matches
"""

from fastapi import FastAPI

app = FastAPI(title="Job Recommendation System API")


@app.get("/health")
def health_check() -> dict:
    """Basic health check endpoint"""
    return {"status": "ok"}
