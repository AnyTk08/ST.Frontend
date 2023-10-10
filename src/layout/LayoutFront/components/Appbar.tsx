import React, { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Divider,
    Grid,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    Drawer,
    Tooltip,
    Avatar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import LogoPTT from "../../../assets/images/Logo/logo-ptt.png";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Link, useNavigate } from "react-router-dom";
import ListHeadMenu from "layout/LayoutBack/components/Menu/ListHeadMenu";
import i18n from "config/i18nConfig";
import { FnDialog } from "utilities/ST_Function";
import secureLocalStorage from "react-secure-storage";
import { AuthToken } from "config/AxiosConfig";
import jwt_decode from "jwt-decode";
import CachedIcon from '@mui/icons-material/Cached';
import ChangeUserGroup from "view/Authen/ChangeUserGroup";
import { AxiosGet } from "utilities/ST_Axios";

const Appbar = (props) => {

    const { dataMenu } = props;
    const DialogFn = FnDialog();
    const navigate = useNavigate();


    const isMatchMobile = useMediaQuery('(min-width:768px)');
    const Layout555 = useMediaQuery('(min-width:555px)');
    const Layout700 = useMediaQuery('(min-width:700px)');
    const Layout1040 = useMediaQuery('(min-width:1040px)');

    const [isOpenGroup, setisOpenGroup] = useState(false)
    const [arrOptionGroup, setarrOptionGroup] = React.useState([] as any)
    const [openDrawer, setOpenDrawer] = useState(false);
    const [DataUser, setDataUser] = useState({
        "ALT": "",
        "FULLNAME": "",
        "ROLE": "",
        "UNITNAME": "",
        "PATHIMAGE": "",
    })

    useEffect(() => {
        getInitOption();
        let token = AuthToken.get() as string;
        let decodedToken = jwt_decode(token) as any;

        let altAvatar = decodedToken.FULLNAME ?? "";

        setDataUser({
            ALT: altAvatar !== "" ? altAvatar.substring(0, 1) : "",
            FULLNAME: decodedToken.FULLNAME ?? "",
            ROLE: decodedToken.ROLE ?? "",
            UNITNAME: decodedToken.UNITNAME ?? "",
            PATHIMAGE: decodedToken.PATHIMAGE ?? "",
        });
    }, [])


    const getInitOption = () => {
        AxiosGet('Authen/GetGroupuser', null, (result) => {
            setarrOptionGroup(result.lstOptionGroup ?? [])
        });

    };
    const onHandleLogout = () => {
        DialogFn.Submit(i18n.t("msgConfirmLogout"), () => {
            DialogFn.CloseSubmit()
            secureLocalStorage.clear();
            navigate("/");
        });
    }


    return (
        <>
            <AppBar
                className={"appbar-front div-glass"}
            >
                <Toolbar className="div-glass" style={{ minHeight: '70px', width: '100%', paddingRight: '0px 30px', color: "#000000" }}>
                    {!isMatchMobile ? (
                        // Mobile
                        <Grid container justifyContent={'space-between'} alignItems='center' >
                            <Grid item xs={'auto'}>
                                <Grid container alignItems='center' sx={{ flexGrow: 1 }} >
                                    <Grid item xs={'auto'}>
                                        <IconButton
                                            onClick={() => setOpenDrawer(!openDrawer)}
                                        >
                                            <MenuIcon style={{ fontSize: Layout700 ? '2rem' : '1.5rem' }} />
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={'auto'}>
                                        <Link to="/homebanner" preventScrollReset={true}>
                                            <Box
                                                component="div"
                                                sx={{
                                                    flexGrow: 1,
                                                    backgroundImage: `url(${LogoPTT})`,
                                                    backgroundSize: "cover",
                                                    backgroundRepeat: "no-repeat",
                                                    objectFit: 'contain',
                                                    cursor: 'pointer',
                                                    height: '43px',
                                                    width: '100px',
                                                    margin: '7px'
                                                }}
                                            />
                                        </Link>
                                    </Grid>
                                    <Divider orientation="vertical" variant="middle" flexItem style={{ margin: '0px 6px', border: '0.5px solid #181365' }} />
                                    <Grid item xs={'auto'}>
                                        <Typography style={{ lineHeight: "0.9" }}>
                                            <span className="color-blue" style={{ fontWeight: "700", display: "flex", fontSize: "24px", marginTop: Layout555 ? "" : "6px" }}>
                                                CRSR
                                            </span>
                                            <span className="color-blue" style={{ fontWeight: "500", fontSize: "16px", display: Layout555 ? "" : "none" }}>
                                                Community Database & Performance Dashboard
                                            </span>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    ) : (
                        // WEB
                        <div className="content-layout">
                            <Grid container spacing={2} justifyContent={'space-between'} alignItems='center' >
                                <Grid item>
                                    <Grid container alignItems='center' >
                                        <Grid item xs={'auto'}>
                                            <Link to="/homebanner" preventScrollReset={true}>
                                                <Box
                                                    component="div"
                                                    sx={{
                                                        flexGrow: 1,
                                                        backgroundImage: `url(${LogoPTT})`,
                                                        backgroundSize: "cover",
                                                        backgroundRepeat: "no-repeat",
                                                        objectFit: 'contain',
                                                        cursor: 'pointer',
                                                        height: '43px',
                                                        width: '100px',
                                                        margin: '7px'
                                                    }}
                                                />
                                            </Link>
                                        </Grid>
                                        <Divider orientation="vertical" variant="middle" flexItem style={{ margin: '4px 8px 4px', border: '0.5px solid rgb(255 255 255 / 29%)', backgroundColor: '#000000' }} />
                                        <Grid item xs={'auto'}>
                                            <Typography style={{ lineHeight: "0.9" }}>
                                                <span className="color-blue" style={{ fontWeight: "700", display: "flex", fontSize: "2rem" }}>
                                                    CRSR
                                                </span>
                                                <span className="color-blue" style={{ fontWeight: "500", fontSize: "1.8rem" }}>
                                                    Community Database & Performance Dashboard
                                                </span>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container spacing={2} alignItems='center' >
                                        <Grid item xs={'auto'}>
                                            <Avatar src={DataUser.PATHIMAGE} alt={DataUser.ALT} sx={{ width: 32, height: 32 }} />
                                        </Grid>
                                        <Grid item xs={'auto'} style={{ display: Layout1040 ? "" : "none" }}>
                                            <Grid container justifyContent={"center"} alignItems='center' >
                                                <Grid item xs={12} style={{ lineHeight: '20px' }}>
                                                    {DataUser.FULLNAME}
                                                    <br />
                                                    {DataUser.ROLE}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={'auto'}>
                                            {secureLocalStorage.getItem("group-user") !== "99" &&
                                                <Tooltip title="เปลี่ยนกลุ่มผู้ใช้งาน">
                                                    <IconButton onClick={() => { setisOpenGroup(true) }}>
                                                        <CachedIcon style={{ color: '#e0a800' }} />
                                                    </IconButton>
                                                </Tooltip>}
                                            <Tooltip title="ออกจากระบบ">
                                                <IconButton onClick={onHandleLogout}>
                                                    <LogoutRoundedIcon style={{ color: "red" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            {/* for mobile */}
            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                sx={{
                    boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset",
                }}
            >
                <Box
                    sx={{ width: 300, overflow: 'hidden' }}
                    role="presentation"
                    style={{
                        overflowY: 'auto'
                    }}
                >
                    <div style={{ width: '100%', padding: '1.8em 1em', display: 'flex', boxShadow: '0px 7px 7px -7px #888888' }}>
                        <Grid container direction={'column'} spacing={1} justifyContent={'space-evenly'} alignItems='center'>
                            <Grid item xs={'auto'}>
                                <Avatar src={DataUser.PATHIMAGE} alt={DataUser.ALT} style={{ width: '5em', height: '5em' }} />
                            </Grid>
                            <Grid item xs={'auto'}>
                                <Typography className="text-center color-blue font-medium">{DataUser.FULLNAME}</Typography>
                                <Typography className="text-center">{DataUser.ROLE}</Typography>
                                <Typography className="text-center">{DataUser.UNITNAME}</Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <Box sx={{ overflowY: 'auto', padding: "10px 0" }}>
                        <ListHeadMenu
                            dataMenu={dataMenu}
                            sidebar={false}
                            setIsDrawerMenu={setOpenDrawer}
                        />
                    </Box>
                    <div style={{ width: "100%",position:'absolute',bottom:'0',padding:'0 6%' }}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { setOpenDrawer(false); setisOpenGroup(true) }}>
                                    <ListItemIcon>
                                        <CachedIcon style={{ color: '#e0a800' }} />
                                    </ListItemIcon>
                                    <ListItemText primary="เปลี่ยนกลุ่มผู้ใช้งาน" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => { setOpenDrawer(false); onHandleLogout(); }}>
                                    <ListItemIcon>
                                        <LogoutRoundedIcon style={{ color: "red" }} />
                                    </ListItemIcon>
                                    <ListItemText primary="ออกจากระบบ" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </div>
                </Box>
            </Drawer>
            <ChangeUserGroup
                isOpen={isOpenGroup}
                setIsOpen={setisOpenGroup}
                arrOptionGroup={arrOptionGroup}
            />
        </>
    );
};

export default Appbar;