
//#region Import
import React, { Fragment, useEffect, useState } from 'react'
import { Card, Divider, Grid } from '@mui/material'
import CardFrom from 'components/CardContent/CardFrom'
import { AsyncAutoCompleteForm, SelectFormItem, SelectMultipleFormItem, SwitchForm, TextBoxForm } from 'components/Input'
import { FormProvider, useForm } from 'react-hook-form'
import { FnAxios } from 'utilities/ST_Axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { FnDialog } from 'utilities/ST_Function'
import { BtnCancel, BtnSave } from 'components/Button'
import i18n from 'config/i18nConfig'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";
import yupFormSchemas from 'components/FormItem/yupFormSchemas'
//#endregion

const AdminUserForm = () => {
    //#region Variable
    const navigate = useNavigate();
    const location = useLocation();
    const DialogFn = FnDialog();
    const AxiosFn = FnAxios();
    const [OptionAgencyPTT, setOptionAgencyPTT] = useState<any>([]);
    const [GroupUser, setGroupUser] = useState<any>([]);
    const [OptionRole, setOptionRole] = useState<any>([]);
    const [OptionGroupUser, setOptionGroupUser] = useState<any>([]);
    const [RoleID, setRoleID] = useState<any>("");
    const [dataForm, setdataForm] = useState<any>([]);
    const sID = location.state["sID"] !== undefined ? location.state["sID"] : null;
    const nPermission = location.state ? location.state["nPermission"] : null;
    //#endregion
    //#region formyup
    const schema = yup.object().shape({
        nRole: yupFormSchemas.integer(`${i18n.t("User.Role")}`, { required: true }),
        sEmployeeID: yupFormSchemas.object(`${i18n.t("User.EmployeeID")}`, { required: true }),
        nUserGroup: yupFormSchemas.stringArray("กลุ่มผู้ใช้งาน", { required: true }),
        nAgency: yupFormSchemas.integer(`${i18n.t("User.Agency")}`, { required: true }),
        sName: yupFormSchemas.string(`${i18n.t("User.FName")}`, { required: true }),
        sSureName: yupFormSchemas.string(`${i18n.t("User.SureName")}`, { required: true }),
        sPosition: yupFormSchemas.string(`${i18n.t("User.Position")}`, { required: true }),
        sEmail: yupFormSchemas.email(`${i18n.t("User.Email")}`, { required: true }),
        sPhoneNumber: yupFormSchemas.string(`${i18n.t("User.PhoneNumber")}`, { required: false }),
    });

    const formResolver = yupResolver(schema);
    const form = useForm({
        resolver: formResolver,
        shouldUnregister: false,
        shouldFocusError: true,
        mode: "all",
        defaultValues: {
            sStatus: true,
            sEmployeeID: null,
        } as any,
    });
    //#endregion 


    //#region LoadData
    useEffect(() => {
        GetOption();
        // GetOptionPIS()
        if (sID) {
            GetdataFormUser()
        }
    }, [])
    //#endregion

    //#region GetOption Initial Data
    const GetOption = () => {
        DialogFn.BlockUI()
        AxiosFn.Get(`AdminUser/GetAdminInitData`, {}, (result) => {
            setOptionRole(result.OptionRole ?? null)
            setGroupUser(result.OptionGroupUser ?? null)
            setOptionAgencyPTT(result.OptionAgency)
            DialogFn.UnBlockUI()
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        })
    }
    // const GetOptionPIS = () => {
    //     DialogFn.BlockUI()
    //     AxiosFn.Get(`AdminUser/GetInitialAgencyDataPIS`, {}, (result) => {
    //         setOptionAgencyPTT(result.OptionAgencyPTT)
    //         DialogFn.UnBlockUI()
    //     }, (err) => {
    //         if (!err.response) {
    //             DialogFn.Warning(err.Message);
    //         }
    //     })
    // }
    //#endregion

    //#region setDataFormEdit
    const GetdataFormUser = () => {
        DialogFn.BlockUI();
        let param = { sID: sID ? sID : null }
        AxiosFn.Get(`AdminUser/GetEditFormUser`, param, (res) => {
            setdataForm([res])
            DialogFn.UnBlockUI();
        }, (err) => {
            if (!err.response) {
                DialogFn.Warning(err.Message);
            }
        })
    }
    useEffect(() => {
        DialogFn.BlockUI();
        if (dataForm.length > 0) {
            if (GroupUser != null) {
                let lstGroup = GroupUser.filter((item) => item.parent === dataForm[0].nRole + "")
                setOptionGroupUser(lstGroup)
            }
            form.setValue("nRole", dataForm[0].nRole ? dataForm[0].nRole + "" : null);
            form.setValue("nUserGroup", dataForm[0].lstUserGroup ? dataForm[0].lstUserGroup : null);
            form.setValue("nTypeUser", dataForm[0].nUserTypeID ? dataForm[0].nUserTypeID + "" : null)
            form.setValue("sEmployeeID", dataForm[0].oEmployeeID ? dataForm[0].oEmployeeID : null);
            form.setValue("nAgency", dataForm[0].sAgencyID !== null ? dataForm[0].sAgencyID + "" : null);
            form.setValue("sName", dataForm[0].sName ? dataForm[0].sName : null);
            form.setValue("sSureName", dataForm[0].sSureName ? dataForm[0].sSureName : null)
            form.setValue("sPosition", dataForm[0].sPosition ? dataForm[0].sPosition : null)
            form.setValue("sEmail", dataForm[0].sEmail ? dataForm[0].sEmail : null)
            form.setValue("sPhoneNumber", dataForm[0].sPhoneNumber ? dataForm[0].sPhoneNumber : null)
            form.setValue("sStatus", dataForm[0].sStatus ? dataForm[0].sStatus : null)
        }
        DialogFn.UnBlockUI();
    }, [dataForm, GroupUser,OptionAgencyPTT.length > 0])

    //#endregion
    //#region Async 
    const onAutoUserCodeChange = (obj) => {
        if (obj !== null) {
            form.setValue("sName", obj.sNameTH ? obj.sNameTH : "");
            form.setValue("sSureName", obj.sSureNameTH ? obj.sSureNameTH : "");
            form.setValue("sPosition", obj.sPosition ? obj.sPosition : "");
            form.setValue("nAgency", obj.sAgency ? obj.sAgency : "");
            form.setValue("sEmail", obj.sEmail ? obj.sEmail : "");
            form.setValue("sPhoneNumber", obj.sPhoneNumber ? obj.sPhoneNumber : "");
        }
        form.clearErrors("sName");
        form.clearErrors("sSureName");
        form.clearErrors("sPosition");
        form.clearErrors("nAgency");
        form.clearErrors("sEmail");
        form.clearErrors("sPhoneNumber");
    };
    //#endregion
    const onChangeRole = (e) => {
        form.setValue("nUserGroup", "")
        setRoleID(e.value + "")
        if (GroupUser) {
            let lstGroup = GroupUser.filter((item) => item.parent === e.value)
            setOptionGroupUser(lstGroup)
        }
    }
    //#region Savedata
    const onSubmit = () => {
        let FormGetvalues = form.getValues()
        let param = {
            sUserID: sID ? sID : null,
            nRole: FormGetvalues.nRole ? Number(FormGetvalues.nRole) : 0,
            lstUserGroup: FormGetvalues.nUserGroup ? FormGetvalues.nUserGroup : [],
            nUserTypeID: 1,
            nAgencyID: FormGetvalues.nAgency ? Number(FormGetvalues.nAgency) : 0,
            sEmployeeID: FormGetvalues.sEmployeeID ? FormGetvalues.sEmployeeID.value : "",
            sName: FormGetvalues.sName ? FormGetvalues.sName : null,
            sSureName: FormGetvalues.sSureName ? FormGetvalues.sSureName : null,
            sPosition: FormGetvalues.sPosition ? FormGetvalues.sPosition : null,
            sEmail: FormGetvalues.sEmail ? FormGetvalues.sEmail : null,
            sPhoneNumber: FormGetvalues.sPhoneNumber ? FormGetvalues.sPhoneNumber : null,
            sStatus: FormGetvalues.sStatus ? FormGetvalues.sStatus : false,
        }
        console.log()
        DialogFn.Submit(i18n.t("msgConfirmSave"), () => {
            DialogFn.BlockUI();
            AxiosFn.Post(`AdminUser/OnSavedatauser`, param, (result) => {
                DialogFn.Success(i18n.t('msgSaveComplete'));
                DialogFn.CloseSubmit()
                navigate(`/admin-user`)
            }, (err) => {
                if (!err.response) {
                    DialogFn.Warning(err.Message);
                }
            }).then(
                () => {
                    DialogFn.UnBlockUI();
                },
                () => { }
            );
        });
    }
    return (
        <Fragment>
            <CardFrom footer={<Grid container spacing={3} sx={{ justifyContent: "center" }}>
                <Grid item >
                    {nPermission === 2 &&
                        <BtnSave
                            txt={`${i18n.t("Btn.sSave")}`}
                            id='btnSave'
                            onClick={form.handleSubmit(
                                () => {
                                    onSubmit()
                                }
                            )}
                        />
                    }
                </Grid>
                <Grid item >
                    <BtnCancel
                        txt={`${i18n.t("Btn.sCancel")}`}
                        id='btnBack'
                        onClick={() => { navigate(`/admin-user`) }} />
                </Grid>
            </Grid>}>
                <FormProvider {...form}>
                    <Grid container spacing={2} justifyContent={"start"}>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item md={4} sm={6} xs={12} >
                                    <SelectFormItem
                                        name={"nRole"}
                                        placeholder={`${i18n.t("User.Role")}`}
                                        label={`${i18n.t("User.Role")}`}
                                        options={OptionRole}
                                        required={true}
                                        id="nRole"
                                        disabled={nPermission !== 2}
                                        onChange={async (e) => {
                                            onChangeRole(e)
                                        }}
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <SelectMultipleFormItem
                                        id={"nUserGroup"}
                                        name={"nUserGroup"}
                                        placeholder={`${i18n.t("User.UserGroup")}`}
                                        label={`${i18n.t("User.UserGroup")}`}
                                        required={true}
                                        fullWidth={true}
                                        disabled={((RoleID != "" && sID == null) || sID != null ? false : true) || nPermission !== 2}
                                        options={OptionGroupUser}
                                        isPopperCustom={false} //True เพื่อ Popper ให้อยู่ภายใต้ Body  
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider textAlign="left" >{i18n.t("User.EmployeeData")}</Divider>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <AsyncAutoCompleteForm
                                id='sEmployeeID'
                                name="sEmployeeID"
                                sUrlAPI={"AdminUser/GetEmployeePTTPIS"}
                                label={`${i18n.t("User.EmployeeID")}`}
                                placeholder={`${i18n.t("User.EmployeeID")}`}
                                required={true}
                                disabled={sID || nPermission !== 2}
                                onChange={(e) => {
                                    onAutoUserCodeChange(e);
                                }}
                            />

                        </Grid>
                        <Grid item sm={6} xs={12} sx={{ display: "grid", alignItems: "flex-end" }} >
                            <SelectFormItem
                                name={"nAgency"}
                                placeholder={`${i18n.t("User.Agency")}`}
                                label={`${i18n.t("User.Agency")}`}
                                options={OptionAgencyPTT}
                                required={true}
                                id="nAgency"
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Card sx={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "1rem",
                                borderRadius: "20px !important",
                                boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px !important",
                                WebkitBackdropFilter: " blur(10px)",
                                backdropFilter: "blur(10px)",
                                background: "inherit",
                                margin: "0.5rem 0rem 0.5rem 0rem",
                                backgroundColor: 'rgba(242, 242, 242, 0.455)',
                            }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <TextBoxForm
                                            label={`${i18n.t("User.FName")}`}
                                            placeholder={`${i18n.t("User.FName")}`}
                                            name="sName"
                                            maxLength={50}
                                            id={"sName"}
                                            disabled={true}
                                            required={true}
                                            isShowTextCont={true}
                                            isMessageError={true}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <TextBoxForm
                                            label={`${i18n.t("User.SureName")}`}
                                            name="sSureName"
                                            placeholder={`${i18n.t("User.SureName")}`}
                                            maxLength={100}
                                            id={"sSureName"}
                                            disabled={true}
                                            required={true}
                                            isShowTextCont={true}
                                            isMessageError={true}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <TextBoxForm
                                            label={`${i18n.t("User.Position")}`}
                                            placeholder={`${i18n.t("User.Position")}`}
                                            name="sPosition"
                                            maxLength={200}
                                            id={"sPosition"}
                                            disabled={true}
                                            required={true}
                                            isShowTextCont={true}
                                            isMessageError={true}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <TextBoxForm
                                            label={`${i18n.t("User.PhoneNumber")}`}
                                            name="sPhoneNumber"
                                            placeholder={`${i18n.t("User.PhoneNumber")}`}
                                            maxLength={100}
                                            id={"sPhoneNumber"}
                                            disabled={true}
                                            required={false}
                                            isShowTextCont={true}
                                            isMessageError={true}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <TextBoxForm
                                            name="sEmail"
                                            label={`${i18n.t("User.Email")}`}
                                            isShowTextCont={false}
                                            placeholder={`${i18n.t("User.Email")}`}
                                            id="sEmail"
                                            type="email"
                                            maxLength={0}
                                            disabled={true}
                                            required={true}
                                            isMessageError={true}
                                        />
                                    </Grid>
                                </Grid>
                            </Card>
                            <Grid container >
                                <Grid item gap={2} sx={{ display: "flex", alignItems: "end" }}>
                                    <SwitchForm
                                        name={"sStatus"}
                                        label={`${i18n.t("User.IsStatus")}`}
                                        labelRight=':'
                                        required={false}
                                        disabled={nPermission !== 2}
                                        RightText={`${i18n.t("User.IsInactive")}`}
                                        LeftText={`${i18n.t("User.IsActive")}`}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </FormProvider>
            </CardFrom>
        </Fragment >
    )
}

export default AdminUserForm
