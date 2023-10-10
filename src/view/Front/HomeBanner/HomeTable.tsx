import React ,{ useEffect, useState } from "react";
import { Grid, Typography, } from "@mui/material";
import DataGridMui, { PaginationInterface, initRows } from "components/DataGrid";
import CardFrom from "components/CardContent/CardFrom";
import { FnDialog } from "utilities/ST_Function";
import { useNavigate } from "react-router-dom";
import { BtnViewDataOnTable } from "components/Button";
import { GetBannerSwiper, GetDataHomeBannerTable } from "./CallAPI";
import CardSDG from "./CardSDG/CardSDG";
import BannerSile from "./Banner/BannerSile";
import i18n from "config/i18nConfig";
import { TypeModeBtn } from "components/enum/enumSystem";

export default function HomeTable() {
    //#region variable
    const DialogFn = FnDialog();
    const [loadingTable, setLoadingTable] = useState<boolean>(false);
    const navigate = useNavigate();
    const [dataRow, setDataRow] = useState<PaginationInterface>({
        ...initRows,
    });
    const [lstDataBanner, setLstDataBanner] = useState<any>([]);
    //#endregion
    const dataColumn: any = [
       
        {
            field: "Button (เพิ่ม/แก้ไข)",
            align: "center",
            type: "actions",
            resizable: false,
            sortable: false,
            width: 60,
            getActions: (item) => {
                return [
                    item.row.IsView === true ?
                        <>
                            <BtnViewDataOnTable
                                id={`viewDataOnTableHomeTable_${item.row.sID}`}
                                key={"preview"}
                                onClick={() => goToEdit(item.row.nProjectID, TypeModeBtn.ViewProject, item.row.nAreaID, item.row.nRequestTypeID) } 
                            />
                        </>
                    :
                    <></>                    
                ]
            }
        },
        {
            field: "No",
            headerName: `${i18n.t("HomeTable.sNo")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            width: 50,
            isHeadMobile: true,
            resizable: false
        },
        {
            field: "sProjectName",
            headerName: `${i18n.t("HomeTable.sProjectName")}`,
            headerAlign: "center",
            align: "left",
            sortable: false,
            flex: 2,
            resizable: false
        },
        {
            field: "sAreaName",
            headerName: `${i18n.t("HomeTable.sAreaName")}`,
            headerAlign: "center",
            align: "left",
            sortable: false,
            flex: 2,
            resizable: false
        },
        {
            field: "sAreaTypeName",
            headerName: `${i18n.t("HomeTable.sAreaTypeName")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            width: 100,
            resizable: false
        },
        {
            field: "sAgencyName",
            headerName: `${i18n.t("HomeTable.sAgencyName")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            width: 140,
            resizable: false
        },
        {
            field: "sProjectBudget",
            headerName: `${i18n.t("HomeTable.sProjectBudget")}`,
            headerAlign: "center",
            align: "right",
            sortable: false,
            flex: 1,
            resizable: false
        },
        {
            field: "sUpdate",
            headerName: `${i18n.t("HomeTable.sLastUpdate")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            flex: 1,
            resizable: false
        },

    ];

    const goToEdit = (nProjectID, sModeBtn, nAreaID, nRequestTypeID) => {

        navigate(`/project-report`,
            {
                state:
                {
                    nProjectID: nProjectID,
                    nAreaID: nAreaID,
                    sModeBtn: sModeBtn,
                    nRequestTypeID: nRequestTypeID,
                }
            }
        );
    };

    const loadData = (p: PaginationInterface) => {
        setLoadingTable(true);
        GetDataHomeBannerTable(p, (result) => {
            setLoadingTable(false);
            setDataRow({
                ...p,
                arrRows: result.lstDataBanner ?? [],
            });
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        });
    }
    useEffect(() => {
        loadData(dataRow);
        onGetBanner();
    }, []);


    //#region OnGetBanner
    const onGetBanner = () => {
        GetBannerSwiper({}, (result) => {
            setLstDataBanner(result.lstBanner ?? []);
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        });
    };
    //#endregion
    return (
        <React.Fragment>
            <Grid container spacing={2} >
                <Grid item container spacing={3}>
                    <Grid item xs={12} md={7} style={{ position: "relative" }}>
                        <Grid item xs={12} md={12} style={{ marginBottom: '5%' }}>
                            <BannerSile lstData={lstDataBanner} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <CardSDG />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <CardFrom>
                        <Grid container spacing={2} justifyContent={"flex-start"} padding={"0 1rem"}>
                            <Grid item xs={12} >
                                <Typography style={{ fontSize: '4em', color: '#0E2B6D', marginTop: '-0.25em', marginLeft: '-0.1em' }}>10</Typography>
                                <Typography style={{ fontSize: '2em', color: '#0E2B6D', fontWeight: 600, marginLeft: '1.3em', marginTop: '-2.45em' }}>PROJECT</Typography>
                                <Typography style={{ fontSize: '1.5em', color: '#0E2B6D', fontWeight: 300, marginTop: '-1em', marginLeft: '1.75em' }}>LAST UPDATE</Typography>
                            </Grid>
                            <Grid item xs={12} ></Grid>
                            <Grid item xs={12} style={{ marginTop: '-25px' }}>
                                <DataGridMui
                                    columns={dataColumn}
                                    isShowCheckBox={false}
                                    rows={dataRow}
                                    isShowColomnTool={false}
                                    isLoading={loadingTable}
                                    isNotShowTotal={true}
                                    isNotShowPagination={true}
                                    isHideFooter={true}
                                    onLoadData={loadData}
                                    isHiddenToolHead={true}
                                />
                            </Grid>
                        </Grid>
                    </CardFrom>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

