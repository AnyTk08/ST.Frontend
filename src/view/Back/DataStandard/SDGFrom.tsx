import React , { useEffect, useState, useRef }  from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CardFrom from 'components/CardContent/CardFrom';
import {  Grid } from '@mui/material';
import {  SelectFormItem, SwitchForm, TextBoxForm } from 'components/Input';
import HeaderInput from 'components/Input/HeaderInput';
import {  Decrypt, Extension, FnDialog } from 'utilities/ST_Function';
import { BtnCancel, BtnSave } from 'components/Button';
import i18n from 'config/i18nConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetDataSDG, GetOptionAll, SaveSDG } from './CallAPI';
import ProfileUploadFile from 'components/Input/UploadFile/Profile/ProfileUploadFile.';

export default function SDGFrom() {
  //#region Validate
  const navigate = useNavigate();
  const DialogFn = FnDialog();
  const location = useLocation();
  const [option, setoption] = useState<any>([]);
  const [ArrFile, setArrFile] = useState<any>([]);
  const onClearFile = useRef(null);
  const sIDParams =  location.state["sID"] != undefined ? Decrypt(location.state["sID"]) : null;
  const sMode = location.state ? location.state["sMode"] : null;
  const nPermission = location.state ? location.state["n const CustomPagination = () => {MenuPermission"] : null;
  const sDefualtBoxItem = location.state ? location.state["sDefualtBoxItem"] : null;
  const sItemType = location.state ? location.state["sItemType"] : null;
  // ทำ Enum ของแต่ละ Table
  //#endregion

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
    sNameMenu: yupFormSchemas.string("SDG", { required: true }),
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
      sMenu: form.getValues("sMenu") ?? "",
      sNameMenu: form.getValues("sNameMenu") ?? null,
      fFile: ArrFile,
      IsStatus: form.getValues("IsStatus"),
    };
    DialogFn.Submit(
      i18n.t("msgConfirmSave"),
      async () => {
        DialogFn.BlockUI();
        await SaveSDG(
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
    await GetDataSDG(
      { sID: sIDParams ?? "" },
      (result) => {
        DialogFn.UnBlockUI();
        form.setValue("sNameMenu", result.sNameMenu)
        form.setValue("IsStatus", result.IsStatus)
        setArrFile(result.fFile ?? [])
        form.setValue("sMenu", sMode)

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
        form.setValue("sMenu", sMode)
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
      <CardFrom footer={ <Grid container spacing={2} justifyContent={"center"}>
              <Grid item xs={"auto"}>
              {nPermission === 2 && <BtnSave
              id='saveSDG'
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
              id='cancelSDG'
                    txt={`${i18n.t("Btn.sCancel")}`} onClick={() => { navigate(`/admin-standard`, {
                    state: {
                      sDefualtBoxItem: sDefualtBoxItem,
                      sItemType: sItemType,
                      IsCheckBox: true,
                      nMenuPermission:nPermission
                    }
                  });}} />
              </Grid>
            </Grid>}>
        <FormProvider {...form}>
          <Grid container gap={3} >
            <Grid item md={6} xs={12} >
              <SelectFormItem
                name={"sMenu"}
                label={`${i18n.t("StanDard.Menu")}`}
                placeholder={`${i18n.t("StanDard.Menu")}`}
                options={option}
                required={false}
                id="selectsMenu"
                disabled={true}
                isPopperCustom={false}
              />
            </Grid>
            <Grid container spacing={2} sx={{alignItems:"center"}}>
              <Grid item md={12} xs={12}>
                 <TextBoxForm
                name="sNameMenu"
                placeholder={`${i18n.t("StanDard.SDG")}`}
                label={`${i18n.t("StanDard.SDG")}`}
                maxLength={200}
                id={"sNameMenu"}
                required={true}
                disabled={nPermission !== 2}
              />
              </Grid>
            </Grid>
            
            <Grid container gap={1} >
              <Grid item xs={12} sx={{ display: "flex" }}>
                <HeaderInput id='StanDard' text={`${i18n.t("StanDard.Pictue")}` + ":"}  />
              </Grid>
              <Grid container>
                 <Grid item  sx={{ display: 'flex' }}>
                <ProfileUploadFile
                  id="arrUploadFile"
                  keyID={"sRectangle"}
                  IsRequired={false}
                  arrFile={ArrFile}
                  setarrFile={setArrFile}
                  Extension={[...Extension.Image]}
                  width={"10em"}
                  height={"10em"}
                  nLimitFile={10}
                  sLimitFile={"MB"}
                  onClearFile={onClearFile}
                  modeDisplay={"ProfileRectangle"}
                  sFolderTemp={"SDGsTemp"}
                  IsCrop={true}
                  cropShape={"retangle"}
                  cropRatio={2 / 3}
                  cropResize={false}
                  cropMovable={true}
                  sPositionText={"right"}
                    nRecommendWidth={140}
                    nRecommendHeight={110}
                    disabled={nPermission !== 2}
                />
              </Grid>

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
