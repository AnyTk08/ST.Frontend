import React , { useEffect, useState }  from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import * as yup from "yup";
import DataGridMui, { PaginationInterface, initRows } from "components/DataGrid";
import { DateTimeToString, FnDialog } from "utilities/ST_Function";
import { useLocation, useNavigate } from "react-router-dom";
import {  BtnClear, BtnSearch, BtnViewDataOnTable } from "components/Button";
import { DateRangePickerFrom, SelectFormItem, SelectMultipleFormItem, TextBoxForm } from "components/Input";
import { GetDataSDGTable, GetInitData } from './CallAPI';
import i18n from "config/i18nConfig";
import { TypeModeBtn } from "components/enum/enumSystem";

export default function SDG_List() {
    //#region variable
    const DialogFn = FnDialog();
    const [loadingTable, setLoadingTable] = useState(false);
    const [lstAgency, setlstAgency] = useState<any>([]);
    const [lstSDGs, setlstSDGs] = useState<any>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [sSDGID] = useState(location?.state ? location.state["sSDGID"] : null)
    const [dataRow, setDataRow] = useState<PaginationInterface>({
        ...initRows,
        sSortExpression: "dUpdate",
        sSortDirection: "desc"
    });
    //#endregion

    const schema = yup.object().shape({});
    const formResolver = yupResolver(schema);
    const form = useForm({
        resolver: formResolver,
        shouldUnregister: false,
        shouldFocusError: true,
        mode: "all"
    });

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
                                id={`viewDataOnTableSDG_${item.row.sID}`}
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
            headerName: `${i18n.t("SDGTable.sNo")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 50,
            isHeadMobile: true
        },
        {
            field: "sProjectName",
            headerName: `${i18n.t("SDGTable.sProjectName")}`,
            headerAlign: "center",
            align: "left",
            sortable: true,
            resizable: false,
            flex: 2
        },
        {
            field: "sAreaName",
            headerName: `${i18n.t("SDGTable.sAreaName")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 2
        },
        {
            field: "sAreaTypeName",
            headerName: `${i18n.t("SDGTable.sAreaTypeName")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            width: 100
        },
        {
            field: "sAgencyName",
            headerName: `${i18n.t("SDGTable.sAgencyName")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            width: 140
        },
        {
            field: "sProjectBudget",
            headerName: `${i18n.t("SDGTable.sProjectBudget")}`,
            headerAlign: "center",
            align: "right",
            sortable: true,
            resizable: false,
            flex: 1
        },
        {
            field: "sUpdate",
            headerName: `${i18n.t("SDGTable.sLastUpdate")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 1
        }
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

    const OnGetData = async () => {
        DialogFn.BlockUI();
        await GetInitData({}, (res) => {
            DialogFn.UnBlockUI();
            setlstAgency(res.lstAgency ?? [])
            setlstSDGs(res.lstSDGs ?? []);
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        });
    };

    const loadData = (p: PaginationInterface) => {

        let dStart = null;
        if (form.getValues("DateStart")) {
            dStart = DateTimeToString(form.getValues("DateStart"), "YYYY-MM-DD")
        }
        let dEnd = null;
        if (form.getValues("DateEnd")) {
            dEnd = DateTimeToString(form.getValues("DateEnd"), "YYYY-MM-DD")
        }
        let param = {
            ...p,
            sSDGID: form.getValues("sSDGID") ?? null,
            sProjectName: form.getValues("sProjectName") ?? null,
            sAreaName: form.getValues("sAreaName") ?? null,
            lstAgency: form.getValues("nAgencyID") ?? [],
            sStart: dStart ?? "",
            sEnd: dEnd ?? "",
        };
        setLoadingTable(true);
        DialogFn.BlockUI();
        GetDataSDGTable(
            param
            , (result) => {
                DialogFn.UnBlockUI();
                setLoadingTable(false);
                setDataRow({
                    ...p,
                    arrRows: result.lstData ?? [],
                    nDataLength: result.nDataLength,
                    nPageIndex: result.nPageIndex,
                });
            }, (err) => {
                if (!err.response) {
                    DialogFn.Warning(err.Message);
                }
            });
    };
    const onClearData = () => {
        form.setValue("DateStart", "");
        form.setValue("DateEnd", "");
        form.setValue("sAreaName", "");
        form.setValue("sProjectName", "");
        form.setValue("nAgencyID", null);
        form.setValue("sSDGID", sSDGID);
        form.clearErrors("sSDGID");
        form.clearErrors("DateStart");
        form.clearErrors("DateEnd");
        form.clearErrors("sAreaName");
        form.clearErrors("sProjectName");
        form.clearErrors("nAgencyID");
        loadData(dataRow);
    };
    useEffect(() => {
        OnGetData();
        form.setValue("sSDGID", sSDGID);
        loadData(dataRow);
    }, []);

    return (
        <React.Fragment>
            <Grid container spacing={1} >
                <Grid item xs={12}>
                    {/* <BreadcrumbAuto /> */}
                </Grid>
                <Grid item xs={12}>
                    <FormProvider {...form}>
                        <Grid container spacing={2} justifyContent={"flex-start"} padding={"0 1rem"}>
                            <Grid item xs={12} md={4} >
                                <SelectFormItem
                                    placeholder={`${i18n.t("SDGTable.sSDG")}`}
                                    name={"sSDGID"}
                                    label={`${i18n.t("SDGTable.sSDG")}`}
                                    options={lstSDGs}
                                    isPopperCustom={false}
                                    id="sSDGID"
                                    required={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <TextBoxForm
                                    placeholder={`${i18n.t("SDGTable.sProjectName")}`}
                                    label={`${i18n.t("SDGTable.sProjectName")}`}
                                    name="sProjectName"
                                    maxLength={20}
                                    id={"sProjectName"}
                                    disabled={false}
                                    required={false}
                                    isShowTextCont={false}

                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <TextBoxForm
                                    placeholder={`${i18n.t("SDGTable.sAreaName")}`}
                                    label={`${i18n.t("SDGTable.sAreaName")}`}
                                    name="sAreaName"
                                    maxLength={20}
                                    id={"sAreaName"}
                                    disabled={false}
                                    required={false}
                                    isShowTextCont={false}

                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <SelectMultipleFormItem
                                    placeholder={`${i18n.t("SDGTable.sAgencyName")}`}
                                    id={"nAgencyID"}
                                    name={"nAgencyID"}
                                    label={`${i18n.t("SDGTable.sAgencyName")}`}
                                    required={false}
                                    fullWidth={true}
                                    disabled={false}
                                    options={lstAgency}
                                    isPopperCustom={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <DateRangePickerFrom
                                    nameStart={'DateStart'}
                                    labelStart={`${i18n.t("SDGTable.dStart")}`}
                                    nameEnd={'DateEnd'}
                                    labelEnd={`${i18n.t("SDGTable.dEnd")}`}
                                    required={false}
                                    disabled={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={'auto'} >
                                <Grid container spacing={1} justifyContent={"center"}>
                                <Grid item >
                                    <BtnSearch
                                        id='searchSDG'
                                        txt={`${i18n.t("Btn.sSheach")}`}
                                        onClick={() => { loadData(dataRow) }}
                                    />
                                </Grid>
                                <Grid item >
                                    <BtnClear 
                                    id='clearSDG'
                                    txt={`${i18n.t("Btn.sClear")}`}
                                    onClick={() => onClearData()} />
                                </Grid>
                            </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <DataGridMui
                                    columns={dataColumn}
                                    isShowCheckBox={false}
                                    rows={dataRow}
                                    isShowColomnTool={false}
                                    isLoading={loadingTable}
                                    isNotShowTotal={true}
                                    onLoadData={loadData}
                                    isHiddenToolHead={true}
                                />
                            </Grid>
                        </Grid>
                    </FormProvider >
            </Grid>
        </Grid>
        </React.Fragment >
    );
}

