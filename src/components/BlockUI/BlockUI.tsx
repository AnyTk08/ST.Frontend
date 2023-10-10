import React from "react";
import { useSelector } from "react-redux";
import AuthenSelectors from "store/selectors/BlockUISelectoe";
import Backdrop from "@mui/material/Backdrop";
export default function BlockUI(props) {
  const OpenBackDrop = useSelector(AuthenSelectors.IsOpen);
  const HandleClose = useSelector(AuthenSelectors.HandleClose);

  return (
    <React.Fragment>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => 9999,
          ...(OpenBackDrop ? {} : { display: "none" }),
        }} //theme.zIndex.drawer + 1,
        open={OpenBackDrop}
        onClick={HandleClose}
      >
        {/* <CircularProgress color="inherit" /> */}
        <div id="page">
          <div id="container">
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="ring"></div>
            <div id="h3">กำลังโหลด</div>
          </div>
        </div>
      </Backdrop>
    </React.Fragment>
  );
}
