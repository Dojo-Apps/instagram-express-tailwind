import express from "express";
const router = express.Router();

// model
import User from "../models/User.js";
import Photo from "../models/Photo.js";

/**
 * POST /api/photos
 * Create photos.
 * Used to create photos from Instagram feed.
 */
router.post("/", async (req, res) => {
  const shopOrigin = req.cookies.shopOrigin;
  const user = await User.findOne({ shopOrigin: shopOrigin });
  if (user) {
    const { photos } = req.body;

    const newPhotosPromises = photos.map(async (photo) => {
      return Photo.findOneAndUpdate({ instagramID: photo.instagramID }, photo, {
        new: true,
        upsert: true,
      });
    });

    const newPhotos = await Promise.all(newPhotosPromises);

    res.json(newPhotos);
    // ctx.res.statusCode = 200;
  } else {
    // user not found
    // ctx.res.statusCode = 401;
  }
});

/**
 * PUT /api/photos/:id
 * Update a photo in a specific feed.
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const shopOrigin = req.cookies.shopOrigin;

  const photo = await Photo.findById(id);
  if (photo) {
    photo.set(req.body); // set tags for photo
    await photo.save(); // save photo with new tags
    console.log(photo);

    res.json(photo);
    // ctx.res.statusCode = 200;
  } else {
    // ctx.res.statusCode = 404;
  }
});

// exports
export default router;
