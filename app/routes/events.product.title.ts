import {authenticate} from '../shopify.server';

export const action = async ({request}: { request: Request }) => {
  const data = await authenticate.webhook(request);

  console.log(`Received ${data.topic} Event for ${data.shop}`);
  console.log(JSON.stringify(data, null, 2));

  return new Response(null, {status: 200});
};
