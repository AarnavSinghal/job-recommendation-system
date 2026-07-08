// Main app: form on top, results below.
import { useEffect, useState } from "react";
import MatchForm from "./components/MatchForm.jsx";
import { getOptions, getMatches } from "./api.js";

// Pick a color class based on the match percentage
function pctClass(pct, prefix) {
  if (pct >= 80) return `${prefix}-high`;
  if (pct >= 50) return `${prefix}-mid`;
  return `${prefix}-low`;
}

function App() {
  const [options, setOptions] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getOptions()
      .then(setOptions)
      .catch(() => setError("Could not reach the backend. Is it running?"));
  }, []);

  async function handleSearch(formData) {
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const data = await getMatches(formData);
      setResults(data.results);
    } catch {
      setError("Something went wrong fetching matches.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Job Recommendation System</h1>
        <p>Select your preferences and get your top matching AI &amp; data jobs.</p>
      </div>

      {error && <p className="state-msg error">{error}</p>}
      {!options && !error && <p className="state-msg">Loading form…</p>}

      {options && (
        <div className="form-card">
          <MatchForm options={options} onSearch={handleSearch} loading={loading} />
        </div>
      )}

      {results && results.length === 0 && (
        <p className="state-msg">
          No jobs found. Try relaxing your filters (e.g. lower minimum salary).
        </p>
      )}

      {results && results.length > 0 && (
        <div>
          <h2 className="results-title">Top {results.length} matches</h2>
          {results.map((job) => (
            <div className="job-card" key={job.id}>
              <div>
                <div className="title">{job.job_role}</div>
                <div className="subtitle">
                  {job.ai_specialization} · {job.experience_level} level
                </div>
              </div>

              <div className="match-badge">
                <div className={`pct ${pctClass(job.match_percent, "pct")}`}>
                  {job.match_percent}%
                </div>
                <div className="label">Match</div>
              </div>

              <div className="match-bar">
                <div
                  className={`fill ${pctClass(job.match_percent, "fill")}`}
                  style={{ width: `${job.match_percent}%` }}
                />
              </div>

              <div className="meta">
                <span className="tag">{job.country}</span>
                <span className="tag">{job.industry}</span>
                <span className="tag">{job.work_mode}</span>
                <span className="tag">{job.company_size}</span>
                <span className="tag">
                  Market est. ${job.salary_estimate.toLocaleString()}
                  {" "}({job.salary_vs_market >= 0 ? "+" : ""}{job.salary_vs_market}%)
                </span>
              </div>

              <div className="reasons">
                {job.matched.map((m) => (
                  <div className="matched" key={m}>✔ {m}</div>
                ))}
                {job.gaps.map((g) => (
                  <div className="gap" key={g}>✘ {g}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;