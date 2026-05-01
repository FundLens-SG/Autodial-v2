# AGENTS.md

## Project identity
Autodial is CK's calling, lead follow-up, and call workflow app. It may involve contacts, call queues, call statuses, scripts, notes, API integrations, and billing-related flows.

Reliability, consent assumptions, and state safety matter more than speed.

## Core operating rules
- Do not rewrite large sections unless explicitly asked.
- Do not change UI, styling, layout, wording, or branding unless the task asks for it.
- Before editing, inspect the relevant existing functions and explain the current flow.
- Make the smallest safe change.
- Preserve existing data schema, contact IDs, call IDs, queue state, and storage keys unless explicitly instructed.
- Do not add paid APIs or new dependencies without asking.
- Do not assume Singapore caller ID, telephony rules, or compliance requirements.
- Separate UI state, contact data, queue logic, call logic, API logic, and billing logic.
- Do not fake successful call states.
- Do not silently skip failed calls.
- Do not remove error handling to make the UI look clean.

## Critical product principles
- Contacts must not duplicate accidentally.
- Call queue order must be predictable.
- Pause/resume must not start extra calls.
- Lead status updates must persist.
- Refreshing the app must not corrupt queue state.
- Failed calls should be visible or recoverable.
- Any AI voice or outbound call feature must assume clear opt-in/consent requirements.
- Billing and usage tracking must be accurate if present.

## Common high-risk areas
Check these carefully before editing:
- contact import
- duplicate contact detection
- queue generation
- call queue state
- current call state
- pause/resume/stop logic
- call result/status update
- notes saving
- API call wrappers
- webhook handling
- billing/usage tracking
- localStorage/database persistence
- retry logic

## Past mistakes Codex must not repeat
- Do not start multiple calls because of duplicate timers or effects.
- Do not reset the queue accidentally on refresh.
- Do not mark a call as completed before the provider confirms it.
- Do not lose notes when updating lead status.
- Do not duplicate imported contacts due to formatting differences.
- Do not mix UI display status with actual call provider status.
- Do not add Twilio or any provider-specific logic without checking existing abstraction.
- Do not change caller ID assumptions casually.
- Do not hide API errors from the user.
- Do not treat Singapore domestic calling rules as generic international calling.

## Required workflow before editing
For every bug fix:
1. Identify the affected user flow.
2. Identify whether the issue is UI state, persistent data, API response, or queue logic.
3. Trace where the incorrect state first appears.
4. Trace how the state is saved.
5. Trace how the state is displayed.
6. Choose the smallest safe fix.
7. Implement.
8. Test affected and nearby flows.

## Verification checklist
After every change:
- Run the app locally if possible.
- Check the browser console.
- Test contact import.
- Test duplicate contact prevention.
- Test call queue start.
- Test pause.
- Test resume.
- Test stop.
- Test lead status update.
- Test refresh persistence.
- Confirm no unrelated UI changed.

## Done means
A task is only complete when:
- The bug no longer reproduces.
- The affected call/contact flow works.
- At least one nearby workflow still works.
- No unrelated files were changed.
- No unrelated UI was changed.
- Final response explains changed files, changed functions, tests done, and remaining risk.
