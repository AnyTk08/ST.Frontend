import { Box, Grid, Step, StepLabel, Stepper } from "@mui/material"
import { PermissionButtonProps, PermissionProps, StepProps } from "./Steps"
import React, { useEffect, useState } from "react";
import { AxiosGet } from "utilities/ST_Axios";
import { BtnApprove, BtnBack, BtnDraft, BtnReject, BtnSave } from "components/Button";
export const StepItem = (props: PermissionProps) => {

    const {
        children,
        IsDisabledSubmit = false,
        nProjectID = 5,
        nAreaID = 13,
        onApproved,
        onBack,
        onReject,
        onSubmit,
        onDraft,
        IsRequestEdit = false
    } = props;

    const [oPermissionButton, setPermissionButton] = useState({} as PermissionButtonProps);
    const [arrSteps, setSteps] = useState([] as StepProps[]);

    useEffect(() => {
        onGetPermission();
    }, []);

    const onGetPermission = () => {
        AxiosGet(
            "Project/GetPermissionProject",
            { IsRequestEdit: IsRequestEdit, nProjectID: nProjectID, nAreaID: nAreaID },
            (Result) => {
                console.log("btn", Result);
                if (Result.Status === 200) {
                    setPermissionButton(Result.Data);
                    setSteps(Result.Data.lstDataStep ?? [])
                }
            })

    }

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ width: "100%" }}>
                        <Stepper activeStep={oPermissionButton?.nStepID} alternativeLabel>
                            {arrSteps.map((label) => (
                                <Step key={label.nStepID}>
                                    <StepLabel>{label.sRequestTypeName}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    {children}                    
                </Grid>
                <Grid item xs={12}>
                    <Grid container display={"flex"} justifyContent={"flex-end"} spacing={1} >
                        {oPermissionButton.IsBtnBack &&
                            <Grid item >
                                <BtnBack
                                    id={"BtnBack"}
                                    txt="กลับ"
                                    onClick={onBack}
                                />
                            </Grid>
                        }
                        {oPermissionButton.IsBtnSaveDraft &&
                            <Grid item >
                                <BtnDraft
                                    id={"BtnDraft"}
                                    txt="บันทึกร่าง"
                                    onClick={onDraft}
                                />
                            </Grid>
                        }
                        {oPermissionButton.IsBtnSubmit &&
                            <Grid item >
                                <BtnSave
                                    id={"BtnSave"}
                                    isDisabled={IsDisabledSubmit}
                                    txt="บันทึก"
                                    onClick={onSubmit}
                                />
                            </Grid>
                        }
                        {oPermissionButton.IsBtnReject &&
                            <Grid item >
                                <BtnReject
                                    id={"BtnReject"}
                                    txt="ส่งกลับแก้ไข"
                                    onClick={onReject}
                                />
                            </Grid>
                        }
                        {oPermissionButton.IsBtnApproved &&
                            <Grid item >
                                <BtnApprove
                                    id={"BtnApprove"}
                                    txt="อนุมัติ"
                                    onClick={onApproved}
                                />
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}