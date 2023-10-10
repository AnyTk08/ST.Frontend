import { useEffect } from 'react'
import { Grid } from '@mui/material';
import DialogPreview from 'components/Dialog/DialogPreview';
// yup
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
import { SelectFormItem } from 'components/Input';
import { BtnConfirm } from 'components/Button';
import secureLocalStorage from 'react-secure-storage';
import { AxiosPost } from 'utilities/ST_Axios';
import { onLoginComplete } from 'utilities/ST_Function';

const ChangeUserGroup = (props) => {

    const { isOpen, setIsOpen,arrOptionGroup } = props;



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
        form.setValue("sGroup", "");
        form.clearErrors("sGroup");
       if (isOpen) {
            let sGroupLocal = secureLocalStorage.getItem("group-user");
            console.log("sGroupLocal", sGroupLocal);
            if (sGroupLocal) {
                form.setValue("sGroup", sGroupLocal)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, arrOptionGroup])
    

    const onSubmitUserGroup = () => {
        let sGroup = form.getValues("sGroup")
        secureLocalStorage.setItem("group-user", sGroup);
        let oParam = {
            sGroupID: sGroup,
        };

        AxiosPost(`Authen/UpdateTokenRole`, oParam, (result) => {
            onLoginComplete(result)
            window.location.reload()
        });
        setIsOpen(false);
    }


    return (
        <DialogPreview
            IsOpen={isOpen}
            onClose={() => { setIsOpen(false); }}
            Title={"เปลี่ยนกลุ่มผู้ใช้งาน"}
            sMaxWidth='xs'
            bgColor={"#5197ff"}
            Color='white'
        >
            <FormProvider {...form}>
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid item xs={12}>
                        <SelectFormItem
                            id={"sGroup"}
                            name={"sGroup"}
                            label={"กลุ่มผู้ใช้งาน"}
                            isClearable={true}
                            required={true}
                            options={arrOptionGroup}
                            isPopperCustom={false}
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
        </DialogPreview>
    )
}

export default ChangeUserGroup
