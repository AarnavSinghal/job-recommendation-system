"""
matcher.py

Core matching logic for the Job Recommendation System.

Scoring model (weighted categorical similarity):
    score = 0.5 * role_match          (1.0 if exact, else 0.0)
          + 0.3 * specialization_match (1.0 if exact, else 0.0)
          + 0.2 * experience_closeness (1.0 exact, 0.5 one level apart,
                                        0.0 two or more levels apart)

experience_level is treated as Entry < Mid < Senior < Lead.
Optional filters (country, industry, minimum salary, work mode) are
applied after scoring, so a missing/unspecified filter never affects
the match percentage itself.
"""

import pandas as pd

EXPERIENCE_ORDER = {"Entry": 0, "Mid": 1, "Senior": 2, "Lead": 3}

WEIGHT_ROLE = 0.5
WEIGHT_SPECIALIZATION = 0.3
WEIGHT_EXPERIENCE = 0.2


def experience_closeness(candidate_level: str, job_level: str) -> float:
    """Scores how close two experience levels are on the scale.

    Args:
        candidate_level: The candidate's selected level (e.g. "Entry").
        job_level: The job's required level (e.g. "Senior").

    Returns:
        float: 1.0 for an exact match, 0.5 for adjacent levels
        (e.g. Entry vs Mid), 0.0 for a gap of two or more levels.
    """
    gap = abs(EXPERIENCE_ORDER[candidate_level] - EXPERIENCE_ORDER[job_level])
    if gap == 0:
        return 1.0
    if gap == 1:
        return 0.5
    return 0.0


def score_job(candidate: dict, job: pd.Series) -> dict:
    """Scores a single job against the candidate's preferences.

    Args:
        candidate: Dict with keys "job_role", "ai_specialization",
            "experience_level".
        job: A single row of the jobs DataFrame.

    Returns:
        dict: The job's display fields plus "match_percent",
        "matched" and "gaps"
    """
    matched = []
    gaps = []

    role_score = 1.0 if candidate["job_role"] == job["job_role"] else 0.0
    if role_score:
        matched.append(f"Role: {job['job_role']}")
    else:
        gaps.append(
            f"Role differs: this is a {job['job_role']} position, "
            f"you selected {candidate['job_role']}"
        )

    spec_score = (
        1.0 if candidate["ai_specialization"] == job["ai_specialization"] else 0.0
    )
    if spec_score:
        matched.append(f"Specialization: {job['ai_specialization']}")
    else:
        gaps.append(
            f"Specialization differs: role focuses on "
            f"{job['ai_specialization']}, you selected "
            f"{candidate['ai_specialization']}"
        )

    exp_score = experience_closeness(
        candidate["experience_level"], job["experience_level"]
    )
    if exp_score == 1.0:
        matched.append(f"Experience level: {job['experience_level']}")
    else:
        level_gap = abs(
            EXPERIENCE_ORDER[candidate["experience_level"]]
            - EXPERIENCE_ORDER[job["experience_level"]]
        )
        gaps.append(
            f"Experience: role is {job['experience_level']}, you selected "
            f"{candidate['experience_level']} ({level_gap}-level gap)"
        )

    total = (
        WEIGHT_ROLE * role_score
        + WEIGHT_SPECIALIZATION * spec_score
        + WEIGHT_EXPERIENCE * exp_score
    )

    return {
        "id": int(job["id"]),
        "job_role": job["job_role"],
        "ai_specialization": job["ai_specialization"],
        "experience_level": job["experience_level"],
        "country": job["country"],
        "industry": job["industry"],
        "work_mode": job["work_mode"],
        "company_size": job["company_size"],
        "salary_usd": int(job["salary_usd"]),
        "match_percent": round(total * 100),
        "matched": matched,
        "gaps": gaps,
    }


def apply_filters(df: pd.DataFrame, filters: dict) -> pd.DataFrame:
    """Apply the candidate's optional filters to the jobs DataFrame.

    Filters are applied only when the candidate provided a value.

    Args:
        df: The full jobs DataFrame.
        filters: Dict possibly containing "country", "industry",
            "work_mode" and "min_salary".

    Returns:
        pd.DataFrame: The filtered DataFrame.
    """
    if filters.get("country"):
        df = df[df["country"] == filters["country"]]
    if filters.get("industry"):
        df = df[df["industry"] == filters["industry"]]
    if filters.get("work_mode"):
        df = df[df["work_mode"] == filters["work_mode"]]
    if filters.get("min_salary"):
        df = df[df["salary_usd"] >= float(filters["min_salary"])]
    return df


def match_jobs(candidate: dict, jobs: pd.DataFrame, top_n: int = 10) -> list[dict]:
    """Return the top-N jobs for a candidate, ranked by match percentage.

    Args:
        candidate: Dict with required keys "job_role",
            "ai_specialization", "experience_level", and optional filter
            keys "country", "industry", "work_mode", "min_salary".
        jobs: The jobs DataFrame from data_loader.load_jobs().
        top_n: Number of results to return (default 10).

    Returns:
        list[dict]: Scored job dicts, best match first.
    """
    filtered = apply_filters(jobs, candidate)

    if filtered.empty:
        return []

    scored = [score_job(candidate, row) for _, row in filtered.iterrows()]

    scored.sort(key=lambda j: (-j["match_percent"], -j["salary_usd"]))
    return scored[:top_n]