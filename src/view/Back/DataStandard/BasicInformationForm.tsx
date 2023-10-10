import React ,{ useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import CardFrom from 'components/CardContent/CardFrom';
import { Grid } from '@mui/material';
import { AsyncAutoCompleteForm, SelectFormItem, SwitchForm, TextBoxForm } from 'components/Input';
import { Decrypt, FnDialog } from 'utilities/ST_Function';
import { BtnCancel, BtnSave } from 'components/Button';
import i18n from 'config/i18nConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { GetDataStandard, GetOptionAll, SaveStandard } from './CallAPI';
import { EnumDifTable } from 'components/enum/enumSystem';

export default function BasicInformationForm() {
  //#region Validate
  const navigate = useNavigate();
  const DialogFn = FnDialog();
  const location = useLocation();
  const [option, setoption] = useState<any>([]);
  const sID =  location.state["sID"] != undefined ? Decrypt(location.state["sID"]) : null;
  const sDefualtBoxItem = location.state ? location.state["sDefualtBoxItem"] : null;
  const sItemType = location.state ? location.state["sItemType"] : null;
  const [sIDParams] = useState<string>(sID);
  const sMode = location.state ? location.state["sMode"] : null;
  const sModeType = location.state ? location.state["sModeType"] : null;
  const nPermission = location.state ? location.state["nMenuPermission"] : null;

  //#endregion

  //#region 
  useEffect(() => {
    onGetOption()
    if (sIDParams) {
      onGetData()
    }
  }, [])
  //#endregion

  //#region yup
  const schema = yup.object().shape({
    sNameMenu: yupFormSchemas.string(`${i18n.t("StanDard.DataName")}`, { required: sModeType !== EnumDifTable.Agency }),
    sNameAgency: yupFormSchemas.object(`${i18n.t("StanDard.DataName")}`, { required: sModeType === EnumDifTable.Agency }),
  });
  const formResolver = yupResolver(schema);
  const form = useForm({
    resolver: formResolver,
    shouldUnregister: false,
    shouldFocusError: true,
    mode: "all",
    defaultValues: {
      sNameMenu: "",
      sNameAgency: null,
      IsStatus: true,
    } as any,
  });
  //#endregion


  //#region onSubmit
  const onSubmit = () => {
    let FormGetvalues = form.getValues()
    let objParam = {
      sID: sIDParams ?? "0",
      sMode: sMode,
      sMenu: form.getValues("sMenu") ?? "",
      sNameMenu: form.getValues("sNameMenu") ?? null,
      oNameAgency: FormGetvalues.sNameAgency ?? null,
      IsStatus: form.getValues("IsStatus") ?? false,
    };
    DialogFn.Submit(
      i18n.t("msgConfirmSave"),
      async () => {
        DialogFn.BlockUI();
        await SaveStandard(
          objParam,
          () => {
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
        )
      }
    ).then(
      () => {
        DialogFn.UnBlockUI();
      },
      () => { }
    );
  }
  //#endregion

  //#region onGetData
  const onGetData = async () => {
    DialogFn.BlockUI();
    await GetDataStandard(
      { sID: sIDParams ?? "", sModeType: sModeType },
      (result) => {
        DialogFn.UnBlockUI();
        form.setValue("sNameMenu", result.sNameMenu)
        form.setValue("IsStatus", result.IsStatus)
        form.setValue("sNameAgency", (result.oNameAgency  ?? null));
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
    <React.Fragment>
      <CardFrom footer={
        <Grid container spacing={2} justifyContent={"center"}>
          <Grid item xs={"auto"}>
            {nPermission === 2 &&  <BtnSave
            id='saveBasic'
              txt="บันทึก"
              onClick={form.handleSubmit(
                () => {
                  onSubmit()
                }

              )}
            />}
           
          </Grid>
          <Grid item xs={"auto"}>
            <BtnCancel
            id='cancelBasic'
              txt='ยกเลิก' onClick={() => {
                navigate(`/admin-standard`, {
                  state: {
                    sDefualtBoxItem: sDefualtBoxItem,
                    sItemType: sItemType,
                    IsCheckBox: true,
                nMenuPermission:nPermission

                  }
                });
              }
              } />
          </Grid>
        </Grid>
      }>
        <FormProvider {...form}>
          <form>
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
                <Grid item md={12} xs={12}>
                  {sModeType === EnumDifTable.Agency &&
                    <AsyncAutoCompleteForm
                      id="sNameAgency"
                      name="sNameAgency"
                      sUrlAPI={"HomeStandard/GetPISAPI"}
                      label={`${i18n.t("StanDard.DataName")}`}
                      placeholder={`${i18n.t("StanDard.DataName")}`}
                      required={sModeType === EnumDifTable.Agency ? true : false}
                      isPopperCustom={false}
                      disabled={nPermission !== 2}
                    />
                  }
                  {sModeType !== EnumDifTable.Agency &&
                    <TextBoxForm
                      name="sNameMenu"
                      placeholder={`${i18n.t("StanDard.DataName")}`}
                      label={`${i18n.t("StanDard.DataName")}`}
                      maxLength={EnumDifTable.OccupationGroup == sModeType ? 200 : EnumDifTable.SDG == sModeType ? 100 : 200}
                      id={"sNameMenu"}
                      required={true}
                      disabled={nPermission !== 2}
                    />
                  }

                </Grid>


                <Grid container gap={2} sx={{ display: "flex", alignItems: "baseline" }}>
                  <SwitchForm
                    name={"IsStatus"}
                    label={`${i18n.t("Banner.Status")}`}
                    labelRight=':'
                    required={false}
                    disabled={nPermission !== 2}
                    RightText={`${i18n.t("Status.Inactive")}`}
                    LeftText={`${i18n.t("Status.Active")}`}
                  />
                </Grid>

              </Grid>

            </Grid>
          </form>
        </FormProvider>
      </CardFrom>

    </React.Fragment>
  );
}
