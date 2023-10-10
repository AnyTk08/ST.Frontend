import React, { Fragment, useEffect, useState } from 'react'
import { Chip, Divider, Grid, Skeleton, Typography, useMediaQuery } from '@mui/material';
import { BtnAddOnTable, BtnAdditionnel, BtnClear, BtnEditOnTable, BtnSearch, BtnViewOnTable } from 'components/Button';
import DataGridMui, { PaginationInterface, initRows } from 'components/DataGrid';
import { useLocation, useNavigate } from 'react-router-dom';
import { FnAxios, GetPermission } from 'utilities/ST_Axios';
import './cardhomestandard.css'
import { BundleType, EnumDifTable, EnumMenu, EnumStandradTable, options } from '../../../components/enum/enumSystem';
import { Delete, GetDataTable, GetOptionAll, GetOrder, GetOrderSub } from './CallAPI'
import { Encrypt, FnDialog, insert } from 'utilities/ST_Function';
import ChangeOrder from './ChangeOrder';
import { GridColumns } from '@mui/x-data-grid-pro';
import DialogPreview from 'components/Dialog/DialogPreview';
import i18n from 'config/i18nConfig';
import CheckIcon from '@mui/icons-material/Check';
import './BoxCard.css'
import { SelectMultipleFormItem, TextBoxForm } from 'components/Input';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Cancel, CheckCircle } from '@mui/icons-material';


const HomeStandard = () => {
  //#region 
  const DialogFn = FnDialog();
  const AxiosFn = FnAxios();
  const [sName, setsName] = useState<string>("")
  const [sLink, setsLink] = useState<string>("")
  const [sMode, setsMode] = useState<string>("")
  const [sItemsiD, setsItemsiD] = useState<string>("")
  const [sColumnName, setsColumnName] = useState<string>("")
  const [sEnCrept, setsEnCrept] = useState<string>("")
  const [column, setColumn] = useState([]);
  const [dataRow, setDataRow] = useState<PaginationInterface>({
    ...initRows,
  });
  const navigate = useNavigate();
  const [loadingTable, setLoadingTable] = useState(false);
  const [isClick, setisClick] = useState(false);
  const [nMenuPermission, setnMenuPermission] = useState<number>(0);
  const [lstDataCard, setlstDataCard] = useState<any>([]);
  const [optOrder, setoptOrder] = useState<any>([]);
  const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
  const [loadingCustomerTable, setLoadingCustomerTable] = useState(false);
  const [listCustomerDataTable, setlistCustomerDataTable] = useState<PaginationInterface>({
    ...initRows,
  });
  const [sNameGroupOccupation, setsNameGroupOccupation] = useState<string>("");
  const [option, setoption] = useState<any>([]);
  const Layout425 = useMediaQuery('(min-width:425px)');
  const Layout900 = useMediaQuery('(min-width:900px)');
  const [nPermission, setPermission] = useState<number>(2);
  const [listMenuPermission, setlistMenuPermission] = useState<any>([]);
  const location = useLocation();
  const sDefualtBoxItem = location.state ? location.state["sDefualtBoxItem"] : null;
  const nMenuPer = location.state ? location.state["nMenuPermission"] : null;
  const isCheckBox = location.state ? location.state["IsCheckBox"] : null;
  const sItemType = location.state ? location.state["sItemType"] : null;
  const [IsCheckBox] = useState<string>(isCheckBox);
  const [DefualtBoxItem] = useState<string>(sDefualtBoxItem);
  const [IsSkelton, setIsSkelton] = useState(true)
  //#endregion

  //#region 
  useEffect(() => {
    if (IsCheckBox && DefualtBoxItem) {
      setsEnCrept(sDefualtBoxItem);
      setisClick(isCheckBox);
      setsItemsiD(sItemType);
      setsColumnName(sDefualtBoxItem);
    }

  }, [sDefualtBoxItem, IsCheckBox])
  //#endregion

  //#region yup
  const schema = yup.object().shape({
  });
  const formResolver = yupResolver(schema);
  const form = useForm({
    resolver: formResolver,
    shouldUnregister: false,
    shouldFocusError: true,
    mode: "all",
    defaultValues: {
      sNameMenu: "",
      IsStatus: null,
    } as any,
  });
  //#endregion


  //#region goToCreate
  const goToCreate = () => {
    navigate(sLink, {
      state: {
        nMenuPermission: nMenuPermission,
        sDefualtBoxItem: sEnCrept,
        sItemType: sItemsiD,
        sMode: sMode,
        sModeType: sColumnName
      }
    });
  };
  //#endregion

  //#region 
  const goToEdit = (sID: any) => {
    navigate(sLink, {
      state: {
        nMenuPermission: nMenuPermission,
        sID: Encrypt(sID),
        sMode: sMode,
        sModeType: sColumnName,
        sDefualtBoxItem: sEnCrept,
        sItemType: sItemsiD
      }
    });
  };
  //#endregion

  //#endregion

  //#region dataColumn
  const dataColumn: any = [
    {
      renderHeader: (item) => (
        <>
          {(nMenuPermission === 2) &&
            <>
              {(sMode !== EnumStandradTable.NatureGroupingType && sMode !== EnumStandradTable.BudgetType) &&
                <BtnAddOnTable
                  id={`addOnTableStandard`}
                  txt={`${i18n.t("add")}`}
                  onClick={() =>
                    goToCreate()
                  }
                />}
            </>

          }

        </>


      ),
      field: "Button (Add/Edit)",
      type: "actions",
      flex: 1,
      resizable: false,
      sortable: false,
      minWidth: 80,
      getActions: (item) => {
        return [
          nPermission === 2 && (nMenuPermission === 2) ? (
            <div style={{ margin: '5px' }}>
              <BtnEditOnTable
                id={`editOnTableStandard_${item.row.sID}`}
                txt={`${i18n.t("edit")}`}
                onClick={() =>
                  goToEdit(item.row.sID)
                }
              />
            </div>
          ) : (
            <div style={{ margin: '5px' }}>
              <BtnViewOnTable
                id={`viewOnTableStandard_${item.row.sID}`}
                onClick={() => goToEdit(item.row.sID)}
              />
            </div>
          ),
        ];
      },
    },
    {
      field: "No",
      headerName: `${i18n.t("StanDard.No")}`,
      headerAlign: "center",
      align: "center",
      resizable: false,
      sortable: true,
      isHeadMobile: true,
      flex: 1,
      minWidth: 100,
      renderCell: (item) => {
        let arrOpt = [];
        for (let i = 1; i <= item.row.nCountOrder; i++) {
          arrOpt.push({ label: `${i}`, value: `${i}` });
        }
        return (
          <>
            {
              sColumnName !== EnumDifTable.Occupation &&
              <ChangeOrder
                item={item}
                onChangeOrder={FilterChangeOrder}
                optOrder={optOrder}
                disabled={nPermission !== 2}
              />
            }
            {
              sColumnName === EnumDifTable.Occupation &&
              <ChangeOrder
                item={item}
                onChangeOrder={FilterChangeOrder}
                optOrder={arrOpt}
                disabled={nPermission !== 2}
              />
            }
          </>

        )
      }
    },
    {
      field: "sName",
      headerName: sName,
      headerAlign: "center",
      align: "left",
      resizable: false,
      sortable: true,
      flex: 3,
      minWidth: 250,
    },
    {
      field: "sUpdateby",
      headerName: `${i18n.t("StanDard.EditBy")}`,
      headerAlign: "center",
      align: "left",
      resizable: false,
      sortable: true,
      flex: 3,
      minWidth: 150,
    },
    {
      field: "sLastUpdate",
      headerName: `${i18n.t("StanDard.LastUpdate")}`,
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
      headerName: `${i18n.t("StanDard.Status")}`,
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

  //#region 
  useEffect(() => {
    if (dataRow.arrRows.length > 0 && (sColumnName == EnumDifTable.Indicator || sColumnName == EnumDifTable.Occupation || sColumnName == EnumDifTable.OccupationGroup)) {
      setColumn(AddCustomerCol(dataColumn, 3, dataRow.arrRows[0].sCustomerName, "", dataRow.arrRows[0].sName));
    }
    else if (dataRow.arrRows.length > 0 && sColumnName == EnumDifTable.GroupType) {
      setColumn(AddCustomerCol(dataColumn, 3, `${i18n.t("StanDard.formal")}`, 4, `${i18n.t("StanDard.informal")}`));
    }
    else {
      setColumn(dataColumn);
    }
  }, [dataRow])
  //#endregion

  const onHandleClick = (sCustomerDataTable, sName, dataPagination) => {
    setsNameGroupOccupation(sName);
    setLoadingCustomerTable(true);
    setlistCustomerDataTable({ ...dataPagination, arrRows: sCustomerDataTable ?? [], nDataLength: sCustomerDataTable.length, nPageIndex: 1, nPageSize: sCustomerDataTable.length })
    setLoadingCustomerTable(false);
    setIsShowPreview(true)
  }

  const AddCustomerCol = (dataCol, indexMap, sCustomerName, indexMapIn?: any, sCustomerNameIn?: any) => {
    let arrCol: GridColumns = dataCol;
    let arrNewCol = [];
    let objColAdd = {
      field: "sCustomerDataTable",
      headerName: sCustomerName,
      headerAlign: "center",
      editable: false,
      resizable: false,
      align: "center",
      sortable: true,
      flex: 2,
      minWidth: 100,
      renderCell: (item) => {
        return [
          <>
            {(sColumnName === EnumDifTable.OccupationGroup && item.row.sCustomerDataOccupation.length > 0) &&
              <BtnAdditionnel txt="รายละเอียด" isCircleWithOutText={true} id={`previewOnTableStandard_${item.row.sID}`} onClick={() => onHandleClick(item.row.sCustomerDataOccupation, item.row.sName, listCustomerDataTable)} />}

            {(sColumnName !== EnumDifTable.OccupationGroup && sColumnName !== EnumDifTable.GroupType) && <span style={{ textAlign: "center" }}>{item.row.sCustomerDataTable}</span>}

            {(sColumnName === EnumDifTable.GroupType && item.row.sCustomerDataTable !== "" && item.row.sCustomerDataTable.includes(21))
              && <CheckIcon style={{ color: "green", strokeWidth: 1.5, stroke: "green" }} />}

          </>,
        ];
      },
    };

    let objColAddGroupType = {
      field: "sInformal",
      headerName: sCustomerNameIn,
      headerAlign: "center",
      editable: false,
      resizable: false,
      align: "center",
      sortable: true,
      flex: 2,
      minWidth: 100,
      renderCell: (item) => {

        return [
          <>
            {(sColumnName === EnumDifTable.GroupType && item.row.sCustomerDataTable !== "" && item.row.sCustomerDataTable.includes(BundleType.Infomal))
              && <CheckIcon style={{ color: "green", strokeWidth: 1.5, stroke: "green" }} />}
          </>,
        ];
      },
    };
    arrNewCol = insert(arrCol, indexMap, objColAdd);
    if (sColumnName === EnumDifTable.GroupType) {
      arrNewCol = insert(arrNewCol, indexMapIn, objColAddGroupType);
    }


    arrCol = arrNewCol;

    return arrCol;
  };


  const loadDataAll = async (dataPagination, siD?: string) => {
    let param =
    {
      nDataLength: dataPagination.nDataLength,
      nPageSize: dataPagination.nPageSize,
      nPageIndex: dataPagination.nPageIndex,
      sSortExpression: dataPagination.sSortExpression,
      sSortDirection: dataPagination.sSortDirection,
      isASC: dataPagination.isASC,
      isDESC: dataPagination.isDESC,

      sMode: sColumnName,
      sID: (sMode !== null && sMode !== "") ? sMode : siD,
      sMenuHead: (form.getValues("sMenuHead") !== null && form.getValues("sMenuHead") !== undefined) ? form.getValues("sMenuHead").join() : "",
      sNameMenu: form.getValues("sNameMenu") ?? null,
      IsStatus: (form.getValues("IsStatus") !== null && form.getValues("IsStatus") != undefined) ? form.getValues("IsStatus").join() : null,
      sEnCrepty: sEnCrept
    }
    DialogFn.BlockUI();
    setLoadingTable(true);
    await GetDataTable(
      param,
      (result) => {
        DialogFn.UnBlockUI();
        setLoadingTable(false);
        setsName(result.sName);
        setsLink(result.sLink);
        setsMode(result.sMode);
        setsColumnName(result.sModeType);
        setsEnCrept(result.sEnCrepty);
        setDataRow({
          ...dataPagination, arrRows: result.lstData ?? [],
          nDataLength: result.nDataLength,
          nPageIndex: result.nPageIndex,
        })
        let arrOpt = [];
        for (let i = 1; i <= result.nOrder; i++) {
          arrOpt.push({ label: `${i}`, value: `${i}` });
        }
        setoptOrder([...arrOpt]);
        onGetOption(result.sModeType);
      },
      (err) => {
        if (!err.response) {
          DialogFn.Warning(err.Message);
        }
      }
    );
  }

  const loadData = () => {
    DialogFn.BlockUI()
    AxiosFn.Get(`HomeStandard/GetlstCardStandard`, {}, (result) => {
      DialogFn.UnBlockUI();
      setlstDataCard(result.lstDataCard)
      setIsSkelton(false)
    }, (err) => {
      if (!err.response) {
        DialogFn.Warning(err.Message);
      }
    });
  }
  useEffect(() => {
    GetPermission(setPermission, setlistMenuPermission, EnumMenu.HomeStandard);
    setnMenuPermission(nMenuPer);
    loadData()
  }, []);

  const FilterChangeOrder = async (sID, nOrder, Table, Column, TypeColumn, TypeID) => {
    switch (sColumnName) {
      case EnumDifTable.SDG:
        onChangeOrder(sID, nOrder, Table, Column, TypeColumn, TypeID)
        break;
      case EnumDifTable.OccupationGroup:
        onChangeOrderSub(sID, nOrder, Table, Column, TypeColumn, TypeID)
        break;
      case EnumDifTable.Indicator:
        onChangeOrder(sID, nOrder, Table, Column, TypeColumn, TypeID)
        break;
      case EnumDifTable.Agency:
        onChangeOrder(sID, nOrder, Table, Column, TypeColumn, TypeID)
        break;
      default:
        onChangeOrderSub(sID, nOrder, Table, Column, TypeColumn, TypeID)
        break;
    }

  }
  //#region onChangeOrder
  const onChangeOrder = async (sID, nOrder, Table, Column, TypeColumn, TypeID) => {
    let param = {
      Table: Table,
      TypeColumn: TypeColumn,
      TypeID: TypeID,
      Column: Column,
      nID: sID,
      NewOrder: parseInt(nOrder)

    };
    await GetOrder(param, (res) => {
      loadDataAll(dataRow);
    }, (err) => {
      if (!err.response) {
        DialogFn.Warning(err.Message);
      }
    });
  };

  //#endregion

  //#region onChangeOrderSub
  const onChangeOrderSub = async (sID, nOrder, Table, Column, TypeColumn, TypeID) => {
    let param = {
      Table: Table,
      TypeColumn: TypeColumn,
      TypeID: TypeID,
      Column: Column,
      nID: sID,
      NewOrder: parseInt(nOrder)
    };
    await GetOrderSub(param, (res) => {
      loadDataAll(dataRow);
    }, (err) => {
      if (!err.response) {
        DialogFn.Warning(err.Message);
      }
    });
  };

  //#endregion

  useEffect(() => {
    if (isClick && sMode == "") {
      HandleChange(sItemsiD)
    }
  }, [sMode, isClick]);

  const HandleChange = async (sID) => {
    handleClearForm(sID)
  }


  //#region OnDelete
  const OnDelete = (e) => {
    DialogFn.Submit(i18n.t("msgConfirmDelete"), async () => {
      DialogFn.BlockUI();
      setLoadingTable(true);
      let param = {
        listDelete: e,
        sMode: sMode,
        sModeType: sColumnName
      }
      await Delete(param, (res) => {
        DialogFn.Success(i18n.t('msgDeleteComplete'));
        loadDataAll(dataRow)
        loadData()
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

  //#region GetOption
  const onGetOption = async (sModeType) => {
    DialogFn.BlockUI();

    await GetOptionAll(
      {},
      (result) => {
        DialogFn.UnBlockUI();
        if (EnumDifTable.Occupation === sModeType) {
          setoption(result.listOccupation)
        } else {
          setoption(result.listGroup)
        }

      },
      (err) => {
        if (!err.response) {
          DialogFn.Warning(err.Message);
        }
      }
    );
  };
  //#endregion

  const handleClearForm = (sID?: any) => {

    form.setValue("sNameMenu", "");
    form.setValue("sMenuHead", null);
    form.setValue("IsStatus", null);

    form.clearErrors("sNameMenu");
    form.clearErrors("sMenuHead");
    form.clearErrors("IsStatus");

    loadDataAll(dataRow, sID)
  }
  const sColorBG = (sID) => {
    let color = "#e7f2ff";

    if ((sID === sEnCrept) && isClick === true) {

      color = "#a0dcff";
    }
    return color;
  }

  const CheckBox = () => {
    if (nPermission === 2) {
      if (sMode !== EnumStandradTable.NatureGroupingType && sMode !== EnumStandradTable.BudgetType) {
        if (nMenuPermission !== 2) {
          return false
        }
        return true
      } else {
        return false

      }
    } else {
      return false
    }


  }

  const DataColumn: any = [
    {
      field: "No",
      headerName: "ลำดับที่",
      headerAlign: "center",
      align: "center",
      sortable: false,
      flex: 1,
      // isHeadMobile: true
    },
    {
      field: "sName",
      headerName: `${i18n.t("StanDard.Occupation")}`,
      headerAlign: "center",
      align: "left",
      resizable: false,
      sortable: false,
      flex: 3,
    },
    {
      field: "sStatus",
      headerName: `${i18n.t("StanDard.Status")}`,
      headerAlign: "center",
      align: "center",
      resizable: false,
      sortable: false,
      flex: 1,
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
  console.log("listCustomerDataTable", listCustomerDataTable)
  return (
    <Fragment>
      <FormProvider {...form}>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent={"flex-start"}>
                {
                  (IsSkelton ? Array.from(new Array(Layout900 ? 15 : (Layout425 ? 10 : 6))) : lstDataCard).map((item, index) => {
                    let nPer = item ? listMenuPermission.find(name => name.nMenuID === item.nMenuID) : null
                    return (
                      <>
                        {
                          item ?
                            (
                              nPer && nPer.nPermission !== 0 && <Grid item md={2.4} sm={6} xs={12} display={"flex"} justifyContent={"center"} key={item ? item.nMenuID : index}>
                                <div
                                  className="card-content"
                                  id={`cardStandard_${item.sID}`}
                                  style={{
                                    backgroundColor: sColorBG(item.sID),
                                  }}
                                  onClick={() => {
                                    setsMode("");
                                    setsColumnName(item.sID);
                                    setsEnCrept(item.sID);
                                    setsItemsiD(item.nType ? item.nType : item.sID);
                                    setisClick(true);
                                    setnMenuPermission(nPer.nPermission);
                                  }}
                                >
                                  <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Typography variant="body1" display={"flex"} justifyContent={"center"} textAlign={"center"} fontWeight={"bold"} lineHeight={"1.0rem"} fontSize={"18px"} color={"#3695dc"} padding={"0 15px"} position="absolute" top={"10%"}>{item.sName}</Typography>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "center" }} >
                                    <Typography variant="body1" display={"flex"} justifyContent={"center"} fontSize={"18px"} color={"#000"} position="absolute" bottom={"30%"}>{item.nSumlist ? item.nSumlist : 0}  {`${i18n.t("StanDard.List")}`}</Typography>
                                  </div>
                                  <div style={{ display: "flex", justifyContent: "center", }} >
                                    <Typography variant="body1" display={"flex"} justifyContent={"center"} textAlign={"center"} fontSize={"14px"} color={"#595959"} margin={"5px"} position="absolute" bottom={0}>{`${i18n.t("StanDard.LastUpdated_Card")}`} {item.sLastUpdate}</Typography>
                                  </div>
                                </div>
                              </Grid>
                            ) :
                            (<Grid item md={2.4} sm={6} xs={12} display={"flex"} justifyContent={"center"} key={`${index + ""}`}>
                              <Skeleton variant="rectangular" animation="wave" sx={{ height: "100px", width: "100%", borderRadius: "15px" }} />
                            </Grid>)
                        }
                      </>
                    )
                  })
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ margin: "1rem 0" }} />
        {isClick &&
          <>
            <Grid container sx={{ marginTop: "1rem", gap: 2 }}>
              <Grid container sx={{ justifyContent: Layout900 ? "flex-end" : "center", gap: 2 }}>
                <Grid item md={3} xs={12}>
                  <TextBoxForm
                    name="sNameMenu"
                    placeholder={sName}
                    label={sName}
                    maxLength={100}
                    id={"sNameMenu"}
                    required={false}
                  />

                </Grid>
                {EnumDifTable.Occupation === sColumnName &&
                  <Grid item md={2} xs={12}>
                    <SelectMultipleFormItem
                      name={"sMenuHead"}
                      placeholder={`${i18n.t("StanDard.Type")}`}
                      label={`${i18n.t("StanDard.Type")}`}
                      options={option}
                      required={false}
                      id="selectsMenuCollect"
                    /></Grid>}

                {EnumDifTable.GroupType == sColumnName &&
                  <Grid item md={2} xs={12}>
                    <SelectMultipleFormItem
                      name={"sMenuHead"}
                      placeholder={`${i18n.t("StanDard.Type")}`}
                      label={`${i18n.t("StanDard.Type")}`}
                      options={option}
                      required={false}
                      id="selectsMenuCollect"
                    /></Grid>}

                <Grid item md={2} xs={12}>
                  <SelectMultipleFormItem
                    name={"IsStatus"}
                    placeholder={`${i18n.t("StanDard.Status")}`}
                    label={`${i18n.t("StanDard.Status")}`}
                    options={options.status}
                    required={false}
                    id="selectsStatus"
                  />
                </Grid>
                <Grid item>
                  <BtnSearch id='searchStandard' txt={`${i18n.t("StanDard.Search")}`}
                    onClick={() => loadDataAll(dataRow)} />
                </Grid>
                <Grid item >
                  <BtnClear id='clearStandard' txt={`${i18n.t("StanDard.Clear")}`}
                    onClick={() => handleClearForm()} />
                </Grid>
              </Grid>
              <Grid xs={12}>
                <DataGridMui
                  id='DataGridHomeStandard'
                  isLoading={loadingTable}
                  columns={column}
                  isHiddenToolHead={true}
                  isShowCheckBox={CheckBox()}
                  rows={dataRow}
                  onLoadData={(e) => {
                    loadDataAll(e);
                  }}
                  onDelete={(d) => OnDelete(d)}
                  onRowSelectable={(p) => (sMode !== EnumStandradTable.NatureGroupingType && sMode !== EnumStandradTable.BudgetType) ? p.row.isCanDel : false}
                />
              </Grid>

            </Grid>
          </>

        }
        <DialogPreview
          IsOpen={isShowPreview}
          onClose={() => setIsShowPreview(false)}
          Title={`${i18n.t("StanDard.NameOccupatonPreview")} ${sNameGroupOccupation}`}
          sMaxWidth='sm'
          bgColor={"#004285"}
          Color='#FFFFFF'
        >
          <Grid item xs={12}>

            <DataGridMui
              isLoading={loadingCustomerTable}
              columns={DataColumn}
              rows={listCustomerDataTable}
              onLoadData={(dataPagination) => {
                onHandleClick("", "", dataPagination);
              }}
              isShowCheckBox={false}
              isNotShowPagination={true}
              isHiddenToolHead={true}
            />
          </Grid>
        </DialogPreview>
      </FormProvider>
    </Fragment>
  )
}

export default HomeStandard
