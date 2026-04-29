import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { normalizeStatus, leadFromRow, reviewImportedLeads } from '../src/app/lead-import.mjs';
import { transitionLeadStatus, nextDialableIndex } from '../src/app/status.mjs';
import { scheduleCallback, dueCallbacks } from '../src/app/callbacks.mjs';
import { calculateSessionPay, metAppointmentBar } from '../src/app/pay.mjs';
import { cacheName, versionsMatch } from '../src/app/pwa.mjs';
import { stripUnsafeHtml } from '../src/app/rich-text.mjs';
import { syncHealth } from '../src/app/sync.mjs';

test('lead import normalizes rows and flags questionable records', () => {
  const lead = leadFromRow(['Ada', '+65 8123 4567', 'Call back', 'CB'], {
    name: 0,
    phone: 1,
    remarks: 2,
    status: 3,
  });
  assert.equal(lead.name, 'Ada');
  assert.equal(lead.phone, '+6581234567');
  assert.equal(lead.status, 'cb');
  assert.equal(normalizeStatus('not interested'), 'ni');
  const review = reviewImportedLeads([lead, { ...lead }]);
  assert.equal(review[1].duplicate, true);
});

test('status transitions handle NP auto-NI and queue lookup', () => {
  const lead = transitionLeadStatus({ status: 'pending', npCount: 4 }, 'np', {
    npMax: 5,
    now: '2026-04-29T00:00:00.000Z',
  });
  assert.equal(lead.status, 'ni');
  assert.equal(lead.npCount, 5);
  assert.equal(nextDialableIndex([{ status: 'ni' }, { status: 'pending' }]), 1);
});

test('callback scheduling and due sorting work', () => {
  const cb = scheduleCallback({ name: 'Ada', phone: '8123' }, '2026-04-29', '18:30', 'Warm');
  assert.equal(cb.status, 'pending');
  const due = dueCallbacks([
    cb,
    { ...cb, id: 'later', scheduled_date: '2026-04-30' },
  ], '2026-04-29');
  assert.equal(due.length, 1);
  assert.equal(due[0].lead_name, 'Ada');
});

test('pay calculation respects full sessions and bonus multiplier', () => {
  assert.equal(calculateSessionPay({ fullSession: true, hourlyRate: 10, bonus: true }, {
    sessionDur: 5,
    bonusMult: 1.5,
  }), 75);
  assert.equal(metAppointmentBar(3, { mThresh: 2 }), true);
});

test('PWA version helpers preserve v2 cache isolation', () => {
  assert.equal(cacheName('2026.04.29.0014'), 'autodial-v2-2026.04.29.0014');
  assert.equal(versionsMatch('a', 'a'), true);
  assert.equal(versionsMatch('a', 'b'), false);
});

test('rich text sanitizer strips scripts and handlers', () => {
  const html = stripUnsafeHtml('<div onclick="x()">Ok<script>alert(1)</script><img src=x></div>');
  assert.equal(html.includes('script'), false);
  assert.equal(html.includes('onclick'), false);
  assert.equal(html.includes('<img'), false);
});

test('sync health reports offline and pending write states', () => {
  assert.deepEqual(syncHealth({ online: false, cloudReady: true, pendingWrites: 2 }).status, 'offline');
  assert.equal(syncHealth({ online: true, cloudReady: true, pendingWrites: 0 }).healthy, true);
});

test('production shell avoids native blocking dialogs', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal(/\b(confirm|prompt)\(/.test(html), false);
});

test('README is stored as clean UTF-8 text', () => {
  const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  assert.equal(/â†|â€|ðŸ/.test(readme), false);
  assert.equal(readme.includes('→'), true);
  assert.equal(readme.includes('📲'), true);
});
