/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { AutoBreadcrumbUIProp, BreadcrumbItemData } from './BreadcrumbsBar'
import "./Breadcrumbs.css"
import { AxiosGet } from 'utilities/ST_Axios';
import { useMediaQuery } from '@mui/material';
import { ManageAccountsRounded } from "@mui/icons-material";
import * as MuiIcons from '@mui/icons-material'
import { IsEmpty } from 'utilities/ST_Function';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const BreadcrumbAuto = (props: AutoBreadcrumbUIProp) => {


    const { maxItems = 2 } = props;

    const matches900 = useMediaQuery('(min-width:900px)');

    const [arrBreadCrumb, setArrBreadCrumb] = useState<Array<BreadcrumbItemData>>([]);

    useEffect(() => {
        GetBreadCrumb();
    }, [window.location.pathname])

    const GetBreadCrumb = () => {
        let sRoute = window.location.pathname.replace("/", "").toLocaleLowerCase();
        let sPageMode = window.location.search == "" ? "Add" : "Edit";
        let arrBreadCrumb: Array<BreadcrumbItemData> = [];

        AxiosGet('APISystems/GetBreadCrumb', { sRoute: sRoute }, (Result) => {
            let lstBremcrumb = Result.lstBremcrumb;
            if (lstBremcrumb) {
                lstBremcrumb.forEach((Item) => {
                    if (Item.ItemName) {
                        let sItemRoute = Item.sURL != null ? Item.sURL.toLocaleLowerCase() : "";
                        let ItemNameEmpty = (IsEmpty(Item.ItemName) ? sPageMode : Item.ItemName);
                        let ItemDisplay = (Item.IsDisplay ? Item.ItemName : ItemNameEmpty)
                        arrBreadCrumb.push({
                            Key: Item.Key,
                            sIcon: Item.sIcon,
                            ItemName: sItemRoute != sRoute ? Item.ItemName : ItemDisplay,
                            IsOnClick: sItemRoute != sRoute && (sItemRoute != "" ? true : false),
                            Href: Item.sURL
                        })
                    }
                });
                setArrBreadCrumb(arrBreadCrumb);
            }
            else {
                arrBreadCrumb.push({
                    Key: "",
                    sIcon: "",
                    ItemName: "",
                    IsOnClick: false,
                    Href: ""
                })
                setArrBreadCrumb(arrBreadCrumb);
            }
        });
    };

    const IconRender = (name) => {
        const Icon = MuiIcons[name]
        return  name != null ? 
            (
                <Icon sx={{ mr: 0.5 }} />
            )
            :
            (
                <ManageAccountsRounded sx={{ mr: 0.5 }} />
            )
    };


    return (
        <div className='Divbreadcrumb' >
            <Breadcrumbs
                maxItems={!matches900 ? maxItems : 4}
                separator={<ArrowRightIcon fontSize="small" />}
                aria-label="breadcrumb"
                style={{ color: "#fff" }}
            >
                {
                    arrBreadCrumb.map((m, i) => (
                        m.IsOnClick ?
                            <Link
                                key={`BreadcrumbAuto_`+ m.Key}
                                // underline="hover"
                                color="inherit"
                                className={arrBreadCrumb.length == i + 1 ? 'underline-on-hover-b disabled-link' : 'underline-on-hover-b'}
                                to={m.Href}
                                // to={ sDefualtBoxItem && sItemType ? "#" : m.Href}
                                // onClick={() => {
                                //     if (sDefualtBoxItem && sItemType) {
                                //         navigate(`/admin-standard`, {
                                //             state: {
                                //                 sDefualtBoxItem: sDefualtBoxItem,
                                //                 sItemType: sItemType,
                                //                 IsCheckBox: true
                                //             }
                                //         });
                                //     }
                                // }}
                                style={{
                                    display: 'flex'
                                }}
                            >
                                {IconRender(m?.sIcon)}
                                {matches900 && <Typography className='underline-on-hover-b'>{m.ItemName}</Typography>}
                            </Link>
                            :
                            <div key={`BreadcrumbAuto_${m.Key}`} style={{ display: 'flex' }}>
                                {IconRender(m?.sIcon)}
                                {matches900 && <Typography className='underline-on-hover-b'>{m.ItemName}</Typography>}
                            </div>
                    ))

                }
            </Breadcrumbs>
        </div>
    )
};
export default BreadcrumbAuto;
