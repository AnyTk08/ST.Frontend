import React , { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { Grid, useMediaQuery } from "@mui/material";
import * as yup from "yup";
import DataGridMui, { PaginationInterface, initRows } from "components/DataGrid";
import { DateTimeToString, FnDialog } from "utilities/ST_Function";
import { useNavigate } from "react-router-dom";
import {  BtnAddOnTable, BtnApproveOnTable, BtnClear, BtnEditOnTable, BtnSearch, BtnUpdateDataOnTable, BtnViewDataOnTable } from "components/Button";
import { DateRangePickerFrom, SelectFormItem, SelectMultipleFormItem, TextBoxForm } from "components/Input";
import { GetDataProjectTable, GetInitData, onDelete } from './CallAPI';
import i18n from "config/i18nConfig";
import { TypeModeBtn } from "components/enum/enumSystem";
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid-pro";
import { List as LINQ } from "linqts";

export default function MyProjectList() {
    const DialogFn = FnDialog();
    const [loadingTable, setLoadingTable] = useState(false);
    const [isAdd, setisAdd] = useState(false);    
    const [lstAgency, setlstAgency] = useState<any>([]);
    const [lstNatureType, setlstNatureType] = useState<any>([]);
    const [lstStatus, setlstStatus] = useState<any>([]);
    const navigate = useNavigate();
    const [nPermission] = useState<number>(2);
    const [dataRow, setDataRow] = useState<PaginationInterface>({
        ...initRows,
        sSortExpression: "dUpdate",
        sSortDirection: "desc"
    });
    const maxLayout600 = useMediaQuery('(max-width:600px)');
    
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
            renderHeader: (item) => {                
                return(
                    <Grid item>
                    {isAdd &&
                        <BtnAddOnTable
                            id={`BtnAdd_MyProject`}
                            onClick={() => navigate("/project-request")}
                            IsHisabled={nPermission !== 2}
                        />
                    }
                    </Grid>
                )
            },
            field: "Button",
            type: "actions",
            resizable: false,
            sortable: false,
            width: 140,
            getActions: (item) => {
                //#region old
                //การโชว์ ปุ่ม 
                // #Edit
                // - Draft (nRequestType = 1 && nStatus = 1) *EditDraft
                // - Ativate ของทุก Type ((nRequestType = 1 && nStatus = 3) | (nRequestType = 2 && nStatus = 2) | (nRequestType = 4 && nStatus = 1) | (nRequestType = 5 && nStatus = 2)) *Editproject
                // - Waiting Update รอ Owner มาทำการ Update Progress (nRequestTypeID = 2 && nStatusID = 0) *Editproject
                // #View
                // - nRequestType = 1 (Request Register) และ Status Ativate (nRequestTypeID = 1 && nStatusID = 8) ขึ้นตลอดถ้าผ่าน Status Ativate นี้ไปแล้ว
                // #Update Progress
                // - Waiting Update รอ Owner มาทำการ Update Progress (nRequestTypeID = 2 && nStatusID = 0)

                // if ((item.row.nRequestTypeID !== 1 && item.row.nNextStatusID === 99) || (item.row.nRequestTypeID === 2 && item.row.nNextStatusID === 1) || (item.row.nRequestTypeID === 1 && item.row.nNextStatusID === 1)) {
                //     isBtnEdit = true;
                // }
                // if (item.row.nRequestTypeID !== 1 && item.row.nNextStatusID === 99) {
                //     sModeEdit = TypeModeBtn.EditProject;
                // }
                // if ((item.row.nRequestTypeID === 1 && item.row.nNextStatusID === 99) || (item.row.nRequestTypeID !== 1)) {
                //     isView = true;
                // }
                //#endregion
                                
                return [
                       (nPermission === 2 ?
                        <>
                        {item.row.IsView &&
                            <BtnViewDataOnTable id={`BtnView_MyProject_${item.row.sID}`} onClick={() => goToEdit(item.row.nProjectID, TypeModeBtn.ViewProject, item.row.nAreaID , item.row.nRequestTypeID)} />
                        }
                        {item.row.IsUpdate &&
                            <BtnUpdateDataOnTable id={`BtnUpdate_MyProject_${item.row.sID}`} onClick={() => goToEdit(item.row.nProjectID, TypeModeBtn.UpdateProgress, item.row.nAreaID, item.row.nRequestTypeID)} />
                        }
                        {item.row.IsApprover &&
                            <BtnApproveOnTable id={`BtnApprove_MyProject_${item.row.sID}`} onClick={() => goToEdit(item.row.nProjectID, TypeModeBtn.Approve, item.row.nAreaID, item.row.nRequestTypeID)} />
                        }
                        {item.row.IsEdit &&
                            <BtnEditOnTable id={`BtnEdit_MyProject_${item.row.sID}`} onClick={() => goToEdit(item.row.nProjectID, item.row.nModeBtn, item.row.nAreaID, item.row.nRequestTypeID)} />
                        }
                        </>
                    :
                        <BtnViewDataOnTable id={`BtnView_MyProject_${item.row.sID}`} onClick={() => goToEdit(item.row.nProjectID, TypeModeBtn.ViewProject, item.row.nAreaID, item.row.nRequestTypeID)} />
                       )
                    
                ];
            }
        },
        {
            field: "No",
            headerName: `${i18n.t("project.sNo")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            width: 60,
            isHeadMobile: true
        },
        {
            field: "sProjectName",
            headerName: `${i18n.t("project.sProjectName")}`,
            headerAlign: "center",
            align: "lefe",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 300
        },
        {
            field: "sAreaName",
            headerName: `${i18n.t("project.sAreaName")}`,
            headerAlign: "center",
            align: "lefe",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 240
        },
        {
            field: "sProjectNatureName",
            headerName: `${i18n.t("project.sProjectNatureName")}`,
            headerAlign: "center",
            align: "lefe",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 215
        },   
        {
            field: "sAgencyName",
            headerName: `${i18n.t("project.sAgencyName")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 150
        },     
        {
            field: "sProcess",
            headerName: `${i18n.t("project.sProcess")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 160
        },
        {
            field: "sProjectBudget",
            headerName: `${i18n.t("project.sProjectBudget")}`,
            headerAlign: "center",
            align: "right",
            sortable: true,
            disableReorder: true,
            width: 180
        },
        {
            field: "sUpdate",
            headerName: `${i18n.t("project.sLastUpdate")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 140
        },
        {
            field: "sRequestTypeName",
            headerName: `${i18n.t("project.sRequestTypeName")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 140
        },
        {
            field: "sStatusName",
            headerName: `${i18n.t("project.sStatus")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 140
        },
        {
            field: "sActionBy",
            headerName: `${i18n.t("project.sActionBy")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            disableReorder: true,
            width: 140
        },

    ];

    const goToEdit = (nProjectID, sModeBtn, nAreaID, nRequestTypeID) => {
        if (nProjectID) {
            navigate(( sModeBtn !== TypeModeBtn.ViewProject ? `/project-request` : `/project-report`),
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
        }
        else {
            navigate(`/project-request`)
        }
    };

    const OnGetData = async () => {
        DialogFn.BlockUI();
        await GetInitData({}, (res) => {
            DialogFn.UnBlockUI();
            setlstAgency(res.lstAgency ?? [])
            setlstStatus(res.lstStatus ?? [])
            setlstNatureType(res.lstNatureType ?? [])
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
            sProjectName: form.getValues("sProjectName") ?? null,
            sAreaName: form.getValues("sAreaName") ?? null,
            lstAgency: form.getValues("nAgency") ?? [],
            nNatureType: form.getValues("nNatureType") ?? null,
            lstStatus: form.getValues("nStatus") ?? [],
            sStart: dStart ?? "",
            sEnd: dEnd ?? "",
        }
        setLoadingTable(true);
        GetDataProjectTable(
            param, (result) => {
                setLoadingTable(false);
                setisAdd(result.isAdd);
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
    }

    const onClearData = () => {
        form.setValue("DateStart", "");
        form.setValue("DateEnd", "");
        form.setValue("sAreaName", "");
        form.setValue("sProjectName", "");
        form.setValue("nAgency", null);
        form.setValue("nNatureType", null);
        form.setValue("nStatus", null);
        form.clearErrors("nStatus");
        form.clearErrors("nNatureType");
        form.clearErrors("DateStart");
        form.clearErrors("DateEnd");
        form.clearErrors("sAreaName");
        form.clearErrors("sProjectName");
        form.clearErrors("nAgency");
        loadData(dataRow)
    };
   
    //#region OnDelete
    const OnDelete = (e) => {
        let lstDelete = new LINQ<any>(dataRow.arrRows ?? []).Where(w=> (e ?? []).includes(w.No +"")).Select(s=> s.nProjectID).ToArray();
        DialogFn.Submit(i18n.t("msgConfirmDelete"), async () => {
            DialogFn.BlockUI();
            setLoadingTable(true);
            await onDelete({ lstDelete : lstDelete }, (res) => {
                DialogFn.Success(i18n.t('msgDeleteComplete'));
                loadData(dataRow)
                DialogFn.UnBlockUI();
            }, (err) => {
                if (!err.response) {
                    DialogFn.Warning(err.Message);
                }
                DialogFn.UnBlockUI();
            });
        });
    };
    //#endregion

    useEffect(() => {
        OnGetData()
        loadData(dataRow);
    }, []);

    return (
        <React.Fragment>
            <Grid container spacing={1} >
                <Grid item xs={12}>
                    <FormProvider {...form}>
                        <Grid container spacing={2} justifyContent={"flex-start"} padding={"0 1rem"}>
                            <Grid item xs={12} md={4} >
                                <TextBoxForm
                                    placeholder={`${i18n.t("project.sProjectName")}`}
                                    label={`${i18n.t("project.sProjectName")}`}
                                    name="sProjectName"
                                    maxLength={250}
                                    id={"sProjectName"}
                                    disabled={false}
                                    required={false}
                                    isShowTextCont={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <SelectFormItem
                                    placeholder={`${i18n.t("project.sNatureType")}`}
                                    name={"nNatureType"}
                                    label={`${i18n.t("project.sNatureType")}`}
                                    options={lstNatureType}
                                    id="nNatureType"
                                    required={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <SelectMultipleFormItem
                                    placeholder={`${i18n.t("project.sAgencyName")}`}
                                    id={"nAgency"}
                                    name={"nAgency"}
                                    label={`${i18n.t("project.sAgencyName")}`}
                                    required={false}
                                    fullWidth={true}
                                    disabled={false}
                                    options={lstAgency}
                                    isPopperCustom={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <TextBoxForm
                                    placeholder={`${i18n.t("project.sAreaName")}`}
                                    label={`${i18n.t("project.sAreaName")}`}
                                    name="sAreaName"
                                    maxLength={250}
                                    id={"sAreaName"}
                                    disabled={false}
                                    required={false}
                                    isShowTextCont={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} >
                                <DateRangePickerFrom
                                    nameStart={'DateStart'}
                                    labelStart={`${i18n.t("project.dStart")}`}
                                    nameEnd={'DateEnd'}
                                    labelEnd={`${i18n.t("project.dEnd")}`}
                                    required={false}
                                    disabled={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={2} >
                                <SelectMultipleFormItem
                                    placeholder={`${i18n.t("project.sStatus")}`}
                                    id={"nStatus"}
                                    name={"nStatus"}
                                    label={`${i18n.t("project.sStatus")}`}
                                    required={false}
                                    fullWidth={true}
                                    disabled={false}
                                    options={lstStatus}
                                    isPopperCustom={false}
                                />
                            </Grid>

                            <Grid item xs={12} md={'auto'} >
                                <Grid container spacing={1} justifyContent={"center"}>
                                    <Grid item >
                                        <BtnSearch
                                            id={"BtnConfirmSearch_MyProjectList"}
                                            txt={`${i18n.t("Btn.sSheach")}`}
                                            onClick={() => { loadData(dataRow) }}
                                        />
                                    </Grid>
                                    <Grid item >
                                        <BtnClear 
                                            id={"BtnClearFilter_MyProjectList"}
                                            txt={`${i18n.t("Btn.sClear")}`}
                                            onClick={() => onClearData()} />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <DataGridMui
                                    columns={dataColumn}
                                    isShowCheckBox={true}
                                    rows={dataRow}
                                    isShowColomnTool={false}
                                    isLoading={loadingTable}
                                    isNotShowTotal={true}
                                    onLoadData={loadData}
                                    isHiddenToolHead={true}
                                    listFixL={maxLayout600 ? null :  [GRID_CHECKBOX_SELECTION_COL_DEF.field,"Button"]}
                                    minHeightCustom={1}
                                    onRowSelectable={(p) => p.row.IsCanDelete ?? false}
                                    onDelete={(d) => OnDelete(d)}                                   
                                />
                            </Grid>
                        </Grid>
                    </FormProvider >
                </Grid>
            </Grid >
        </React.Fragment>
    );
}

