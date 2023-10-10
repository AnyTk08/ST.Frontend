import React , { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CardFrom from 'components/CardContent/CardFrom';
import { Grid } from '@mui/material';
import {  SelectFormItem, SelectMultipleFormItem, SwitchForm, TextBoxForm } from 'components/Input';
import {  Decrypt, FnDialog } from 'utilities/ST_Function';
import { BtnCancel, BtnSave } from 'components/Button';
import i18n from 'config/i18nConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetDataStandard, GetOptionAll, SaveStandard } from './CallAPI';

export default function CollectForm() {
  //#region Validate
  const navigate = useNavigate();
  const DialogFn = FnDialog();
  const location = useLocation();
  const sMode = location.state ? location.state["sMode"] : null;
  const sModeType = location.state ? location.state["sModeType"] : null;
  const sIDParams = location.state["sID"] != undefined ? Decrypt(location.state["sID"]) : null;
  const [option, setoption] = useState<any>([]);
  const [optionCollect, setoptionCollect] = useState<any>([]);
  const nPermission = location.state ? location.state["nMenuPermission"] : null;
  const sDefualtBoxItem = location.state ? location.state["sDefualtBoxItem"] : null;
  const sItemType = location.state ? location.state["sItemType"] : null;


  //#region 
  useEffect(() => {
    onGetOption()
    if (sIDParams != null && sIDParams != "") {
      onGetData()
    }
  }, [])
  //#endregion

  //#region yup
  const schema = yup.object().shape({
    sNameMenu: yupFormSchemas.string(`${i18n.t("StanDard.BundleTypeName")}`, { required: true }),
    sMenuCollect: yupFormSchemas.stringArray(`${i18n.t("StanDard.BundleType")}`, { required: true }),
  });
  const formResolver = yupResolver(schema);
  const form = useForm({
    resolver: formResolver,
    shouldUnregister: false,
    shouldFocusError: true,
    mode: "all",
    defaultValues: {
      sNameMenu: "",
      IsStatus: true,
    } as any,
  });
  //#endregion


  //#region onSubmit
  const onSubmit = () => {
    let objParam = {
      sID: sIDParams ?? null,
      sMode: sMode,
      sMenu: form.getValues("sMenu"),
      sMenuCollect: form.getValues("sMenuCollect") ?? null,
      sNameMenu: form.getValues("sNameMenu") ?? null,
      IsStatus: form.getValues("IsStatus") ?? false,
    };
    DialogFn.Submit(
      i18n.t("msgConfirmSave"),
      async () => {
        DialogFn.BlockUI();
        await SaveStandard(
          objParam,
          (result) => {
            DialogFn.Success(i18n.t('msgSaveComplete'));
            navigate(`/admin-standard`, {
              state: {
                sDefualtBoxItem: sDefualtBoxItem,
                sItemType: sItemType,
                IsCheckBox: true,
                nMenuPermission:nPermission
              }
            });
          },
          (err) => {
            if (!err.response) {
              DialogFn.Warning(err.Message);
            }
          }
        ).then(
          () => {
            DialogFn.UnBlockUI();
          },
          () => { }
        );
      }
    );
  };
  //#endregion

  //#region onGetData
  const onGetData = async () => {
    DialogFn.BlockUI();
    await GetDataStandard(
      { sID: sIDParams ?? "", sModeType: sModeType },
      (result) => {
        DialogFn.UnBlockUI();
        form.setValue("sNameMenu", result.sNameMenu)
        let arr = result.sMenuHead.split(", ");
        form.setValue("sMenuCollect", arr)
        form.setValue("IsStatus", result.IsStatus)
        form.setValue("sMenu", sModeType)

      },
      (err) => {
        if (!err.response) {
          DialogFn.Warning(err.Message);
        }
      }
    );
  };
  //#endregion

  //#region GetOption
  const onGetOption = async () => {
    DialogFn.BlockUI();

    await GetOptionAll(
      {},
      (result) => {
        DialogFn.UnBlockUI();
        setoption(result.listMenu)
        setoptionCollect(result.listGroup)
        form.setValue("sMenu", sModeType)
      },
      (err) => {
        if (!err.response) {
          DialogFn.Warning(err.Message);
        }
      }
    );
  };
  //#endregion



  return (
    <>
      <CardFrom footer={
        <Grid container spacing={2} justifyContent={"center"}>
          <Grid item xs={"auto"}>
            {nPermission === 2 && <BtnSave
            id='saveCollect'
             txt={`${i18n.t("Btn.sSave")}`}
              onClick={form.handleSubmit(
                () => {
                  onSubmit()
                }

              )}
            />}
            
          </Grid>
          <Grid item xs={"auto"}>
            <BtnCancel
            id='cancelCollect'
              txt={`${i18n.t("Btn.sCancel")}`} 
              onClick={() => {
                navigate(`/admin-standard`, {
                  state: {
                    sDefualtBoxItem: sDefualtBoxItem,
                    sItemType: sItemType,
                    IsCheckBox: true,
                    nMenuPermission:nPermission
                  }
                });
              }} />
          </Grid>
        </Grid>
      }>
        <FormProvider {...form}>
          <Grid container gap={3} >
            <Grid container gap={2} sx={{ justifyContent: "flex-start" }}>

              <Grid item md={6} xs={12}>
                <SelectFormItem
                  name={"sMenu"}
                  placeholder={`${i18n.t("StanDard.Menu")}`}
                  label={`${i18n.t("StanDard.Menu")}`}
                  options={option}
                  required={false}
                  id="selectsMenu"
                  disabled={true}
                  isPopperCustom={false}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <SelectMultipleFormItem
                  name={"sMenuCollect"}
                  placeholder={`${i18n.t("StanDard.BundleType")}`}
                  label={`${i18n.t("StanDard.BundleType")}`}
                  options={optionCollect}
                  required={true}
                  id="selectsMenuCollect"
                  isPopperCustom={false}
                  disabled={nPermission !== 2}
                />
              </Grid>

              <Grid item md={12} xs={12}>
                <TextBoxForm
                  name="sNameMenu"
                  label={`${i18n.t("StanDard.BundleTypeName")}`}
                  placeholder={`${i18n.t("StanDard.BundleTypeName")}`}
                  maxLength={200}
                  id={"sNameMenu"}
                  required={true}
                  disabled={nPermission !== 2}
                />
              </Grid>

              <Grid container gap={2} sx={{ display: "flex", alignItems: "baseline" }}>
                <SwitchForm
                  name={"IsStatus"}
                  label={`${i18n.t("Banner.Status")}`}
                  labelRight=':'
                  required={false}
                  disabled={nPermission !== 2}
                  RightText={`${i18n.t("Status.Inactive")}`}
                  LeftText={ `${i18n.t("Status.Active")}`}
                />
              </Grid>

            </Grid>

          </Grid>

        </FormProvider>
      </CardFrom>

    </>
  );
}
