export function syncHealth({ online, cloudReady, pendingWrites = 0, lastSyncAt = 0 }) {
  const status = !online ? 'offline' : cloudReady ? 'ready' : 'local';
  return {
    status,
    pendingWrites,
    healthy: status !== 'offline' && pendingWrites === 0,
    lastSyncAt,
  };
}
