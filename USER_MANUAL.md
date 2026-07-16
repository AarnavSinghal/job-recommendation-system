# User Manual

## What the application does

The Job Recommendation System recommends AI/data jobs based on your
preferences. It scores ~90,000 job records against your inputs and
returns the top 10 matches, each with a match percentage, an
explanation of what matched and what didn't, and an ML-estimated
market salary for comparison.

## Using the application

1. Open http://localhost:3000.

2. Fill in the three required fields:
   - **Job role** — the position you are looking for
   - **AI specialization** — your area of focus
   - **Experience level** — Entry, Mid, Senior or Lead

3. Optionally narrow results with the filters below the divider:
   - **Country**, **Industry**, **Work mode** — restrict to a value
   - **Minimum salary (USD)** — hide jobs paying less

4. Click **Find matching jobs**.
   (The very first search after startup takes up to 30 seconds while
   the salary model trains — later searches are instant.)

## Reading the results

Each job card shows:
- **Match percentage** with a colored bar — green (80%+), amber
  (50–79%), red (below 50%)
- **Job details** — country, industry, work mode, company size, salary
- **Market est.** — the ML model's estimated market salary for a job
  with these attributes, and how this job's salary compares (e.g. −10%
  means it pays 10% below the estimate)
- **✔ lines** — criteria that matched your preferences
- **✘ lines** — gaps, e.g. an experience-level difference

## Notes on the results

- Jobs requiring experience more than one level above yours are never
  shown, since you could not realistically apply to them. Jobs one
  level above are shown as "stretch" options with partial credit.
- If no jobs are found, relax the filters — usually the minimum salary.
<img width="2938" height="1594" alt="Screenshot 2026-07-16 at 17 42 57" src="https://github.com/user-attachments/assets/8c14e00c-1c8d-4b9a-a70a-8b4560c9c45e" />


## Example searches

- **Perfect matches:** Data Scientist · LLM · Entry · country: India
<img width="2939" height="1602" alt="Screenshot 2026-07-16 at 17 40 32 2" src="https://github.com/user-attachments/assets/4f6bb3da-e8f9-4dfc-a6de-73ae857f997d" />

- **Partial matches with gaps:** the same, plus minimum salary 50000
<img width="2939" height="1602" alt="Screenshot 2026-07-16 at 17 55 29" src="https://github.com/user-attachments/assets/6e5a23d5-4717-44a2-b588-57219c921767" />
