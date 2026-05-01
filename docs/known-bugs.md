# Autodial Known Bugs and Mistakes Log

Use this file to record bugs, causes, and lessons so Codex does not repeat the same mistake.

## Bug format

```md
## Bug: Short title

### Symptom
What the user saw.

### Root cause
Where the bug actually came from.

### Fix
What changed.

### Test
How it was verified.

### Lesson for Codex
What future agents must avoid.
```

---

## Bug: Duplicate calls triggered

### Symptom
The app may start more than one call for the same contact or queue step.

### Likely root cause areas
- duplicate timers
- repeated useEffect triggers
- start button not disabled during active call
- async provider response race condition
- queue state updated too late

### Fix principle
There must be one source of truth for active call state.

### Test
- Start queue.
- Confirm one call starts.
- Rapid-click start.
- Confirm duplicate calls do not start.
- Pause/resume and confirm no duplicate calls.

### Lesson for Codex
Do not add another timer or effect without checking existing queue execution logic.

---

## Bug: Imported contacts duplicated

### Symptom
Same contact appears multiple times after import.

### Likely root cause areas
- phone numbers not normalized
- duplicate detection uses display name only
- import creates new records without checking existing normalized phone
- existing contact history overwritten or duplicated

### Fix principle
Normalize phone numbers and merge carefully without deleting notes/status.

### Test
- Import same CSV twice.
- Import same phone with different spacing.
- Confirm one contact remains.
- Confirm existing notes/status remain.

### Lesson for Codex
Never use contact name alone for duplicate detection.
