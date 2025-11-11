// app/api/auth/login/route.ts
export async function POST(req: Request) {
  const body = await req.json();

  // teruskan ke backend asli di :8080
  const apiRes = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await apiRes.text(); // bisa json atau text
  return new Response(data, {
    status: apiRes.status,
    headers: {
      "Content-Type": apiRes.headers.get("content-type") || "application/json",
    },
  });
}
