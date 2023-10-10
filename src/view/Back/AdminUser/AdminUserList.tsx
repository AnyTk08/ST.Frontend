import React , { Fragment, useEffect, useState } from 'react'
import { Cancel, CheckCircle } from '@mui/icons-material';
import { Chip, Grid, useMediaQuery } from '@mui/material';
import { BtnAddOnTable, BtnClear, BtnEditOnTable, BtnSearch, BtnViewOnTable } from 'components/Button';
import CardFrom from 'components/CardContent/CardFrom';
import DataGridMui, { PaginationInterface, initRows } from 'components/DataGrid';
import { SelectFormItem, TextBoxForm } from 'components/Input';
import { options } from 'components/enum/enumSystem';
import i18n from 'config/i18nConfig';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FnAxios, GetPermission } from 'utilities/ST_Axios';
import { FnDialog } from 'utilities/ST_Function';

const AdminUserList = () => {
    const navigate = useNavigate();
    const AxiosFn = FnAxios()
    const DialogFn = FnDialog();
    const [loadingTable, setLoadingTable] = useState(false);
    const [, setOptionUserType] = useState<any>([]);
    const [nPermission, setPermission] = useState<number>();
    const Layout900 = useMediaQuery('(min-width:900px)');
    const [dataRow, setDataRow] = useState<PaginationInterface>({
        ...initRows,
        sSortExpression: "dUpdate",
        sSortDirection: "desc",
    });
    const form = useForm({
        shouldUnregister: false,
        shouldFocusError: true,
        mode: "all",
    });

    useEffect(() => {
        GetOption()
        GetPermission(setPermission);
        loadData(dataRow);
    }, []);

    const OnSearch = () => {
        loadData(dataRow);
    }
    const GetOption = () => {
        DialogFn.BlockUI()
        AxiosFn.Get(`AdminUser/GetAdminInitData`, {}, (result) => {
            setOptionUserType(result.OptionUserType)
            DialogFn.UnBlockUI()
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        })
    }
    const loadData = (p: PaginationInterface) => {
        DialogFn.BlockUI()
        setLoadingTable(true);
        let FormGetvalues = form.getValues();
        let param = {
            ...p,
            sUserName: FormGetvalues.sUserName ? FormGetvalues.sUserName : null,
            nStatus: FormGetvalues.nStatus ? Number(FormGetvalues.nStatus) : null,
            nUserType: FormGetvalues.nUserType ? Number(FormGetvalues.nUserType) : null,
        }
        AxiosFn.Post(`AdminUser/GetAdminUserTable`, param, (result) => {
            setLoadingTable(false);
            setDataRow({
                ...p,
                arrRows: result.lstDataUser ? result.lstDataUser : [],
                nDataLength: result.nDataLength,
                nPageIndex: result.nPageIndex,
            });
            DialogFn.UnBlockUI()
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        })
    }

    const GotoEdit = (sID) => {
        if (sID !== "") {
            navigate(`/admin-user-form`,
                {
                    state: {
                        nPermission: nPermission,
                        sID: sID
                    }
                }
            )
        }
    };
    const GotoCreate = () => {
        navigate(`/admin-user-form`, {
            state: {
                nPermission: nPermission,
            }
        });
    };
    const dataColumn: any = [
        {
            renderHeader: (item) => (
                <>{nPermission === 2 &&
                    <BtnAddOnTable
                        id={`btnAddOnTable`}
                        txt='เพิ่ม'
                        onClick={() =>
                            GotoCreate()
                        }
                    />
                }
                </>
            ),
            field: "Button (เพิ่ม/แก้ไข)",
            align: "center",
            type: "actions",
            resizable: false,
            sortable: false,
            flex: 1,
            minWidth: 60,
            getActions: (item) => {
                return [
                    nPermission === 2 ? (
                        <div style={{ margin: '5px' }}>
                            <BtnEditOnTable
                                id={`btnEditOnTable_${item.row.sID}`}
                                onClick={() => GotoEdit(item.row.sID)}
                            />
                        </div>
                    ) : (
                        <div style={{ margin: '5px' }}>
                            <BtnViewOnTable
                                id={`btnViewOnTable_${item.row.sID}`}
                                onClick={() => GotoEdit(item.row.sID)}
                            />
                        </div>
                    ),
                ];
            },
        },
        {
            field: "No",
            headerName: `${i18n.t("User.No")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 60,
            isHeadMobile: true,
        },
        {
            field: "sEmployeeID",
            headerName: `${i18n.t("User.EmployeeID")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 1,
            minWidth: 100,
            isHeadMobile: true
        },
        {
            field: "sFullname",
            headerName: `${i18n.t("User.Name")}`,
            headerAlign: "center",
            align: "left",
            sortable: true,
            resizable: false,
            flex: 3,
            minWidth: 180,
            isHeadMobile: true
        },
        {
            field: "sUserGroup",
            headerName: `${i18n.t("User.UserGroup")}`,
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 2,
            minWidth: 150,
            isHeadMobile: true,
            renderCell: (item) => {
                return (
                    <div style={{ width: "100%" }}>
                        {(item.row.sUserGroup || []).map((m, i) => (
                            <Chip
                                key={m}
                                label={m}
                                size="small"
                                style={{
                                    color: "#7239ea",
                                    backgroundColor: "#E8DEFF",
                                    margin: "0.2rem",
                                    fontSize: "1.05rem"
                                }}
                            />
                        ))}
                    </div>
                )
            }
        },
        // {
        //     field: "sUserType",
        //     headerName: `${i18n.t("User.UserType")}`,
        //     headerAlign: "center",
        //     align: "center",
        //     sortable: true,
        //     resizable: false,
        //     flex: 1.5,
        //     minWidth: 120,
        //     isHeadMobile: true
        // },
        {
            field: "sStatus",
            headerName: `${i18n.t("User.Status")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 1.5,
            isHeadMobile: true,
            minWidth: 100,
            renderCell: (item) => {
                return (
                    <>
                        {item.row.sStatus === `${i18n.t("User.IsActive")}` && (
                            <Chip
                                size="small"
                                icon={<CheckCircle style={{ color: "#50cd89" }} />}
                                label={i18n.t("User.IsActive")}
                                style={{
                                    color: "#50cd89",
                                    backgroundColor: "#e8fff3",
                                    margin: "0.2rem",
                                    fontSize: "1.05rem"
                                }}
                            />

                        )}
                        {item.row.sStatus === `${i18n.t("User.IsInactive")}` && (
                            <Chip
                                icon={<Cancel style={{ color: "#f1416c" }} />}
                                label={i18n.t("User.IsInactive")}
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
            headerName: `${i18n.t("User.sEditby")}`,
            headerAlign: "center",
            align: "left",
            sortable: true,
            resizable: false,
            flex: 2,
            minWidth: 150,
            isHeadMobile: true
        },
        {
            field: "sUpdate",
            headerName: `${i18n.t("User.sLastUpdate")}`,
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 1.5,
            isHeadMobile: true,
            minWidth: 100,
            renderCell: (item) => {
                return (
                    <span style={{ textAlign: "center" }}>{item.row.sUpdate}</span>
                )
            }
        },
    ];
    const onDelete = (e) => {
        DialogFn.Submit(i18n.t("msgConfirmDelete"), async () => {
            DialogFn.BlockUI();
            setLoadingTable(true);
            let param = {
                lstdataDelete: e,
            }
            AxiosFn.Post(`AdminUser/OnDeleteAdminuser`, param, (result) => {
                DialogFn.Success(i18n.t('ข้อมูลถูกลบไปเรียบร้อยแล้ว'));
                loadData(dataRow)
                DialogFn.UnBlockUI();
            }, (err) => {
                if (!err.response) {
                    DialogFn.Warning(err.Message);
                }
                DialogFn.UnBlockUI();
            });
        })
    }
    const onClear = () => {
        Object.keys(form.getValues()).forEach((key => {
            form.setValue("sUserName", "");
            form.setValue("nStatus", "");
            form.setValue("nUserType", "");
            form.clearErrors("sGroup");
            form.clearErrors("nStatus");
            form.clearErrors("nUserType");
        }))
        loadData(dataRow);
    }
    return (
        <Fragment>
            <CardFrom>
                <FormProvider {...form}>
                    <Grid container sx={{ justifyContent: Layout900 ? "flex-end" : "center", gap: 2, marginTop: "1rem" }}>
                        <Grid item xs={12} md={4} display={"flex"} justifyContent={"center"}>
                            <TextBoxForm
                                label={`${i18n.t("User.Name")} / ${i18n.t("User.EmployeeID")}`}
                                placeholder={`${i18n.t("User.Name")} / ${i18n.t("User.EmployeeID")}`}
                                name="sUserName"
                                maxLength={20}
                                id={"sUserName"}
                                disabled={false}
                                required={false}
                                isShowTextCont={false}
                            />
                        </Grid>
                        {/* <Grid item xs={12} md={2} display={"flex"} justifyContent={"center"}>
                            <SelectFormItem
                                name={"nUserType"}
                                label={`${i18n.t("User.UserType")}`}
                                options={OptionUserType}
                                id="nUserType"
                                required={false}
                                placeholder={`${i18n.t("User.UserType")}`}//"ประเภทผู้ใช้งาน"
                            />
                        </Grid> */}
                        <Grid item xs={12} md={2} display={"flex"} justifyContent={"center"}>
                            <SelectFormItem
                                name={"nStatus"}
                                label={`${i18n.t("User.Status")}`}
                                options={options.status}
                                id="nStatus"
                                required={false}
                                placeholder={`${i18n.t("User.Status")}`}
                            />
                        </Grid>
                        <Grid item xs={12} md={'auto'} >
                            <Grid container spacing={1} justifyContent={"center"}>
                                <Grid item >
                                    <BtnSearch
                                        id='btnSearch'
                                        txt={`${i18n.t("Btn.sSheach")}`}
                                        onClick={() => { OnSearch() }}
                                    />
                                </Grid>
                                <Grid item >
                                    <BtnClear
                                        id='btnClear'
                                        txt={`${i18n.t("Btn.sClear")}`}
                                        onClick={() => { onClear() }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: "1rem", gap: 2 }}>
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
                                onDelete={(d) => onDelete(d)}
                            />
                        </Grid>
                    </Grid>
                </FormProvider>
            </CardFrom>
        </Fragment>
    )
}

export default AdminUserList
