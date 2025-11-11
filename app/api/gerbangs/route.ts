export async function GET() {
  const apiRes = await fetch("http://localhost:8080/api/gerbangs");

  const data = await apiRes.text(); // bisa json atau text
  return new Response(data, {
    status: apiRes.status,
    headers: {
      "Content-Type": apiRes.headers.get("content-type") || "application/json",
    },
  });
}