import Shopify, { DataType } from "@shopify/shopify-api";

export const appUninstallHooks = async (
  topic,
  callbackUrl,
  shop,
  accessToken
) => {
  const client = new Shopify.Clients.Rest(shop, accessToken);
  let _callUrl = callbackUrl.replace(/([^:]\/)\/+/g, "$1");
  console.log("url - ", _callUrl);
  try {
    const response = await client.post({
      path: "webhooks",
      data: {
        webhook: {
          topic: topic,
          address: _callUrl,
          format: "json",
          fields: ["id", "note"],
        },
      },
      type: DataType.JSON,
    });

    console.log("body.errors", response.body.errors);
    console.log("body data", response.body.webhook);
  } catch (err) {
    console.log("err", err);
  }
  return 0;
};
