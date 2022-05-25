import pkg from "@apollo/client";
const { ApolloClient, InMemoryCache } = pkg;

const cache = new InMemoryCache();

export const createClient = (shop, accessToken) => {
  return new ApolloClient({
    cache,
    uri: `https://${shop}/admin/api/2019-10/graphql.json`,
    request: (operation) => {
      operation.setContext({
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "User-Agent": `shopify-app-node ${process.env.npm_package_version} | Shopify App CLI`,
        },
      });
    },
  });
};
