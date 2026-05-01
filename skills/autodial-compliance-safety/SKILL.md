---
name: autodial-compliance-safety
description: Use when editing Autodial AI voice calling, outbound call provider setup, caller ID, consent, opt-out, do-not-call, or Singapore calling assumptions.
---

# Autodial Compliance Safety Skill

## Purpose
Avoid unsafe assumptions around outbound calling, AI voice, consent, caller ID, and provider restrictions.

## Rules
- Do not assume consent exists.
- Do not bypass do-not-call or opt-out status.
- Do not implement caller ID spoofing.
- Do not hide that a call is automated if the product requirement needs disclosure.
- Do not treat Singapore calling rules as generic international rules.
- Do not add a provider-specific workaround that may violate telecom restrictions.
- Do not remove logs needed for auditability.

## Product-safe behavior
The app should support:
- opt-in status
- do-not-call status
- opt-out notes
- call attempt history
- clear failed call states
- clear provider errors
- usage/cost tracking if calls are paid

## Before editing
Check:
1. Is this feature making outbound calls?
2. Does it involve AI voice?
3. Does it involve caller ID?
4. Does it involve imported leads?
5. Does it affect consent, opt-out, or do-not-call?
6. Does it add a provider like Twilio or another telephony API?

## Required checks
- Do-not-call leads are excluded from queues.
- Failed calls are not hidden.
- Provider restrictions are not bypassed.
- Caller ID logic is explicit and not assumed.
- User-facing statuses are clear.

## Final answer
Include any compliance-sensitive assumptions and what was not changed.
