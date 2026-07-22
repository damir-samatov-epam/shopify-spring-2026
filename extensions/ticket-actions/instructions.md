## When to use these ticket actions

Use these intents and tools when the merchant wants to create, edit, or delete a
support ticket (also referred to as a todo or task).

- **Create a ticket** — invoke the `application/ticket` **create** intent when the
  merchant asks to open, add, or file a new ticket. Prefill `title` and
  `description` from what the merchant said.
- **Edit a ticket** — invoke the `application/ticket` **edit** intent with the
  ticket's `id` as the intent `value` when the merchant wants to change an existing
  ticket's title, description, or status.

## Tools available while a ticket is open

- `save_ticket` — creates the new ticket (on a create intent) or saves changes to the
  open ticket (on an edit intent). `title` is required; `description` and `status`
  are optional. `status` only applies when editing.
- `delete_ticket` — deletes the ticket currently open. Only available on an edit
  intent, where a ticket is already loaded. Deletion is exposed as a tool because
  `delete` is not a supported intent action for `application/ticket`.

## Guidelines

- Confirm the details with the merchant before saving or deleting — the merchant
  stays in control of what gets changed.
- Deletion is permanent. Only call `delete_ticket` when the merchant clearly asks to
  remove the ticket.
- Valid `status` values are `open`, `in_progress`, and `closed`.
