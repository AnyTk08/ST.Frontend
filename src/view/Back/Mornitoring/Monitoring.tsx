import React, {useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material';
import "./Monitoring.css";
//component
import MornitorStatus from './components/MornitorStatus/MornitorStatus';
import AccordionCustom from 'components/Accordion/AccordionCustom';
// yup
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
//input
import { DateRangePickerFrom, SelectFormItem, SelectMultipleFormItem, TextBoxForm } from 'components/Input';
//button
import { BtnClear, BtnSearch } from 'components/Button';
//table mui
import { PaginationInterface, initRows } from 'components/DataGrid';
import RegisUpdatePage from './components/Register/RegisterPage';
import { AxiosGet, AxiosPost } from 'utilities/ST_Axios';
import moment from 'moment';
import i18n from 'config/i18nConfig';
import register from "../../../assets/images/Icon/register.png";
import updating from "../../../assets/images/Icon/updating.png";
import monitoring from "../../../assets/images/Icon/monitoring.png";
import { FnDialog } from 'utilities/ST_Function';


const Monitoring = () => {

    const DialogFn = FnDialog();

    const [arrOptionNatureProject, setarrOptionNatureProject] = useState([] as any)
    const [arrOptionAgency, setarrOptionAgency] = useState([] as any)
    const [arrOptionStatusRegis, setarrOptionStatusRegis] = useState([] as any)
    const [arrOptionStatusUpdate, setarrOptionStatusUpdate] = useState([] as any)
    const [arrOptionYear, setarrOptionYear] = useState([] as any)
    const [arrRound, setarrRound] = useState([] as any)
    const [LoadingTable, setLoadingTable] = useState(false)

    const [dataRow, setDataRow] = useState<PaginationInterface>({
        ...initRows,
        sSortExpression: "dUpdate",
        sSortDirection: "desc",
    });

    const [dataRowBox3, setDataRowBox3] = useState<PaginationInterface>({
        ...initRows,
        sSortExpression: "dUpdate",
        sSortDirection: "desc",
    });


    const [stepProject, setStepProject] = React.useState(0);
    //#region  Form
    let objSchema = {
        sProjectName: yupFormSchemas.string("ชื่อโครงการ", { required: false }),
        sNatureType: yupFormSchemas.string("ลักษณะโครงการ", { required: false }),
        arrAgency: yupFormSchemas.stringArray("หน่วยงานรับผิดชอบ", { required: false }),
        sAreaName: yupFormSchemas.string("พื้นที่ดำเนินการ", { required: false }),
        sStartDate: yupFormSchemas.string("เริ่มโครงการ", { required: false }),
        sEndDate: yupFormSchemas.string("สิ้นสุดโครงการ", { required: false }),
        arrStatus: yupFormSchemas.stringArray("สถานะ", { required: false }),
        sYearMonitoring: yupFormSchemas.string("ปี", { required: false }),
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
        getRoundYear();
    }, [])

    useEffect(() => {
        if (stepProject === 2) {
            loadDataMonitoring();
        }
        else {
            loadData();
        }
    }, [stepProject])

    const getInitOption = () => {
        DialogFn.BlockUI();
        AxiosGet('Monitoring/getInitOption', null, (result) => {
            setarrOptionNatureProject(result.lstNatureType ?? [])
            setarrOptionAgency(result.lstAgency ?? [])
            setarrOptionStatusRegis(result.lstStatusRegister ?? [])
            setarrOptionStatusUpdate(result.lstStatusUpdate ?? [])
            DialogFn.UnBlockUI();

        });
    };

    const getRoundYear = () => {
        DialogFn.BlockUI();
        let year = moment().year();
        AxiosGet('Monitoring/getRoundYear', { nYear: year }, (result) => {
            setarrOptionYear(result.lstYearMonitoring ?? [])
            setarrRound(result.lstRound ?? [])
            form.setValue("sYearMonitoring", year + "")
            DialogFn.UnBlockUI();

        });
    };

    const loadData = (p: PaginationInterface = dataRow) => {
        let year = moment().year();
        let oParam = {
            ...p,
            "nBoxID": stepProject + 1,
            "sProjectName": form.getValues("sProjectName") ?? null,
            "sNatureType": form.getValues("sNatureType") ?? null,
            "sAreaName": form.getValues("sAreaName") ?? null,
            "sStartDate": form.getValues("sStartDate") ? (moment(form.getValues("sStartDate"))).format("DD/MM/YYYY") + "" : null,
            "sEndDate": form.getValues("sEndDate") ? (moment(form.getValues("sEndDate"))).format("DD/MM/YYYY") + "" : null,
            "lstAgency": form.getValues("arrAgency") ? form.getValues("arrAgency") : null,
            "lstStatus": form.getValues("arrStatus") ? form.getValues("arrStatus") : null,
            "nYear": year
        }
        DialogFn.BlockUI();

        setLoadingTable(true);
        AxiosPost(`Monitoring/searchMonitoring`, oParam, (result) => {
            setLoadingTable(false);
            if (result?.cResult) {
                let oResult = result.cResult;
                setDataRow({
                    ...p,
                    arrRows: oResult.lstMonitoring || [],
                    nDataLength: oResult.nDataLength,
                    nPageIndex: oResult.nPageIndex,
                });
                DialogFn.UnBlockUI();
            }
        });
    }

    const loadDataMonitoring = (p: PaginationInterface = dataRow, nYear = moment().year()) => {
        let oParam = {
            ...p,
            "nBoxID": 3,
            "sProjectName": form.getValues("sProjectName") ?? null,
            "sNatureType": form.getValues("sNatureType") ?? null,
            "sAreaName": form.getValues("sAreaName") ?? null,
            "sStartDate": form.getValues("sStartDate") ? (moment(form.getValues("sStartDate"))).format("DD/MM/YYYY") + "" : null,
            "sEndDate": form.getValues("sEndDate") ? (moment(form.getValues("sEndDate"))).format("DD/MM/YYYY") + "" : null,
            "lstAgency": form.getValues("arrAgency") ? form.getValues("arrAgency") : null,
            "lstStatus": form.getValues("arrStatus") ? form.getValues("arrStatus") : null,
            "nYear": nYear
        }
        DialogFn.BlockUI();

        setLoadingTable(true);
        AxiosPost(`Monitoring/searchMonitoring`, oParam, (result) => {
            setLoadingTable(false);
            if (result?.cResult) {
                let oResult = result.cResult;
                setDataRowBox3({
                    ...p,
                    arrRows: oResult.lstMonitoring || [],
                    nDataLength: oResult.nDataLength,
                    nPageIndex: oResult.nPageIndex,
                });
                DialogFn.UnBlockUI();
            }
        });
    }

    const onClearForm = (IsRefresh) => {
        Object.keys(form.getValues()).forEach((key => {
            form.setValue(key, null);
            form.clearErrors(key);
        }))

        if (IsRefresh) {
            if (stepProject === 2) {
                loadDataMonitoring();
            }
            else {
                loadData();
            }
        }
    }



    const handleStep = (step: number) => () => {
        if (step === 2) {
            getRoundYear();
        }
        setStepProject(step);
        onClearForm(false);
    };
    return (
        <Grid container spacing={2} >
            {/* <Grid item xs={12}>
                <div className='div-container-step'>
                    {lstStep.map((item, index) => (
                        <div
                            key={item.sID}
                            className='div-step'
                            onClick={handleStep(index)}
                            style={{
                                color: sColorText(index),
                                // boxShadow: sColorShadow(index),
                                backgroundColor: 'white',
                                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                                transform: divAction(index)
                            }}
                        >
                            <div
                                style={{
                                    background: item.bgColor,
                                    padding: '14px',
                                    borderRadius: "12px"
                                }}
                            >
                                {item.sIcon}
                            </div>

                            <Typography className='label-step'>{item.label}</Typography>
                        </div>
                    ))}
                </div>
            </Grid> */}
            <Grid item xs={12}>
                <div className='div-container-step'>
                    <div
                        className={`card ${stepProject === 0 ? "card-active" : "card-no"}`}
                        onClick={handleStep(0)}
                    >
                        <img src={register} alt='Register' className='card-icon-img' />
                        <Typography className='label-blue'>Project Register</Typography>
                    </div>
                    <div
                        className={`card ${stepProject === 1 ? "card-active" : "card-no"}`}
                        onClick={handleStep(1)}
                    >

                        <img src={updating} alt='Update Progress' className='card-icon-img' />


                        <Typography className='label-blue'>Progress Update</Typography>
                    </div>
                    <div
                        className={`card ${stepProject === 2 ? "card-active" : "card-no"}`}
                        onClick={handleStep(2)}
                    >

                        <img src={monitoring} alt='Monitoring' className='card-icon-img' />


                        <Typography className='label-blue'>Monitoring</Typography>
                    </div>
                </div>
            </Grid>
            {/* <Grid item xs={12}>
                <div className='div-container-step'>
                    <div
                        className='card card-update'
                        onClick={handleStep(0)}
                    >
                        <img src={register} alt='Register' className='card-icon-img' />

                        <Typography className='label-white'>Register</Typography>
                    </div>
                    <div
                        className='card card-update'
                        onClick={handleStep(1)}
                    >
                        <img src={updating} alt='Update' className='card-icon-img' />
                        <Typography className='label-white'>Update Progress</Typography>
                    </div>
                    <div
                        className='card card-update'
                        onClick={handleStep(2)}
                    >
                        <img src={monitoring} alt='Monitoring' className='card-icon-img' />
                        <Typography className='label-white'>Monitoring</Typography>
                    </div>
                </div>
            </Grid> */}
            <Grid item xs={12} style={{ display: stepProject === 0 || stepProject === 1 ? '' : 'none' }}>
                <FormProvider {...form}>
                    <AccordionCustom header={"ค้นหา"}>
                        <Grid container spacing={2} justifyContent={"start"}>
                            <Grid item xs={12} md={4}>
                                <TextBoxForm
                                    id={`sProjectName`}
                                    name={`sProjectName`}
                                    label={"ชื่อโครงการ"}
                                    placeholder={"ชื่อโครงการ"}
                                    required={false}
                                    maxLength={100}
                                    IsShrink={true}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <SelectFormItem
                                    id={"sNatureType"}
                                    name={"sNatureType"}
                                    label={"ลักษณะโครงการ"}
                                    required={false}
                                    options={arrOptionNatureProject}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <SelectMultipleFormItem
                                    id={"arrAgency"}
                                    name={"arrAgency"}
                                    label={'หน่วยงานรับผิดชอบ'}
                                    required={false}
                                    options={arrOptionAgency}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.5}>
                                <TextBoxForm
                                    id={`sAreaName`}
                                    name={`sAreaName`}
                                    label={"พื้นที่ดำเนินการ"}
                                    placeholder={"พื้นที่ดำเนินการ"}
                                    required={false}
                                    maxLength={100}
                                    IsShrink={true}
                                />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <DateRangePickerFrom
                                    nameStart={'sStartDate'}
                                    nameEnd={'sEndDate'}
                                    labelStart={`เริ่มโครงการ`}
                                    labelEnd={`สิ้นสุดโครงการ`}
                                    required={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={2.5}>
                                <SelectMultipleFormItem
                                    id={"arrStatus"}
                                    name={"arrStatus"}
                                    label={'สถานะ'}
                                    required={false}
                                    options={stepProject === 0 ? arrOptionStatusRegis : arrOptionStatusUpdate}
                                />
                            </Grid>
                            <Grid item xs={12} md={'auto'} >
                                <Grid container spacing={1} justifyContent={"center"}>

                                    <Grid item >
                                        <BtnSearch
                                            id='search-monitor'
                                            txt={`${i18n.t("Btn.sSheach")}`}
                                            onClick={() => { loadData() }} />
                                    </Grid>
                                    <Grid item >
                                        <BtnClear
                                            id='clear-monitor'
                                            txt={`${i18n.t("Btn.sClear")}`}
                                            onClick={() => { onClearForm(true) }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionCustom>
                </FormProvider>
            </Grid>
            <Grid item xs={12}>
                <div className='div-container-child'>
                    {stepProject === 0 && <RegisUpdatePage dataRow={dataRow} LoadingTable={LoadingTable} loadData={loadData} isRegister />}
                    {stepProject === 1 && <RegisUpdatePage dataRow={dataRow} LoadingTable={LoadingTable} loadData={loadData} />}
                    {stepProject === 2 &&
                        <>
                            <FormProvider {...form}>
                                <Grid container spacing={0} justifyContent={"start"}>
                                    <Grid item xs={8} md={2}>
                                        <SelectFormItem
                                            id={"sYearMonitoring"}
                                            name={"sYearMonitoring"}
                                            label={"ปี"}
                                            required={true}
                                            options={arrOptionYear}
                                            isClearable={true}
                                            onChange={(event) => {
                                                if (event) {
                                                    loadDataMonitoring(dataRow, event.value)
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </FormProvider>
                            <MornitorStatus dataRow={dataRowBox3} arrRound={arrRound} LoadingTable={LoadingTable} />

                        </>
                    }
                </div>
            </Grid>
        </Grid>
    )
}

export default Monitoring