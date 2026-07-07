# Job Recommendation System

A web application that recommends AI/data jobs based on a candidate's
preferences. The user selects their desired job role, AI specialization and
experience level  plus optional filters like country, industry, work mode
and minimum salary and gets back their top 10 matching jobs, each with a
match percentage, what matched, and where the gaps are.

## Why I chose this project

As a fresh graduate applying for data science roles, job searching is a
problem I dealt with every day. Most job boards only filter results — they
don't explain why a job fits you or where you fall short. This project
scores every job against the candidate and shows the reasoning behind each
match (matched criteria and gaps), which makes the results more useful
than a plain filtered list.

What is special about it:

- **Explainable matching** — every result shows exactly why it was
  recommended (✔ matched criteria) and why it isn't a perfect fit
  (✘ gaps), instead of a black-box score.
- **Realistic eligibility** — jobs requiring experience more than one
  level above the candidate are excluded entirely, because the candidate
  cannot realistically apply to them. Applying one level up is allowed and scored with partial credit.
- **Honest scoring** — optional filters do not distort the match
  percentage, they only narrow which jobs are considered.

## How matching works

Each eligible job is scored with a weighted formula:

| Component | Weight | Scoring |
|---|---|---|
| Job role | 50% | Exact match = 1, else 0 |
| AI specialization | 30% | Exact match = 1, else 0 |
| Experience level | 20% | Exact = 1, one level apart = 0.5, further = 0 |

Experience level is ordinal (Entry < Mid < Senior < Lead), so a candidate
one level away from a role still gets partial credit. Jobs more than one
level **above** the candidate are filtered out before scoring (eligibility
rule). Optional filters (country, industry, work mode, minimum salary) are
applied before scoring. Results are ranked by match percentage, with
salary as the tie-breaker.

## Dataset

**Global AI & Data Jobs Salary Dataset** (Kaggle), ~90,000 job records:
https://www.kaggle.com/datasets/mohankrishnathalla/global-ai-and-data-jobs-salary-dataset

The dataset is included in this repository
(`backend/data/global_ai_jobs.csv`) so the project runs with no extra
download steps.

**Data preparation steps** (see `backend/data_loader.py`):
1. Load only the 11 columns used by the app (the full dataset has 35).
2. Drop rows missing any core matching field (job role, specialization,
   experience level).
3. Strip whitespace from categorical text fields.
4. Cache the cleaned DataFrame in memory so the CSV is read only once.

The frontend's dropdown options are generated dynamically from the
dataset's unique values, so the form can never drift out of sync with the
data.

**Note on the database:** the dataset is a static, read-only data source
loaded by the backend. Per the project specification, a separate database
container is optional; it was not needed here since no data is written or
updated at runtime.

## Tech stack

- **Backend:** Python, FastAPI, pandas, Pydantic
- **Frontend:** React (Vite), plain fetch API, hand-written CSS
  (no UI frameworks or third-party templates)
- **Deployment:** Docker Compose — separate frontend and backend
  containers connected through a custom Docker network (`matcher-net`)

## How to run

Requirements: Docker Desktop (or Docker Engine with the compose plugin).

```bash
git clone https://github.com/AarnavSinghal/job-recommendation-system.git
cd job-recommendation-system
docker compose up --build
```

Then open:

- **App:** http://localhost:3000
- **API docs (Swagger):** http://localhost:8000/docs

To stop: `Ctrl+C`, then `docker compose down`.

(The compose stack includes a small `info` container that prints these
URLs after startup and exits — the application itself is the frontend and
backend containers.)

## Project structure

├── docker-compose.yml        # services + custom Docker network
├── backend/
│   ├── main.py               # FastAPI endpoints (/options, /match, /health)
│   ├── matcher.py            # eligibility, scoring and ranking logic
│   ├── data_loader.py        # dataset loading and cleaning
│   ├── requirements.txt
│   ├── Dockerfile
│   └── data/global_ai_jobs.csv
└── frontend/
├── Dockerfile             # multi-stage: Vite build → nginx
└── src/
├── App.jsx            # results display
├── components/MatchForm.jsx  # candidate input form
├── api.js             # backend API calls
└── index.css          # custom styling