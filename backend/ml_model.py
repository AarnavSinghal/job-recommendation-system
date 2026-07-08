"""Trains a salary prediction model from the jobs dataset."""

from functools import lru_cache

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

from data_loader import load_jobs

FEATURES = ["job_role", "ai_specialization", "experience_level",
            "country", "industry", "company_size", "work_mode"]


@lru_cache(maxsize=1)
def get_model():
    """Train the model once (on first use) and cache it with its metrics."""
    df = load_jobs()
    X = pd.get_dummies(df[FEATURES])
    y = df["salary_usd"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=50, max_depth=12, random_state=42, n_jobs=-1
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    metrics = {
        "mae": round(mean_absolute_error(y_test, preds), 2),
        "r2": round(r2_score(y_test, preds), 3),
    }
    return model, list(X.columns), metrics


def estimate_salary(job: dict) -> int:
    """Predict market salary for one job's attributes."""
    model, columns, _ = get_model()
    row = pd.get_dummies(pd.DataFrame([{f: job[f] for f in FEATURES}]))
    row = row.reindex(columns=columns, fill_value=0)
    return int(model.predict(row)[0])