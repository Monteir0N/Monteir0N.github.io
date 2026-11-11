const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8000;
const BASE = __dirname;
const CATALOG_URL = "https://www.geil.to/live/catalog/live/channels.json?&&filter%5Bgroup%5D=Portugal";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

async function proxy(url, res) {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow"
    });
    const body = Buffer.from(await response.arrayBuffer());
    res.writeHead(response.status, {
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store"
    });
    res.end(body);
  } catch (error) {
    res.writeHead(502, {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    });
    res.end(JSON.stringify({ error: error.message }));
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  if (req.method === "GET" && url.pathname === "/api/catalog") {
    return proxy(CATALOG_URL, res);
  }

  if (req.method === "GET" && url.pathname === "/api/resolve") {
    const id = url.searchParams.get("id");
    if (!id || !/^\d+$/.test(id)) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ error: "Invalid channel ID" }));
    }
    const playUrl = `https://geil.to/live/play/${id}`;
    const resolverUrl = "https://www.geil.to/live/resolve?url=" + encodeURIComponent(playUrl);
    return proxy(resolverUrl, res);
  }

  if (req.method !== "GET") {
    res.writeHead(405);
    return res.end("Method not allowed");
  }

  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.resolve(BASE, "." + requestedPath);
  if (filePath !== path.join(BASE, "index.html") && !filePath.startsWith(BASE + path.sep)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("File not found");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Dual Player disponível em http://localhost:${PORT}`);
  console.log("Mantém esta janela do PowerShell aberta enquanto utilizas a página.");
});
