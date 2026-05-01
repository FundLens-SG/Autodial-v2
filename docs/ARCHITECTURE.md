# Autodial Architecture

## Purpose
Autodial helps CK manage calling workflows, lead follow-ups, call queues, statuses, notes, and possibly AI-assisted outbound calling.

## Main concepts

### Contact / Lead
A person or prospect to be called.

A lead may have:
- name
- phone number
- source
- status
- notes
- tags
- last contacted date
- next follow-up date

### Call queue
An ordered list of leads to call.

The queue should have:
- predictable order
- current index
- paused/running/stopped state
- retry handling
- completed/skipped/failed status

### Call session
A single call attempt.

A call session may have:
- contact ID
- phone number
- provider call ID
- start time
- end time
- status
- notes
- recording/transcript references if applicable

### Call provider
The external service or local call mechanism used to make calls.

Provider-specific logic should be isolated.

### Script
The call guide or talk track used for the call.

Scripts should not be mixed with call execution logic.

## Expected separation of concerns

### UI layer
Responsible for:
- displaying contacts
- displaying queue
- displaying current call
- buttons for start/pause/resume/stop
- showing errors clearly

Not responsible for:
- direct provider-specific call logic
- low-level persistence rules
- billing calculations

### State layer
Responsible for:
- queue state
- selected contact
- call status
- pause/resume/stop state

### Persistence layer
Responsible for:
- saving contacts
- saving lead statuses
- saving notes
- saving queue state if required
- restoring state after refresh

### Provider/API layer
Responsible for:
- outbound call request
- call status updates
- webhooks
- errors and retries

### Billing/usage layer
Responsible for:
- tracking usage
- call duration
- provider cost
- customer billing if applicable

## Architecture rule
Do not mix UI display status with real call execution status.

The app must distinguish:
- what the user sees
- what the app believes is happening
- what the provider confirms happened
