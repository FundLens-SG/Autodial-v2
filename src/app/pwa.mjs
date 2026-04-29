export function cacheName(version) {
  if (!version) throw new Error('APP_VERSION is required');
  return `autodial-v2-${version}`;
}

export function versionsMatch(indexVersion, swVersion) {
  return Boolean(indexVersion && swVersion && indexVersion === swVersion);
}
