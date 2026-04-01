const http = require("http");
const httpProxy = require("http-proxy");
const url = require("url");
const fs = require("fs");
const proxy = httpProxy.createProxyServer({ changeOrigin: true });

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;

    if (!query.url) {
        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(`
            <h2>Totally Normal Website 👀</h2>
            <form method="GET">
                <input name="url" placeholder="Enter URL" style="width:300px;">
                <button>Go</button>
            </form>
        `);
    }

    let target = query.url;
    if (!target.startsWith("http")) {
        target = "http://" + target;
    }

    proxy.web(req, res, { target }, (e) => {
        res.writeHead(500);
        res.end("Error: " + e.message);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Running on port " + PORT);
});
