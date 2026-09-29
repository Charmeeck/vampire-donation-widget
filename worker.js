const API = "https://www.donationalerts.com/api/v1";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(data, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
}

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "*";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(origin),
          "Access-Control-Allow-Headers":
            request.headers.get("Access-Control-Request-Headers") ||
            "Authorization, Content-Type"
        }
      });
    }

    const allowed = new Set([
      "/user/oauth",
      "/alerts/donations",
      "/centrifuge/subscribe"
    ]);

    let path = url.pathname;

    if (!allowed.has(path) && path.startsWith("/api/v1/")) {
      path = path.slice("/api/v1".length) || "/";
    }

    if (!allowed.has(path)) {
      return json({ error: "Not found", path: url.pathname }, 404, origin);
    }

    const target = API + path + url.search;

    const headers = new Headers();
    const auth = request.headers.get("Authorization");
    if (auth) headers.set("Authorization", auth);

    const contentType = request.headers.get("Content-Type");
    if (contentType) headers.set("Content-Type", contentType);

    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer()
    });

    const out = new Headers(upstream.headers);
    out.set("Access-Control-Allow-Origin", origin);
    out.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    out.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
    out.set("Access-Control-Max-Age", "86400");
    out.set("Vary", "Origin");

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: out
    });
  }
};
