// import "isomorphic-fetch";
// import { gql } from "apollo-boost";

export function GET_SUBSCRIPTION_CHECK(id) {
  return `query {
  node(id: "${id}") {
    ...on AppSubscription {
      createdAt
      currentPeriodEnd
      id
      name
      status
      test      
    }
  }
}





`;
}

export const getSubscriptionStatus = async (client, id) => {
  return client
    .query({
      data: GET_SUBSCRIPTION_CHECK(id),
    })
    .then((response) => {
      const { data } = response.body;
      // console.log("response.data - ", data, response)
      // We map the metafield nodes and already JSON.parse the content inside the value field
      return data;
    });
};
