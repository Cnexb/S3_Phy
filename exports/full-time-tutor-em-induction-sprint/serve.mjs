// Local preview server for the interview brief.
//   node serve.mjs   ->   http://localhost:8792
// Serving over http (rather than opening index.html directly) keeps the
// demo iframe and the EN / Traditional Chinese sync working.
import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const types = {
  ".html": "text/html; charset=utf-8",
  ".pdf": "application/pdf",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".md": "text/plain; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".yaml": "text/plain; charset=utf-8"
};

const root = import.meta.dirname;
const port = 8792;

function sendFile(req, res, filePath, info) {
  const type = types[path.extname(filePath)] || "application/octet-stream";
  const size = info.size;
  const range = req.headers.range;

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` }).end();
      return;
    }
    const start = match[1] === "" ? 0 : Number(match[1]);
    const end = match[2] === "" ? size - 1 : Number(match[2]);
    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` }).end();
      return;
    }
    const clippedEnd = Math.min(end, size - 1);
    res.writeHead(206, {
      "Content-Type": type,
      "Content-Length": clippedEnd - start + 1,
      "Content-Range": `bytes ${start}-${clippedEnd}/${size}`,
      "Accept-Ranges": "bytes"
    });
    createReadStream(filePath, { start, end: clippedEnd }).pipe(res);
    return;
  }

  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": size,
    "Accept-Ranges": "bytes"
  });
  createReadStream(filePath).pipe(res);
}

http
  .createServer(async (req, res) => {
    let url = decodeURIComponent(req.url.split("?")[0]);
    if (url.endsWith("/")) url += "index.html";
    const filePath = path.normalize(path.join(root, url));
    if (!filePath.startsWith(root)) {
      res.writeHead(403).end("403");
      return;
    }
    try {
      const info = await stat(filePath);
      if (!info.isFile()) throw new Error("not a file");
      sendFile(req, res, filePath, info);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("404 " + url);
    }
  })
  .listen(port, () => console.log("Interview brief: http://localhost:" + port));
