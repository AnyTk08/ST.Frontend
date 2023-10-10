import { Tooltip, Typography, Divider, Avatar, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from 'react-router';
import FolderIcon from "@mui/icons-material/Folder";
import { Encrypt } from "utilities/ST_Function";
import { AxiosPost } from "utilities/ST_Axios";

export default function CardWorkList(props) {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("props",props);
    }, [props]);
    
    const goPage = (sID: string, mode: string) => {
        // 1 Create  not sid
        // 2 In process
        // 3 Booking
        // 4 Cancel
        switch (mode) {
            case "1":
                navigate(`/worklist-form?mode=${Encrypt(mode)}`);
                break;
            case "2":
                navigate(`/worklist-form?sID=${Encrypt(sID)}&&mode=${Encrypt(mode)}`);
                break;
            case "3":
                navigate(`/worklist-form?sID=${Encrypt(sID)}&&mode=${Encrypt(mode)}`);
                break;
            default:
                navigate(`/worklist-form?sID=${Encrypt(sID)}&&mode=${Encrypt(mode)}`);
        }
    };

     //#region 
     const loadFileDowload = (nID: any, dataPagination) => {
        let param = {
            sID: nID,

        }
        console.log("dataPagination", dataPagination)
        AxiosPost("MeetingRoom/GetDataTableFileALL", param, (result) => {
            props.state.setDataRow({
                ...dataPagination, arrRows: result.lstData ?? [],
                nDataLength: result.lstData.length,
            })
        });
    }
    //#endregion
  return (
    <div className="carditem">
      <Grid container direction={{ xs: "column", md: "row" }} spacing={2}>
        {/* {Layoutmin900 && */}
        <Grid item xs={12}>
          <Grid container direction={{ xs: "row", md: "column" }}>
            <Grid
              container
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid
                item
                flex={1}
                sx={{ display: "flex", alignItems: "center" }}
                gap={2}
              >
                <img
                  src={require("../../assets/images/Icon/icon-soffthai.png")}
                  alt=""
                  style={{
                    width: "6%",
                    height: "25%",
                    objectFit: "contain",
                    borderRadius: "14px",
                  }}
                />
                <a
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    goPage(props.item.sID + "", props.item.nST + "")
                  }}
                >
                  <Tooltip placement={"top"} title={props.item.Topic}>
                    <Typography
                      color={"#3376de"}
                      sx={{
                        textOverflow: "ellipsis",
                        wordBreak: "break-word",
                        overflow: "hidden",
                        maxWidth: "40ch",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                      }}
                    >
                      Topic : {props.item.Topic}
                    </Typography>
                  </Tooltip>
                </a>
              </Grid>
              <Grid item>
                {props.item.nST == 3 && (
                  <>
                    <div className="btnBooking">
                      <p
                        style={{
                          color: "#50cd89",
                          fontWeight: "bold",
                          margin: 0,
                          fontSize: "0.75rem",
                        }}
                      >
                        Booking
                      </p>
                    </div>
                  </>
                )}
                {props.item.nST == 2 && (
                  <>
                    <div className="btnInprocess">
                      <p
                        style={{
                          color: "rgb(81,151,255)",
                          fontWeight: "bold",
                          margin: 0,
                          fontSize: "0.75rem",
                        }}
                      >
                        In Process
                      </p>
                    </div>
                  </>
                )}
                {props.item.nST == 4 && (
                  <>
                    <div className="btnCancel">
                      <p
                        style={{
                          color: "#f1416c",
                          fontWeight: "bold",
                          margin: 0,
                          fontSize: "0.75rem",
                        }}
                      >
                        Cancel
                      </p>
                    </div>
                  </>
                )}
              </Grid>
            </Grid>

            <Grid item padding={"5px"}></Grid>
            <Divider />
            <Grid item padding={"10px"}></Grid>
            <Grid
              container
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Grid item flex={1}>
                <Grid container gap={1}>
                  <Grid item>
                    <Typography
                      sx={{ fontWeight: "bold", fontSize: "0.95rem" }}
                    >
                      Meeting Room :
                    </Typography>
                  </Grid>
                  <Grid item>
                    {" "}
                    <Typography sx={{ color: "#8e8e8e", fontSize: "0.95rem" }}>
                      {props.item.usetitle}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid item></Grid>
                  <span style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                    Booking Date :{" "}
                  </span>
                  <span
                    style={{
                      color: "#8e8e8e",
                      marginRight: "16px",
                      marginLeft: "8px",
                      fontSize: "0.95rem",
                    }}
                  >
                    {props.item.usedates == props.item.usedateE
                      ? props.item.usedates
                      : props.item.usedates + " - " + props.item.usedateE}
                  </span>
                  <Grid item></Grid>
                  <span style={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                    Booking Time :{" "}
                  </span>
                  <span
                    style={{
                      color: "#8e8e8e",
                      marginLeft: "8px",
                      fontSize: "0.95rem",
                    }}
                  >
                    {!props.item.allDay ? props.item.usetimes : "ทั้งวัน"}
                  </span>
                  <Grid item></Grid>
                </Grid>
              </Grid>

              <Grid item>
                {props.item.isFile && (
                  <div
                    style={{
                      padding: "0.5rem",
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Grid
                      item
                      sx={{
                        cursor: "pointer",
                        padding: "1rem 1rem 0.5rem 1rem",
                        backgroundColor: "#f7e3b4",
                        borderRadius: "100%",
                        ":hover": {
                          backgroundColor: "#ffeec4",
                        },
                      }}
                      onClick={() => {
                        loadFileDowload(props.item.sID, props.state.dataRow);
                        props.state.setIsShowPreview(true);
                      }}
                    >
                      <FolderIcon
                        style={{ fontSize: "30px", color: "#f1c65a" }}
                      />
                    </Grid>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        marginLeft: "0.25rem",
                        marginRight: "0.25rem",
                      }}
                    >
                      {" "}
                      เอกสารประกอบ
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#8e8e8e" }}>
                      {" "}
                      {props.item.nCountFile} เอกสาร
                    </Typography>
                  </div>
                )}
              </Grid>
            </Grid>

            <Grid item padding={"10px"}></Grid>
            {props.item.nST == 3 && (
              <>
                <Divider
                  style={{
                    backgroundColor: "#50cd89",
                    padding: "1px",
                    borderRadius: "10px",
                  }}
                />
              </>
            )}
            {props.item.nST == 2 && (
              <>
                <Divider
                  style={{
                    backgroundColor: "rgb(81,151,255)",
                    padding: "1px",
                    borderRadius: "10px",
                  }}
                />
              </>
            )}
            {props.item.nST == 4 && (
              <>
                <Divider
                  style={{
                    backgroundColor: "#f1416c",
                    padding: "1px",
                    borderRadius: "10px",
                  }}
                />
              </>
            )}
            <Grid item padding={"5px"}></Grid>

            <Grid container justifyContent={"space-between"}>
              <Grid container md={6} gap={2} alignItems={"center"}>
                <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Request By
                </Typography>
                <Avatar sx={{ width: "30px", height: "30px" }}>H</Avatar>
                <span style={{ fontSize: "0.95rem" }}> {props.item.sReq}</span>
              </Grid>

              <Grid
                container
                md={6}
                gap={2}
                alignItems={"center"}
                justifyContent={"flex-end"}
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>
                  Waiting By
                </Typography>
                <Avatar sx={{ width: "30px", height: "30px" }}>H</Avatar>
                <span style={{ fontSize: "0.95rem" }}>{props.item.sAppove}</span>
              </Grid>
            </Grid>
            {/* <Grid item padding={"5px"}></Grid> */}
            <Grid container direction={"column"}>
              <Grid
                container
                justifyContent={"space-between"}
                paddingTop={"8px"}
              >
                <Grid
                  item
                  md={7}
                  display={"flex"}
                  sx={{ alignItems: "center" }}
                >
                  {props.item.nST == 4 &&
                    props.item.sRemark != null &&
                    props.item.sRemark.length > 0 && (
                      <>
                        <Typography
                          sx={{
                            color: "red",
                            textOverflow: "ellipsis",
                            wordBreak: "break-word",
                            overflow: "hidden",
                            maxWidth: "24ch",
                            whiteSpace: "nowrap",
                            fontSize: "0.95rem",
                          }}
                        >
                          <span style={{ fontWeight: "bold" }}>Remark :</span>{" "}
                          {props.item.sRemark}
                        </Typography>
                        <a
                          style={{
                            cursor: "pointer",
                            color: "#00478f",
                            fontWeight: "bold",
                            paddingLeft: "0.5rem",
                            fontSize: "0.95rem",
                          }}
                          onClick={() => {
                            props.state.setIsShowPreviewRemark(true);
                            props.state.setsRemark(props.item.sRemark);
                          }}
                        >
                          {props.item.sRemark.replace(/\s/g, "").length > 25
                            ? "more"
                            : ""}
                        </a>
                      </>
                    )}
                </Grid>
                <Grid item>
                  <div className="lastupdate">
                    <span
                      style={{
                        color: "#7239ea",
                        fontWeight: "bold",
                        margin: 0,
                        fontSize: "0.75rem",
                      }}
                    >
                      Last Update :
                    </span>
                    <span
                      style={{
                        color: "#7239ea",
                        fontSize: "0.75rem",
                      }}
                    >
                      {" "}
                      {props.item.slastUpate}
                    </span>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* } */}
      </Grid>
    </div>
  );
}
