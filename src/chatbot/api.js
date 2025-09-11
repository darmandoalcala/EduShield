// src/chatbot/api.js
const BASE_URL = "https://literate-cod-4jj5vrppq4x43w97-8000.app.github.dev"; // tu URL del backend

export async function classifyByBackend(text) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json(); // { category, reply }
}
