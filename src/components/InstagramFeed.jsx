import { Button, Card, Grid, ImageList, Paper } from "@mui/material";
import React from "react";
import SelectedPhoto from "./SelectedPhoto";

export default function PhotoSlideShow({
  photos,
  selectedPhotos,
  addSelectedPhoto,
  removeSelectedPhoto,
  selectAllPhotos,
  InstagramAuthUrl,
  deSelectAllPhotos,
}) {
  const handleOnSelect = (isSelected, photo) => {
    isSelected ? addSelectedPhoto(photo) : removeSelectedPhoto(photo);
  };
  return (
    <>
      {photos?.length > 0 ? (
        <Paper elevation={4}>
          <Card>
            <div style={{ display: "flex", margin: 10 }}>
              <div
                style={{
                  display: "flex",
                  flex: "1",
                }}
              >
                <h4>Current IG Feed</h4>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: "1",
                  justifyContent: "center",
                }}
              >
                {/* <Chip label="Last Updated: Date" /> */}
              </div>
              <div
                style={{
                  display: "flex",
                  flex: "1",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => selectAllPhotos(photos)}
                  style={{ marginRight: 5 }}
                >
                  Select All
                </Button>
                <Button
                  variant="contained"
                  onClick={() => deSelectAllPhotos(photos)}
                >
                  De-Select All
                </Button>
              </div>
            </div>
            <ImageList
              sx={{ width: "100%", height: 350, overflowY: "scroll" }}
              cols={6}
              rowHeight={164}
            >
              {photos?.map((photo) => (
                <SelectedPhoto
                  photo={photo}
                  selected={selectedPhotos?.find(
                    (selectedPhoto) =>
                      selectedPhoto.instagramID == photo.instagramID
                  )}
                  onSelect={handleOnSelect}
                />
              ))}
            </ImageList>
          </Card>
        </Paper>
      ) : (
        <Paper
          elevation={4}
          sx={{
            height: "100%",
          }}
        >
          <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Grid
              container
              display="flex"
              justifyContent="center"
              sx={{
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <h4>Connect your Instagram Account to view your feed!</h4>
            </Grid>
            <Grid container justifyContent="center" display="flex">
              <a href={InstagramAuthUrl} target="blank">
                <Button variant="contained">Connect to Instagram</Button>
              </a>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
}
