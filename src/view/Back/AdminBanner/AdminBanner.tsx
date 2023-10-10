//#region  import
import React,{ useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


import { Chip, Grid, useMediaQuery } from '@mui/material';
import {SelectMultipleFormItem, TextBoxForm } from 'components/Input';
import { BtnAddOnTable, BtnClear,  BtnEditOnTable, BtnSearch, BtnViewOnTable } from 'components/Button';
import DataGridMui, { PaginationInterface, initRows } from 'components/DataGrid';
import { useNavigate } from 'react-router-dom';
import CardFrom from 'components/CardContent/CardFrom';
import { Encrypt, FnDialog } from 'utilities/ST_Function';
import { Delete, GetDataTable, GetOrder } from './CallAPI';
import i18n from 'config/i18nConfig';
import ChangeOrder from './ChangeOrder';
import { options } from 'components/enum/enumSystem';
import '../DataStandard/BoxCard.css'
import { Cancel, CheckCircle } from '@mui/icons-material';
import { GetPermission } from 'utilities/ST_Axios';

//#endregion
const AdminBanner = () => {
    //#region  Varaible
    const DialogFn = FnDialog();
    const [optOrder, setoptOrder] = useState<any>([]);
    const [nPermission, setPermission] = useState<number>();
    const [loadingTable, setLoadingTable] = useState(false);
    const Layout900 = useMediaQuery('(min-width:900px)');
    const navigate = useNavigate();
    const [dataRow, setDataRow] = useState<PaginationInterface>({
        ...initRows,
    });
    const objSchema = {

    }
    const schema = yup.object().shape(objSchema);
    const form = useForm({
        resolver: yupResolver(schema),
        shouldUnregister: false,
        shouldFocusError: true,
        mode: "all",
    });
    //#endregion

    useEffect(() => {
        GetPermission(setPermission);
        loadData(dataRow);
    }, []);
    console.log("nPermission", nPermission)

    //#region loaddata
    const loadData = (dataPagination) => {
        let param =
        {
            nDataLength: dataPagination.nDataLength,
            nPageSize: dataPagination.nPageSize,
            nPageIndex: dataPagination.nPageIndex,
            sSortExpression: dataPagination.sSortExpression,
            sSortDirection: dataPagination.sSortDirection,
            isASC: dataPagination.isASC,
            isDESC: dataPagination.isDESC,

            sTitle: form.getValues("sTitle") ?? "",
            nStatus: (form.getValues("IsStatus") !== null && form.getValues("IsStatus") != undefined) ? form.getValues("IsStatus").join() : null,
        }
        DialogFn.BlockUI();
        setLoadingTable(true);
        GetDataTable(param, (res) => {
            DialogFn.UnBlockUI();
            setLoadingTable(false);
            setDataRow({
                ...dataPagination, arrRows: res.lstData ?? [],
                nDataLength: res.nDataLength,
                nPageIndex: res.nPageIndex,
            });
            let arrOpt = [];
            for (let i = 1; i <= res.nOrder; i++) {
                arrOpt.push({ label: `${i}`, value: `${i}` });
            }
            setoptOrder([...arrOpt]);

        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        });
    };
    //#endregion

    //#region dataColumn
    const dataColumn: any = [
        {
            renderHeader: (item) => (
                <>
                {nPermission === 2 &&
                 <BtnAddOnTable
                 id={`addOnTableBanner`}
                        txt="เพิ่ม"
                        onClick={() =>
                            // navigate(`/admin-bannerform`)
                           { navigate(`/admin-bannerform`, {
                                state: {
                                    nPermission: nPermission,
                                }
                            });}
                        }
                    />
                }
                   
                </>


            ),
            field: "Button (Add/Edit)",
            type: "actions",
            flex: 1.5,
            resizable: false,
            sortable: false,
            minWidth: 80,
            getActions: (item) => {
                return [
                    nPermission === 2 ? (
                        <div style={{ margin: '5px' }}>
                            <BtnEditOnTable
                            id={`editOnTableBanner_${item.row.sID}`}
                                onClick={() => goToEdit(item.row.sID)}
                            />
                        </div>
                    ) : (
                        <div style={{ margin: '5px' }}>
                            <BtnViewOnTable
                            id={`viewOnTableBanner_${item.row.sID}`}
                                onClick={() => goToEdit(item.row.sID)}
                            />
                        </div>
                    ),
                ];
            },
        },
        {
            field: "No",
            headerName: "ที่.",
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            isHeadMobile: true,
            flex: 1.5,
            minWidth: 80,
            renderCell: (item) => {
                return (
                    <ChangeOrder
                        item={item}
                        onChangeOrder={onChangeOrder}
                        optOrder={optOrder}
                        disabled={nPermission !== 2}
                    />
                )
            }
        },
        {
            field: "sPRBanner",
            headerName: "PR Banner",
            headerAlign: "center",
            align: "left",
            resizable: false,
            sortable: true,
            flex: 3,
            minWidth: 200,
        },
        {
            field: "sSEDate",
            headerName: "ระยะเวลาที่แสดง",
            headerAlign: "center",
            align: "center",
            resizable: false,
            sortable: true,
            flex: 4,
            minWidth: 150,
            renderCell: (item) => {
                return (
                    <span style={{ textAlign: "center" }}>{item.row.sSEDate}</span>
                )
            }
        },
        {
            field: "sUpdateby",
            headerName: "แก้ไขโดย",
            headerAlign: "center",
            align: "left",
            resizable: false,
            sortable: true,
            flex: 3,
            minWidth: 150,
        },
        {
            field: "sLastUpdate",
            headerName: "วันที่แก้ไขล่าสุด",
            headerAlign: "center",
            align: "center",
            resizable: false,
            sortable: true,
            flex: 2,
            minWidth: 100,
            renderCell: (item) => {
                return (
                    <span style={{ textAlign: "center" }}>{item.row.sLastUpdate}</span>
                )
            }
        },
        {
            field: "sStatus",
            headerName: "สถานะ",
            headerAlign: "center",
            align: "center",
            resizable: false,
            sortable: true,
            flex: 2,
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
    ];
    //#endregion

    //#region OnDelete
    const OnDelete = (e) => {
        DialogFn.Submit(i18n.t("msgConfirmDelete"), async () => {
            DialogFn.BlockUI();
            setLoadingTable(true);
            await Delete({ lstBannerDelete: e }, (res) => {
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


    //#region onChangeOrder
    const onChangeOrder = async (sID, nOrder) => {
        let param = {
            nID: sID,
            NewOrder: nOrder,
            Table: "TB_Banner",
            Column: "nBannerID",
            TypeColumn: "",
            TypeID: 0
        };
        await GetOrder(param, (res) => {
            loadData(dataRow);
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        });
    };

    //#endregion

    //#region 
    const goToEdit = (sID: any) => {
        navigate(`/admin-bannerform`, {
            state: {
                nPermission: nPermission,
                sID: Encrypt(sID)
            }
        });
    };
    //#endregion

    const handleClearForm = () => {
        form.setValue("sTitle", "");
        form.setValue("IsStatus", null);

        form.clearErrors("sTitle");
        form.clearErrors("IsStatus");
        loadData(dataRow)
    }
  console.log("dataRow",dataRow)

    return (
        <React.Fragment>
            <CardFrom >
                <FormProvider {...form}>
                    <Grid container sx={{ justifyContent: !Layout900 ? "center" : "flex-end", gap: 2, marginTop: "1rem" }}>
                        <Grid item xs={12} md={4} >
                            <TextBoxForm
                                placeholder="ชื่อ PR Banner"
                                name="sTitle"
                                label={"ชื่อ PR Banner"}
                                maxLength={200}
                                id={"txtsTitle"}
                                required={false}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <SelectMultipleFormItem
                                name={"IsStatus"}
                                placeholder={`${i18n.t("StanDard.Status")}`}
                                label={`${i18n.t("StanDard.Status")}`}
                                options={options.status}
                                required={false}
                                id="selectsStatus"
                            />
                        </Grid>
                        <Grid item xs={12} md={'auto'} >
                            <Grid container spacing={1} justifyContent={"center"}>
                                <Grid item >
                                    <BtnSearch
                                    id='searchBanner'
                                        txt={`${i18n.t("Btn.sSheach")}`}
                                        onClick={() => loadData(dataRow)}
                                    />
                                </Grid>
                                <Grid item >
                                    <BtnClear
                                    id='clearBanner' txt={`${i18n.t("Btn.sClear")}`}
                                        onClick={() => handleClearForm()} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ marginTop: "1rem", gap: 2 }}>
                        <Grid xs={12}>
                            <DataGridMui
                                isLoading={loadingTable}
                                columns={dataColumn}
                                isHiddenToolHead={true}
                                isShowCheckBox={nPermission === 2}
                                rows={dataRow}
                                onLoadData={(e) => {
                                    loadData(e);
                                }}
                                onDelete={(d) => OnDelete(d)}
                            />
                        </Grid>

                    </Grid>
                </FormProvider>
            </CardFrom>

        </React.Fragment>
    );
}

export default AdminBanner;

