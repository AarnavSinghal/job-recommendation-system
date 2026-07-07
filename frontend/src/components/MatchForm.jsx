// Candidate input form 
// Required: role, specialization, experience.
// Optional: country, industry, work mode, min salary.
import { useState } from "react";

function MatchForm({ options, onSearch, loading }) {
  const [form, setForm] = useState({
    job_role: options.job_roles[0],
    ai_specialization: options.specializations[0],
    experience_level: options.experience_levels[0],
    country: "",
    industry: "",
    work_mode: "",
    min_salary: "",
  });

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  function handleSubmit() {
    const payload = {
      job_role: form.job_role,
      ai_specialization: form.ai_specialization,
      experience_level: form.experience_level,
    };
    if (form.country) payload.country = form.country;
    if (form.industry) payload.industry = form.industry;
    if (form.work_mode) payload.work_mode = form.work_mode;
    if (form.min_salary) payload.min_salary = Number(form.min_salary);
    onSearch(payload);
  }

  return (
    <div className="form-grid">
      <div className="field">
        <label>Job role *</label>
        <select value={form.job_role} onChange={(e) => update("job_role", e.target.value)}>
          {options.job_roles.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="field">
        <label>AI specialization *</label>
        <select value={form.ai_specialization} onChange={(e) => update("ai_specialization", e.target.value)}>
          {options.specializations.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Experience level *</label>
        <select value={form.experience_level} onChange={(e) => update("experience_level", e.target.value)}>
          {options.experience_levels.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      <div className="form-divider">Optional filters</div>

      <div className="field">
        <label>Country <span className="optional">(optional)</span></label>
        <select value={form.country} onChange={(e) => update("country", e.target.value)}>
          <option value="">Any</option>
          {options.countries.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Industry <span className="optional">(optional)</span></label>
        <select value={form.industry} onChange={(e) => update("industry", e.target.value)}>
          <option value="">Any</option>
          {options.industries.map((i) => <option key={i}>{i}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Work mode <span className="optional">(optional)</span></label>
        <select value={form.work_mode} onChange={(e) => update("work_mode", e.target.value)}>
          <option value="">Any</option>
          {options.work_modes.map((w) => <option key={w}>{w}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Minimum salary (USD) <span className="optional">(optional)</span></label>
        <input
          type="number"
          placeholder="e.g. 50000"
          value={form.min_salary}
          onChange={(e) => update("min_salary", e.target.value)}
        />
      </div>

      <div className="submit-row">
        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Searching…" : "Find matching jobs"}
        </button>
      </div>
    </div>
  );
}

export default MatchForm;