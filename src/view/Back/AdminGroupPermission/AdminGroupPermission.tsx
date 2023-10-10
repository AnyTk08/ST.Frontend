import React, { useEffect, useState }  from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { Chip, Grid } from "@mui/material";
import * as yup from "yup";
import DataGridMui, { PaginationInterface, initRows } from "components/DataGrid";
import CardFrom from "components/CardContent/CardFrom";
import { FnDialog } from "utilities/ST_Function";
import { useNavigate } from "react-router-dom";
import { BtnAddOnTable, BtnAdditionnel, BtnClear, BtnEditOnTable, BtnSearch, BtnViewOnTable } from "components/Button";
import { SelectFormItem, TextBoxForm } from "components/Input";
import { options } from "components/enum/enumSystem";
import { GetDataTable, GetInitData, RemoveDataGroupTable } from "./CallAPI";
import i18n from "config/i18nConfig";
import DialogPreview from "components/Dialog/DialogPreview";
import { Cancel, CheckCircle, FiberManualRecord } from "@mui/icons-material";
import { GetPermission } from "utilities/ST_Axios";

export default function AdminGroupPermission() {
    const DialogFn = FnDialog();
    const [loadingTable, setLoadingTable] = useState(false);
    const [loadingTablePerm, setLoadingTablePerm] = useState(false);
    const [openPopup, setopenPopup] = useState(false);
    const [lstRole, setlstRole] = useState<any>([]);
    const [nPermission, setPermission] = useState<number>(0);
    const [sNamePer, setsNamePer] = useState<string>("");
    const navigate = useNavigate();
    const [lstDataTable, setlstDataTable] = useState<PaginationInterface>({
        ...initRows,
    });
    const [dataRow, setDataRow] = useState<PaginationInterface>({
        ...initRows,
        sSortExpression: "dUpdate",
        sSortDirection: "desc",
    });
    const schema = yup.object().shape({});
    const formResolver = yupResolver(schema);
    const form = useForm({
        resolver: formResolver,
        shouldUnregister: false,
        shouldFocusError: true,
        mode: "all",
    });

    const dataColumn: any = [
        {
            renderHeader: (item) => (
                <>
                    {nPermission === 2 ? (
                        <BtnAddOnTable
                            id={`addOnTableGroup`}
                            onClick={() => {
                                navigate(`/admin-groupform`,
                                    {
                                        state:
                                        {
                                            nPermission: nPermission
                                        }
                                    }
                                );
                            }
                            }
                        />
                    ) : null}
                </>
            ),
            field: "Button (เพิ่ม/แก้ไข)",
            align: "center",
            type: "actions",
            resizable: false,
            sortable: false,
            width: 60,
            getActions: (item) => {
                return [
                    nPermission === 2 ? (
                        <div style={{ margin: '5px' }}>
                            <BtnEditOnTable
                                id={`editOnTableGroup${item.row.sID}`}
                                onClick={() => goToEdit(item.row.sID)}
                            />
                        </div>
                    ) : (
                        <div style={{ margin: '5px' }}>
                            <BtnViewOnTable
                                id={`viewOnTableGroup${item.row.sID}`}
                                onClick={() => goToEdit(item.row.sID)}
                            />
                        </div>
                    ),
                ];
            },
        },
        {
            field: "No",
            headerName: `${i18n.t("Group.sNo")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 60,
            isHeadMobile: true,
        },
        {
            field: "sGroup",
            headerName: `${i18n.t("Group.sGroup")}`,
            headerAlign: "center",
            align: "lefe",
            sortable: true,
            resizable: false,
            flex: 2,
            isHeadMobile: true,
        },
        {
            field: "sRole",
            headerName: `${i18n.t("Group.sRole")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 1,
            isHeadMobile: true,
        },
        {
            field: "สิทธิ์การใช้งาน",
            headerName: `${i18n.t("Group.sPermission")}`,
            align: "center",
            type: "actions",
            resizable: false,
            sortable: false,
            width: 100,
            isHeadMobile: true,
            getActions: (item) => {
                return [
                    <BtnAdditionnel
                        key={`previewTableGroup_${item.row.sID}`}
                        isCircleWithOutText={true}
                        id={`previewTableGroup_${item.row.sID}`}
                        onClick={() => { onHandleClick(item.row.lstPermission ?? [], item.row.sGroup, lstDataTable); }} />
                ];
            },
        },
        {
            field: "sStatus",
            headerName: `${i18n.t("Group.sStatus")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 1,
            renderCell: (item) => {
                return (
                    <>
                        {item.row.sStatus === `${i18n.t("common.active")}` && (
                            <Chip
                                size="small"
                                icon={<CheckCircle style={{ color: "#50cd89" }} />}
                                label={`${i18n.t("common.active")}`}
                                style={{
                                    color: "#50cd89",
                                    backgroundColor: "#e8fff3",
                                    margin: "0.2rem",
                                    fontSize: "1.05rem"
                                }}
                            />
                        )}
                        {item.row.sStatus === `${i18n.t("common.inactive")}` && (
                            <Chip
                                icon={<Cancel style={{ color: "#f1416c" }} />}
                                label={`${i18n.t("common.inactive")}`}
                                size="small"
                                style={{
                                    color: "#f1416c",
                                    backgroundColor: "#fff5f8",
                                    margin: "0.2rem",
                                    fontSize: "1.05rem"
                                }}
                            />
                        )}
                    </>

                )
            }
        },
        {
            field: "sUpdateBy",
            headerName: `${i18n.t("Group.sEditby")}`,
            headerAlign: "center",
            align: "left",
            sortable: true,
            resizable: false,
            flex: 1,
        },
        {
            field: "sUpdate",
            headerName: `${i18n.t("Group.sLastUpdate")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 1,
        },

    ];

    const DataColumnPerm: any = [
        {
            field: "sNo",
            headerName: "ลำดับที่",
            headerAlign: "center",
            align: "center",
            sortable: false,
            flex: 1,
            renderCell: (item) => {
                return(
                   item.row.isManagePRM && !item.row.isFontEnd && item.row.nMenuHeadID !== 20 ? (
                   <>{null}</>
                ) :(
                    <>{item.row.sNo}</>
                )
                )
            }
        },
        {
            field: "sMenuName",
            headerName: `เมนู`,
            headerAlign: "center",
            align: "left",
            resizable: false,
            sortable: false,
            flex: 2,
            renderCell: (item) =>
                item.row.isManagePRM && !item.row.isFontEnd && item.row.nMenuHeadID !== 20 ? (
                    <div>
                        <FiberManualRecord sx={{ fontSize: "0.6em", mr: 0.5 }} />{" "}
                        {item.value}{" "}
                    </div>
                ) : (
                    item.value
                ),
            cellClassName: (params) => params.row.isHasSub ? "sMenuHead" : "",
        },
        {
            field: "sStatus",
            headerName: `สิทธิ์การใช้งาน`,
            headerAlign: "center",
            align: "center",
            resizable: false,
            sortable: false,
            flex: 1,
            renderCell: (item) => {
                return (
                    <>
                        {
                        (item.row.isDisable ? "Disable" : item.row.isReadOnly) ? "View Only" : item.row.isEnable ? "Add / Edit / Delete" : "Disable"
                        }
                    </>

                )
            }
        },
    ];

    const goToEdit = (sID) => {
        if (sID) {
            navigate(`/admin-groupform`,
                {
                    state:
                    {
                        nPermission: nPermission,
                        sRoleID: sID,
                    }
                }
            );
        }
        else {
            navigate(`/admin-groupform`,
                {
                    state:
                    {
                        nPermission: nPermission,
                    }
                }
            );
        }
    };

    const loadData = (p: PaginationInterface) => {
        setLoadingTable(true);
        DialogFn.BlockUI();
        let param = {
            ...p,
            sGroup: form.getValues("sGroup") ?? null,
            nStatus: form.getValues("nStatus") ? parseInt(form.getValues("nStatus")) : null,
            nRoleID: form.getValues("nRole") ? parseInt(form.getValues("nRole")) : null,
        }
        GetDataTable(
            param
            , (result) => {
                DialogFn.UnBlockUI();
                setLoadingTable(false);
                console.log("latData", result.lstData)
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

    const onDelete = (e) => {
        DialogFn.Submit(`${i18n.t("common.removedata")}`, () => {
            DialogFn.BlockUI();
            let param = {
                lstRemove: e
            }
            RemoveDataGroupTable(param, (result) => {
                DialogFn.UnBlockUI();
                if (result.Status === 200) {
                    DialogFn.Success(`${i18n.t("common.removesuccess")}`);
                    loadData(dataRow);
                }
            }, (err) => {
                DialogFn.UnBlockUI();
                if (!err.response) {
                    DialogFn.Warning(err.Message);
                }
            });
        });
    };

    const onHandleClick = (item, sNamePer, dataPagination) => {
        setsNamePer(sNamePer);
        setLoadingTablePerm(true);
        setlstDataTable({ ...dataPagination, arrRows: item ?? [], nDataLength: item.length, nPageIndex: 1, nPageSize: item.length });
        setLoadingTablePerm(false);
        setopenPopup(true)
    };


    const onClearData = () => {
        form.setValue("sGroup", "");
        form.setValue("nStatus", "");
        form.setValue("nRole", null);
        form.clearErrors("sGroup");
        form.clearErrors("nStatus");
        form.clearErrors("nRole");
        loadData(dataRow);
    };

    //#region onGetData
    const GetData = async () => {
        DialogFn.BlockUI();
        await GetInitData({}, (res) => {
            DialogFn.UnBlockUI();
            setlstRole(res.lstRolesSH ?? [])
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        });
    };

    //#endregion


    useEffect(() => {
        GetPermission(setPermission);
        loadData(dataRow);
        GetData();
    }, []);

    return (
        <React.Fragment>
            <CardFrom>
                <FormProvider {...form}>
                    <Grid container sx={{ justifyContent: "flex-end", gap: 2, marginTop: "1rem" }}>
                        <Grid item xs={12} md={3} >
                            <TextBoxForm
                                placeholder={`${i18n.t("Group.sGroupName")}`}
                                label={`${i18n.t("Group.sGroupName")}`}
                                name="sGroup"
                                maxLength={20}
                                id={"sGroup"}
                                disabled={false}
                                required={false}
                                isShowTextCont={false}
                            />
                        </Grid>
                        <Grid item xs={12} md={2} >
                            <SelectFormItem
                                placeholder={`${i18n.t("Group.sRole")}`}
                                name={"nRole"}
                                label={`${i18n.t("Group.sRole")}`}
                                options={lstRole}
                                id="nRole"
                                required={false}
                            />
                        </Grid>
                        <Grid item xs={12} md={2} >
                            <SelectFormItem
                                placeholder={`${i18n.t("Group.sStatus")}`}
                                name={"nStatus"}
                                label={`${i18n.t("Group.sStatus")}`}
                                options={options.status}
                                id="nStatus"
                                required={false}
                            />
                        </Grid>
                        <Grid item xs={12} md={'auto'} >
                            <Grid container spacing={1} justifyContent={"center"}>
                                <Grid item >
                                    <BtnSearch
                                        id='searchGroupPermission'
                                        txt={`${i18n.t("Btn.sSheach")}`}
                                        onClick={() => { loadData(dataRow) }}
                                    />
                                </Grid>
                                <Grid item >
                                    <BtnClear
                                        id='clearGroupPermission'
                                        txt={`${i18n.t("Btn.sClear")}`}
                                        onClick={() => onClearData()} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ gap: 2 }}>
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
                                    onDelete={onDelete}
                                    isDisableColumnReorder={nPermission !== 2}
                                    // isDisableColumnMenu={nPermission !== 2}
                                    onRowSelectable={(p) => p.row.IsCanDelete ?? false}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <DialogPreview
                        IsOpen={openPopup}
                        onClose={() => { setopenPopup(false); }}
                        Title={`${i18n.t("Group.GroupPerm")} ${sNamePer}`}
                        sMaxWidth='sm'
                        bgColor={"#004285"}
                        Color='white'
                    >
                        <Grid item xs={12}>
                            <DataGridMui
                                isLoading={loadingTablePerm}
                                columns={DataColumnPerm}
                                rows={lstDataTable}
                                onLoadData={(dataPagination) => { onHandleClick("", "", dataPagination); }}
                                isShowCheckBox={false}
                                isNotShowPagination={true}
                                isHiddenToolHead={true}
                            />
                        </Grid>
                    </DialogPreview>
                </FormProvider >
            </CardFrom>
        </React.Fragment>
    );
}

