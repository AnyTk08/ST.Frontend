import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { HeaderInputProps } from "./HeaderInputProps";

export default function HeaderInput(props: HeaderInputProps)  {
  return (
    <Box
      sx={{
        marginBottom: "8px",
        // marginLeft: "4px",
        // marginTop: "24px",
        lineHeight: 0,
        display: props.display ? props.display : "inline-block",
        alignItems : props.alignItems ? props.alignItems : "flex-start",
        opacity: 1,
        background: "transparent",
        color: "rgb(52, 71, 103)",
      }}
    >
      <Typography
        sx={{
          m: 0,
          fontSize: "1.25rem",
          lineHeight: 1.25,
          letterSpacing: "0.0333em",
          opacity: 1,
          textTransform: "none",
          verticalAlign: "unset",
          textDecoration: "none",
          color: "rgb(52, 71, 103)",
          fontWeight: 700,
        }}
      >
        {props.text}
        {
          props.required && props.required === true ? (
            <span style={{color:"red"}}> *</span>
          ): null
        }
      </Typography>
      {
        props.subtext && (
          <Typography
        className='Sub-title-form'
        sx={props.sxSubText}
      >
        {props.subtext}
      </Typography>
        )
      }
      {
        props.IsTooltip && (
          <>{props.tooltip}</>
        )
      }
    </Box>
  );
}

const defaultProp: HeaderInputProps = {
  IsTooltip: false,
  text: "",
  tooltip: <></>
  // tooltipIcon : <HelpRoundedIcon />
  ,
  id: "",
}
HeaderInput.defaultProps = defaultProp;


