const packageInfo = require('../package.json');
const { loadCommands } = require('./commandLoader');

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 MB';
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getCanonicalCommandCount() {
  const commands = loadCommands();
  return new Set([...commands.values()].map(command => command.name)).size;
}

function getHealthSnapshot(sock) {
  const websocketState = sock?.ws?.isOpen;
  const socketOpen = websocketState === true ||
    (typeof websocketState === 'function' && websocketState());
  const authenticated = Boolean(sock?.user?.id);
  const commandCount = getCanonicalCommandCount();
  const memory = process.memoryUsage();

  let connection = 'awaiting_qr';
  if (socketOpen) connection = 'connected';
  else if (authenticated) connection = 'authenticated';

  return {
    healthy: socketOpen && commandCount > 0,
    connection,
    authenticated,
    commandCount,
    version: packageInfo.version,
    node: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      rss: formatBytes(memory.rss),
      heapUsed: formatBytes(memory.heapUsed),
      heapTotal: formatBytes(memory.heapTotal)
    }
  };
}

module.exports = { getHealthSnapshot };