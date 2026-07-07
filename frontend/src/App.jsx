// Main app
import { useEffect, useState } from "react";
import MatchForm from "./components/MatchForm.jsx";
import { getOptions, getMatches } from "./api.js";

function App() {
  const [options, setOptions] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Loads dropdown values from the backend
  useEffect(() => {
    getOptions()
      .then(setOptions)
      .catch(() => setError("Could not reach the backend"));
  }, []);

  async function handleSearch(formData) {
    setLoading(true);
    setError("");
    setResults(null);
    try {
      const data = await getMatches(formData);
      setResults(data.results);
    } catch {
      setError("Something went wrong while fetching matches");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "system-ui, sans-serif", padding: "0 16px" }}>
      <h1>Job Recommendation System</h1>
      <p>Select your preferences and get your top matching jobs.</p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {!options && !error && <p>Loading form…</p>}
      {options && <MatchForm options={options} onSearch={handleSearch} loading={loading} />}

      {results && results.length === 0 && (
        <p>No jobs found. Try relaxing your filters (e.g. lower minimum salary).</p>
      )}

      {results && results.length > 0 && (
        <div>
          <h2>Top matches</h2>
          {results.map((job) => (
            <div key={job.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <strong>{job.job_role}</strong> — {job.ai_specialization} ({job.experience_level})
              <div style={{ fontSize: 22, fontWeight: "bold", color: "#2563eb" }}>
                {job.match_percent}% Match
              </div>
              <div>
                {job.country} · {job.industry} · {job.work_mode} · {job.company_size} · $
                {job.salary_usd.toLocaleString()}
              </div>
              {job.matched.length > 0 && (
                <ul style={{ color: "green", margin: "8px 0" }}>
                  {job.matched.map((m) => <li key={m}>✔ {m}</li>)}
                </ul>
              )}
              {job.gaps.length > 0 && (
                <ul style={{ color: "#b45309", margin: "8px 0" }}>
                  {job.gaps.map((g) => <li key={g}>✘ {g}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;