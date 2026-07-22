import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/IntentExtension.jsx' {
  interface SaveTicketInput {
    /**
     * Ticket title/summary (1-200 characters).
     */
    title: string;
    /**
     * Detailed description of the ticket.
     */
    description?: string;
    /**
     * Workflow status of the ticket. Only applies when editing an existing ticket.
     */
    status?: 'open' | 'in_progress' | 'closed';
    [k: string]: unknown;
  }

  type SaveTicketOutput = unknown;
  interface DeleteTicketInput {
    [k: string]: unknown;
  }

  type DeleteTicketOutput = unknown;
  interface ShopifyTools {
    /**
     * Create the new ticket, or save changes to the ticket currently open in the extension. On a create intent this creates a ticket; on an edit intent this updates the open ticket.
     */
    register(
      name: 'save_ticket',
      handler: (
        input: SaveTicketInput,
      ) => SaveTicketOutput | Promise<SaveTicketOutput>,
    ): () => void;
    /**
     * Delete the ticket currently open in the extension. Only available on an edit intent, where a ticket is already loaded.
     */
    register(
      name: 'delete_ticket',
      handler: (
        input: DeleteTicketInput,
      ) => DeleteTicketOutput | Promise<DeleteTicketOutput>,
    ): () => void;
  }

  interface CreateApplicationTicketIntentInput {
    /**
     * Short summary/title of the ticket (1-200 characters).
     */
    title?: string;
    /**
     * Detailed description of the issue or task the ticket tracks.
     */
    description?: string;
    [k: string]: unknown;
  }

  type CreateApplicationTicketIntentValue = unknown;
  type CreateApplicationTicketIntentOutput = unknown;
  interface CreateApplicationTicketIntentRequest {
    action: 'create';
    type: 'application/ticket';
    data: CreateApplicationTicketIntentInput;
    value?: CreateApplicationTicketIntentValue;
  }

  interface EditApplicationTicketIntentInput {
    /**
     * Updated title/summary of the ticket (1-200 characters).
     */
    title?: string;
    /**
     * Updated detailed description of the ticket.
     */
    description?: string;
    /**
     * Workflow status of the ticket.
     */
    status?: 'open' | 'in_progress' | 'closed';
    [k: string]: unknown;
  }

  /**
   * The ID of the ticket to edit.
   */
  export type EditApplicationTicketIntentValue = string;

  type EditApplicationTicketIntentOutput = unknown;
  interface EditApplicationTicketIntentRequest {
    action: 'edit';
    type: 'application/ticket';
    data: EditApplicationTicketIntentInput;
    value?: EditApplicationTicketIntentValue;
  }

  type ShopifyGeneratedIntentVariants =
    | import('@shopify/ui-extensions/admin').ShopifyGeneratedIntentVariant<
        CreateApplicationTicketIntentRequest,
        CreateApplicationTicketIntentOutput
      >
    | import('@shopify/ui-extensions/admin').ShopifyGeneratedIntentVariant<
        EditApplicationTicketIntentRequest,
        EditApplicationTicketIntentOutput
      >;

  const shopify: import('@shopify/ui-extensions/admin').WithGeneratedTools<
    import('@shopify/ui-extensions/admin').WithGeneratedIntents<
      import('@shopify/ui-extensions/admin.app.intent.render').Api,
      ShopifyGeneratedIntentVariants
    >,
    ShopifyTools
  >;
  const globalThis: { shopify: typeof shopify };
}
