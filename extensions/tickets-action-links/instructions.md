## When to use these ticket action links

Use these intents when the merchant wants to edit a support ticket
(also referred to as a todo or task). The merchant will be navigated directly
to the ticket form in the app.

- **Edit a ticket** — invoke the `application/ticket` **edit** intent with the
  ticket's `id` as the intent `value` when the merchant wants to change an
  existing ticket's title, description, or status.

- **Create a ticket** — invoke the `application/ticket` **create** intent with the
  ticket's `id` as the `create` when the merchant wants to create a tciekt

## Guidelines

- Confirm the details with the merchant before triggering the intent.
- Valid `status` values are `open`, `in_progress`, and `closed`, infer any synonyms that you can.
