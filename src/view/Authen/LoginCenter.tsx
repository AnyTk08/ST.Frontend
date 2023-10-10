import { Backdrop, Grid, Typography } from "@mui/material";
import React, { Fragment } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextBoxForm } from "components/Input";
import { BtnBaseButton } from "components/Button";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { AxiosPost } from "utilities/ST_Axios";
import { FnDialog, onLoginComplete } from "utilities/ST_Function";
import { InputPassword } from "components/Input/TextBox";
import LogoPTT from "../../assets/images/Logo/logo-ptt.png";
import bgLogin from "../../assets/images/Background/backLogin2.jpg";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import yupFormSchemas from "components/FormItem/yupFormSchemas";
import "./indexLogin.css";
import secureLocalStorage from "react-secure-storage";

export default function LoginCenter() {
    const DialogFn = FnDialog();
    const navigate = useNavigate();
    const [openBackDrop, setOpenBackDrop] = React.useState(false);

    const schema = yup.object().shape({
        sUsername: yupFormSchemas.string("ชื่อผู้ใช้งาน", { required: true }),
        sSecureCode: yupFormSchemas.string("รหัสผ่าน", { required: true }),
    });
    const formResolver = yupResolver(schema);

    const form = useForm({
        resolver: formResolver,
        shouldUnregister: false,
        shouldFocusError: true,
        mode: "all",
        defaultValues: {} as any,
    });

    const onLogin = () => {
        setOpenBackDrop(true);
        let oParam = {
            sUsername: form.getValues("sUsername"),
            sSecureCode: form.getValues("sSecureCode"),
        };

        AxiosPost(
            `Authen/onLogin`,
            oParam,
            (result) => {
                setOpenBackDrop(false);
                if (result.IsLoggedIn) {
                    onLoginComplete(result);
                    if (!result.sGroup && result.sGroup !== "99") {
                        navigate("/select-group");
                    }
                    else {
                        secureLocalStorage.setItem("group-user", result.sGroup);
                        navigate("/homebanner");
                    }


                }
            },
            (dtErr: any) => {
                setOpenBackDrop(false);
                if (dtErr.Message === "UserNull") {
                    DialogFn.Warning("ไม่พบข้อมูลผู้ใช้งาน");
                }
                else if (dtErr.Message === "UserNullPIS") {
                    DialogFn.Warning("ไม่พบข้อมูลผู้ใช้งานใน PIS");
                }
                else if (dtErr.Message === "NotMatch") {
                    DialogFn.Warning("รหัสผ่านไม่ถูกต้อง");
                }
            }
        );
    };

    const onLoginAD = () => {
        let sSiteAD = process.env.REACT_APP_LOGINAD_URL;
        let anchor = document.createElement("a");
        anchor.href = sSiteAD;
        anchor.click();
    }

    return (
        <Fragment>
            <div className="bg">
                <img src={`${bgLogin}`} alt="" className="img-background" />
                <div>
                    <div className="div-gls-login">
                        <FormProvider {...form}>
                            <Grid
                                container
                                spacing={2}
                                justifyContent={"center"}
                                alignItems={"center"}
                                alignContent={"center"}
                            >
                                <Grid item xs={10} sm={9}>
                                    <Grid
                                        container
                                        spacing={2}
                                        justifyContent={"center"}
                                        alignItems={"center"}
                                        alignContent={"center"}
                                    >
                                        <Grid item xs={12}>
                                            <img
                                                src={LogoPTT}
                                                alt="Soffthai Logo"
                                                className="image-ptt"
                                            />
                                            <div className="concept concept-five font-semibold name-crsr">
                                                <h1 className="word">
                                                    <span className="char">C</span>
                                                    <span className="char">R</span>
                                                    <span className="char">S</span>
                                                    <span className="char">R</span>
                                                </h1>
                                            </div>

                                            <Typography className="name-prj">
                                                Community Database &
                                            </Typography>
                                            <Typography className="name-prj">
                                                Performance Dashboard
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextBoxForm
                                                name="sUsername"
                                                maxLength={0}
                                                id={"sUsername"}
                                                label="ชื่อผู้ใช้งาน"
                                                IsShrink={false}
                                                onKeyDown={(e) => {
                                                    if (e.keyCode === 13) {
                                                        console.log("sUsername");
                                                        onLogin();
                                                    }
                                                }}
                                                required={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <InputPassword
                                                name="sSecureCode"
                                                maxLength={0}
                                                id={"sSecureCode"}
                                                label="รหัสผ่าน"
                                                type="password"
                                                IsShrink={false}
                                                onKeyDown={(e) => {
                                                    if (e.keyCode === 13) {
                                                        console.log("sSecureCode");
                                                        onLogin();
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                spacing={2}
                                                justifyContent={"center"}
                                                alignItems={"center"}
                                                alignContent={"center"}
                                            >
                                                <Grid item xs={6} >
                                                    <BtnBaseButton
                                                        sx={{ width: "100%" }}
                                                        startIcon={<LoginIcon />}
                                                        txt="LOGIN"
                                                        id="btnLogin"
                                                        className="btn-login"
                                                        bgcolor="#169bd5"
                                                        bgcolorHover="#098ec8"
                                                        fontColor="#ffffff"
                                                        isFullwidth={true}
                                                        onClick={form.handleSubmit((e) => { onLogin(); })}
                                                    />
                                                </Grid>
                                                <Grid item xs={6} >
                                                    <BtnBaseButton
                                                        sx={{ width: "100%" }}
                                                        startIcon={
                                                            <VpnKeyRoundedIcon />
                                                        }
                                                        txt={"LOGIN AD"}
                                                        id="btnLoginAD"
                                                        className="btn-login-ad"
                                                        bgcolor="#007bb0"
                                                        bgcolorHover="#044f6f"
                                                        fontColor="#ffffff"
                                                        isFullwidth={true}
                                                        onClick={() => { onLoginAD(); }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </FormProvider>
                    </div>
                </div>
            </div>
            <Backdrop
                sx={{
                    zIndex: 99999,
                    backgroundColor: "rgba(0, 0, 0, 0.21)",
                }}
                open={openBackDrop}
            >
                {/* <div className="spinner-6"></div> */}
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
        </Fragment>
    );
}
