import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

// === ICON MUI ===
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import * as MuiIcons from '@mui/icons-material'
import { ManageAccountsRounded } from "@mui/icons-material";
import { Avatar, Collapse, Tooltip } from "@mui/material";
import { SidebarLabel, SidebarWrap, WrapIconMUI, WrapItemSubNav, WrapMenuContent } from "../SidebarStaticDropDown/Styled_Sidebar";

type SubNavProps = {
    sKey: any;
    dataMenu?: any;
    sidebar?: boolean;
    LayoutMin900?: boolean;
    fnShowSidebar?: VoidFunction | null;
    IsDrawerMenu?: any;
    setIsDrawerMenu?: any;
};

const ListSubMenu: React.FC<SubNavProps> = ({
    sKey,
    dataMenu,
    sidebar,
    fnShowSidebar,
    setIsDrawerMenu,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [subnav, setSubnav] = useState<boolean>(false);

    const showSubnav = (pathURL: string | undefined, dataMenu) => {
        // ถ้า Sidebar ปิดอยู่ให้เปิด / ถ้าเปิดอยู่แล้วมี SubNav ให้เปิด / ถ้าไม่มีเข้าลิ้ง
        // console.log("pathURL",pathURL);
        
        setSubnav(false);
        if(sidebar){
            if(fnShowSidebar){
                return  dataMenu?.lstChildren ? setSubnav(!subnav)   : GotoPath(pathURL);
            }
        }else{
            return fnShowSidebar
        }
        // sidebar
        //     ? fnShowSidebar && fnShowSidebar()
        //     : dataMenu?.lstChildren
        //         ? setSubnav(!subnav)
        //         : GotoPath(pathURL);

    };

    useEffect(() => {
        if (sidebar) {
            setSubnav(false);
        }
    }, [sidebar]);

    const GotoPath = (pathURL: string | any) => {
        
        if (pathURL) {
            navigate(pathURL)
            setSubnav(dataMenu?.lstChildren != null && dataMenu?.lstChildren.length > 0 ? true : false);
            if (setIsDrawerMenu) {
                setIsDrawerMenu(false)
            }
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
    };

    const IconRender = (name, nlevel) => {
        let JSXIcon = <ManageAccountsRounded />;
        if (name) {
            const Icon = MuiIcons[name]
            if (nlevel === 1) {
                JSXIcon = <Icon className="icon-1" />

            }
            else if (nlevel === 2) {
                JSXIcon = <Icon className="icon-2" />
            }
        }
        return JSXIcon;
    }

    return (
        <div style={{ padding: "0.2rem 1rem" }}>
            <CardActionArea
                sx={{
                    borderRadius: "10px",
                }}
            >
                {
                    dataMenu?.sURL ?
                        <Link to={dataMenu?.sURL || "#"} className="no-underline hover-white">
                            <Tooltip title={dataMenu?.sMenuName} placement="right">
                                <SidebarWrap
                                    onClick={() => showSubnav(dataMenu?.sURL, dataMenu)}
                                    activeurl={(location?.pathname).includes(dataMenu?.sURL) ? 1 : 0}
                                >
                                    <Avatar
                                        variant="rounded"
                                        style={{
                                            margin: '8px',
                                            width: '30px',
                                            height: '30px',
                                            backgroundColor: dataMenu?.sURL === location?.pathname ? "#3f6ad8" : "#778a9c"
                                        }}
                                    >

                                        <WrapIconMUI>
                                            {dataMenu?.sIcon ? IconRender(dataMenu?.sIcon, 1) : <ManageAccountsRounded className="icon-1" />}
                                        </WrapIconMUI>
                                    </Avatar>
                                    <SidebarLabel sidebar={sidebar ? 1 : 0}>
                                        <WrapMenuContent subnav={subnav ? 1 : 0}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: dataMenu?.sURL === location?.pathname ? "#ffffff" : '#000000',
                                                    '&:hover': {
                                                        color: "#ffffff"
                                                    },
                                                }}
                                            >
                                                {dataMenu?.sMenuName}
                                            </Typography>
                                            {dataMenu?.lstChildren != null && dataMenu?.lstChildren.length > 0 ?
                                                <KeyboardArrowDownIcon
                                                    className={"rotate-Icon"}
                                                    sx={{ mr: "1rem", transition: "transform 250ms" }}
                                                />
                                                : null}
                                        </WrapMenuContent>
                                    </SidebarLabel>
                                </SidebarWrap>
                            </Tooltip>
                        </Link>
                        :
                        <Tooltip title={dataMenu?.sMenuName} placement="right" disableHoverListener={!sidebar}>
                            <SidebarWrap
                                onClick={() => showSubnav(dataMenu?.sURL, dataMenu)}
                                activeurl={dataMenu?.sURL === location?.pathname ? 1 : 0}
                            >
                                <Avatar
                                    variant="rounded"
                                    style={{
                                        margin: '8px',
                                        width: '30px',
                                        height: '30px',
                                        backgroundColor: dataMenu?.sURL === location?.pathname ? "#1e90ff" : "#778a9c"
                                    }}>
                                    <WrapIconMUI>
                                        {dataMenu?.sIcon ? IconRender(dataMenu?.sIcon, 1) : <ManageAccountsRounded />}
                                    </WrapIconMUI>
                                </Avatar>
                                <SidebarLabel sidebar={sidebar ? 1 : 0}>
                                    <WrapMenuContent subnav={subnav ? 1 : 0}>
                                        <Typography
                                            className="hover-white"
                                            variant="subtitle1"
                                            sx={{
                                                color: dataMenu?.sURL === location?.pathname ? "#ffffff" : '#000000',
                                                '&:hover': {
                                                    color: "#ffffff"
                                                },
                                            }}
                                        >
                                            {dataMenu?.sMenuName}
                                        </Typography>
                                        {dataMenu?.lstChildren && (
                                            <KeyboardArrowDownIcon
                                                className={"rotate-Icon"}
                                                sx={{ mr: "1rem", transition: "transform 250ms" }}
                                            />
                                        )}
                                    </WrapMenuContent>
                                </SidebarLabel>
                            </SidebarWrap>
                        </Tooltip>
                }
            </CardActionArea>
            <Collapse in={subnav} timeout="auto" unmountOnExit style={{ width: '100%', paddingLeft: "18px" }}>
                {
                    dataMenu?.lstChildren?.map((item, idx) => {
                        return (
                            <div key={item.sMenuID + "" + item.index} style={{ width: "100%" }}>
                                <CardActionArea
                                    className="Sub-Card"
                                    sx={{
                                        borderRadius: "10px",
                                        margin: '4px 0',
                                        color: item?.sURL === location?.pathname ? "#ffffff" : '#000000',
                                        '&:hover': {
                                            color: "#ffffff !important"
                                        },
                                    }}
                                >
                                    <Link to={item.sURL} className="no-underline hover-white">
                                        <WrapItemSubNav
                                            onClick={() => GotoPath(item.sURL)}
                                            activeurl={item.sURL === location?.pathname ? 1 : 0}
                                        >
                                            <WrapIconMUI>
                                                {item.sIcon ? IconRender(item.sIcon, 2) : <ManageAccountsRounded />}
                                            </WrapIconMUI>
                                            <WrapMenuContent>
                                                <Typography
                                                    component="div"
                                                    sx={{
                                                        color: item?.sURL === location?.pathname ? "#ffffff" : '#000000',
                                                        '&:hover': {
                                                            color: "#ffffff !important"
                                                        },
                                                    }}
                                                >
                                                    {item.sMenuName}
                                                </Typography>
                                            </WrapMenuContent>
                                        </WrapItemSubNav>
                                    </Link>
                                </CardActionArea>
                            </div>
                        );
                    })
                }
            </Collapse>
        </div >
    );
};

export default ListSubMenu;
