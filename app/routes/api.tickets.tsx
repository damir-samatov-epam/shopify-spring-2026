import {authenticate} from "../shopify.server";
import {onTicketCreated} from "../app-events.service";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router";

// eslint-disable-next-line no-undef
const MOCK_API_URL = process.env.MOCK_API_URL || "";

// GET /api/tickets  -> list
export const loader = async ({request}: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const res = await fetch(MOCK_API_URL);

  const tickets = await res.json()

  return {tickets: tickets};
};

// POST /api/tickets -> create
export const action = async ({request}: ActionFunctionArgs) => {
  await authenticate.admin(request);

  if (request.method !== "POST") {
    return {error: "Method not allowed"}
  }

  const body = await request.json();
  const res = await fetch(MOCK_API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      title: body.title,
      description: body.description,
      status: body.status ?? "open",
    }),
  });
  const ticket = await res.json();

  onTicketCreated(ticket);

  return {ticket};
};
