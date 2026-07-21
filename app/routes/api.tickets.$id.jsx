import {authenticate} from "../shopify.server";

// eslint-disable-next-line no-undef
const MOCK_API_URL = process.env.MOCK_API_URL || "";

export const action = async ({request, params}) => {
  await authenticate.admin(request);

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
    const ticket = await res.json();

    console.dir({ticket});
    return {ticket};
  }

  if (request.method === "DELETE") {
    await fetch(`${MOCK_API_URL}/${id}`, {method: "DELETE"});
    return {ok: true};
  }

  return null;
};
