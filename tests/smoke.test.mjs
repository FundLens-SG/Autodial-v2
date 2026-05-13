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

test('inline sheet parser clamps ambiguous AI statuses and dates', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /function parseDateValue\(raw\)/);
  assert.match(html, /function canonicalLeadStatus\(value\)/);
  assert.match(html, /var cleanAiStatus = canonicalLeadStatus\(rawAiStatus\)/);
  assert.equal(html.includes("status: a.status || 'pending'"), false);
  assert.match(html, /l = sanitizeImportedLead\(l\)/);
});

test('inline sheet parser keeps phone detection header-aware', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /function detectBatchColumns\(rows, startRow, endRow, headers\)/);
  assert.match(html, /return isPhoneLike\(v, header\)/);
  assert.equal(html.includes('vals.filter(isPhoneLike).length'), false);
  assert.match(html, /detectPhoneCol\(rows, 0, 15, headers\)/);
});

test('session sync applies remote control-state changes, not only counters', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /var runningRef = useRef\(running\)/);
  assert.match(html, /var phaseRef = useRef\(phase\)/);
  assert.match(html, /remoteControlChanged/);
  assert.match(html, /actualElapsed: actualElapsed/);
  assert.match(html, /creditHours: creditElapsed \? creditElapsed \/ 3600 : null/);
});

test('stability hardening keeps recovery, config, appts, and calendar safe', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal(html.includes('localStorage.clear('), false);
  assert.match(html, /window\.autodialSafeRepair=function\(\)/);
  assert.match(html, /function _normalizeCfgShape\(cfg, opts\)/);
  assert.match(html, /var myCfg = _normalizeCfgShape/);
  assert.match(html, /var _mergeApptRecords = \(existing, incoming\) =>/);
  assert.match(html, /var _mapDbApptRow = a =>/);
  assert.match(html, /leadNotes: a\.lead_notes \|\| a\.leadNotes \|\| ''/);
  assert.match(html, /migrateMissingLeadSourceMeta/);
  assert.match(html, /calendarWeekCacheRef/);
});

test('appointment status merge protects durable follow-up outcomes', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /APPT_FOLLOWUP_RANK = \{ pending: 1, postponed: 2, fly_kite: 3, met: 4, closed: 5 \}/);
  assert.match(html, /var _stampApptStatus = \(appt, followUp, extra\) =>/);
  assert.match(html, /var _pickApptStatusSource = \(ex, inc\) =>/);
  assert.match(html, /statusUpdatedAt/);
  assert.match(html, /clientOpId/);
  assert.match(html, /_normApptFollowUp\(a\.followUp\) === _normApptFollowUp\(apptSearch\)/);
  assert.match(html, /var _statusKey = _fu === 'fly_kite' \? 'flykite' : _fu/);
  assert.match(html, /var _apFu = _normApptFollowUp\(ap\.followUp\)/);
  assert.equal(/fly_kite:\s*0/.test(html), false);
});

test('appointment set flow pauses before dialing next lead', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /var _apptOrdinal = value =>/);
  assert.equal(html.includes("Congratulations on setting your ' + _setOrdinal + ' appointment.\\n\\nContinue?"), true);
  assert.match(html, /confirmLabel: 'Continue'/);
  assert.match(html, /cancelLabel: 'Take break'/);
  assert.match(html, /_pendingSetApptSaved/);
  assert.match(html, /_confirmSetContinue\(_advance\)/);
  assert.match(html, /_advanceAfterWARef\.current = run/);
  assert.match(html, /Book appointment/);
});

test('google readiness uses verified API health instead of raw token', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /var googleApiOk = !!\(gOk && googleHealth\.state === 'ok'\)/);
  assert.match(html, /done: googleApiOk/);
  assert.match(html, /Sheets and Calendar verified from Main access/);
  assert.match(html, /googleApiOk && React\.createElement\("div", \{/);
  assert.equal(/done: !!\(gOk \|\| myCfg\.timesheetId \|\| cfg\.sheetId\)/.test(html), false);
});

test('appointment delete tombstones avoid broad phone-date keys for new deletes', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const exactStart = html.indexOf('function _apptDeleteKeys(a)');
  const legacyStart = html.indexOf('function _apptLegacyDeleteKeys(a)');
  const exactBlock = html.slice(exactStart, legacyStart);
  assert.ok(exactStart >= 0 && legacyStart > exactStart);
  assert.equal(exactBlock.includes("add(phone + '_' + date)"), false);
  assert.match(exactBlock, /if \(phone && date && time\) add\('pdt:' \+ phone \+ '\|' \+ date \+ '\|' \+ time\)/);
  assert.match(html, /function _apptLegacyDeleteKeys\(a\)/);
  assert.match(html, /if \(_apptLegacyDeleteKeys\(a\)\.some\(k => delSet\.has\(k\)\)\) return true/);
});

test('cloud appointment purge retries every owner candidate', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /var dbOwners = owners\.length \? owners : \[/);
  assert.match(html, /for \(var doi = 0; doi < dbOwners\.length; doi\+\+\)/);
  assert.match(html, /admin: dbOwners\[doi\]/);
  assert.equal(html.includes('admin: owners[0] ||'), false);
});

test('undo set cleanup persists and replays pending deletes', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /_undoSetCleanupQueue_/);
  assert.match(html, /var _buildUndoSetCleanupItem = \(\{ u, info, undoPhone, restoredLead, matchedAppt \}\) =>/);
  assert.match(html, /var cleanupItem = _enqueueUndoSetCleanup\(_buildUndoSetCleanupItem/);
  assert.match(html, /_markUndoSetCleanupRetry\(cleanupItem/);
  assert.match(html, /var _flushUndoSetCleanupQueue = async reason =>/);
  assert.match(html, /_flushUndoSetCleanupQueue\('boot'\)/);
  assert.match(html, /window\.addEventListener\('online', wake\)/);
  assert.match(html, /window\.addEventListener\('focus', wake\)/);
});

test('calendar loading keeps ready week and prioritizes target calendar', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal(/setCalRefreshing\(true\);\s*setWeekEventsWeekKey\(''\);\s*gCalShare\.listCalendars/.test(html), false);
  assert.match(html, /var targetCalForFetch = myCfg\?\.targetCalendarId \|\| cfg\.targetCalendarId \|\| ''/);
  assert.match(html, /var calFetchRank = c =>/);
  assert.match(html, /if \(c\.id === targetCalForFetch\) return 0/);
  assert.match(html, /calFetchList\.sort\(\(a, b\) => calFetchRank\(a\) - calFetchRank\(b\)/);
  assert.match(html, /cfg\.targetCalendarId, myCfg\?\.targetCalendarId/);
});

test('pending undo cleanup is visible in sync diagnostics', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /var undoCleanupCount = _readUndoSetCleanupQueue\(\)\.length/);
  assert.match(html, /var hasActionActivity = !!\(syncTrail\.length \|\| undoInfo \|\| importReview \|\| incompleteApptAlerts\.length \|\| undoCleanupCount\)/);
  assert.match(html, /var cadUndoCleanupBanner = undoCleanupCount \?/);
  assert.match(html, /Flush cleanup/);
  assert.match(html, /\['Undo cleanup', undoCleanupCount === 0/);
  assert.match(html, /label: 'Undo Cleanup'/);
});

test('mobile outcome dock hides while blocking modals are active', () => {
  const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /var mobileOutcomeDockBlocked = !!\(/);
  assert.match(html, /showAppt \|\| showCb \|\| showWA \|\| showPostCall \|\| showNextPreview/);
  assert.match(html, /showMoreMenu \|\| showActivityDrawer \|\| showAllLeadsModal \|\| showLeadJump \|\| dialogRequest/);
  assert.match(html, /var showMobileOutcomeDock = !mobileOutcomeDockBlocked && running && curIdx >= 0/);
});

test('README is stored as clean UTF-8 text', () => {
  const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  assert.equal(/â†|â€|ðŸ/.test(readme), false);
  assert.equal(readme.includes('→'), true);
  assert.equal(readme.includes('📲'), true);
});
