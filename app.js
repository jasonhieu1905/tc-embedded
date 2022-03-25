const express = require("express");
const path = require("path");
const server = express();
const port = 3000;

const contenSecurityPolicyHeaders = [
  "default-src 'none'",
  "frame-ancestors 'none'",
  "frame-src https://local.officeatwork365.com:9000",
  "form-action 'none'",
  "base-uri 'none'",
  "img-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/",
  "style-src 'self' 'unsafe-inline' https://static2.sharepointonline.com/",
  "connect-src 'self'",
];

server.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader(
    "Content-Security-Policy",
    contenSecurityPolicyHeaders.join("; ")
  );
  res.setHeader("X-Xss-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

server.use(express.static('public'));

server.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
