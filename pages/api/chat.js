export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const backendRes = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  });

  const data = await backendRes.json();
  res.status(200).json(data);
}
