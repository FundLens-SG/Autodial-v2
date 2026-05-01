# Autodial Manual Test Checklist

Run this after every material change.

## Startup
- [ ] App loads without console errors.
- [ ] Existing contacts load.
- [ ] Existing queue state loads if applicable.
- [ ] Existing notes/statuses load.

## Contact import
- [ ] Can import clean contacts.
- [ ] Can import contacts with spaces/dashes in numbers.
- [ ] Duplicate contacts are not accidentally created.
- [ ] Existing contact notes are preserved.
- [ ] Existing contact statuses are preserved.

## Queue
- [ ] Can create queue.
- [ ] Queue order is correct.
- [ ] Do-not-call contacts are excluded.
- [ ] Queue starts from correct contact.
- [ ] Only one call starts at a time.
- [ ] Rapid clicking start does not duplicate calls.

## Pause/resume/stop
- [ ] Pause stops new calls.
- [ ] Resume continues from correct contact.
- [ ] Stop prevents further calls.
- [ ] Refresh does not accidentally restart queue.
- [ ] Queue state remains understandable after refresh.

## Lead status
- [ ] Can mark no answer.
- [ ] Can mark follow up.
- [ ] Can mark not interested.
- [ ] Can mark converted.
- [ ] Can mark do not call.
- [ ] Status persists after refresh.

## Notes
- [ ] Can add note.
- [ ] Can edit note if supported.
- [ ] Notes persist after status update.
- [ ] Notes persist after refresh.

## Call provider/API
- [ ] Successful call updates status correctly.
- [ ] Failed call shows error.
- [ ] Failed call does not mark lead completed.
- [ ] Provider call ID is stored separately from internal call ID.
- [ ] API error does not break UI.

## UI regression
- [ ] Layout still works on desktop.
- [ ] Layout still works on mobile.
- [ ] No unintended text/design changes.
- [ ] No new visual duplication.
