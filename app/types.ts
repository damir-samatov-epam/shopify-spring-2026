export type ShopifyAppEventPayload = {
  shop_id: string;
  event_handle: string;
  timestamp: string;
  idempotency_key?: string;
  attributes?: Record<string, string | number | boolean>;
}

export type ShopifyAppEventTokenResponse = {
  access_token: string;
}

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
}
