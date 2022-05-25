import { Shopify } from "@shopify/shopify-api";
import express from "express";
import {
  createClient,
  getSubscriptionUrl,
  getSubscriptionStatus,
} from "../handlers/index.js";
const router = express.Router();

// model
import User from "../models/User.js";

// middleware

router.get("/_accessToken", async (req, res) => {
  const users = await User.find();
  let user = users[0];
  console.log(user);
  console.log("cho");
});

router.post("/lastSelectedFeedID", async (req, res) => {
  const { lastSelectedFeedID } = req.body;
  const shopOrigin = req.cookies.shopOrigin;
  const user = await User.findOne({ shopOrigin: shopOrigin });
  if (user) {
    user.lastSelectedFeedID = lastSelectedFeedID;
    await user.save();
    res.json(user);
  } else {
    // user not found
    res.status(401).send();
  }
});

router.post("/accesstoken", async (req, res) => {
  const _user = await new User({
    userId: req.body.userId,
  });
  _user.save();
});

/**
 * Returns the currently logged-in user's info based on the shopOrigin cookie.
 */
router.get("/me", async (req, res) => {
  const shop = req.cookies.shopOrigin || req.query.shop;
  const user = await User.findOne({
    shopOrigin: shop,
  });

  // const client = await createClient(shop, user.shopifyAccessToken);
  const client = await new Shopify.Clients.Graphql(
    shop,
    user.shopifyAccessToken
  );

  if (user.subscriptionID) {
    const appSubscription = await getSubscriptionStatus(
      client,
      user.subscriptionID
    );
    user.subscriptionStatus = appSubscription.node.status;
    await user.save();
  }

  const populatedUser = await user.populate({
    path: "feeds",
    populate: { path: "photos" },
  });

  // console.log("this is the populated user", populatedUser);
  res.json({ populatedUser });
});

router.get("/instagram/disconnect", async (req, res) => {
  const shop = req.cookies.shopOrigin || req.query.shop;
  const user = await User.findOne({
    shopOrigin: shop,
  });
  user.instagramAccessToken = null;
  user.instagramUserID = null;
  user.instagramUsername = null;
  user.save();
  res.json("hit instagram logout");
});

/**
 * GET /api/user/subscription
 *
 * Redirect user to subscription page to approve paid subscription.
 */
router.get("/subscription", async (req, res) => {
  const shopOrigin = req.cookies.shopOrigin;
  const user = await User.findOne({ shopOrigin });
  const client = await new Shopify.Clients.Graphql(
    user.shopOrigin,
    user.shopifyAccessToken
  );
  console.log(client, user.shopifyAccessToken);
  let subscriptionData = await getSubscriptionUrl(
    { client },
    // `https://${shopOrigin}/admin/apps/${process.env.SHOPIFY_API_KEY}`,
    `${process.env.HOST}/api/user/subscription/callback`,
    false // isHistory
  );
  res.redirect(subscriptionData.confirmationUrl);
});

/**
 * GET /api/user/subscription/callback
 *
 * After user approves the paid subscription, this route is hit. This route
 * saves the subscription ID in the user doc, then reirects the user to
 * the homepage of the app.
 */
router.get("/subscription/callback", async (req, res) => {
  // Grab the charge ID from the query param => shopify api can convert about the charge
  // Mark their user account as being premium (in DB)
  // redirect to home page
  const shopOrigin = req.cookies.shopOrigin;
  const user = await User.findOne({ shopOrigin });
  const subscriptionID = req.query.charge_id;

  // update user's subscription id
  user.subscriptionID = `gid://shopify/AppSubscription/${subscriptionID}`;
  await user.save();

  res.redirect(
    `https://${shopOrigin}/admin/apps/${process.env.SHOPIFY_API_KEY}`
  );
});

// exports
export default router;
