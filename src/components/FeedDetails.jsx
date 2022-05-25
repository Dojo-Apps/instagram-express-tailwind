import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CurrentFeedSlideShow from "./CurrentFeedSlideShow";
import InstagramFeed from "./InstagramFeed";

export default function FeedDetails({
  feed,
  instagramUsername,
  onFeedAdd,
  onFeedDelete,
  onFeedUpdate,
  onFeedClick,
  onPhotoTagsSaved,
  onNewFeed,
  instagramPhotos,
  InstagramAuthUrl,
  user,
}) {
  const [showModal, setShowModal] = useState(false);
  const onModalClose = () => setShowModal(false);
  const [modalPhoto, setModalPhoto] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [feedTitle, setFeedTitle] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [missingTitleError, setMissingTitleError] = useState(false);

  const onPhotoClick = (photo) => {
    setModalPhoto(photo);
    setOpenDialog(true);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const handleListChange = (event) => {
    setFeedLayout(event.target.value);
  };

  const onFeedChange = (event) => {
    onFeedClick(event.target.value);
  };

  useEffect(() => {
    setFeedTitle(feed.name);
    setSelectedPhotos(feed.photos);
  }, [feed, user]);

  const saveFeed = () => {
    if (feedTitle.trim() == "") {
      setMissingTitleError(true);
      return;
    }

    if (feed._id) {
      // updating an existing feed
      const updatedFeed = {
        ...feed,
        name: feedTitle,
        photos: selectedPhotos,
      };
      axios.put("/api/feeds/update-feed/", updatedFeed).then((resp) => {
        // add the _id to the user.feeds
        const updatedUser = resp.data;
        onFeedUpdate(updatedUser);
      });
    } else {
      // creating a new one
      const newFeed = {
        name: feedTitle,
        photos: selectedPhotos,
      };

      axios.post("/api/feeds/add-feed", newFeed).then((resp) => {
        const updatedUser = resp.data;
        onFeedAdd(updatedUser);
        // add the _id to the user.feeds
      });
    }

    setMissingTitleError(false);
  };

  const addSelectedPhoto = (photo) => {
    setSelectedPhotos([...selectedPhotos, photo]);
  };

  const removeSelectedPhoto = (photoToRemove) => {
    setSelectedPhotos(
      selectedPhotos.filter(
        (photo) => photo.instagramID != photoToRemove.instagramID
      )
    );
  };

  const selectAllPhotos = (photos) => {
    setSelectedPhotos(photos);
  };

  const deSelectAllPhotos = (photos) => {
    setSelectedPhotos([]);
  };

  const deleteFeed = async (feed) => {
    const feedName = feed._id;
    await axios.put("/api/feeds/delete", {
      // removing from database
      id: feedName,
    });
    onFeedDelete(feed);
    // visually remove feed
  };

  return (
    <>
      <Grid
        container
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        <Grid item xs={3} paddingRight={1} display="flex">
          <Card sx={{ width: "100%" }} elevation={3}>
            <Grid container display="flex" flexDirection="column" padding={1}>
              <Grid className="feed_details" container paddingBottom={1}>
                <Grid item xs display="flex" padding={1}>
                  <h4>
                    Total Feeds:{" "}
                    <span className="highlight_number">
                      {user?.feeds?.length}
                    </span>
                  </h4>
                </Grid>
                <Grid
                  item
                  xs
                  display="flex"
                  justifyContent="flex-end"
                  padding={1}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={onNewFeed}
                  >
                    New Feed
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs>
                <Grid paddingRight={1} paddingLeft={1} paddingBottom={1}>
                  <h4>Choose your feed:</h4>
                </Grid>
                <FormControl fullWidth>
                  <InputLabel id="slider-or-grid">Choose your feed:</InputLabel>
                  <Select
                    labelId="chooose-feed"
                    id="choose-feed"
                    value={feed}
                    label="Choose your feed"
                    onChange={onFeedChange}
                  >
                    {user?.feeds?.map((feed) => (
                      <MenuItem value={feed}>{feed.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Grid paddingRight={1} paddingLeft={1} paddingTop={3}>
                  <h4>Feed Title:</h4>
                </Grid>
                <TextField
                  label="Feed title"
                  sx={{
                    width: "100%",
                  }}
                  error={missingTitleError}
                  variant="filled"
                  value={feedTitle}
                  onChange={(event) => {
                    setFeedTitle(event.target.value);
                  }}
                />
              </Grid>

              <Grid
                item
                xs
                justifyContent="flex-end"
                alignItems="center"
                flexDirection="column"
                display="flex"
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={saveFeed}
                  sx={{ width: "80%", margin: 1 }}
                >
                  Save Feed
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteFeed(feed)}
                  sx={{ width: "80%" }}
                >
                  Delete Feed
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <InstagramFeed
            onPhotoClick={onPhotoClick}
            photos={instagramPhotos}
            selectedPhotos={selectedPhotos}
            addSelectedPhoto={addSelectedPhoto}
            removeSelectedPhoto={removeSelectedPhoto}
            selectAllPhotos={selectAllPhotos}
            deSelectAllPhotos={deSelectAllPhotos}
            InstagramAuthUrl={InstagramAuthUrl}
          />
        </Grid>
      </Grid>

      <CurrentFeedSlideShow
        photos={selectedPhotos}
        feedName={feed.name}
        instagramUsername={instagramUsername}
        feed={feed}
        user={user}
        onPhotoTagsSaved={onPhotoTagsSaved}
      />
    </>
  );
}
