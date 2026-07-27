import {authenticate} from '../shopify.server';

export const action = async ({request}: {request: Request}) => {
  const {shop, topic, payload} = await authenticate.webhook(request);

  console.log(`Received ${topic} Event for ${shop}`);
  console.log(JSON.stringify(payload, null, 2));

  return new Response(null, {status: 200});
};
