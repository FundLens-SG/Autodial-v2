const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const htmlVersion = (html.match(/window\.APP_VERSION\s*=\s*'([^']+)'/) || [])[1];
const swVersion = (sw.match(/APP_VERSION\s*=\s*'([^']+)'/) || [])[1];
if (!htmlVersion || !swVersion || htmlVersion !== swVersion) {
  fail(`APP_VERSION mismatch: index=${htmlVersion || 'missing'} sw=${swVersion || 'missing'}`);
}

if (!/autodial-v2-\$\{APP_VERSION\}/.test(sw)) {
  fail('Service-worker cache name must be v2-isolated.');
}

const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(match => !/\bsrc\s*=/.test(match[1]))
  .map(match => match[2].trim())
  .filter(Boolean);

scripts.forEach((script, index) => {
  try {
    new Function(script);
  } catch (error) {
    fail(`Inline script ${index + 1} failed to parse: ${error.message}`);
  }
});

if (process.exitCode) process.exit(process.exitCode);
console.log(`validated ${scripts.length} inline scripts at ${htmlVersion}`);
