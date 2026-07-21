export default () => {
  shopify.tools.register('search_tickets', async () => {
    const response = await fetch(`/api/tickets`);
    return response.json();
  });
}
