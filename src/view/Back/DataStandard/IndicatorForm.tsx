import React , { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CardFrom from 'components/CardContent/CardFrom';
import { Grid } from '@mui/material';
import { SelectFormItem, SwitchForm, TextBoxForm } from 'components/Input';
import {Decrypt, FnDialog } from 'utilities/ST_Function';
import i18n from 'config/i18nConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import {  GetDataIndicator, GetOptionAll, SaveIndicator} from './CallAPI';
import { BtnCancel, BtnSave } from 'components/Button';

export default function IndicatorForm() {
  //#region Validate
  const navigate = useNavigate();
  const DialogFn = FnDialog();
  const location = useLocation();
  const [option, setoption] = useState<any>([]);
  const sIDParams = location.state["sID"] != undefined ? Decrypt(location.state["sID"]) : null;
  const sMode = location.state ? location.state["sMode"] : null;
  const nPermission = location.state ? location.state["nMenuPermission"] : null;
  const sDefualtBoxItem = location.state ? location.state["sDefualtBoxItem"] : null;
  const sItemType = location.state ? location.state["sItemType"] : null;
  // ทำ Enum ของแต่ละ Table
  //#endregion

  //#region yup
  const schema = yup.object().shape({
    sNameMenu: yupFormSchemas.string(`${i18n.t("StanDard.IndicatorName")}`, { required: true }),
    sUnit: yupFormSchemas.string(`${i18n.t("StanDard.UnitIndicator")}`, { required: true }),

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

  //#region 
  useEffect(() => {
    onGetOption();
    if(sIDParams != null && sIDParams != "")
    {
       onGetData()
    }
  }, [])
  //#endregion

 //#region onSubmit
 const onSubmit = () => {
  let objParam = {
    sID : sIDParams ?? null,
    sMenu: form.getValues("sMenu") ,
    sUnit : form.getValues("sUnit") ?? null,
    sNameMenu: form.getValues("sNameMenu") ,
    IsStatus: form.getValues("IsStatus") ,
  };
  DialogFn.Submit(
    i18n.t("msgConfirmSave"),
    async () => {
      DialogFn.BlockUI();
      await SaveIndicator(
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
  await GetDataIndicator(
    {sID: sIDParams ?? ""},
    (result) => {
      DialogFn.UnBlockUI();
      form.setValue("sNameMenu",result.sNameMenu )
      form.setValue("sUnit",result.sUnit )
      form.setValue("IsStatus",result.IsStatus)
      form.setValue("sMenu",sMode)
     
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
            form.setValue("sMenu",sMode)
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
              id='saveIndicator'
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
              id='cancelIndicator'
                   txt={`${i18n.t("Btn.sCancel")}`} 
                  onClick={() => { navigate(`/admin-standard`, {
                    state: {
                      sDefualtBoxItem: sDefualtBoxItem,
                      sItemType: sItemType,
                      IsCheckBox: true,
                      nMenuPermission:nPermission
                    }
                  }); }} />
              </Grid>
            </Grid>}>
        <FormProvider {...form}>
          <Grid container gap={3} >
          <Grid container gap={2} sx={{ justifyContent: "flex-start" }}>
              
              <Grid item md={6}  xs={12}>
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
              <Grid item md={12} xs={12}>
              <TextBoxForm
                  name="sNameMenu"
                  placeholder={`${i18n.t("StanDard.IndicatorName")}`}
                  label={`${i18n.t("StanDard.IndicatorName")}`}
                  maxLength={200}
                  id={"sNameMenu"}
                  required={true}
                  disabled={nPermission !== 2}
                />
              </Grid>
              <Grid item md={12} xs={12}>
              <TextBoxForm
                  name="sUnit"
                  placeholder={`${i18n.t("StanDard.UnitIndicator")}`}
                  label={`${i18n.t("StanDard.UnitIndicator")}`}
                  maxLength={50}
                  id={"sUnit"}
                  required={true}
                  disabled={nPermission !== 2}
                />
              </Grid>
              </Grid>
              <Grid item gap={2} sx={{display:"flex",alignItems:"baseline"}}>
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
           

        </FormProvider>
      </CardFrom>

    </>
  );
}
