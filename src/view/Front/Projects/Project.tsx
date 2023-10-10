import { Box, Grid } from "@mui/material"
import { PermissionButtonProps, StepProps } from "./Steps"
import React, { useEffect, useState } from "react";
import { AxiosGet, AxiosPost } from "utilities/ST_Axios";
import { BtnApprove, BtnBack, BtnDraft, BtnReject, BtnSave } from "components/Button";
import ProjectApprove from "./ProjectApprove";
import DialogPreview from "components/Dialog/DialogPreview";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { TextBoxForm } from "components/Input";
import i18n from "config/i18nConfig";
import { FnDialog } from "utilities/ST_Function";
import { useLocation, useNavigate } from "react-router-dom";
import RequestProject from "./RequestProject";
import { TypeModeBtn } from "components/enum/enumSystem";
import HTMLReactParser from "html-react-parser";
import ProjectUpdate from "./ProjectUpdate";
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import ProjectEdit from "./ProjectEdit";

export const Project = () => {
    const DialogFn = FnDialog();
    const navigate = useNavigate();
    const [oPermissionButton, setPermissionButton] = useState({} as PermissionButtonProps);
    const [arrSteps, setSteps] = useState([] as StepProps[]);
    const [IsOpen, setIsOpen] = useState(false);
    const [sMode, setMode] = useState(null);
    const location = useLocation();
    console.log("location", location);
    const [nProjectID] = useState(location?.state ? location.state["nProjectID"] : null)
    const [nAreaID] = useState(location?.state ? location.state["nAreaID"] : null)
    const [sModeBtn] = useState(location?.state ? location.state["sModeBtn"] : null)
    const [nRequestTypeID] = useState(location?.state ? location.state["nRequestTypeID"] : 1);
    const [IsReject, setIsReject] = useState(false);
    //button
    const [IsSave, setIsSave] = useState(false);

    useEffect(() => {
        onGetPermission();

    }, []);

    const [objShcemaApprove] = useState({} as any);
    //#region  Form
    let objSchema = {
        sComment: yupFormSchemas.string("หมายเหตุ", { required: IsReject }),
    }
    const schema = yup.object().shape(Object.assign(objSchema, objShcemaApprove));

    const formSubmit = useForm({
        resolver: yupResolver(schema),
        mode: "all",
        shouldFocusError: true,
        criteriaMode: "firstError",
    });

    const onGetPermission = () => {
        AxiosGet(
            "Project/GetPermissionProject",
            { IsRequestEdit: (sModeBtn === TypeModeBtn.EditProject), nProjectID: nProjectID, nAreaID: nAreaID },
            (Result) => {
                console.log("btn", Result);
                if (Result.Status === 200) {
                    setPermissionButton(Result.Data);
                    setSteps(Result.Data.lstDataStep ?? []);
                }
            })
    }

    const onSubmit = (data) => {
        console.log("data", JSON.stringify(data));
        setIsSave(false);
        if (data) {
            if (sMode === "S" || sMode === "D" || sMode === "E") {
                // <p></p>
                let html = `<p>มีการ${sMode === "D" ? "บันทึกร่าง" : "เพิ่ม"}พื้นที่ทั้งหมดจำนวน ${data.nCountlstArea} พื้นที่<br/>${i18n.t("msgConfirmSave")} </p>`
                DialogFn.Submit(sModeBtn === TypeModeBtn.EditProject ? i18n.t("msgConfirmSave") : HTMLReactParser(html), async () => {
                    DialogFn.BlockUI();
                    AxiosPost(
                        "Project/SaveData",
                        data,
                        (result) => {
                            DialogFn.CloseSubmit();
                            DialogFn.UnBlockUI();
                            if (result.Status === 200) {
                                DialogFn.Success(i18n.t("msgSaveComplete"));
                                navigate("/project");
                            } else {
                                DialogFn.Warning(result.Message);
                            }
                        },
                        (err) => {
                            if (!err.response) {
                                DialogFn.CloseSubmit();
                                DialogFn.UnBlockUI();
                                DialogFn.Warning(err.Message);
                            }
                        }
                    );
                });
            } else if (sMode === "A" || sMode === "R") {
                data.sComment = formSubmit.getValues("sComment");
                data.nAreaID = nAreaID;

                console.log("formSubmit", data);
                DialogFn.Submit(i18n.t("msgConfirmSave"), async () => {
                    DialogFn.BlockUI();
                    AxiosPost(
                        "Project/ProjectApprove",
                        data,
                        (result) => {
                            setIsOpen(false);
                            formSubmit.setValue("sComment", null);
                            setMode(null);

                            DialogFn.CloseSubmit();
                            DialogFn.UnBlockUI();
                            if (result.Status === 200) {
                                DialogFn.Success(i18n.t("msgSaveComplete"));
                                navigate("/project");
                            } else {
                                DialogFn.Warning(result.Message);
                            }

                        },
                        (err) => {
                            if (!err.response) {
                                DialogFn.CloseSubmit();
                                DialogFn.UnBlockUI();
                                DialogFn.Warning(err.Message);
                            }
                        })
                });
            }
        }
    }

    const onSubmitRequestEdit = (data) => {
        console.log("data", data);
        setIsSave(false);
        if (data) {
            if (data.sMode === "E" || sMode === "D") {
                console.log("smode", sMode);
                DialogFn.Submit(i18n.t("msgConfirmSave"), async () => {
                    DialogFn.BlockUI();
                    AxiosPost(
                        "Project/SaveDataRequestEdit",
                        data,
                        (result) => {
                            DialogFn.CloseSubmit();
                            DialogFn.UnBlockUI();
                            if (result.Status === 200) {
                                DialogFn.Success(i18n.t("msgSaveComplete"));
                                navigate("/project");
                            } else {
                                DialogFn.Warning(result.Message);
                            }
                        },
                        (err) => {
                            if (!err.response) {
                                DialogFn.CloseSubmit();
                                DialogFn.UnBlockUI();
                                DialogFn.Warning(err.Message);
                            }
                        }
                    );
                });
            } else if (sMode === "A" || sMode === "R") {
                data.sComment = formSubmit.getValues("sComment");
                data.nAreaID = nAreaID;

                console.log("formSubmit", data);
                DialogFn.Submit(i18n.t("msgConfirmSave"), async () => {
                    DialogFn.BlockUI();
                    AxiosPost(
                        "Project/ProjectApprove",
                        data,
                        (result) => {
                            setIsOpen(false);
                            formSubmit.setValue("sComment", null);
                            setMode(null);

                            DialogFn.CloseSubmit();
                            DialogFn.UnBlockUI();
                            if (result.Status === 200) {
                                DialogFn.Success(i18n.t("msgSaveComplete"));
                                navigate("/project");
                            } else {
                                DialogFn.Warning(result.Message);
                            }

                        },
                        (err) => {
                            if (!err.response) {
                                DialogFn.CloseSubmit();
                                DialogFn.UnBlockUI();
                                DialogFn.Warning(err.Message);
                            }
                        })
                });
            }
        }
    }

    const onSubmitUpdateProgress = (data) => {
        console.log("data", data);
        setIsSave(false);
        if (data) {
            if (sMode === "S" || sMode === "D") {
                DialogFn.Submit(i18n.t("msgConfirmSave"), async () => {
                    DialogFn.BlockUI();
                    AxiosPost(
                        "Project/onAreaUpdateProgress",
                        data,
                        (result) => {
                            DialogFn.CloseSubmit();
                            DialogFn.UnBlockUI();
                            if (result.Status === 200) {
                                DialogFn.Success(i18n.t("msgSaveComplete"));
                                navigate("/project");
                            } else {
                                DialogFn.Warning(result.Message);
                            }
                        },
                        (err) => {
                            if (!err.response) {
                                DialogFn.CloseSubmit();
                                DialogFn.UnBlockUI();
                                DialogFn.Warning(err.Message);
                            }
                        }
                    );
                });
            } else if (sMode === "A" || sMode === "R") {
                data.sComment = formSubmit.getValues("sComment");
                data.nAreaID = nAreaID;

                console.log("formSubmit", data);
                DialogFn.Submit(i18n.t("msgConfirmSave"), async () => {
                    DialogFn.BlockUI();
                    AxiosPost(
                        "Project/ProjectApprove",
                        data,
                        (result) => {
                            setIsOpen(false);
                            formSubmit.setValue("sComment", null);
                            setMode(null);

                            DialogFn.CloseSubmit();
                            DialogFn.UnBlockUI();
                            if (result.Status === 200) {
                                DialogFn.Success(i18n.t("msgSaveComplete"));
                                navigate("/project");
                            } else {
                                DialogFn.Warning(result.Message);
                            }

                        },
                        (err) => {
                            if (!err.response) {
                                DialogFn.CloseSubmit();
                                DialogFn.UnBlockUI();
                                DialogFn.Warning(err.Message);
                            }
                        })
                });
            }
        }
    }

    const onComment = (sMode) => {
        if (sMode === "R" || sMode === "A") {
            setIsOpen(true);
        }

    }

    return (
        <React.Fragment>
            <DialogPreview
                IsOpen={IsOpen}
                setIsOpen={setIsOpen}
                CloseColor='theme.palette.grey[500]'
                Title={"รายละเอียดเพิ่มเติม"}
                JsxDialogAction
                sMaxWidth="sm"
                onCustomButton={
                    sMode === "R" ?
                        <BtnReject
                            id="reject-project"
                            txt="ส่งกลับแก้ไข"
                            onClick={
                                formSubmit.handleSubmit(() => {
                                    setIsSave(true)
                                })
                            }
                        />
                        : <BtnApprove id="approve-project" txt="อนุมัติ" onClick={() => setIsSave(true)} />}
                onClose={() => {
                    setIsOpen(false);
                    setIsReject(false);
                    formSubmit.clearErrors();
                    formSubmit.setValue("sComment", null);
                    setMode(null);
                }}
            >
                <FormProvider {...formSubmit}>
                    <TextBoxForm required={IsReject} id="sComment" name="sComment" label="หมายเหตุ" maxLength={2000} rows={5} multiline />
                </FormProvider>
            </DialogPreview>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ width: "100%" }}>
                        {/* <Stepper activeStep={oPermissionButton?.nStepID} alternativeLabel>
                            {arrSteps.map((label) => (
                                <Step key={label.nStepID}>
                                    <StepLabel>{label.sRequestTypeName}</StepLabel>
                                </Step>
                            ))}
                        </Stepper> */}
                        <div className="stepper-wrapper">
                            {arrSteps.map((label) => {
                                let key = label.nStepID;
                                let key1 = key + 1
                                let sRequestTypeName = label.sRequestTypeName;
                                let oPerm = oPermissionButton?.nStepID
                                let StepCounter = <div className="step-counter">{key1}</div>
                                let StepName = <div className="step-name">{sRequestTypeName}</div>
                                return (
                                    (oPerm === key ?
                                        <div className="stepper-item update" key={key}>
                                            {StepCounter}
                                            {StepName}
                                        </div>
                                        :
                                        (key === 0 && oPerm > 0 ?
                                            (
                                                <div className="stepper-item completed" key={key}>
                                                    {StepCounter}
                                                    {StepName}
                                                </div>
                                            )
                                            :
                                            (
                                                <div className="stepper-item" key={key}>
                                                    {StepCounter}
                                                    {StepName}
                                                </div>
                                            )
                                        )
                                    )
                                )
                            })}
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {sModeBtn ?
                        <>
                            {sModeBtn === TypeModeBtn.EditDraft &&
                                <RequestProject IsSave={IsSave} onSave={onSubmit} sMode={sMode} nAreaID={nAreaID} nProjectID={nProjectID} IsEditProject={false} />
                            }
                            {sModeBtn === TypeModeBtn.UpdateProgress &&
                                <ProjectUpdate IsSave={IsSave} onSave={onSubmitUpdateProgress} sMode={sMode} nAreaID={nAreaID} nProjectID={nProjectID} IsApprove={false} />
                            }
                            {sModeBtn === TypeModeBtn.EditProject &&
                                <ProjectEdit IsSave={IsSave} onSave={onSubmitRequestEdit} sMode={sMode} nAreaID={nAreaID} nProjectID={nProjectID} IsEditProject={true} />
                            }
                            {sModeBtn === TypeModeBtn.EditReject && nRequestTypeID === 4 &&
                                <ProjectEdit IsSave={IsSave} onSave={onSubmitRequestEdit} sMode={sMode} nAreaID={nAreaID} nProjectID={nProjectID} IsEditProject={true} />
                            }
                            {sModeBtn === TypeModeBtn.Approve && nRequestTypeID === 1 &&
                                <ProjectApprove IsSave={IsSave} onSave={onSubmit} sMode={sMode} nAreaID={nAreaID} IsShowSendCC={oPermissionButton?.IsCCSendEmail} />
                            }
                            {sModeBtn === TypeModeBtn.Approve && nRequestTypeID === 2 &&
                                <ProjectUpdate IsSave={IsSave} onSave={onSubmitUpdateProgress} sMode={sMode} nAreaID={nAreaID} nProjectID={nProjectID} IsShowSendCC={oPermissionButton?.IsCCSendEmail} IsApprove={true} />
                            }
                            {sModeBtn === TypeModeBtn.Approve && nRequestTypeID === 4 &&
                                <ProjectUpdate IsSave={IsSave} onSave={onSubmitRequestEdit} sMode={sMode} nAreaID={nAreaID} nProjectID={nProjectID} IsShowSendCC={oPermissionButton?.IsCCSendEmail} IsApprove={true} IsEditApprove={true} />
                            }
                            {sModeBtn === TypeModeBtn.ViewProject &&
                                <ProjectApprove IsSave={IsSave} onSave={onSubmit} sMode={sMode} nAreaID={nAreaID} IsShowSendCC={oPermissionButton?.IsCCSendEmail} />
                            }
                            {sModeBtn === TypeModeBtn.EditReject && nRequestTypeID === 1 &&
                                <RequestProject IsSave={IsSave} onSave={onSubmit} sMode={sMode} nAreaID={nAreaID} nProjectID={nProjectID} IsEditProject={false} IsReject={true} />
                            }
                            {sModeBtn === TypeModeBtn.EditReject && nRequestTypeID === 2 &&
                                <ProjectUpdate IsSave={IsSave} onSave={onSubmitUpdateProgress} sMode={sMode} nAreaID={nAreaID} nProjectID={nProjectID} IsApprove={false} />
                            }

                        </>
                        :
                        <>
                            <RequestProject IsSave={IsSave} onSave={onSubmit} sMode={sMode} nProjectID={null} IsEditProject={false} />
                        </>
                    }
                </Grid>
                <Grid item xs={12}>
                    <Grid container display={"flex"} justifyContent={"flex-end"} spacing={1} >
                        {oPermissionButton.IsBtnBack &&
                            <Grid item >
                                <BtnBack
                                    id={"back-project"}
                                    txt="กลับ"
                                    onClick={() => navigate("/project")}
                                />
                            </Grid>
                        }
                        {oPermissionButton.IsBtnSaveDraft && sModeBtn !== TypeModeBtn.ViewProject &&
                            <Grid item >
                                <BtnDraft
                                    id={"draft-project"}
                                    txt="บันทึกร่าง"
                                    onClick={() => {
                                        setIsSave(true);
                                        setMode("D");
                                    }}
                                />
                            </Grid>
                        }
                        {oPermissionButton.IsBtnSubmit && sModeBtn !== TypeModeBtn.ViewProject &&
                            <Grid item >
                                <BtnSave
                                    id={"save-project"}
                                    // isDisabled={IsDisabledSubmit}
                                    txt="บันทึก"
                                    onClick={() => {
                                        console.log("IsSave", IsSave)
                                        setIsSave(true);
                                        setMode("S");
                                    }}
                                />
                            </Grid>
                        }
                        {oPermissionButton.IsBtnReject && sModeBtn !== TypeModeBtn.ViewProject &&
                            <Grid item >
                                <BtnReject
                                    id="reject-project-view"
                                    txt="ส่งกลับแก้ไข"
                                    onClick={() => {
                                        onComment("R");
                                        setMode("R");
                                        setIsReject(true);
                                    }}
                                />
                            </Grid>
                        }
                        {oPermissionButton.IsBtnApproved && sModeBtn !== TypeModeBtn.ViewProject &&
                            <Grid item >
                                <BtnApprove
                                    id="approve-project-view"
                                    txt="อนุมัติ"
                                    onClick={() => {
                                        onComment("A");
                                        setMode("A");
                                    }}
                                // onClick={onApproved}
                                />
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}