//const BASE_URL = "https://filthy-superstition-v669r5jjp7g7fxvqw-8000.app.github.dev";
const BASE_URL = "http://edushield.duckdns.org:8000";


export async function classifyByBackend(text, userId = "123") {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      text: text
    }),
  });

  if (!res.ok) {
    const errorDetail = await res.json();
    console.error("Backend error:", errorDetail);
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  console.log("Respuesta del backend:", data);
  return data; // { text, action }
}