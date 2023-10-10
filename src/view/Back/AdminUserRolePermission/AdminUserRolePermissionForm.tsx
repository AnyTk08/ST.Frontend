import React , { useEffect, useState }from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CardFrom from 'components/CardContent/CardFrom';
import { Grid, Radio, Typography } from '@mui/material';
import { SwitchForm, TextBoxForm } from 'components/Input';
import { Decrypt, FnDialog} from 'utilities/ST_Function';
import { BtnCancel, BtnSave } from 'components/Button';
import i18n from 'config/i18nConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataGridMui, PaginationInterface, initRows } from 'components/DataGrid';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { GridColumns } from '@mui/x-data-grid-pro';
import { t } from 'i18next';
import { GetUserRole, SaveUserRole } from './CallAPI';
import { EnumPermission } from 'components/enum/enumSystem';

export default function AdminUserRolePermissionForm() {
  //#region Validate
  const navigate = useNavigate();
  const DialogFn = FnDialog();
  const location = useLocation();
  const [loadingTable, setLoadingTable] = useState(false);
  const [sRoleID] = useState(location?.state ? location.state["sRoleID"] : null)
  const sIDParams = location.state ? Decrypt(location.state["sID"]) : null;
  const nPermission = location.state ? location.state["nPermission"] : null;
  const [dataRow, setDataRow] = useState<PaginationInterface>({
    ...initRows,
  });
  //#endregion

  //#region 
  useEffect(() => {
    if (sIDParams != null) {
      onGetData()
    }
  }, [])
  //#endregion

  //#region yup
  const schema = yup.object().shape({
    sUserRoleName: yupFormSchemas.string("Role", { required: true, }),
  });
  const formResolver = yupResolver(schema);
  const form = useForm({
    resolver: formResolver,
    shouldUnregister: false,
    shouldFocusError: true,
    mode: "all",
    defaultValues: {
      sUserRoleName: "",
      IsStatus: true,
    } as any,
  });
  //#endregion

  const handleChangeRadio = (sID, sField) => {
    let oCheck = dataRow.arrRows.find((f) => f.sID === sID);
    if (oCheck) {
      oCheck.isDisable = sField === "isDisable";
      oCheck.isReadOnly = sField === "isReadOnly";
      oCheck.isEnable = sField === "isEnable";

      if (oCheck.isHasSub) //กรณี ที่ Head ถูกปรับ ต่ำกว่า Sub จะต้องปรับ Sub ให้อยู่ต่ำตาม
      {
        let lstCheckSub = dataRow.arrRows.filter((f) => f.isSubMenu === true && f.nMenuHeadID === oCheck.nMenuID); //Sub All
        if (lstCheckSub.length > 0)
        {
          lstCheckSub.forEach((iSub) => {
            if (oCheck.isDisable) //กรณี ต่ำสุดให้ ต่ำสุด ตาม
            {          
              iSub.isDisable = true;
              iSub.isReadOnly = false;
              iSub.isEnable = false;
            }
            else if (oCheck.isReadOnly) //กรณี ต่ำกลาง ปรับตามกัน ถ้า Sub ต่ำกว่าไม่ต้องปรับถ้าสูงกว่า ปรับต่ำเท่ากัน
            {
              iSub.isEnable = false;
              if(iSub.isDisable === false)
              {
                iSub.isDisable = false;
                iSub.isReadOnly = true;
              }
              else 
              {
                iSub.isDisable = true;
                iSub.isReadOnly = false;
              }
            }
            iSub.nDisabledMode = (oCheck.isDisable ? EnumPermission.Disable : (oCheck.isReadOnly ? EnumPermission.ReadOnly : EnumPermission.Enable ));
          });
        }
      }      
    }
    setDataRow({ ...dataRow });
  };

  const dataColumn: GridColumns = [
    {
      field: "nNo",
      headerName: `${i18n.t("Roles.sNo")}`,
      headerAlign: "center",
      align: "center",
      resizable: false,
      sortable: false,
      minWidth: 50,
      renderCell: (item) =>
      item.row.isManagePRM && !item.row.isFontEnd && item.row.nMenuHeadID !==20 ? (
        <></>
    ):(
      <>{item.row.sNo}</>
    )
    },
    {
      field: "sMenuName",
      headerName: `${i18n.t("Roles.sManu")}`,
      headerAlign: "center",
      align: "left",
      resizable: false,
      sortable: false,
      flex: 1,
      minWidth: 200,
      renderCell: (item) =>
        item.row.isManagePRM && !item.row.isFontEnd && item.row.nMenuHeadID !==20 ? (
          <div>
            <FiberManualRecordIcon sx={{ fontSize: "0.6em", mr: 0.5 }} />{" "}
            {item.value}{" "}
          </div>
        ) : (
          item.value
        ),
      cellClassName: (params) => params.row.isHasSub ? "sMenuHead" : "",
    },
    {
      field: "isEnable",
      headerName: `${i18n.t("Roles.isEnable")}`,
      headerAlign: "center",
      align: "center",
      resizable: false,
      sortable: false,
      minWidth: 200,
      renderCell: (item) =>
          <Radio
            checked={item.value}
            onChange={() => handleChangeRadio(item.row.sID, "isEnable",)}
            disabled={nPermission !== EnumPermission.Enable || (item.row.nDisabledMode != null ? (item.row.nDisabledMode !== EnumPermission.Enable ? true : false) : false) }
          />
    },
    {
      field: "isReadOnly",
      headerName: `${i18n.t("Roles.isReadOnly")}`,
      headerAlign: "center",
      align: "center",
      resizable: false,
      sortable: false,
      minWidth: 200,
      renderCell: (item) =>
          <Radio
            checked={item.value}
            onChange={() => handleChangeRadio(item.row.sID, "isReadOnly")}
            disabled={nPermission !== EnumPermission.Enable ||
              (item.row.nDisabledMode != null ? (item.row.nDisabledMode === EnumPermission.Disable ? true : false) : false) }
          />
    },
    {
      field: "isDisable",
      headerName: `${i18n.t("Roles.isDisable")}`,
      headerAlign: "center",
      align: "center",
      resizable: false,
      sortable: false,
      minWidth: 200,
      renderCell: (item) =>
          <Radio
            checked={item.value}
            onChange={() => handleChangeRadio(item.row.sID, "isDisable")}
            disabled={nPermission !== EnumPermission.Enable}
          />
    },
  ];

  //#region onSubmit
  const onSubmit = () => {
    let isCheckPermComplete = true;
    dataRow.arrRows.forEach((item) => {
      if (item.nMenuHeadID != null && !item.isDisable && !item.isReadOnly && !item.isEnable) {
        DialogFn.Warning(t('checkperm'))
        isCheckPermComplete = false;
        return false;
      }
    });

    if (isCheckPermComplete) {
      let data = {
        sRoleID: sRoleID ?? "",
        sUserRoleName: form.getValues("sUserRoleName") ?? "",
        lstPermission: dataRow.arrRows,
        IsActive: form.getValues("IsStatus"),
      };
      DialogFn.Submit(`${i18n.t("common.savedata")}`, () => {
        DialogFn.BlockUI();
        SaveUserRole(data, (result) => {
          DialogFn.UnBlockUI();
          DialogFn.Success(`${i18n.t("common.savesuccess")}`);
          DialogFn.CloseSubmit()
          navigate(`/admin-roleuser`);
        }, (err) => {
          DialogFn.UnBlockUI();
          if (!err.response) {
            DialogFn.Warning(err.Message);
          }
        });
      });
    }
  };

  //#endregion

  //#region onGetData
  const onGetData = async () => {
    let param = { sRoleID: sRoleID || "" };
    DialogFn.BlockUI();
    setLoadingTable(true);
    GetUserRole(param, (res) => {
      form.setValue("IsStatus", true);
      if (sRoleID) {
        form.setValue("sUserRoleName", res.sUserRoleName)
        form.setValue("IsStatus", res.IsActive)
      }
      setLoadingTable(false);
      setDataRow({
        ...dataRow,
        arrRows: res.lstPermission ?? [],
        nDataLength: res.nDataLength,
        nPageIndex: res.nPageIndex,
      });
      DialogFn.UnBlockUI();
    }, (err) => {
      if (!err.response) {
        DialogFn.Warning(err.Message);
      }
      DialogFn.UnBlockUI();
    }
    );
  };
  //#endregion

  return (
    <React.Fragment>
      <CardFrom footer={<Grid container gap={1} sx={{ justifyContent: "center" }}>
      {nPermission === 2 &&
        <Grid item xs={"auto"}>
          <BtnSave
          id='saveRolePermission'
            txt={`${i18n.t("Btn.sSave")}`}
            onClick={form.handleSubmit(
              () => { onSubmit() }

            )}
          />
      
        </Grid>
        }
        <Grid item xs={"auto"}>
          <BtnCancel
            id='cancelRolePermission'
            txt={`${i18n.t("Btn.sCancel")}`} onClick={() => { navigate(`/admin-roleuser`) }} />
        </Grid>
      </Grid>}>
        <FormProvider {...form}>
          <Grid container spacing={1} sx={{ justifyContent: "flex-start" }}>
            <Grid item md={4} xs={12}>
              <TextBoxForm
                placeholder={`${i18n.t("Roles.sRole")}`}
                name="sUserRoleName"
                label={`${i18n.t("Roles.sRole")}`}
                maxLength={100}
                id={"sUserRoleName"}
                required={true}
              disabled={nPermission !== 2}
              />
            </Grid>
            <Grid item md={12} xs={12}></Grid>
            <Grid item md={12} xs={12}>
              <Typography>
                <span style={{ fontWeight: 500, fontSize: '1rem' }}> {`${i18n.t("Roles.sPermission")}`} </span>
                <span style={{ color: "red" }}>
                  {"*"}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <DataGridMui
                isLoading={loadingTable}
                columns={dataColumn}
                rows={dataRow}
                isNotShowPagination={true}
                isNotShowTotal={true}
                isHiddenToolHead={true}
                isHideFooter={true}
                isDisableColumnReorder={nPermission !== 2}
              />
            </Grid>
            <Grid item gap={2} sx={{ display: "flex", alignItems: "end" }}>
              <SwitchForm
                name={"IsStatus"}
                label={`${i18n.t("Roles.IsStatus")}`}
                labelRight=':'
                required={false}
                disabled={nPermission !== 2}
                RightText={`${i18n.t("Roles.IsInactive")}`}
                LeftText={`${i18n.t("Roles.IsActive")}`}
              />
            </Grid>
          </Grid>
        </FormProvider>
      </CardFrom>
    </React.Fragment>
  );
}
