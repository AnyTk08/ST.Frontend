import { Grid, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from "react";
import { SelectFormItem } from 'components/Input';
import { BtnConfirm } from 'components/Button';
import { AxiosGet, AxiosPost } from "utilities/ST_Axios";
import bgLogin from "../../assets/images/Background/backLogin2.jpg";

// yup
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
import { onLoginComplete } from 'utilities/ST_Function';


const PageUserGroup = () => {


    const navigate = useNavigate();

    const [arrOptionGroup, setarrOptionGroup] = useState([] as any)

    //#region  Form
    let objSchema = {
        sGroup: yupFormSchemas.string("กลุ่มผู้ใช้งาน", { required: true }),
    }

    const schema = yup.object().shape(objSchema);
    const form = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        shouldFocusError: true,
    })
    //#endregion


    useEffect(() => {
        getInitOption();
    }, [])

    const getInitOption = () => {
        AxiosGet('Authen/GetGroupuser', null, (result) => {
            setarrOptionGroup(result.lstOptionGroup ?? [])
        });
    };

    const onSubmitUserGroup = () => {
        let sGroup = form.getValues("sGroup")
        secureLocalStorage.setItem("group-user", sGroup);
        let oParam = {
            sGroupID: sGroup,
        };

        AxiosPost(`Authen/UpdateTokenRole`, oParam, (result) => {
            onLoginComplete(result)
            navigate("/homebanner");
        });
    }

    return (
        <Fragment>
            <div className="bg">
                <img src={`${bgLogin}`} alt="" className='img-background' />
                <div className='div-gls-login'>
                    <FormProvider {...form}>
                        <Grid container spacing={2} justifyContent={"center"}>
                        <Grid item >
                            <Typography style={{fontSize:'1.8rem',fontWeight:500}}>
                                เลือกกลุ่มผู้ใช้งาน
                            </Typography>
                        </Grid>
                            <Grid item xs={10}>
                                <SelectFormItem
                                    id={"sGroup"}
                                    name={"sGroup"}
                                    label={"กลุ่มผู้ใช้งาน"}
                                    isClearable={true}
                                    required={true}
                                    options={arrOptionGroup}
                                />
                            </Grid>
                            <Grid item >
                                <BtnConfirm
                                    id='id-group'
                                    onClick={form.handleSubmit(onSubmitUserGroup)}
                                />
                            </Grid>
                        </Grid>
                    </FormProvider>
                </div>
            </div>

        </Fragment >
    )
}

export default PageUserGroup
