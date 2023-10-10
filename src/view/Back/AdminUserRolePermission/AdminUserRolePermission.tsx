import React , { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { Chip, Grid } from "@mui/material";
import * as yup from "yup";
import DataGridMui, { PaginationInterface, initRows } from "components/DataGrid";
import CardFrom from "components/CardContent/CardFrom";
import { FnDialog } from "utilities/ST_Function";
import { useNavigate } from "react-router-dom";
import { BtnAdditionnel, BtnClear, BtnEditOnTable, BtnSearch, BtnViewOnTable } from "components/Button";
import { SelectFormItem, TextBoxForm } from "components/Input";
import { options } from "components/enum/enumSystem";
import { GetDataTable } from "./CallAPI";
import i18n from "config/i18nConfig";
import { Cancel, CheckCircle, FiberManualRecord } from '@mui/icons-material';
import DialogPreview from "components/Dialog/DialogPreview";
import { GetPermission } from "utilities/ST_Axios";


export default function AdminUserRolePermission() {
    const DialogFn = FnDialog();
    const [loadingTable, setLoadingTable] = useState(false);
    const [openPopup, setopenPopup] = useState(false);
    const [lstDataTable, setlstDataTable] = useState<PaginationInterface>({
        ...initRows,
    });
    const [loadingTablePerm, setLoadingTablePerm] = useState(false);
    const [nPermission, setPermission] = useState<number>(0);
    const [sNamePer, setsNamePer] = useState<string>("");
    const navigate = useNavigate();
    const [dataRow, setDataRow] = useState<PaginationInterface>({
        ...initRows,
        sSortExpression: "dUpdate",
        sSortDirection: "desc"
    });
    const objSchema = {

    };

    const schema = yup.object().shape({ ...objSchema });
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
                    nPermission === 2 ? (
                        <div style={{ margin: '5px' }}>
                            <BtnEditOnTable
                                id={`editOnTableRolePermission_${item.row.sID}`}
                                onClick={() => goToEdit(item.row.sID)}
                            />
                        </div>
                    ) : (
                        <div style={{ margin: '5px' }}>
                            <BtnViewOnTable
                                id={`viewOnTableRolePermission_${item.row.sID}`}
                                onClick={() => goToEdit(item.row.sID)}
                            />
                        </div>
                    ),
                ];
            },
        },
        {
            field: "No",
            headerName: `${i18n.t("Roles.sNo")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 60,
            isHeadMobile: true
        },
        {
            field: "sUserRoleName",
            headerName: `${i18n.t("Roles.sRole")}`,
            headerAlign: "center",
            align: "lefe",
            sortable: true,
            resizable: false,
            flex: 2
        },
        {
            field: "สิทธิ์การใช้งาน",
            headerName: `${i18n.t("Roles.sPermission")}`,
            align: "center",
            type: "actions",
            resizable: false,
            sortable: false,
            width: 100,
            getActions: (item) => {
                return [
                    <BtnAdditionnel
                        key={`previewTableRolePermission_${item.row.sID}`}
                        isCircleWithOutText={true}
                        id={`previewTableRolePermission_${item.row.sID}`}
                        onClick={() => { onHandleClick(item.row.lstPermission ?? [], item.row.sUserRoleName, lstDataTable); }} />
                ];
            },
        },
        {
            field: "sActive",
            headerName: `${i18n.t("Roles.sStatus")}`,
            headerAlign: "center",
            align: "center",
            resizable: false,
            sortable: true,
            flex: 1,
            renderCell: (item) => {
                return (
                    <>
                        {item.row.sActive === `${i18n.t("common.active")}` && (
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
                        {item.row.sActive === `${i18n.t("common.inactive")}` && (
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
            headerName: `${i18n.t("Roles.sEditby")}`,
            headerAlign: "center",
            align: "left",
            textarea: "center",
            resizable: false,
            sortable: true,
            flex: 1
        },
        {
            field: "sUpdate",
            headerName: `${i18n.t("Roles.sLastUpdate")}`,
            headerAlign: "center",
            resizable: false,
            align: "center",
            sortable: true,
            flex: 1
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
                    <></>
                ) : (
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
                        {item.row.isDisable ? "Disable" : item.row.isReadOnly ? "View Only" : item.row.isEnable ? "Add / Edit / Delete" : "Disable"}
                    </>

                )
            }
        },
    ];


    const goToEdit = (sID) => {
        if (sID) {
            navigate(`/admin-roleuserform`,
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
            navigate(`/admin-roleuserform`,
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
        GetDataTable(
            {
                ...p,
                sUserRoleName: form.getValues("sUserRoleName") ?? null,
                nStatus: form.getValues("nStatus") ? parseInt(form.getValues("nStatus")) : null,
            }, (result) => {
                setLoadingTable(false);
                DialogFn.UnBlockUI();
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
    const onHandleClick = (item, sNamePer, dataPagination) => {
        setsNamePer(sNamePer);
        setLoadingTablePerm(true);
        setlstDataTable({ ...dataPagination, arrRows: item ?? [], nDataLength: item.length, nPageIndex: 1, nPageSize: item.length });
        setLoadingTablePerm(false);
        setopenPopup(true)
    };

    const onClearData = () => {
        Object.keys(form.getValues()).forEach((key => {
            form.setValue("sUserRoleName", "");
            form.setValue("nStatus", null);
            form.clearErrors("sUserRoleName");
            form.clearErrors("nStatus");
        }))
        loadData(dataRow);
    };

    useEffect(() => {
        GetPermission(setPermission);
        loadData(dataRow);
    }, []);

    return (
        <React.Fragment>
            <CardFrom>
                <FormProvider {...form}>
                    <Grid container sx={{ justifyContent: "flex-end", gap: 2, marginTop: "1rem" }}>
                        <Grid item xs={12} md={4} >
                            <TextBoxForm
                                placeholder={`${i18n.t("Roles.sRoleNane")}`}
                                label={`${i18n.t("Roles.sRoleNane")}`}
                                name="sUserRoleName"
                                maxLength={20}
                                id={"sUserRoleName"}
                                disabled={false}
                                required={false}
                                isShowTextCont={false}
                            />
                        </Grid>
                        <Grid item xs={12} md={2} >
                            <SelectFormItem
                                placeholder={`${i18n.t("Roles.sStatus")}`}
                                name={"nStatus"}
                                label={`${i18n.t("Roles.sStatus")}`}
                                options={options.status}
                                id="nStatus"
                                required={false}
                            />
                        </Grid>
                        <Grid item xs={12} md={'auto'} >
                            <Grid container spacing={1} justifyContent={"center"}>
                                <Grid item  >
                                    <BtnSearch
                                        id={'searchRolePermistion'}
                                        txt={`${i18n.t("Btn.sSheach")}`}
                                        onClick={() => { loadData(dataRow) }}
                                    />
                                </Grid>
                                <Grid item  >
                                    <BtnClear
                                        id={'clearRolePermistion'}
                                        txt={`${i18n.t("Btn.sClear")}`}
                                        onClick={() => onClearData()} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container sx={{ marginTop: "1rem", gap: 2 }}>
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
                                isDisableColumnReorder={nPermission !== 2}
                            />
                        </Grid>
                    </Grid>
                    <DialogPreview
                        IsOpen={openPopup}
                        onClose={() => { setopenPopup(false); }}
                        Title={`${i18n.t("Roles.RolePerm")} ${sNamePer}`}
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
                </FormProvider>
            </CardFrom >
        </React.Fragment>

    );
}

