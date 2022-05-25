import express from "express";
const router = express.Router();

// model
import User from "../models/User.js";
import Photo from "../models/Photo.js";

// middleware

/**
 * Create a new Feed
 */
router.post("/add-feed/", async (req, res) => {
  const shopOrigin = req.cookies.shopOrigin;
  console.log(shopOrigin);
  const user = await User.findOne({ shopOrigin: shopOrigin });
  if (user) {
    const { name, photos } = req.body;
    console.log(req.body);

    const newPhotosPromises = photos.map(async (photo) => {
      return Photo.findOneAndUpdate({ instagramID: photo.instagramID }, photo, {
        upsert: true,
      });
    });

    const newPhotos = await Promise.all(newPhotosPromises);

    user.feeds.push({ name: name, photos: newPhotos });
    user.lastSelectedFeedID = user.feeds.at(-1)._id;

    await user.save();

    res.json(user);
    // res.status(200).send("Works");
  } else {
    // user not found
    return res.status(400).send("user not found");
  }
});

/**
 * Update a feed
 */
router.put("/update-feed/", async (req, res) => {
  const shopOrigin = req.cookies.shopOrigin;
  const user = await User.findOne({ shopOrigin: shopOrigin });

  if (user) {
    const feedData = req.body;
    const feedToUpdate = user.feeds.id(feedData._id);
    feedToUpdate.set(feedData); // update name and list of photos

    await user.save();

    res.json(user); //populated
    // ctx.res.statusCode = 200;
  } else {
    // user not found
    return res.status(401).send("user not found");
  }
});

/**
 * PUT /api/feeds/photos
 * Update a feeds photos
 */
router.put("/photos", async (req, res) => {
  const shopOrigin = ctx.cookies.get("shopOrigin");
  const user = await User.findOneAndUpdate({ shopOrigin: shopOrigin });

  user.feeds.push({ name: req.body.name, photos: req.body.photos });
  await user.save();

  res.json({ message: user });
  // ctx.res.statusCode = 200;
});

/**
 * Delete Feed
 */
router.put("/delete", async (req, res) => {
  const shopOrigin = req.cookies.shopOrigin;
  const user = await User.findOne({ shopOrigin: shopOrigin });
  console.log("hit delete req");
  console.log(req.body.name);
  user.feeds.pull({ _id: req.body.id });
  await user.save();
  res.json({ message: user });
});

// exports
export default router;
