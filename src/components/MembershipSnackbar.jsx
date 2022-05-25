import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { blue, green } from "@mui/material/colors";
import { SnackbarContent } from "@mui/material";

export default function MembershipSnackbar({ open, setOpen }) {
  // const [open, setOpen] = React.useState(false);

  const billingCall = async () => {
    window.top.location.href = "/api/user/subscription";
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    console.log("hit");
  };

  const action = (
    <React.Fragment>
      <Button variant="contained" onClick={() => billingCall()}>
        Upgrade
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    // {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={handleClose}
      action={action}
    >
      <SnackbarContent
        style={{
          backgroundColor: `#0289d1`,
          margin: 40,
          fontSize: 20,
          action: blue,
          ".MuiSnackbarContent-action": {
            size: 20,
            fontSize: 40,
            color: green,
          },
        }}
        sx={{
          ".MuiSnackbarContent-action": {
            size: 20,
            fontSize: 40,
            color: green,
          },
        }}
        message="Upgrade to the pro plan to tag photos"
        action={action}
      />
    </Snackbar>
  );
}
