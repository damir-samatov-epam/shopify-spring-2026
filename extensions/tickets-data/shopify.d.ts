import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/index.js' {
  interface SearchTicketsInput {
    [k: string]: unknown;
  }

  type SearchTicketsOutput = unknown;
  interface ShopifyTools {
    /**
     * Search tickets
     */
    register(
      name: 'search_tickets',
      handler: (
        input: SearchTicketsInput,
      ) => SearchTicketsOutput | Promise<SearchTicketsOutput>,
    ): () => void;
  }

  const shopify: import('@shopify/ui-extensions/admin').WithGeneratedTools<
    import('@shopify/ui-extensions/admin.app.tools.data').Api,
    ShopifyTools
  >;
  const globalThis: { shopify: typeof shopify };
}
