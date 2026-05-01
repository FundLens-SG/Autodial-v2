# Autodial User Flows

## Flow 1: Import contacts

### Expected behavior
- Contacts import cleanly.
- Duplicates are detected.
- Phone numbers are normalized.
- Existing notes/statuses are preserved.
- Import does not wipe existing data.

### Test steps
1. Import contacts with clean numbers.
2. Import contacts with spaces/dashes.
3. Import same contacts again.
4. Confirm duplicates are not created accidentally.
5. Confirm existing notes/statuses are preserved.

## Flow 2: Create call queue

### Expected behavior
- Queue contains correct contacts.
- Queue order is predictable.
- Do-not-call contacts are excluded.
- Queue state is saved if app supports persistence.

### Test steps
1. Select contacts.
2. Create queue.
3. Confirm order.
4. Confirm excluded statuses are not included.
5. Refresh if applicable.
6. Confirm queue remains valid.

## Flow 3: Start queue

### Expected behavior
- First eligible contact starts.
- Only one active call starts.
- Current index is correct.
- UI reflects running state.

### Test steps
1. Create queue with multiple contacts.
2. Click start.
3. Confirm only first contact is active.
4. Confirm no duplicate call is triggered.
5. Confirm queue status is running.

## Flow 4: Pause queue

### Expected behavior
- Queue pauses.
- No new calls start while paused.
- Current call state remains clear.
- Resume continues correctly.

### Test steps
1. Start queue.
2. Pause during or after a call.
3. Confirm no next call starts.
4. Confirm queue status is paused.
5. Refresh if applicable.
6. Confirm queue does not auto-start unexpectedly.

## Flow 5: Resume queue

### Expected behavior
- Queue resumes from the correct position.
- It does not restart from the beginning unless intended.
- It does not skip contacts accidentally.

### Test steps
1. Start queue.
2. Complete or skip first contact.
3. Pause.
4. Resume.
5. Confirm next correct contact is called.

## Flow 6: Stop queue

### Expected behavior
- Queue stops.
- No new calls start.
- Current state is saved or cleared intentionally.
- UI does not show running state.

### Test steps
1. Start queue.
2. Stop queue.
3. Confirm no new call starts.
4. Confirm UI shows stopped/idle.
5. Refresh and confirm expected state.

## Flow 7: Update lead outcome

### Expected behavior
- Status saves correctly.
- Notes save correctly.
- Last contacted timestamp updates if appropriate.
- Follow-up date saves if set.

### Test steps
1. Open a lead.
2. Mark no answer.
3. Add note.
4. Set follow-up.
5. Refresh.
6. Confirm values persisted.

## Flow 8: Failed call handling

### Expected behavior
- Failed calls show clear error.
- Failed contacts are not marked completed.
- Queue either stops, retries, or moves on according to app rules.
- Failure does not corrupt queue.

### Test steps
1. Simulate provider/API failure.
2. Confirm error is visible.
3. Confirm contact status is not wrongly completed.
4. Confirm queue state is recoverable.
