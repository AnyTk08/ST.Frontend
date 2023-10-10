import React , { useEffect, useState, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CardFrom from 'components/CardContent/CardFrom';
import { Box, Grid } from '@mui/material';
import { DatePickerFromItem, SwitchForm, TextBoxForm } from 'components/Input';
import HeaderInput from 'components/Input/HeaderInput';
import { DateTimeToString, Decrypt, Extension, FnDialog } from 'utilities/ST_Function';
import { BtnCancel, BtnSave } from 'components/Button';
import i18n from 'config/i18nConfig';
import { GetData, Save } from './CallAPI';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileUploadFile from 'components/Input/UploadFile/Profile/ProfileUploadFile.';

export default function AdminBannerForm() {
  //#region Validate
  const navigate = useNavigate();
  const DialogFn = FnDialog();
  const location = useLocation();
  const [oDate, setoDate] = useState({ dS_Max: null, dE_Min: null });
  const [isAllDay, setisAllDay] = useState<boolean>(false);
  const [ArrFile, setArrFile] = useState<any>([]);
  const onClearFile = useRef(null);
  const sIDParams = location.state["sID"] != undefined ? Decrypt(location.state["sID"]) : null;
  const nPermission = location.state ? location.state["nPermission"] : null;
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
    sBannerName: yupFormSchemas.string(`${i18n.t("Banner.Name")}`, { required: true }),
    sNote: yupFormSchemas.string(`${i18n.t("Banner.Note")}`, { required: false }),
    dStart: yupFormSchemas.string(`${i18n.t("Banner.DateStart")}`, { required: true }),
    dEnd: yupFormSchemas.string(`${i18n.t("Banner.DateEnd")}`, { required: isAllDay ? false : true }),
  });
  const formResolver = yupResolver(schema);
  const form = useForm({
    resolver: formResolver,
    shouldUnregister: false,
    shouldFocusError: true,
    mode: "all",
    defaultValues: {
      sBannerName: "",
      sNote: "",
      IsStatus: true,
      isAllDay: true,
    } as any,
  });
  //#endregion

  //#region 
  const HandleChangeDate = (val, type) => {
    if (type === "S") {
      form.setValue("dEnd", "")
      setoDate({ ...oDate, dE_Min: val });
    } else if (type === "E") {
      setoDate({ ...oDate, dS_Max: val });
    }
    else {
      form.setValue("dEnd", "")
    }
  }
  //#endregion

  //#region onSubmit
  const onSubmit = () => {
    if (ArrFile.length === 0) {
      return DialogFn.Warning(i18n.t('msgUploadImage'));
    }
    let dStart = null;
    if (form.getValues("dStart") !== "" && form.getValues("dStart") !== null) {
      dStart = DateTimeToString(form.getValues("dStart"), "YYYY-MM-DD HH:mm:ss")
    }
    let dEnd = null;
    if (form.getValues("dEnd") !== "" && form.getValues("dEnd") !== null) {
      dEnd = DateTimeToString(form.getValues("dEnd"), "YYYY-MM-DD HH:mm:ss")
    }
    let objParam = {
      sID: sIDParams ?? "0",
      sBannerName: form.getValues("sBannerName") ?? "",
      sNote: form.getValues("sNote") ?? null,
      sStart: dStart,
      sEnd: isAllDay ? null : dEnd,
      fFile: ArrFile,
      IsStatus: form.getValues("IsStatus"),
      IsAllDay: form.getValues("IsAllDay")
    };
    DialogFn.Submit(
      i18n.t("msgConfirmSave"),
      async () => {
        DialogFn.BlockUI();
        await Save(
          objParam,
          (result) => {
            DialogFn.Success(i18n.t('msgSaveComplete'));
            DialogFn.CloseSubmit()
            DialogFn.UnBlockUI();
            navigate(`/admin-banner`)
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
    let objParam = {
      sID: sIDParams ?? "",
    };
    await GetData(
      objParam,
      (result) => {
        DialogFn.UnBlockUI();
        form.setValue("sBannerName", result.sBannerName)
        form.setValue("sNote", result.sNote)
        form.setValue("dStart", new Date(result.dStart))
        form.setValue("dEnd", result.IsAllDay ? "" : new Date(result.dEnd))
        form.setValue("IsStatus", result.IsStatus)
        form.setValue("IsAllDay", result.IsAllDay)
        setArrFile(result.fFile ?? [])
        setisAllDay(result.IsAllDay)

      },
      (err) => {
        if (!err.response) {
          DialogFn.Warning(err.Message);
        }
      }
    );
  };
  //#endregion

  useEffect(() => {
    if (isAllDay) {
      form.setValue("dEnd", null)
    }
  }, [isAllDay])


  return (
    <>
      <CardFrom footer={

        <Grid container spacing={2} justifyContent={"center"}>
          <Grid item xs={"auto"}>
            {nPermission === 2 &&  <BtnSave
            id='saveBanner'
               txt={`${i18n.t("Btn.sSave")}`}
              onClick={form.handleSubmit(
                () => { onSubmit() }
              )}
            />}
           
          </Grid>
          <Grid item xs={"auto"}>
            <BtnCancel
            id='cancelBanner'
               txt={`${i18n.t("Btn.sCancel")}`}  onClick={() => { navigate(`/admin-banner`) }} />
          </Grid>
        </Grid>
      }>
        <FormProvider {...form}>
          <Grid container gap={3} >
            <Grid container gap={1} >
              <TextBoxForm
                name="sBannerName"
                label={`${i18n.t("Banner.Name")}`} 
                placeholder={`${i18n.t("Banner.Name")}`} 
                maxLength={100}
                id={"sBanner"}
                required={true}
                disabled={nPermission !== 2}
              />
            </Grid>
            <Grid container gap={1} >
              <TextBoxForm
                name="sNote"
                label={`${i18n.t("Banner.Note")}`} 
                placeholder={`${i18n.t("Banner.Note")}`} 
                maxLength={2000}
                id={"sNote"}
                required={false}
                multiline
                rows={5}
                disabled={nPermission !== 2}
              />
            </Grid>
            <Grid container gap={3} sx={{ alignItems: "center", justifyContent: "flex-start" }}>
              <Grid item md={3} xs={12}>
                <Box
                  sx={{
                    color: "rgb(52, 71, 103)",
                  }}
                  className=".Box-content-form"
                >
                  <HeaderInput text={`${i18n.t("Banner.DateStart")}`}  required />
                  <DatePickerFromItem
                    fullWidth
                    name={'dStart'}
                    maxDate={oDate.dS_Max}
                    onChange={e => HandleChangeDate(e, "S")}
                    required={true}
                    disabled={nPermission !== 2}
                  />
                </Box>
              </Grid>
              <Grid item md={3} xs={12}>
                <Box
                  sx={{
                    color: "rgb(52, 71, 103)",
                  }}
                  className=".Box-content-form"
                >
                  <HeaderInput text={`${i18n.t("Banner.DateEnd")}`}  required />
                  <DatePickerFromItem
                    fullWidth
                    name={'dEnd'}
                    minDate={oDate.dE_Min}
                    onChange={e =>
                      HandleChangeDate(e, "E")
                    }
                    required={isAllDay ? false : true}
                    disabled={(isAllDay ?? nPermission !== 2) ? true : false}
                  />
                </Box>
              </Grid>
              <Grid item md={3} xs={12}>
                <SwitchForm
                  name={"IsAllDay"}
                  label={`${i18n.t("Banner.AllDay")}`}
                  required={false}
                  disabled={nPermission !== 2}
                  onChange={(e) => setisAllDay(e)}
                  onColor="#3c4573"
                  offColor="#ebecf0"
                  IsClassName={false}
                  RightText=" "
                  LeftText=' '
                />
              </Grid>
            </Grid>

            <Grid container gap={2} sx={{ alignItems: "center" }}>
              <Grid container md={3} gap={1} sx={{ justifyContent: "flex-start" }}>
                <Grid item xs={12}>
                  <HeaderInput
                    required
                    text={`${i18n.t("Banner.PictureBanner")}`}
                  />
                </Grid>
                <Grid item sx={{ display: 'flex' }}>
                  <ProfileUploadFile
                    id="arrUploadFile"
                    keyID={"sRectangle"}
                    IsRequired={true}
                    arrFile={ArrFile}
                    setarrFile={setArrFile}
                    Extension={[...Extension.Image]}
                    width={"10em"}
                    height={"10em"}
                    nLimitFile={10}
                    sLimitFile={"MB"}
                    onClearFile={onClearFile}
                    modeDisplay={"ProfileRectangle"}
                    sFolderTemp={"AdminBannerTemp"}
                    IsCrop={true}
                    cropShape={"retangle"}
                    cropRatio={16/9}
                    cropResize={false}
                    cropMovable={true}
                    sPositionText={"right"}
                    nRecommendWidth={650}
                    nRecommendHeight={500}
                    disabled={nPermission !== 2}
                  />
                </Grid>

              </Grid>

            </Grid>
            <Grid item gap={2} sx={{ display: "flex", alignItems: "baseline" }}>
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
