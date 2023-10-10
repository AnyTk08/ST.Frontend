/* eslint-disable eqeqeq */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Avatar,
    Collapse,
    IconButton,
    Tooltip,
    Typography,
    useMediaQuery,
    Grid
} from "@mui/material";
import LogoPTT from "../../assets/images/Logo/logo-ptt.png";
import "./custom.css"
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { AxiosGet } from "utilities/ST_Axios";
import { LstMenu } from "layout/ILayout";
import { useNavigate, useLocation, Link } from "react-router-dom";
import * as MuiIcons from '@mui/icons-material'
import { ManageAccountsRounded } from "@mui/icons-material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import BreadcrumbAuto from "components/Breadcrumbs/BreadcrumbAuto";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { LightTooltip } from "layout/LayoutFront/components/SideMenu";
import CachedIcon from '@mui/icons-material/Cached';
import secureLocalStorage from "react-secure-storage";
import { FnDialog } from "utilities/ST_Function";
import i18n from "config/i18nConfig";
import jwt_decode from "jwt-decode";
import { AuthToken } from "config/AxiosConfig";
import { AlertMsg } from "config/AlertMsgConfig";
import ChangeUserGroup from "view/Authen/ChangeUserGroup";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const drawerWidth = 250;
const drawerWidthMini = 64;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(8)} + 0px)`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    ...(!open && {
        marginLeft: drawerWidthMini,
        width: `calc(100% - ${drawerWidthMini}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


type Props = {
    children?: React.ReactNode;
};

const LayoutBack2: React.FC<Props> = ({ children }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const DialogFn = FnDialog();

    const Layout630 = useMediaQuery('(min-width:630px)');
    const Layout1040 = useMediaQuery('(min-width:1040px)');
    const Layout1200 = useMediaQuery('(min-width:1200px)');
    const [isOpenGroup, setisOpenGroup] = useState(false)
    const [arrOptionGroup, setarrOptionGroup] = React.useState([] as any)

    const [dataMenu, setDataMenu] = useState<LstMenu[]>([]);
    const [subnav, setSubnav] = useState<boolean>(false);
    const [, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const [pathActive, setPathActive] = useState("abc")
    const [sHeadMenu, setsHeadMenu] = useState("")
    const [DataUser, setDataUser] = useState({
        "ALT": "",
        "FULLNAME": "",
        "ROLE": "",
        "UNITNAME": "",
        "PATHIMAGE": "",
    })
    const [open, setOpen] = React.useState(Layout1040);
    const isActiveMemo = useMemo(() => {
        const arrIsOpen = ["/admin-roleuser", "/admin-group", "/admin-user", "/admin-groupform", "/admin-roleuserform", "/admin-user-form"];

        let isActive = false;
        let pathCurrent = location?.pathname;
        if (pathCurrent) {
            isActive = arrIsOpen.includes(location?.pathname)
        }
        return isActive;
    }, [location?.pathname])

    useEffect(() => {
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
        GetMenuSystem()
    }, [])

    const GetMenuSystem = () => {
        AxiosGet('APISystems/GetMenuSystem', { IsFront: false }, (Result) => {
            setDataMenu(Result.lstMenu ?? [])
            setsHeadMenu(Result.sHeadMenu ?? "")
        });
    };

    const isActiveCallBack = useCallback((sURL, IsMain) => {
        let isActive = false;
        let pathCurrent = location?.pathname;
        if (pathCurrent) {
            isActive = (pathCurrent).includes(sURL.substring(0, 12))
        }
        return isActive;
    }, [location?.pathname])

    const IconRender = (name, nlevel) => {
        let JSXIcon = <ManageAccountsRounded />;
        if (name) {
            const Icon = MuiIcons[name]
            if (nlevel === 1 || nlevel === 2) {
                JSXIcon = <Icon />
            }
        }
        return JSXIcon;
    }

    const onHandleLogout = () => {
        setAnchorEl(null);
        DialogFn.Submit(i18n.t("msgConfirmLogout"), () => {
            DialogFn.CloseSubmit()
            secureLocalStorage.clear();
            navigate("/");
        });
    }

    const getInitOption = () => {
        AxiosGet('Authen/GetGroupuser', null, (result) => {
            setarrOptionGroup(result.lstOptionGroup ?? [])
        });

    };

    //#region 
    useEffect(() => {
        getInitOption();
    }, [])



    useEffect(() => {
        let sPath = window.location.pathname + "";
        AxiosGet(`Authen/GetUserPermission`, { sRoute: sPath }, (res) => {
            if (res.nPermission != 2 && res.nPermission != 1) {
                DialogFn.Warning(AlertMsg.NoPermission);
                navigate(`/homebanner`);
            }
        })

    }, [window.location.pathname])
    //#endregion

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <AppBar className="appbar-glass" position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            aria-label="delete"
                            onClick={() => { setOpen(!open) }}
                            edge="start"
                            style={{
                                position: 'absolute',
                                top: 10,
                                left: -11,
                                backgroundColor: '#181365'
                            }}
                        >
                            <MenuRoundedIcon style={{ color: 'white' }} />
                        </IconButton>
                        <Grid container justifyContent={"space-between"} alignItems='center'  >
                            <Grid item xs={'auto'}>
                                <Grid container alignItems='center' sx={{ flexGrow: 1 }} >
                                    <Grid item xs={'auto'}>
                                        <Link to="/homebanner" preventScrollReset={true}>
                                            <Box
                                                component="div"
                                                className="img-ptt"
                                                sx={{
                                                    backgroundImage: `url(${LogoPTT})`,

                                                }}
                                            />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={'auto'}>
                                        <Typography style={{ lineHeight: "0.9" }}>
                                            <span className="color-blue text-prj1" style={{ display: "flex", marginTop: Layout630 ? "" : "6px" }}>
                                                CRSR
                                            </span>
                                            <span className="color-blue text-prj2" style={{ display: Layout630 ? "" : "none" }}>
                                                Community Database & Performance Dashboard
                                            </span>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={'auto'}>
                                <Grid container spacing={2} alignItems='center' >
                                    <Grid item xs={'auto'} style={{ display: Layout1040 ? "" : "none" }}>
                                        <Avatar src={DataUser.PATHIMAGE} alt={DataUser.ALT} sx={{ width: 32, height: 32 }} />
                                    </Grid>
                                    <Grid item xs={'auto'} style={{ display: Layout1200 ? "" : "none" }}>
                                        <Grid container justifyContent={"center"} alignItems='center' >
                                            <Grid item xs={12} style={{ lineHeight: '20px', color: '#181365' }}>
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
                    </Toolbar>
                </AppBar>
                <Drawer
                    id="layout"
                    variant="permanent"
                    open={open}
                    sx={{
                        ".MuiDrawer-paper": {
                            background: 'linear-gradient(360deg, #0048bd, #44a7fd) !important',
                            borderRight: "0px"
                        }
                    }}
                >
                    <div style={{ width: '100%', padding: '1.4em 1em', display: 'flex', position: 'relative' }}>
                        <Grid container direction={'column'} spacing={1} justifyContent={'space-evenly'} alignItems='center' style={{ display: open ? 'flex' : 'none' }}>
                            <Grid item xs={'auto'}>
                                <Avatar src={DataUser.PATHIMAGE} alt={DataUser.ALT} style={{ width: '5em', height: '5em' }} />
                            </Grid>
                            <Grid item xs={'auto'} style={{ color: 'white' }}>
                                <Typography className="text-center font-medium">{DataUser.FULLNAME}</Typography>
                                <Typography className="text-center">{DataUser.ROLE}</Typography>
                                <Typography className="text-center">{DataUser.UNITNAME}</Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="color-back" style={{ width: '100%', padding: '0.5em', display: open ? 'block' : 'none' }}>
                        <Typography className="text-center font-semibold">{sHeadMenu}</Typography>
                    </div>
                    <Box
                        sx={{
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            padding: open ? "10px 0" : "107px 0",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            height: '100%',
                            width: open ? '250px' : '64px'
                        }}
                    >
                        {
                            dataMenu && dataMenu.length > 0 ?
                                <>
                                    {
                                        dataMenu.map((dataMenu, index) => {
                                            if (dataMenu?.lstChildren != null && dataMenu?.lstChildren.length > 0) {
                                                return (
                                                    <div key={dataMenu.sKey} className="dropdown" onClick={() => { setSubnav(!subnav) }}>
                                                        <LightTooltip title={dataMenu.sMenuName} placement="right" arrow>
                                                            <div
                                                                className={`no-underline dropbtn`}
                                                                style={{ paddingLeft: open ? '30px' : '12px' }}
                                                            >
                                                                {dataMenu.sIcon ? IconRender(dataMenu.sIcon, 1) : <ManageAccountsRounded />}
                                                                <Typography sx={{ opacity: open ? 1 : 0, marginLeft: '5px' }}>{open ? dataMenu.sMenuName : ""}</Typography>
                                                                {
                                                                    subnav || isActiveMemo ?
                                                                        <KeyboardArrowUpRoundedIcon
                                                                            className={"rotate-Icon"}
                                                                            sx={{ mr: "1rem", transition: "transform 250ms" }}
                                                                        />
                                                                        :
                                                                        <KeyboardArrowDownIcon
                                                                            className={"rotate-Icon"}
                                                                            sx={{ mr: "1rem", transition: "transform 250ms" }}
                                                                        />
                                                                }
                                                            </div>
                                                        </LightTooltip>
                                                        <Collapse in={subnav || isActiveMemo} timeout="auto" unmountOnExit style={{ width: '100%', paddingLeft: open ? "36px" : '0px' }}>
                                                            {
                                                                dataMenu?.lstChildren?.map((item) => {
                                                                    return (
                                                                        <LightTooltip key={item.sKey} title={item.sMenuName} placement="right" arrow>
                                                                            <Link
                                                                                to={item.sURL}
                                                                                preventScrollReset={true}
                                                                                className={`${isActiveCallBack(item?.sURL, false) ? "menu-active" : ""} no-underline `}
                                                                            >
                                                                                <span className={`${isActiveCallBack(item?.sURL, false) ? "menu-active-after" : ""} no-underline `}></span>
                                                                                <span className={`${isActiveCallBack(item?.sURL, false) ? "menu-active-before" : ""} no-underline `}></span>
                                                                                {item.sIcon ? IconRender(item.sIcon, 1) : <ManageAccountsRounded />}
                                                                                <Typography sx={{ opacity: open ? 1 : 0 }}>{open ? item.sMenuName : ""}</Typography>
                                                                            </Link>
                                                                        </LightTooltip>

                                                                    );
                                                                })
                                                            }
                                                        </Collapse>
                                                    </div>
                                                );
                                            }
                                            else {
                                                return (
                                                    <LightTooltip key={dataMenu.sKey} title={dataMenu.sMenuName} placement="right" arrow>
                                                        <Link
                                                            to={dataMenu.sURL}
                                                            preventScrollReset={true}
                                                            style={{ paddingLeft: open ? '30px' : '12px' }}
                                                            className={`${isActiveCallBack(dataMenu?.sURL, true) ? "menu-active" : ""} no-underline `}
                                                        >
                                                            <span className={`${isActiveCallBack(dataMenu?.sURL, true) ? "menu-active-after" : ""} no-underline `}></span>
                                                            <span className={`${isActiveCallBack(dataMenu?.sURL, true) ? "menu-active-before" : ""} no-underline `}></span>
                                                            {dataMenu.sIcon ? IconRender(dataMenu.sIcon, 1) : <ManageAccountsRounded />}
                                                            <Typography sx={{ opacity: open ? 1 : 0 }}>{open ? dataMenu.sMenuName : ""}</Typography>
                                                        </Link>
                                                    </LightTooltip>
                                                )
                                            }

                                        })
                                    }
                                </>
                                :
                                null
                        }
                    </Box>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1 }}>
                    <DrawerHeader />
                    <div className="box-child">
                        <Grid container justifyContent={'center'} alignItems={'start'} >
                            <Grid item xs={12} style={{ margin: "6px 12px" }}>
                                <BreadcrumbAuto />
                            </Grid>
                            <Grid item xs={12} style={{ margin: "6px 12px", minHeight: '80vh' }}>
                                {children}
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </Box>
            <ChangeUserGroup
                isOpen={isOpenGroup}
                setIsOpen={setisOpenGroup}
                arrOptionGroup={arrOptionGroup}
            />
        </>
    )
}

export default LayoutBack2;
