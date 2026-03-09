const http = require('http');
const { fork } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head>
        <title>GOJO BOT - THE HONORED ONE</title>
        <style>
          body { background-color: #000000; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; overflow: hidden; }
          .container { border: 2px solid #3d5afe; padding: 40px; border-radius: 20px; background-color: #050505; box-shadow: 0 0 30px #3d5afe, inset 0 0 15px #3d5afe; text-align: center; position: relative; }
          .container::before { content: ''; position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border-radius: 25px; border: 1px solid #3d5afe; opacity: 0.3; pointer-events: none; }
          h1 { font-size: 3.5rem; margin: 0; text-transform: uppercase; letter-spacing: 8px; color: #3d5afe; text-shadow: 0 0 10px #3d5afe; }
          p { font-size: 1.5rem; margin: 15px 0; letter-spacing: 2px; }
          .status { color: #00e5ff; font-weight: bold; text-shadow: 0 0 5px #00e5ff; }
          .quote { font-style: italic; color: #888; font-size: 1rem; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>♾️ GOJO BOT</h1>
          <p>Domain Expansion: <span class="status">INFINITE VOID</span></p>
          <p>Sovereign: OAD-26</p>
          <p>Frequency: ${PORT}</p>
          <div class="quote">"Throughout Heaven and Earth, I alone am the honored one."</div>
        </div>
      </body>
    </html>
  `);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('✅ Keep-alive server listening on port ' + PORT);
  const startBot = () => {
    const bot = fork(path.join(__dirname, 'bot.js'));
    bot.on('exit', (code) => {
      console.log(`🌋 Bot exited (${code}). Restarting in 5s...`);
      setTimeout(startBot, 5000);
    });
  };
  startBot();
});

process.on('uncaughtException', (err) => {
  if (err.code === 'EADDRINUSE') return;
  console.error('Uncaught Exception:', err);
});
