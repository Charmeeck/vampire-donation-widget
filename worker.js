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

async function daUser(request) {
  const auth = request.headers.get("Authorization");
  if (!auth) throw new Error("Missing Authorization");

  const r = await fetch(API + "/user/oauth", {
    headers: { Authorization: auth }
  });
  const tx = await r.text();
  let data = {};
  try { data = JSON.parse(tx); } catch {}
  if (!r.ok) throw new Error(data.message || ("DonationAlerts HTTP " + r.status));

  const user = data.data || data;
  if (!user.id) throw new Error("DonationAlerts user id unavailable");
  return user;
}

export default {
  async fetch(request, env) {
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

    // Public read-only state for the main widget. The streamer ID is public,
    // while writes remain protected by DonationAlerts OAuth.
    if (url.pathname === "/public-state") {
      if (request.method !== "GET") return json({ error: "Method not allowed" }, 405, origin);
      if (!env.VAMPIRE_KV) return json({ error: "VAMPIRE_KV binding is not configured" }, 503, origin);
      const uid = (url.searchParams.get("uid") || url.pathname.split("/").filter(Boolean)[1] || "").trim();
      if (!/^[0-9]+$/.test(uid)) {
        return json({ error: "Invalid uid", received: uid || null }, 400, origin);
      }
      try {
        const value = await env.VAMPIRE_KV.get("state:" + uid, "json");
        return json(value || {}, 200, origin);
      } catch (e) {
        return json({ error: e.message || "Public state error" }, 500, origin);
      }
    }

    // Shared state between separate OBS Browser Sources.
    if (url.pathname === "/state" || url.pathname === "/api/v1/state") {
      if (!env.VAMPIRE_KV) {
        return json({ error: "VAMPIRE_KV binding is not configured" }, 503, origin);
      }

      if (request.method !== "GET" && request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405, origin);
      }

      try {
        const user = await daUser(request);
        const key = "state:" + user.id;

        if (request.method === "GET") {
          const value = await env.VAMPIRE_KV.get(key, "json");
          return json(value || {}, 200, origin);
        }

        const body = await request.json();
        const current = Number(body.current);
        const goal = Number(body.goal);

        if (!Number.isFinite(current) || current < 0 ||
            !Number.isFinite(goal) || goal <= 0) {
          return json({ error: "Invalid current/goal" }, 400, origin);
        }

        const state = {
          current,
          goal,
          updatedAt: new Date().toISOString()
        };

        await env.VAMPIRE_KV.put(key, JSON.stringify(state));
        return json(state, 200, origin);
      } catch (e) {
        return json({ error: e.message || "State error" }, 500, origin);
      }
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

    const headers = new Headers();
    const auth = request.headers.get("Authorization");
    if (auth) headers.set("Authorization", auth);

    const contentType = request.headers.get("Content-Type");
    if (contentType) headers.set("Content-Type", contentType);

    const upstream = await fetch(API + path + url.search, {
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