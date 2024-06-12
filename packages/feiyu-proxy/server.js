import http from "http";
import { parse } from "url";
import apiProxy from "./api/proxy.js";

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url);
  if (pathname.startsWith("/api/proxy")) {
    apiProxy(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello World!" }));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
