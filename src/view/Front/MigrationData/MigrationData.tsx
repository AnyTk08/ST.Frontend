import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { Extension, FnDialog, ParseHtml } from 'utilities/ST_Function';
import UploadFile from 'components/Input/UploadFile/UploadFile';
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import yupFormSchemas from 'components/FormItem/yupFormSchemas'
import { AxiosPost } from 'utilities/ST_Axios';

const MigrationData = () => {

    const DialogFn = FnDialog();

    const onClearImportFile = useRef(null);
    const [arrImport, setarrImport] = useState([] as any)

    const schema = yup.object().shape({
        sFileImport: yupFormSchemas.string("FileUpload", { required: true }),
    });
    const formResolver = yupResolver(schema);

    const form = useForm({
        resolver: formResolver,
        shouldUnregister: false,
        shouldFocusError: true,
        mode: "all",
        defaultValues: {} as any,
    });


    const onAddImportData = useCallback(() => {
        let param = {
            lstFile: arrImport,
        }

        AxiosPost("Migration/MigrationDataProject", param, 
        (res) => {
            onClearImportFile.current(null)
        }, (data)=>{
            onClearImportFile.current(null)
            if(data.Message)
            {
                DialogFn.SubmitWarning(ParseHtml(data.Message));
            }
        }, null);
    }, [DialogFn, arrImport])

    useEffect(() => {
        if (arrImport.length > 0) {
            console.log("arrImport",arrImport);
            
            onAddImportData();
        }
    }, [arrImport, onAddImportData])



    return (
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12}>
                <Typography
                    sx={{
                        fontSize: "1.75rem !important",
                        color: '#005ab7'
                    }}
                >
                    Migration Data
                </Typography>
            </Grid>
            <Grid item >
                <FormProvider {...form}>
                    <UploadFile
                        id="sFileImport"
                        name={"sFileImport"}
                        keyID={1}
                        sTitle={"File Import"}
                        IsRequired={false}
                        arrFile={arrImport}
                        setarrFile={setarrImport}
                        sFolderTemp="MigrationData"
                        IsFolder={false}
                        IsMultiple={false}
                        Extension={[...Extension.Excel]}
                        nLimitFile={10}
                        sLimitFile={"MB"}
                        onClearFile={onClearImportFile}
                        sPositionText="right"
                    />
                </FormProvider>
            </Grid>
            <Grid item xs={12}>

            </Grid>
        </Grid>
    )
}

export default MigrationData
