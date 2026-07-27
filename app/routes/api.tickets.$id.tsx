import {authenticate} from "../shopify.server";
import {Ticket} from "../types";
import {onTicketDeleted, onTicketEdited} from "../app-events.service";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "react-router";

// eslint-disable-next-line no-undef
const MOCK_API_URL = process.env.MOCK_API_URL || "";

export const loader = async ({request, params}: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const {id} = params;
  const res = await fetch(`${MOCK_API_URL}/${id}`);
  const ticket = await res.json();
  return {ticket};
};

export const action = async ({request, params}: ActionFunctionArgs) => {
  await authenticate.admin(request);

  console.dir(request, {depth: 100});

  const {id} = params;

  if (request.method === "PUT") {
    const body = await request.json();
    const res = await fetch(`${MOCK_API_URL}/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        ...body
      }),
    });

    const ticket: Ticket = await res.json();

    onTicketEdited(ticket);

    return {ticket};
  }

  if (request.method === "DELETE" && id) {
    await fetch(`${MOCK_API_URL}/${id}`, {method: "DELETE"});
    onTicketDeleted(id);

    return {ok: true};
  }

  return null;
};
