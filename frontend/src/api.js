// Calls the FastAPI backend;
// falls back to localhost for local dev.
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getOptions() {
  const res = await fetch(`${API_URL}/options`);
  if (!res.ok) throw new Error("Failed to load form options");
  return res.json();
}

export async function getMatches(payload) {
  const res = await fetch(`${API_URL}/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Match request failed");
  return res.json();
}