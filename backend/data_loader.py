"""
data_loader.py

Loads and lightly cleans the job postings dataset used by the matcher.

Dataset source:
    Global AI & Data Jobs Salary Dataset (Kaggle)
    https://www.kaggle.com/datasets/mohankrishnathalla/global-ai-and-data-jobs-salary-dataset

The dataset contains ~90,000 AI/data job records with clean categorical
fields (job_role, ai_specialization, experience_level, country, industry,
work_mode) and numeric salary data (salary_usd).
"""

from functools import lru_cache
from pathlib import Path

import pandas as pd

# Path to the dataset
DATA_PATH = Path(__file__).parent / "data" / "global_ai_jobs.csv"

USED_COLUMNS = [
    "id",
    "country",
    "job_role",
    "ai_specialization",
    "experience_level",
    "experience_years",
    "salary_usd",
    "industry",
    "company_size",
    "work_mode",
    "year",
]


@lru_cache(maxsize=1)
def load_jobs() -> pd.DataFrame:
    """Load the jobs dataset into a DataFrame (cached after first call).

    Returns:
        pd.DataFrame: Cleaned jobs data with only the columns used by
        the matcher. Rows with missing values in any core matching
        column are dropped.

    Raises:
        FileNotFoundError: If the dataset CSV is not present at DATA_PATH.
    """
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Dataset not found at {DATA_PATH}. "
            "Download it from Kaggle (see module docstring) and place it "
            "in backend/data/."
        )

    df = pd.read_csv(DATA_PATH, usecols=USED_COLUMNS)

    # Drop rows with missing values in any of the core matching fields
    core_fields = ["job_role", "ai_specialization", "experience_level"]
    df = df.dropna(subset=core_fields)

    text_fields = [
        "country", "job_role", "ai_specialization",
        "experience_level", "industry", "work_mode",
    ]
    for col in text_fields:
        df[col] = df[col].astype(str).str.strip()

    return df


def get_form_options() -> dict:
    """Return the unique values of each user-facing field.

    Used by the frontend to make its dropdowns lists so the user can select only valid options.

    Returns:
        dict: Mapping of field name to sorted list of unique values.
    """
    df = load_jobs()
    return {
        "job_roles": sorted(df["job_role"].unique().tolist()),
        "specializations": sorted(df["ai_specialization"].unique().tolist()),
        "experience_levels": ["Entry", "Mid", "Senior", "Lead"],  # ordinal order
        "countries": sorted(df["country"].unique().tolist()),
        "industries": sorted(df["industry"].unique().tolist()),
        "work_modes": sorted(df["work_mode"].unique().tolist()),
    }