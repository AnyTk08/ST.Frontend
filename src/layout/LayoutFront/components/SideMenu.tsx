import React, { useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome } from "react-icons/fa";
import {AiOutlineFileSearch, AiFillSetting } from "react-icons/ai";
import { IoNewspaperOutline } from "react-icons/io5";
import { BsGraphUpArrow } from "react-icons/bs";
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

export const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.white,
        "&::before": {
            backgroundColor: theme.palette.common.white,
            border: "0px solid #999"
        }
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 18,
    },
}));


const SideMenu = (props) => {

    const location = useLocation();

    const { dataMenu = [] } = props;
    const isActiveCallBack = useCallback((sURL) => {
        let isActive = false;
        let pathCurrent = location?.pathname;
        if (pathCurrent) {
            isActive = (pathCurrent).includes(sURL.substring(0, 7))
        }

        return isActive;
    }, [location?.pathname])

    const renderIcon = (index) => {
        switch (index) {
            case "1":
                return (<FaHome />);
            case "2":
                return (<AiOutlineFileSearch />);
            case "20":
                return (<BsGraphUpArrow />);
            case "3":
                return (<IoNewspaperOutline />);
            case "4":
                return (<AiFillSetting />);

            default:
                return (<BsGraphUpArrow />);
        }
    };

    return (
        <div className="body-tools">
            <div className="main-nav">
                <ul className="menu">
                    {
                        dataMenu.length > 0 ?
                            <>
                                {
                                    dataMenu.map((itemHead, index) => {
                                        return (
                                            <li key={itemHead.sKey}>
                                                <LightTooltip title={itemHead.sMenuName} placement="right" arrow>
                                                    <Link
                                                        to={itemHead.sURL}
                                                        // className={({ isActive }) => isActive || isActiveCallBack(itemHead.sURL) ? "active" : "" }
                                                        className={`${isActiveCallBack(itemHead?.sURL) ? "active" : ""} `}
                                                    >
                                                        {renderIcon(itemHead.sKey)}
                                                    </Link>
                                                </LightTooltip>
                                            </li>
                                        )
                                    })
                                }
                            </>
                            : null
                    }
                </ul>
            </div>
        </div>
    )
}

export default SideMenu
