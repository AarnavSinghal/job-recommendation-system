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

  const selectStyle = { display: "block", width: "100%", padding: 8, marginBottom: 12 };

  return (
    <div>
      <label>Job role *</label>
      <select style={selectStyle} value={form.job_role} onChange={(e) => update("job_role", e.target.value)}>
        {options.job_roles.map((r) => <option key={r}>{r}</option>)}
      </select>

      <label>AI specialization *</label>
      <select style={selectStyle} value={form.ai_specialization} onChange={(e) => update("ai_specialization", e.target.value)}>
        {options.specializations.map((s) => <option key={s}>{s}</option>)}
      </select>

      <label>Experience level *</label>
      <select style={selectStyle} value={form.experience_level} onChange={(e) => update("experience_level", e.target.value)}>
        {options.experience_levels.map((l) => <option key={l}>{l}</option>)}
      </select>

      <label>Country (optional)</label>
      <select style={selectStyle} value={form.country} onChange={(e) => update("country", e.target.value)}>
        <option value="">Any</option>
        {options.countries.map((c) => <option key={c}>{c}</option>)}
      </select>

      <label>Industry</label>
      <select style={selectStyle} value={form.industry} onChange={(e) => update("industry", e.target.value)}>
        <option value="">Any</option>
        {options.industries.map((i) => <option key={i}>{i}</option>)}
      </select>

      <label>Work mode</label>
      <select style={selectStyle} value={form.work_mode} onChange={(e) => update("work_mode", e.target.value)}>
        <option value="">Any</option>
        {options.work_modes.map((w) => <option key={w}>{w}</option>)}
      </select>

      <label>Salary (USD)</label>
      <input
        style={selectStyle}
        type="number"
        placeholder="e.g. 50000"
        value={form.min_salary}
        onChange={(e) => update("min_salary", e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading} style={{ padding: "10px 24px", fontSize: 16 }}>
        {loading ? "Searching…" : "Find matching jobs"}
      </button>
    </div>
  );
}

export default MatchForm;