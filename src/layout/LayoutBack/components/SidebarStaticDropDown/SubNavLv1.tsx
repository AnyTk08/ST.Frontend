import React, { useState, useEffect, useRef } from "react";
import { IdataMenuType } from "./SidebarStaticDropDown";
import { useLocation, Link } from "react-router-dom";

// === Styled ===
import {
  SidebarLabel,
  SidebarWrap,
  WrapMenuContent,
  WrapItemSubNav,
  WrapIconMUI,
  WrapSubIconMUI,
} from "./Styled_Sidebar";

// === ICON MUI ===
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchIcon from "@mui/icons-material/Search";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";

import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import * as MuiIcons from '@mui/icons-material'
import { ManageAccountsRounded } from "@mui/icons-material";
import { Collapse, Tooltip } from "@mui/material";
// ====== MAPPING_ICON ======
const IconMUI_list = [
  {
    sIcon: "HomeRoundedIcon",
    icon: <HomeRoundedIcon />,
  },
  {
    sIcon: "SearchIcon",
    icon: <SearchIcon />,
  },
  {
    sIcon: "BorderColorRoundedIcon",
    icon: <BorderColorRoundedIcon />,
  },
  {
    sIcon: "AccountBoxRoundedIcon",
    icon: <AccountBoxRoundedIcon />,
  },
  {
    sIcon: "ListAltIcon",
    icon: <ListAltIcon />,
  },
  {
    sIcon: "DashboardOutlinedIcon",
    icon: <DashboardOutlinedIcon />,
  },
  {
    sIcon: "ManageAccountsRoundedIcon",
    icon: <ManageAccountsRoundedIcon />,
  },
  {
    sIcon: "ArrowForwardIosRoundedIcon",
    icon: <ArrowForwardIosRoundedIcon />,
  },
];

type SubNavProps = {
  dataMenu?: IdataMenuType;
  sidebar?: boolean;
  fnShowSidebar?: VoidFunction | null;
};

const SubNavLv1: React.FC<SubNavProps> = ({
  dataMenu,
  sidebar,
  fnShowSidebar,
}) => {
  const location = useLocation();
  const [subnav, setSubnav] = useState<boolean>(false);
  const [PathBooKing] = useState(["/backend/onsite_booking_create", "/backend/online_booking_create", "/backend/FastTrack_Create","/backend/Booking_Visitor_Create"])
  const divSubnav = useRef<HTMLDivElement>(null);

  const showSubnav = (pathURL: string | undefined, dataMenu) => {
    // ถ้า Sidebar ปิดอยู่ให้เปิด / ถ้าเปิดอยู่แล้วมี SubNav ให้เปิด / ถ้าไม่มีเข้าลิ้ง
    if(sidebar){
      if(fnShowSidebar){
          return  dataMenu?.lstChildren ? setSubnav(!subnav)   : GotoPath(pathURL);
      }
  }else{
      return fnShowSidebar
  }
    // sidebar
    //   ? fnShowSidebar && fnShowSidebar()
    //   : dataMenu?.subNav
    //     ? setSubnav(!subnav)
    //     : GotoPath(pathURL);
    if ((dataMenu.nMenuID == 10 || dataMenu.nMenuID == 9) && subnav == false) {
      setTimeout(() => {
        var divTop = document.getElementById("ABC") as HTMLDivElement
        if (divTop) {
          let nAdd = dataMenu.nMenuID == 9 ? 0 : 550
          window.scrollTo({ behavior: 'smooth', top: divTop.offsetTop+nAdd })
        }
      }, 400);
    }
  };

  useEffect(() => {
    if (sidebar) {
      setSubnav(false);
    }
  }, [sidebar]);

  const GotoPath = (pathURL: string | any) => {
    if (pathURL) {
      // navigate(pathURL)
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const IconRender = (name) => {
    const Icon = MuiIcons[name]
    return name != null ? <Icon /> : <ManageAccountsRounded />
  }

  return (
    <>
      <CardActionArea>
        {dataMenu?.sMenuLink ?
          <Link to={dataMenu?.sMenuLink || "#"} >
            <Tooltip title={dataMenu?.sMenuNameTH} placement="right" disableHoverListener={!sidebar}>
              <SidebarWrap
                onClick={() => showSubnav(dataMenu?.sMenuLink,dataMenu)}
                activeurl={(dataMenu?.sMenuLink === location?.pathname) || (dataMenu?.sMenuLink === "/backend/B_BookingList" && (PathBooKing.indexOf(location?.pathname) !== -1)) || (dataMenu?.sMenuLink === "/backend" && location?.pathname === "/backend/booking_reviewdoc") ? 1 : 0}
                // activeurl={dataMenu?.sMenuLink === location?.pathname ? 1 : 0}
              >
                <WrapIconMUI>
                  {IconRender(dataMenu?.sIcon)}
                </WrapIconMUI>
                <SidebarLabel sidebar={sidebar ? 1 : 0}>
                  <WrapMenuContent subnav={subnav ? 1 : 0}>
                    <Typography variant="subtitle1">
                      {dataMenu?.sMenuNameTH}
                    </Typography>
                    {dataMenu?.lstSubMenu && (
                      <KeyboardArrowDownIcon
                        className={"rotate-Icon"}
                        sx={{ mr: "1rem", transition: "transform 250ms" }}
                      />
                    )}
                  </WrapMenuContent>
                </SidebarLabel>
              </SidebarWrap>
            </Tooltip>
          </Link>
          :
          <Tooltip title={dataMenu?.sMenuNameTH} placement="right" disableHoverListener={!sidebar}>
            <SidebarWrap
              onClick={() => showSubnav(dataMenu?.sMenuLink,dataMenu)}
              activeurl={(dataMenu?.sMenuLink === location?.pathname) || (dataMenu?.sMenuLink === "/backend/B_BookingList" && (PathBooKing.indexOf(location?.pathname) !== -1)) ? 1 : 0}
            >
              <WrapIconMUI>
                {IconRender(dataMenu?.sIcon)}
              </WrapIconMUI>
              <SidebarLabel sidebar={sidebar ? 1 : 0}>
                <WrapMenuContent subnav={subnav ? 1 : 0}>
                  <Typography variant="subtitle1">
                    {dataMenu?.sMenuNameTH}
                  </Typography>
                  {dataMenu?.lstSubMenu && (
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
      <div id={"ABC"} ref={divSubnav} style={{width:'100%',height:'2px'}}></div>
      <Collapse in={subnav} timeout="auto" unmountOnExit style={{width:'100%'}}>
      {
        dataMenu?.lstSubMenu?.map((item) => {
          return (
            <div id={`tab_menu_${item?.nMenuID.toString()}`} key={item?.nMenuID} style={{ width: "100%" }}>
              <CardActionArea>
                <Link to={item?.sMenuLink || "#"}>
                  <WrapItemSubNav 
                    onClick={() => GotoPath(item?.sMenuLink)} 
                    // className={item?.sMenuLink.substring(0, 30).toLowerCase() === location?.pathname.substring(0, 30).toLowerCase() ? "activeMenu" : ""}
                  >
                    {IconMUI_list.some((f) => f.sIcon === item?.sIcon) && (
                      <WrapSubIconMUI>
                        {
                          IconMUI_list.find((f) => f.sIcon === item?.sIcon)
                            ?.icon
                        }
                      </WrapSubIconMUI>
                    )}
                    <WrapMenuContent>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        component="div"
                        sx={{ pt: "7px" }}
                      >
                        {item?.sMenuNameTH}
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
    </>
  );
};

export default SubNavLv1;
