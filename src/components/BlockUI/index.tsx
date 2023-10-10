import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import { useSelector, useDispatch } from "react-redux";
import { openBlockUI, closeBlockUI } from "store/counterSlice";
import "../BlockUI/blockUI.css";
const BlockUI = () => {
  const isOpent = useSelector((state: any) => state.counterSlice?.open);
  return (
    <div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          cursor: isOpent ? "progress" : "",
        }}
        open={false}
      >
        <div className="spinner-6"></div>
      </Backdrop>
    </div>
  );
};

export const FnBlock_UI = () => {
  const Dispatch = useDispatch();
  const BlockUI = () => Dispatch(openBlockUI());
  const UnBlockUI = () => Dispatch(closeBlockUI());
  return { BlockUI, UnBlockUI };
};

export default BlockUI;
