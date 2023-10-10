import React from 'react'
import { Cake, Email, MoreHoriz, Phone } from '@mui/icons-material'
import { Button, Card, CardContent, CardMedia, Chip, Grid, Stack, Typography } from '@mui/material'
import defaultAvatar from "assets/images/NoImage/default-avatar.png";
import { useNavigate } from 'react-router-dom';

export default function CardEmployee(props) {
    const navigate = useNavigate();
    const OnPage = (sID) => {
        let sUri = (`/personal_information?sID=${encodeURI(sID)}`);
        navigate(sUri, {});
    }
    return (
        <div>
            <Stack justifyContent={"center"} alignItems={"center"} direction={"row"} flexWrap={"wrap"} >
                <Card
                    sx={{
                        margin: "8px",
                        maxWidth: "300px",
                        minWidth: "300px",
                        minHeight: "465px",
                        borderRadius: "25px",
                        backgroundColor: "aliceblue",
                        boxShadow: "2.8px 2.8px 2.2px rgba(0, 0, 0, 0.014),6.7px 6.7px 5.3px rgba(0, 0, 0, 0.02),12.5px 12.5px 10px rgba(0, 0, 0, 0.025),22.3px 22.3px 17.9px rgba(0, 0, 0, 0.03),41.8px 41.8px 33.4px rgba(0, 0, 0, 0.036),100px 100px 80px rgba(0, 0, 0, 0.05)",
                        '&:hover': {
                            backgroundColor: "#f5faff",
                            cursor: "pointer",
                            boxShadow: " 2.8px 2.8px 2.2px rgba(0, 0, 0, 0.014),6.7px 6.7px 5.3px rgba(0, 0, 0, 0.02),12.5px 12.5px 10px rgba(0, 0, 0, 0.025)",
                            transform: " TranslateY(-10px)",
                            outline: "1px solid rgba(0,0,0,0)",
                            transition: "0.3s",
                            zIndex:100,
                        },
                    }}>
                    <Grid container>
                        <Grid item xs={12} padding={"10px"}>
                            <Grid container justifyContent={"space-between"} >
                                <Grid item xs={7.5}>
                                    <Typography variant="body1" color={"#000"} style={{ margin: "5px" }}>
                                        {props.item.sTotalDate}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4.5} display={"flex"} justifyContent={"center"}>
                                    <Chip label={props.item.isActive === true ? `Active` : `Not Active`} color={props.item.isActive === true ? "success" : "error"} variant="filled" />
                                    <Button onClick={() => { OnPage(props.item.sID) }} sx={{ padding: 0, margin: 0, minWidth: "30px", display: "block" }}><MoreHoriz sx={{ fontSize: "1rem" }} /></Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <CardMedia
                                style={{ border: 'solid', color: "#000", width: "150px", height: "150px", borderRadius: "50%", margin: "auto" }}
                                image={defaultAvatar}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardContent
                                sx={{
                                    borderRadius: "25px ",
                                }}>
                                <Card sx={{
                                    overflow: "hidden",
                                    margin: "10x",
                                    padding: 0,
                                    borderRadius: "25px ",
                                    backgroundColor: "rgba(200 ,235 ,255, 1)",
                                }}>
                                    <Grid item xs={12} >
                                        <Typography textOverflow={"ellipsis"} overflow={"hidden"} whiteSpace={"nowrap"} variant="h6" color={"#243784"} textAlign={"center"} sx={{ marginTop: "5px" }}>
                                            <b>{props.item.sFullname}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h6" color={"#243784"} textAlign={"center"} sx={{ margin: "3px 0px 10px 0" }}>
                                            <p>{"(Project Manager)"}</p>
                                        </Typography>
                                    </Grid>
                                    <CardContent sx={{
                                        backdropFilter: "blur(10px)",
                                        backgroundColor: "rgba(255,255,255,0.5)",
                                        padding: " 5px",
                                        width: "100%",
                                        minHeight: "150px",
                                        borderRadius: " 0 0 25px 25px ",
                                    }}>
                                        <Grid item xs={12}>
                                            <Typography display={"flex"} fontSize={"14px"} alignItems={"center"} variant="body2" color={"#3f3f3f"} textAlign={"left"} margin={"10px"}>
                                                <b> ประเภทพนักงาน : </b> &nbsp;{props.item.sEmpType}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            {
                                                `${props.item.IsRetire !== true}` ?
                                                    <Typography display={"flex"} fontSize={"14px"} alignItems={"center"} variant="body2" color={"#3f3f3f"} textAlign={"left"} margin={"10px"}>
                                                        <b>วันที่เริ่มงาน :</b>&nbsp; {props.item.sWorkStart}
                                                    </Typography>
                                                    :
                                                    <Typography display={"flex"} fontSize={"14px"} alignItems={"center"} variant="body2" color={"#3f3f3f"} textAlign={"left"} margin={"10px"}>
                                                        <b>วันที่ลาออก :</b>&nbsp; {props.item.sRetire}
                                                    </Typography>
                                            }
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography display={"flex"} fontSize={"14px"} alignItems={"center"} variant="body2" color={"#3f3f3f"} textAlign={"left"} margin={"10px"}>
                                                <Email /> &nbsp;{props.item.sEmail}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography display={"flex"} fontSize={"14px"} variant="body2" alignItems={"center"} color={"#3f3f3f"} textAlign={"left"} margin={"10px"}>
                                                <Phone /> &nbsp;{props.item.sTelephone}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Typography display={"flex"} fontSize={"14px"} variant="body2" alignItems={"center"} color={"#3f3f3f"} textAlign={"left"} margin={"10px"}>
                                                <Cake /> &nbsp;{props.item.sBirth}
                                            </Typography>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Stack>
        </div>
    )
}

