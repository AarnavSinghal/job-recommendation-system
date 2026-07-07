"""
matcher.py

Core matching logic for the Job Recommendation System.

Will implement a skill-overlap based scoring function:

    match_score = |user_skills intersect job_skills| / |job_skills|

along with helpers to compute matched skills and missing skills for
each candidate-job pair.
"""
