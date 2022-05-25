import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { TitleBar } from "@shopify/app-bridge-react";
import PhotoSlideShow from "./InstagramFeed";

export default function Feeds({ userFeeds, onFeedClick, onFeedDelete }) {
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
    <Box
      sx={{
        top: 0,
        width: "100%",
        height: 60,
        paddingTop: "30px",
      }}
    >
      <Typography variant="h2">My Feeds</Typography>

      <List>
        {userFeeds?.map((feed) => (
          <>
            <ListItem
              sx={{
                backgroundColor: "orange",
              }}
            >
              <Grid container display="flex">
                <Grid xs item display="flex" justifyContent="flex-start">
                  {feed.name}
                </Grid>
                <Grid xs item display="flex" justifyContent="flex-end">
                  <Button variant="contained" onClick={() => deleteFeed(feed)}>
                    Delete Feed
                  </Button>
                  <Button variant="contained" onClick={() => onFeedClick(feed)}>
                    View Feed
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </Box>
  );
}
