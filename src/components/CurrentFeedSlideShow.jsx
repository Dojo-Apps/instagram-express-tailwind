import Glide from "@glidejs/glide";
import { Button, Grid, Paper } from "@mui/material";
import { ResourcePicker } from "@shopify/app-bridge-react";
// import { Frame, Toast } from "@shopify/polaris";
import axios from "axios";
import { format } from "date-fns";
import MicroModal from "micromodal";
import React, { useCallback, useEffect, useState } from "react";
import MembershipSnackbar from "./MembershipSnackbar";

export default function CurrentFeedSlideShow({
  photos,
  feedName,
  user,
  onPhotoTagsSaved,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [modalPhoto, setModalPhoto] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleToastOpen = useCallback(
    () => setToastOpen((toastOpen) => !toastOpen),
    []
  );

  const placeholderPics = [
    { pic: "example" },
    { pic: "example" },
    { pic: "example" },
    { pic: "example" },
    { pic: "example" },
    { pic: "example" },
  ];

  useEffect(() => {
    console.log(photos);
    new Glide(".glide", {
      type: "slider",
      startAt: 0,
      focusAt: 0,
      bound: true,
      perView: 6, // xxl
      breakpoints: {
        // xl
        1600: { perView: 6 },
        // lg
        1200: { perView: 5 },
        // md
        992: { perView: 4 },
        // sm
        768: { perView: 3 },
        // xs
        576: { perView: 2 },
      },
    }).mount();

    MicroModal.init({ awaitCloseAnimation: true });
  }, [photos]);

  const displayModalTags = (tags) => {
    if (!tags) return;
    const modalTags = document.querySelector(".modal__tags");
    modalTags.innerHTML = ""; // clear list
    const taggedProducts = tags;
    taggedProducts.forEach((product) => {
      const { id, title, handle } = product; // {}
      const div = document.createElement("div");
      div.innerHTML = `<a target="_blank" class="btn btn-primary btn-sm m-1 close" key="${id}"href="https://${user.shopOrigin}/products/${handle}">${title}</a>`;
      modalTags.appendChild(div.firstChild);
    });
  };

  const displayPhotoDescription = (description) => {
    if (!description) return;
    const photoDescription = document.querySelector(".photo_description");
    photoDescription.innerHTML = ""; // clear list
    photoDescription.innerHTML = description; // clear list
  };

  const handleSlideClick = async (photo) => {
    let mediaDateElement = document.querySelector(".media__date");
    mediaDateElement.innerHTML = `${format(
      new Date(photo.instagramTimestamp),
      "MMM d"
    )} • <a href="https://instagram.com/${
      photo.username
    }" target="_blank">View on Instagram</a>`;
    const instagramUsernameElement = document.querySelector(".ig_username");
    instagramUsernameElement.innerHTML = `<a target="_blank" href="https://instagram.com/${photo.username}">@${photo.username}</a>`;

    let imgHTML = `<img 
      src="${photo.mediaURL}"
      class="modal__img"
      width="100"
      height="100" 
      loading="lazy"/>`;

    let videoHTML = `<video 
      src="${photo.mediaURL}"
      autoplay
      controls
      class="modal__img"
      width="100"
      height="100" 
      loading="lazy"/>`;

    const modalMediaContainerElement = document.querySelector(
      ".modal__media_container"
    );
    if (photo.mediaType == "IMAGE") {
      modalMediaContainerElement.innerHTML = imgHTML;
    } else if (photo.mediaType == "VIDEO") {
      modalMediaContainerElement.innerHTML = videoHTML;
    } else if (photo.mediaType == "CAROUSEL_ALBUM") {
      modalMediaContainerElement.innerHTML = imgHTML;
    }

    displayModalTags(photo.tags);

    setModalPhoto(photo); // react
    displayPhotoDescription(photo.caption ? photo.caption : " ");
    MicroModal.show("modal-1");
  };

  const savePhotoTags = async (resources) => {
    console.log(resources);

    const tags = resources.map((resource) => {
      return {
        title: resource.title,
        id: resource.id,
        handle: resource.handle,
      };
    });

    const photoData = {
      tags,
    };

    const resp = await axios.put(`/api/photos/${modalPhoto._id}`, photoData);

    displayModalTags(photoData.tags);
    onPhotoTagsSaved();
    setModalPhoto(resp.data); // react
  };

  const handleTagButtonClick = () => {
    if (user.subscriptionStatus != "ACTIVE") {
      // setToastOpen(true);
      // setOpen(true);
      handleClick();
    } else {
      setPickerOpen(true);
    }
  };
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const generateHTMLForMedia = (media) => {
    const { mediaType, mediaURL } = media;
    if (mediaType == "IMAGE") {
      return (
        <div className="image_container">
          <img
            className="image"
            style={{
              height: "200px",
              width: "100%",
              objectFit: "cover",
            }}
            src={mediaURL}
            alt="gord"
            onClick={() => handleSlideClick(media)}
          />
          <div className="middle">
            <img
              src="https://storage.googleapis.com/dojo_apps/Instagram_Glyph_Gradient_RGB.png"
              className="ig_logo"
            />
          </div>
        </div>
      );
    } else if (mediaType == "VIDEO") {
      return (
        <video
          className="selected_photo"
          style={{
            height: "200px",
            width: "100%",
            objectFit: "cover",
          }}
          src={mediaURL}
          alt="gord"
          onClick={() => handleSlideClick(media)}
        />
      );
    } else if (mediaType == "CAROUSEL_ALBUM") {
      return (
        <div className="image_container">
          <img
            className="image"
            style={{
              height: "200px",
              width: "100%",
              objectFit: "cover",
            }}
            src={mediaURL}
            alt="gord"
            onClick={() => handleSlideClick(media)}
          />
          <div className="middle">
            <img
              src="https://storage.googleapis.com/dojo_apps/Instagram_Glyph_Gradient_RGB.png"
              className="ig_logo"
            />
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* Current Feed Slideshow */}
      <Grid item paddingBottom={2}>
        <Paper elevation={4}>
          <Grid
            container
            display="flex"
            paddingBottom={3}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
          >
            <Grid item xs={6}>
              <h3>
                Display Feed:{" "}
                <span className="highlight_number">{feedName}</span>
              </h3>
            </Grid>
            <Grid item display="flex" justifyContent="flex-end" xs={6}>
              <h3>
                Photos Selected:{" "}
                <span className="highlight_number">{photos?.length}</span>
              </h3>
            </Grid>

            <div className="glide" id="lcarousel">
              <div className="glide__track" data-glide-el="track">
                <ul className="glide__slides">
                  {photos?.length > 0
                    ? photos?.map((photo, index) => (
                        <li key={index} className="glide__slide">
                          {generateHTMLForMedia(photo)}
                        </li>
                      ))
                    : placeholderPics.map((pic) => (
                        <img
                          src="http://caari.org/wp-content/plugins/instagram-feed/img/thumb-placeholder.png"
                          alt="gord"
                          style={{
                            height: "200px",
                            width: "200px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                </ul>
              </div>

              <div className="glide__arrows" data-glide-el="controls">
                <button
                  className="glide__arrow glide__arrow--left"
                  data-glide-dir="<"
                  // style={{ backgroundColor: "blue" }}
                >
                  prev
                </button>
                <button
                  className="glide__arrow glide__arrow--right"
                  data-glide-dir=">"
                  // style={{ backgroundColor: "blue" }}
                >
                  next
                </button>
              </div>
            </div>
            {/* Modal  */}
            {/* Consider using fancybox https://fancyapps.com/ */}
            <div
              className="micromodal micromodal-slide"
              id="modal-1"
              aria-hidden="true"
            >
              <div
                className="modal__overlay"
                tabIndex="-1"
                data-micromodal-close
              >
                <div
                  className="modal-dialog modal-lg"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-1-title"
                >
                  <main className="modal-content" id="modal-1-content">
                    <div class="modal-body vw-100 mw-100 p-0">
                      <div class="container-fluid p-0">
                        <div class="row g-0">
                          <div class="col-12 col-md-7 modal__media_container"></div>
                          <div class="col-12 col-md-5 p-3 d-flex flex-column">
                            <h4 style={{ marginBottom: "0" }}>
                              <div class="ig_username"></div>
                            </h4>
                            <hr />
                            <div class="modal__tags"></div>
                            <p class="photo_description"></p>
                            <Button
                              variant="contained"
                              className="mb-1"
                              sx={{
                                height: "50px",
                              }}
                              onClick={handleTagButtonClick}
                            >
                              Tag Your Products
                            </Button>
                            <ResourcePicker
                              resourceType="Product"
                              open={pickerOpen}
                              initialSelectionIds={modalPhoto.tags}
                              onCancel={() => setPickerOpen(false)}
                              onSelection={(resources) => {
                                savePhotoTags(resources.selection);
                                setPickerOpen(false);
                              }}
                            />
                            {/* USE MUI SNACKBAR INSTEAD */}
                            <MembershipSnackbar open={open} setOpen={setOpen} />
                            <p className="media__date mb-0 mt-auto"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
