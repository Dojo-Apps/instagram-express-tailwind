import { Alert, AlertTitle, Button, Card, Grid } from "@mui/material";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import LoadingOverlay from "react-loading-overlay";
import FeedDetails from "../components/FeedDetails";
import MicroModal from "micromodal";

function HomePage() {
  const app = useAppBridge();
  const [open, setOpen] = useState(false);
  const instagramRedirectURL = process.env.HOST + "/oauth/callback/";
  const instagramAppID = process.env.INSTA_APP_ID;
  const clientAccess = process.env.INSTA_CLIENT_ACCESS;
  const access_token = `${instagramAppID}|${clientAccess}`;
  const redirect = Redirect.create(app); //Example of working redirect
  const InstagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${instagramAppID}&redirect_uri=${instagramRedirectURL}&scope=user_profile,user_media&response_type=code`;

  const [user, setUser] = useState(); // undefined => {id: 23jfj3jrj4, }
  const [displayFeed, setDisplayFeed] = useState({});
  const [instagramPhotos, setInstagramPhotos] = useState();
  const [instagramUsername, setInstagramUsername] = useState();
  const [subscriptionStatus, setSubscriptionStatus] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = async () => {
    const resp = await axios.get("/api/user/me");
    try {
      console.log("run fetch user response", resp);
      setUser(resp.data.populatedUser);
      setSubscriptionStatus(resp.data.populatedUser.subscriptionStatus);
      if (resp.data.populatedUser == null) {
        setIsLoading(false);
        console.log("insta-response", resp);
      }
    } catch (error) {
      console.log(error, "fetch user error");
    }
  };

  const onPhotoTagsSaved = async () => {
    fetchUser();
  };

  const fetchInstagramFeed = async () => {
    if (user.instagramAccessToken) {
      try {
        console.log("log user", user);

        const arrayResp = await axios.get(
          `https://graph.instagram.com/me/media?fields=media,timestamp,media_type,media_url,permalink,caption,username&access_token=${user.instagramAccessToken}`
        );
        console.log(arrayResp, "array Response");
        const instagramPhotos = arrayResp.data.data.map((photo) => {
          return {
            instagramID: photo.id,
            mediaURL: photo.media_url,
            caption: photo.caption,
            permalink: photo.permalink,
            mediaType: photo.media_type,
            instagramTimestamp: photo.timestamp,
            username: photo.username,
          };
        });

        const createPhotosResp = await axios.post("/api/photos", {
          photos: instagramPhotos,
        });
        // hide loading screen...

        setInstagramPhotos(createPhotosResp.data);
        console.log(createPhotosResp);
        console.log("fetch instagram photos success");
      } catch (error) {
        console.log("fetch instagram photo error" + error);
      }
    } else {
      setIsLoading(false);
    }
  };

  // 3
  useEffect(() => {
    // show loading screen...
    setIsLoading(true);
    fetchUser();
    MicroModal.init({ awaitCloseAnimation: true });
  }, []); // runs once the app loads

  // 2
  // TODO: User is set when a new feed is added. This triggers a re-fetch
  // of the instagram feed. We don't want that to happen on every new feed added.
  useEffect(() => {
    if (user && !instagramPhotos) {
      console.log("fetch instagram feed");
      fetchInstagramFeed();
    }
  }, [user]); //  when user loads... run this function

  // 1. When app loads (user = undefined, instagramPhotos = undefined)
  // 2. When user finished loading
  //    (user = {...}, instagramPhotos = undefined)
  // 3. When instagramPhotos finised loading
  //    (user = {...}, instagramPhotos=[...])
  useEffect(() => {
    // return if user or instagram photos not loaded

    if (!user || !instagramPhotos) {
      console.log("return hit");
      return;
    }

    // user and instagram photos have loaded
    if (user?.feeds?.length > 0) {
      // user has created a feed before
      const lastSelectedFeed =
        user.feeds.find((feed) => feed._id === user.lastSelectedFeedID) ||
        user.feeds[0];

      setDisplayFeed(lastSelectedFeed);
    } else {
      // user has not created a feed yet... display instagram feed
      setDisplayFeed({ name: "", photos: [] });
    }

    setIsLoading(false);
  }, [user, instagramPhotos]);

  const onFeedDelete = (feedToDelete) => {
    console.log(user.feeds);
    setUser({
      ...user,
      feeds: user.feeds.filter((feed) => feed._id != feedToDelete._id),
    });
  };

  const onFeedUpdate = (user) => {
    setUser(user);
  };

  const onFeedAdd = (updatedUser) => {
    setUser(updatedUser);
  };

  const onNewFeed = () => {
    setDisplayFeed({ name: "", photos: [] });
  };

  const onFeedClick = async (feed) => {
    setDisplayFeed(feed);

    const resp = await axios.post("/api/user/lastSelectedFeedID", {
      lastSelectedFeedID: feed._id,
    });

    console.log("saved lastSelectedFeedID");
  };

  const classes = {
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: 20,
      textAlign: "center",
      backgroundColor: "black",
      color: "white",
    },
  };

  const billingCall = async () => {
    window.top.location.href = "/api/user/subscription";
  };

  const removeIG = async () => {
    const _user = await axios.get("/api/user/instagram/disconnect");
    try {
      console.log(_user, "new user");
      setUser(_user);
      setInstagramPhotos([]);
    } catch (error) {
      console.log(error, "fetch user error");
    }
  };

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.core.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.theme.min.css"
        />
      </Helmet>

      <body>
        <LoadingOverlay active={isLoading} spinner text="Loading...">
          <div className="app">
            {
              subscriptionStatus != "ACTIVE" ? (
                <Card sx={{ marginBottom: 1 }}>
                  <Grid container className="membership_banner">
                    <Grid
                      item
                      display="flex"
                      alignItems="center"
                      xs={8}
                      padding={1}
                      marginBottom={0}
                    >
                      <h5>
                        Your are currently using the free version. Upgrade to
                        Pro so you can tag photos with products!
                      </h5>
                    </Grid>
                    <Grid
                      item
                      xs
                      display="flex"
                      justifyContent="flex-end"
                      margin={1}
                    >
                      <Button onClick={billingCall} variant="contained">
                        Upgrade to Pro
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              ) : null
              // <h1>You are a member</h1>
            }

            {/* <div className="membership_banner"></div> */}
            <Card>
              <Grid container padding={1} display="flex">
                <Grid item display="flex" xs={12} sm={8}>
                  {user?.instagramAccessToken ? (
                    <Grid>
                      <Alert severity="success" sx={{ width: "100%" }}>
                        <AlertTitle sx={{ fontSize: 18, marginBottom: 0 }}>
                          Connected to Instagram account{" "}
                          <strong>@{user?.instagramUsername}</strong>
                        </AlertTitle>
                      </Alert>
                    </Grid>
                  ) : (
                    // <Alert severity="success">Connected to Instagram</Alert>
                    <a href={InstagramAuthUrl} target="blank">
                      <Button variant="contained">Connect to Instagram</Button>
                    </a>
                  )}
                </Grid>

                <Grid
                  item
                  display="flex"
                  justifyContent="flex-end"
                  xs={12}
                  sm={4}
                >
                  {user?.instagramAccessToken ? (
                    <Button
                      sx={{ marginRight: 1 }}
                      size="small"
                      variant="contained"
                      onClick={() => removeIG()}
                    >
                      Disconnect Instagram Account
                    </Button>
                  ) : null}
                  <Button
                    variant="contained"
                    onClick={() => MicroModal.show("modal-2")}
                  >
                    Help
                  </Button>
                </Grid>
              </Grid>
            </Card>

            <FeedDetails
              feed={displayFeed}
              instagramUsername={instagramUsername}
              instagramPhotos={instagramPhotos}
              userFeeds={user?.feeds}
              InstagramAuthUrl={InstagramAuthUrl}
              onFeedClick={onFeedClick}
              onFeedDelete={onFeedDelete}
              onFeedUpdate={onFeedUpdate}
              onFeedAdd={onFeedAdd}
              onNewFeed={onNewFeed}
              onPhotoTagsSaved={onPhotoTagsSaved}
              user={user}
            />
          </div>
          <div
            class="modal__help micromodal-slide"
            id="modal-2"
            aria-hidden="true"
          >
            <div
              class="modal__overlay__help"
              tabindex="-1"
              data-micromodal-close
            >
              <div
                class="modal__container__help"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-1-title"
              >
                <header class="modal__header__help">
                  <h2 class="modal__title__help" id="modal-1-title">
                    How to set up Instagram Pro
                  </h2>
                </header>
                <main class="modal__content__help" id="modal-1-content">
                  <p>
                    Instructions:
                    <br />
                    <br />
                    1. Connect your Instagram account by clicking ‘Connect
                    Instagram Account’. If you are signed in to instagram on
                    your browser, it will automatically connect to that account.
                    Log out of your browser’s instagram account to connect to
                    another account.
                    <br />
                    <br />
                    2. Create a ‘Feed Title’ to begin creating a new feed.
                    <br />
                    <br />
                    3. Select the images you would like to add to your display
                    feed. Your display feed is what will be shown on your
                    shopify store (the app block). Make sure to “save” any
                    changes you make to the display feed like adding or removing
                    photos.
                    <br />
                    <br /> 4. Click on images in your display feed to tag
                    products. These tags will allow customers to click and
                    navigate to your selected products.
                    <br />
                    <br />
                    5. To remove product tags, deselect products from the
                    resource picker.
                    <br />
                    <br />
                    6. The “selected feed” will be the feed that appears in your
                    store’s app block.
                    <br />
                    <br />
                    7. Add your Instagram feed app block to your theme: a.
                    Navigate to Online Store>Themes>Customize. b. On the
                    left-hand menu, select a section and click add app block. c.
                    Insert the Instagram Feed App Block. Your Instagram feed
                    should appear. —-- Display your Instagram feed directly in
                    your Shopify store with Dojo Apps’ Instagram Feed Pro.
                    Instagram Feed Pro allows merchants to create a seamless
                    social media experience in their store, enabling social
                    proof and branding.
                  </p>
                </main>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </body>
    </>
  );
}

export default HomePage;
