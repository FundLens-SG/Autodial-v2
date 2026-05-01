---
name: autodial-call-flow
description: Use when editing Autodial contact import, call queue, call status, pause/resume/stop, provider API, lead outcome, or call persistence logic.
---

# Autodial Call Flow Skill

Use this skill whenever a task touches:
- contacts
- lead statuses
- call queues
- outbound call logic
- pause/resume/stop
- provider API calls
- call status webhooks
- notes
- follow-up dates
- billing or usage tracking

## Before editing
Trace the full path:
1. Which contact or queue is affected?
2. What is the current queue state?
3. What should happen next?
4. Is this UI state, persistent state, or provider-confirmed state?
5. Which function starts a call?
6. Which function updates call status?
7. Which function updates lead status?
8. Which function persists the result?

## Never do
- Never start more than one call for one queue step.
- Never mark a call completed before provider confirmation.
- Never lose notes when changing status.
- Never include do-not-call leads in a queue.
- Never hide API errors.
- Never reset queue state accidentally.
- Never add provider-specific code into UI components if an API/provider layer exists.
- Never assume Singapore caller ID behavior without explicit requirements.

## Required checks
After editing, test:
- Contact import.
- Duplicate prevention.
- Queue start.
- Pause.
- Resume.
- Stop.
- Lead status update.
- Notes persistence.
- Error handling.
- Refresh persistence.

## Final answer
Report:
- Root cause.
- Files/functions changed.
- State flow before and after.
- Tests completed.
- Remaining risk.
