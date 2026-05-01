# Autodial Data Schema

This document defines the expected structure and ownership rules for Autodial data.

## Contact object

```json
{
  "id": "contact_unique_id",
  "name": "Lead Name",
  "phone": "+65XXXXXXXX",
  "normalizedPhone": "+65XXXXXXXX",
  "email": null,
  "source": "source_name",
  "status": "new",
  "tags": [],
  "notes": [],
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "lastContactedAt": null,
  "nextFollowUpAt": null
}
```

## Contact status values

Suggested statuses:

```txt
new
queued
calling
completed
no_answer
busy
failed
follow_up
not_interested
converted
do_not_call
```

Do not invent new statuses without checking all UI and filtering logic.

## Note object

```json
{
  "id": "note_unique_id",
  "contactId": "contact_unique_id",
  "body": "note text",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "createdBy": "user_or_system"
}
```

## Queue object

```json
{
  "id": "queue_unique_id",
  "name": "Queue Name",
  "contactIds": [],
  "currentIndex": 0,
  "status": "idle",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Queue status values

```txt
idle
running
paused
stopped
completed
error
```

## Call session object

```json
{
  "id": "call_session_unique_id",
  "contactId": "contact_unique_id",
  "queueId": "queue_unique_id",
  "provider": "provider_name",
  "providerCallId": null,
  "phone": "+65XXXXXXXX",
  "status": "initiated",
  "startedAt": "ISO date string",
  "endedAt": null,
  "durationSeconds": null,
  "error": null,
  "notes": [],
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Call session status values

```txt
initiated
ringing
in_progress
completed
no_answer
busy
failed
cancelled
unknown
```

## ID rules
- contact.id must be unique.
- queue.id must be unique.
- call_session.id must be unique.
- providerCallId should not replace internal app ID.
- Do not rely only on contact name for uniqueness.
- Duplicate contact checks should use normalized phone number and relevant context.

## Phone normalization rules
- Store display phone and normalized phone separately.
- Normalize spacing and punctuation.
- Preserve country code where available.
- Do not assume all numbers are Singapore numbers unless the product explicitly requires that.

## Persistence rules
- Do not rename localStorage/database keys without migration.
- Do not clear queue state unless the user intentionally resets it.
- Do not lose notes when updating lead status.
- Do not overwrite contact history when importing contacts.
- Do not mark calls as successful before confirmation.

## Compliance-sensitive rules
- Do not assume consent exists.
- Do not implement call spoofing.
- Do not bypass provider restrictions.
- Do not hide opt-out/do-not-call status.
- Do not call contacts marked `do_not_call`.
