import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function RECURRING_CREATE(url, freeDays) {
  return `
    mutation {
      appSubscriptionCreate(
          name: "Basic Plan"
          returnUrl: "${url}"
          test: true,
          trialDays: 7,
          lineItems: [
          {
            plan: {
              appUsagePricingDetails: {
                  cappedAmount: { amount: 1.99, currencyCode: USD }
                  terms: "The pro version allows you to tag unlimited products onto your posts so users can easily navigate to product pages from each post."
              }
            }
          }
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: 1.99, currencyCode: USD }
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}

export const getSubscriptionUrl = async (ctx, returnUrl, isHistory) => {
  const { client } = ctx;
  const freeDays = isHistory ? 0 : 7;
  const subscriptionData = await client
    .query({
      data: RECURRING_CREATE(returnUrl, freeDays),
    })
    .then((response) => {
      return {
        confirmationUrl:
          response.body.data.appSubscriptionCreate.confirmationUrl,
        appSubscription_Id:
          response.body.data.appSubscriptionCreate.appSubscription.id,
      };
    });

  return subscriptionData;
};
