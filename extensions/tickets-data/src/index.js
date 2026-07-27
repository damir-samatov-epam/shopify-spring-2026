export default () => {
  shopify.tools.register('search_tickets', async () => {
    const response = await fetch(`/api/tickets`);
    const data = await response.json();

    return {
      results: data.tickets.map(ticket => ({
        name: ticket.title,
        uri: `gid://application/ticket/${ticket.id}`,
        url: `app://tickets/${ticket.id}`,
        mimeType: 'application/ticket',
        type: "resource_link",
        _meta: ticket
      }))
    }
  });
}
