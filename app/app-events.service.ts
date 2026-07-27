import {ShopifyAppEventPayload, ShopifyAppEventTokenResponse, Ticket} from "./types";

export const getAppEventsToken = async () => {
  const response = await fetch("https://api.shopify.com/auth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY || "",
      client_secret: process.env.SHOPIFY_API_SECRET,
      grant_type: "client_credentials"
    }),
    redirect: "follow"
  });

  const data: ShopifyAppEventTokenResponse = await response.json();

  return data.access_token;
}

export const sendAppEvent = async (token: string, payload: ShopifyAppEventPayload) => {
  const response = await fetch("https://api.shopify.com/app/unstable/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload),
    redirect: "follow"
  });

  return await response.json();
}

console.log(process.env.SHOP_ID);

export const fireAppEvent = async (eventHandle: string, attributes: ShopifyAppEventPayload["attributes"]) => {
  console.log(process.env.SHOP_ID);

  if (!process.env.SHOP_ID) return;
  const token = await getAppEventsToken();
  const time = new Date().toISOString();
  const res = await sendAppEvent(token, {
    "shop_id": process.env.SHOP_ID,
    "event_handle": eventHandle,
    "timestamp": time,
    "idempotency_key": time,
    "attributes": attributes
  });

  console.log(res)

  return res;
}

export const onTicketCreated = (ticket: Ticket) => {
  fireAppEvent("ticket_created", ticket);
}

export const onTicketEdited = (ticket: Ticket) => {
  fireAppEvent("ticket_edited", ticket);
}

export const onTicketDeleted = (id: string) => {
  fireAppEvent("ticket_deleted", {id});
}
