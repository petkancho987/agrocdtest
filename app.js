const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>nov-test</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          text-align: center;
          background: white;
          padding: 50px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        h1 {
          color: #333;
          font-size: 3em;
          margin: 0;
        }
        .info {
          color: #666;
          font-size: 1.2em;
          margin-top: 20px;
        }
        .pod-info {
          background: #f0f0f0;
          padding: 10px;
          margin-top: 15px;
          border-radius: 5px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Hello Test</h1>
        <div class="info">ArgoCD Deployment Test</div>
        <div class="pod-info">
          <strong>Pod:</strong> ${process.env.HOSTNAME || 'unknown'}<br>
          <strong>Node:</strong> ${process.env.NODE_NAME || 'unknown'}<br>
          <strong>Timestamp:</strong> ${new Date().toLocaleString()}
        </div>
      </div>
    </body>
    </html>
  `);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
