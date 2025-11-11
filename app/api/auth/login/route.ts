
export async function POST(req: Request) {
  const body = await req.json();

  const apiRes = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await apiRes.text(); 
  return new Response(data, {
    status: apiRes.status,
    headers: {
      "Content-Type": apiRes.headers.get("content-type") || "application/json",
    },
  });
}
