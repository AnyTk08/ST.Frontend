import React, { useState } from "react";
import {
    AppBar,
    Box,
    Grid,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
    Tooltip,
    Avatar,
} from "@mui/material";
import LogoPTT from "../../../assets/images/Logo/logo-ptt.png";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Link } from "react-router-dom";
const AppbarBack = (props) => {

    const [openDrawer, setOpenDrawer] = useState(false);
    const isMatchMobile = useMediaQuery('(min-width:768px)');
    const Layout555 = useMediaQuery('(min-width:555px)');
    const Layout700 = useMediaQuery('(min-width:700px)');
    const Layout1040 = useMediaQuery('(min-width:1040px)');

    return (
        <div 
            style={{
                flexGrow: 1
            }}
        >
            <AppBar
                style={{background: '#F1F6F9 !important'}}
            >
                <Toolbar style={{ minHeight: '70px', paddingRight: '0px', backgroundColor: "#ffffff", color: "#000000" }}>
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
                                        <Link to="/Home" preventScrollReset={true}>
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
                                    <Grid item xs={'auto'}>
                                        <Typography style={{ lineHeight: "0.9" }}>
                                            <span className="color-blue text-prj1" style={{ display: "flex", marginTop: Layout555 ? "" : "6px" }}>
                                                CRSR
                                            </span>
                                            <span className="color-blue text-prj2" style={{ display: Layout555 ? "" : "none" }}>
                                                Community Database & Performance Dashboard
                                            </span>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2} justifyContent={'space-between'} alignItems='center' sx={{ marginLeft: '8px' }} >
                            <Grid item>
                                <Grid container spacing={2} alignItems='center' >
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
                                    <Grid item xs={'auto'}>
                                        <Typography style={{ lineHeight: "0.9" }}>
                                            <span className="color-blue text-prj1" style={{ display: "flex"}}>
                                                CRSR
                                            </span>{" "}
                                            <span className="color-blue text-prj2">
                                                Community Database & Performance Dashboard
                                            </span>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={2} alignItems='center' >
                                    <Grid item xs={'auto'}>
                                            <IconButton sx={{ p: 0 }}>
                                                <Avatar alt="Remy Sharp" src="" />
                                            </IconButton>
                                    </Grid>
                                    <Grid item xs={'auto'} style={{ display: Layout1040 ? "" : "none" }}>
                                        <Grid container justifyContent={"center"} alignItems='center' >
                                            <Grid item xs={12}>
                                                Somchai Tongpan
                                            </Grid>
                                            <Grid item xs={12}>
                                                PTTPLC
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={'auto'}>
                                        <Tooltip title="Log out">
                                            <IconButton >
                                                <LogoutRoundedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Toolbar>
            </AppBar>
            {/* for mobile */}
            {/* <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <Box
                    sx={{ width: 300, overflow: 'hidden' }}
                    role="presentation"
                    style={{
                        overflowY: 'auto',
                        minHeight:'100vh',
                        boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset",
                    }}
                >
                    <div style={{ width: '100%', padding: '1.8em 1em', display: 'flex', boxShadow: '0px 7px 7px -7px #888888' }}>
                        <Grid container direction={'column'} spacing={1} justifyContent={'space-evenly'} alignItems='center'>
                            <Grid item xs={'auto'}>
                                <Avatar src={""} style={{ width: '5em', height: '5em' }} />
                            </Grid>
                            <Grid item xs={'auto'}>
                                <Typography className="text-center color-blue font-medium">{DataUser.FULLNAME}</Typography>
                                <Typography className="text-center">{DataUser.ROLE}</Typography>
                                <Typography className="text-center">{DataUser.}</Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="color-back" style={{ width: '100%', padding: '1em' }}>
                        <Typography className="text-center font-semibold">เมนู Administator</Typography>
                    </div>
                    <Box sx={{ overflowY: 'auto', padding: "10px 0" }}>
                        <ListHeadMenu
                            dataMenu={dataMenu}
                            sidebar={false}
                            setIsDrawerMenu={false}
                        />
                    </Box>
                </Box>
            </Drawer> */}
        </div>
    );
};

export default AppbarBack;