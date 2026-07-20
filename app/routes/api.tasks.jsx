import {authenticate} from "../shopify.server";

// eslint-disable-next-line no-undef
const MOCK_API_URL = process.env.MOCK_API_URL || "";

// GET /api/tasks  -> list
export const loader = async ({request}) => {
  await authenticate.admin(request);

  const res = await fetch(MOCK_API_URL);
  const tasks = await res.json();
  return {tasks};
};

// POST /api/tasks -> create
export const action = async ({request}) => {
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
    }),
  });
  const task = await res.json();
  return {task};
};
