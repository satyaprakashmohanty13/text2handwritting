// api/function.js
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const backendBase = process.env.BACKEND_URL;

  if (!backendBase) {
    return new Response("BACKEND_URL not set in environment", { status: 500 });
  }

  const backendPath = url.pathname.replace(/^\/api/, '');
  const backendUrl = backendBase + backendPath + url.search;

  const backendRes = await fetch(backendUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' ? req.body : undefined,
    redirect: 'follow',
  });

  const headers = new Headers(backendRes.headers);
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(await backendRes.body, {
    status: backendRes.status,
    headers,
  });
}
