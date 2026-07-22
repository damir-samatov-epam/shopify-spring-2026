## When to Use This App's Tools

Use these tools when the merchant asks about:

- Tickets, todos, or tasks

Use `search_tickets` to find and read tickets.

To change tickets, use the Ticket Actions extension:

- Create a ticket → `application/ticket` **create** intent.
- Edit a ticket → `application/ticket` **edit** intent (pass the ticket `id` as the
  intent value).
- Delete a ticket → the `delete_ticket` tool, available while a ticket is open in the
  edit intent.
