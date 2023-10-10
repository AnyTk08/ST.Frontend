import { Box, Chip, Divider, Grid, Table, TableBody, TableCell, TableRow, Skeleton, } from "@mui/material";
import AccordionCustom from "components/Accordion/AccordionCustom";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AxiosGet, AxiosPostFileExcel, AxiosPostFilePDF } from "utilities/ST_Axios";
import RenderText from "./RenderText";
import { FormProvider, useForm } from "react-hook-form";
import UploadFile from "components/Input/UploadFile/UploadFile";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Extension, FnDialog, formatNumber } from "utilities/ST_Function";
import { Folder, PlaceRounded } from "@mui/icons-material";
import MapCompoents from "view/Map/MapCompoents";
import { styled } from '@mui/material/styles';
import DataGrid, { PaginationInterface, initRows } from "components/DataGrid";
import { GridColumns } from "@mui/x-data-grid";
import GraphProject from "./GraphProject";
import { BtnExcel, BtnPDF } from "components/Button";
import moment from "moment";
import './Project.css'
import { SwiperGellary } from "components/Swiper";
import ModalExportMap from "view/Map/ModalExportMap";
import { SelectFormItem } from "components/Input";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ProjectReport = (props) => {

    const [IsLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const [nAreaID] = useState(location?.state ? location.state["nAreaID"] : 12);
    const onClearFileProject = useRef(null);
    const onClearFileIndicator = useRef(null);
    const [lstFileProjectDocument, setLstFileProjectDocument] = useState([] as any);
    const [lstFileIndicator, setLstFileIndicator] = useState([] as any);
    const [arrMarkerView, setarrMarkerView] = useState([] as any);
    const [sImgChart, setsImgChart] = useState("");
    const [isOpenExportPDF, setisOpenExportPDF] = useState(false);
    const [isOpenExportExcel, setisOpenExportExcel] = useState(false);
    const [locationLatLng, setlocationLatLng] = useState(null);
    const [Base64PDF, setBase64PDF] = useState(null);
    const [Base64Excel, setBase64Excel] = useState(null);
    const [nRound, setRound] = useState(null);
    const [nYear, setYear] = useState(null);
    const [arrRoundUpdate, setArrRoundUpdate] = useState([] as any);
    const [IsAreaLoading, setIsAreaLoading] = useState(false);
    const [oProject, setProject] = useState<any>({});
    const [oArea, setArea] = useState<any>({});
    const [lstGraph, setGraph] = useState([]);
    const mapRefView = useRef(null);
    const DialogFn = FnDialog();

    const [DataRowAreaBudget, setDataRowAreaBudget] =
        useState<PaginationInterface>({
            ...initRows,
            sSortExpression: "dUpdate",
            sSortDirection: "desc",
        });

    const [DataRowIndicator, setDataRowIndicator] =
        useState<PaginationInterface>({
            ...initRows,
            sSortExpression: "dUpdate",
            sSortDirection: "desc",
        });

    const schema = yup.object().shape({});

    const form = useForm({
        resolver: yupResolver(schema),
        mode: "all",
        shouldFocusError: true,
        criteriaMode: "firstError",
    });

    const dataColumnIndicator: GridColumns = [
        {
            field: "sRound",
            headerName: "ปี (พ.ศ.)",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 100
        },
        {
            field: "label",
            headerName: "ตัวชี้วัด",
            headerAlign: "center",
            align: "left",
            sortable: false,
            resizable: false,
            flex: 3,
        },
        {
            field: "sUnit",
            headerName: "หน่วย",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
        },
        {
            field: "nBudget",
            headerName: "ผลการดำเนินงานตามตัวชี้วัด (บาท)",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
            renderCell: (item) => {
                let sBudget = formatNumber(item.row.nBudget, 2);
                return item.row.nBudget ? sBudget : "-";
            }
        }
    ];

    const dataColumnAreaBudget: GridColumns = [
        {
            field: "sRound",
            headerName: "ปี (พ.ศ.)",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
        },
        {
            field: "nBudget",
            headerName: "งบประมาณตามแผน (บาท)",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
            renderCell: (item) => {
                let sBudget = formatNumber(item.row.nBudget, 2);
                return sBudget;
            }
        },
        {
            field: "nResultBudget",
            headerName: "งบประมาณใช้จริง (บาท)",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
            renderCell: (item) => {
                let sBudget = formatNumber(item.row.nResultBudget, 2);
                return sBudget;
            }
        },
    ];


    useEffect(() => {
        onGetReport();
    }, [nAreaID]);

    const onGetReport = (nRoundID = null) => {
        setIsAreaLoading(true);
        setIsLoading(true);
        let nYear = null;
        let nRound = null;

        if (nRoundID) {
            nYear = nRoundID.nYear;
            nRound = nRound.nRound;
        }
        AxiosGet(
            "Project/GetReportArea",
            { nAreaID: nAreaID, nYear: nYear, nRound: nRound },
            (Result) => {
                if (Result.Status === 200) {
                    setProject(Result.Data.oProject);
                    setArea(Result.Data.oArea);
                    let area = Result.Data.oArea;

                    if ((area.oRoundUpdate?.lstRoundUpdate ?? []).length > 0 && nRoundID === null) {
                        let arrRoundUpdate = area.oRoundUpdate?.lstRoundUpdate ?? [];
                        setArrRoundUpdate(arrRoundUpdate);
                        form.setValue("sRound", arrRoundUpdate[0].value);
                        setRound(arrRoundUpdate[0].nRound);
                        setYear(arrRoundUpdate[0].nYear);
                    }

                    setLstFileProjectDocument(Result.Data.oProject.lstFileProjectDocument ?? []);
                    setLstFileIndicator(Result.Data.oArea.lstFileIndicatorDocument ?? []);
                    setarrMarkerView(Result.Data.oArea.lstMarkerMap)
                    let markerExport = Result.Data.oArea.lstMarkerMap || [];
                    if (markerExport.length > 0) {
                        setlocationLatLng({
                            lat: markerExport[0].lat,
                            lng: markerExport[0].lng,
                        })
                    }

                    setDataRowAreaBudget({
                        ...DataRowAreaBudget,
                        arrRows: Result.Data.oArea.lstBudget ?? [],
                    });

                    setDataRowIndicator({
                        ...DataRowIndicator,
                        arrRows: Result.Data.oArea.oResultOperation?.lstResultIndicator ?? [],
                    });

                    setGraph(Result.Data.oArea.oResultOperation?.lstGraphProject ?? [])

                    setIsLoading(false);
                    setIsAreaLoading(false);
                }
            })
    }

    const ExportPDF = async () => {
        setisOpenExportPDF(false)
        DialogFn.BlockUI();
        let param = {
            sAreaID: nAreaID + "",
            sBase64Map: Base64PDF,
            sBase64Graph: sImgChart,
            nRound: nRound,
            nYear: nYear
        }
        let sProjectName = oProject?.sProjectName ?? "ProjectName";

        let fileName = `CRSR_${sProjectName}_${moment().format('yyyyMMDDHHmmss')}.pdf`;
        await AxiosPostFilePDF("Export/ExportPDF", param, fileName, () => {
            setBase64PDF(null)
            DialogFn.UnBlockUI()
        })

    }

    const ExportExcel = async () => {
        setisOpenExportExcel(false)
        DialogFn.BlockUI();
        let param = {
            sAreaID: nAreaID + "",
            sBase64Map: Base64Excel,
            sBase64Graph: sImgChart,
            nRound: nRound,
            nYear: nYear
        }
        let sProjectName = oProject?.sProjectName ?? "ProjectName";
        let fileName = `CRSR_${sProjectName}_${moment().format('yyyyMMDDHHmmss')}.xls`;
        AxiosPostFileExcel("Export/ExportExcel", param, fileName, () => {
            setBase64Excel(null)
            DialogFn.UnBlockUI()
        })
    }

    useEffect(() => {
        if (Base64Excel) {
            console.log("Export Excel");
            ExportExcel()
        }
    }, [Base64Excel])

    useEffect(() => {
        if (Base64PDF) {
            console.log("Export Excel");
            ExportPDF()
        }
    }, [Base64PDF])



    return (
        <React.Fragment>
            <Grid container spacing={2}>
                {IsAreaLoading ?
                    <Grid item xs={12}>
                        <AccordionCustom header="รายละเอียดโครงการ" color="#50cd89" bgColor="#e8fff3" borderColor="1px solid #50cd89">
                            <Grid container spacing={2} justifyContent={"space-between"}>
                                <Grid item md={9} xs={12}>
                                    <Grid container spacing={2} alignItems={"center"} flexWrap={"nowrap"}>
                                        <Grid item xs={2}>
                                            <Skeleton variant="rounded" height={100} width={100} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={1}>
                                                        <Grid item xs={6}>
                                                            <Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={3} xs={12} display={"grid"} alignItems={"center"} justifyItems={"center"}>
                                    <Grid container alignItems={"center"} justifyItems={"center"}>
                                        <Grid item xs={12}>
                                            <Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Skeleton variant="rounded" height={60} width={50} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Skeleton variant="rounded" height={60} width={50} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Divider style={{ borderColor: "#50cd89", borderBottomWidth: "medium", margin: "1rem 0" }} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} className="border-right-container" sx={{ mt: 3, pr: 16, paddingTop: "0 !important" }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={200} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={200} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={200} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={200} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={200} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} width="50%" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={100} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ mt: 3, paddingTop: "0 !important" }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Skeleton variant="rounded" height={30} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Skeleton variant="rounded" height={30} width="30%" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} width="30%" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={300} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={100} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} width="30%" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {(Array.from(Array(7), (e, i) => {
                                                return (
                                                    <Grid container spacing={2} key={"skeleton_" + e} sx={{ pb: "16px" }}>
                                                        <Grid item xs={12} md={6} >
                                                            <Skeleton variant="rounded" height={30} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} >
                                                            <Skeleton variant="rounded" height={30} />
                                                        </Grid>
                                                    </Grid>
                                                )
                                            }))}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} width="30%" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            {(Array.from(Array(7), (e, i) => {
                                                return (
                                                    <Grid container spacing={2} key={"skeleton_" + e} sx={{ pb: "16px" }}>
                                                        <Grid item xs={12} md={6} >
                                                            <Skeleton variant="rounded" height={30} />
                                                        </Grid>
                                                        <Grid item xs={12} md={3} >
                                                            <Skeleton variant="rounded" height={30} />
                                                        </Grid>
                                                    </Grid>
                                                )
                                            }))}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={100} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={30} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={50} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Skeleton variant="rounded" height={100} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} mt={3}>
                                <Grid item xs={12}>
                                    <Divider textAlign="center">
                                        <Chip
                                            label="ผลการดำเนินโครงการ"
                                            className="divider-chip"
                                        />
                                    </Divider>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Skeleton variant="rounded" height={30} width="30%" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton variant="rounded" height={200} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton variant="rounded" height={400} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={2} justifyContent={"center"}>
                                        <Grid item>
                                            <Skeleton variant="rounded" height={30} width={30} />
                                        </Grid>
                                        <Grid item>
                                            <Skeleton variant="rounded" height={30} width={30} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton variant="rounded" height={30} width="30%" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton variant="rounded" height={200} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton variant="rounded" height={30} width="30%" />
                                </Grid>
                                <Grid item xs={12}>
                                    <Skeleton variant="rounded" height={200} />
                                </Grid>
                            </Grid>
                        </AccordionCustom>
                    </Grid>
                    :
                    <Grid item xs={12}>
                        <AccordionCustom header="รายละเอียดโครงการ" color="#50cd89" bgColor="#e8fff3" borderColor="1px solid #50cd89">
                            <Grid container spacing={2} justifyContent={"space-between"}>
                                <Grid item md={9} xs={12}>
                                    <Grid container spacing={2} alignItems={"start"} flexWrap={"nowrap"}>
                                        <Grid item>
                                            <Box
                                                component="div"
                                                sx={{
                                                    flexGrow: 1,
                                                    backgroundImage: `url(${oProject?.oSDGImage?.sFileLink})`,
                                                    backgroundSize: "cover",
                                                    backgroundRepeat: "no-repeat",
                                                    objectFit: 'contain',
                                                    cursor: 'pointer',
                                                    height: '100px',
                                                    width: '100px',
                                                    margin: '7px'
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Grid container>
                                                <Grid item xs={12} sx={{ fontSize: "21pt", fontWeight: "bold" }}>
                                                    {oProject?.sProjectName}
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={1}>
                                                        <Grid item>
                                                            <Chip size="small" style={{ fontSize: "1.4rem" }} color="success" label={oProject?.sCorporateStrategyName} />
                                                        </Grid>
                                                        <Grid item>
                                                            <Chip size="small" style={{ fontSize: "1.4rem" }} color="warning" label={oProject?.sAgencyName} />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item md={3} xs={12} display={"grid"} alignItems={"center"} justifyItems={"center"}>
                                    {(arrRoundUpdate ?? []).length > 0 ?
                                        <Grid container spacing={1} alignItems={"center"}>
                                            <Grid item>
                                                รายงานประจำปี
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormProvider {...form}>
                                                    <SelectFormItem
                                                        id={"sRound"}
                                                        name={"sRound"}
                                                        placeholder="รอบที่"
                                                        required={false}
                                                        options={arrRoundUpdate}
                                                        onChange={(e) => {
                                                            if (e !== null) {
                                                                onGetReport(e);
                                                                setRound(e.nRound);
                                                                setYear(e.nYear);
                                                            }
                                                        }}
                                                    />
                                                </FormProvider>
                                            </Grid>
                                        </Grid>
                                        :
                                        <Grid item>
                                            รายงานประจำปี {oArea?.oRoundUpdate?.sRound ?? "-"}
                                        </Grid>
                                    }

                                    <Grid item>
                                        <BtnExcel onClick={() => { setisOpenExportExcel(true) }} />
                                        <BtnPDF onClick={() => { setisOpenExportPDF(true) }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Divider style={{ borderColor: "#50cd89", borderBottomWidth: "medium", margin: "1rem 0" }} />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} className="border-right-container" sx={{ mt: 3, pr: 16, paddingTop: "0 !important" }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="ช่วงเวลาการดำเนินงาน:"
                                                text={oProject?.sDuration}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="ลักษณะโครงการ:"
                                                text={oProject?.sProjectNatureName}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="หน่วยงานรับผิดชอบรอง:"
                                                text={oProject?.sProjectAgencySecondary}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="ที่มาโครงการ"
                                                text={oProject?.sProjectOrigin}
                                                IsFlex={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="วัตถุประสงค์"
                                                text={oProject?.sObjective}
                                                IsFlex={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="เป้าหมาย"
                                                text={oProject?.sTarget}
                                                IsFlex={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="ความเชื่อมโยงทางธุรกิจ"
                                                text={oProject?.sBusinessConnection}
                                                IsFlex={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="ความเสี่ยง"
                                                text={oProject?.sRisk}
                                                IsFlex={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                Icon={<Folder htmlColor="#F6C000" />}
                                                header={"เอกสารที่เกี่ยวข้อง"}
                                                text={" "}
                                            />
                                            <FormProvider {...form}>
                                                <UploadFile
                                                    IsRequired={false}
                                                    modeDisplay={"list"}
                                                    id={"oFileDocument"}
                                                    name={"oFileDocument"}
                                                    keyID={1}
                                                    IsDrag={false}
                                                    arrFile={
                                                        lstFileProjectDocument
                                                    }
                                                    setarrFile={
                                                        setLstFileProjectDocument
                                                    }
                                                    Extension={
                                                        Extension.ImageDocument
                                                    }
                                                    IsFolder={false}
                                                    isFileChange={true}
                                                    IsMultiple={true}
                                                    onClearFile={
                                                        onClearFileProject
                                                    }
                                                    sFolderTemp="DocumentProject"
                                                    nLimitFile={3}
                                                    sLimitFile="MB"
                                                    sPositionText="right"
                                                    IsMultiDelete={false}
                                                    disabled
                                                    IsHide
                                                />
                                            </FormProvider>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ mt: 3, paddingTop: "0 !important" }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <RenderText
                                                Icon={<PlaceRounded color="error" />}
                                                header="พื้นที่ดำเนินการ"
                                                text={" "}
                                                textChip={<Chip size="small" style={{ background: oArea?.IsAreaActivated ? "#e8fff3" : "#fff5f8", color: oArea?.IsAreaActivated ? "#399e67" : "#f1416c", fontSize: "1.1rem" }} label={oArea?.IsAreaActivated ? "Actived" : "Closed"} />}
                                            />

                                        </Grid>
                                        <Grid item xs={12}>
                                            <p>{oArea?.sAreaName}</p>
                                            <Chip size="small" style={{ background: "#cbbae7", color: "#7239ea", fontSize: "1.1rem" }} label={oArea?.sAreaTypeName} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    minHeight: "300px",
                                                }}
                                            >
                                                <MapCompoents
                                                    id={"div-view"}
                                                    mapRef={mapRefView}
                                                    IsMultiMarker={true}
                                                    Isdisable={false}
                                                    IsMarker={false}
                                                    IsPopUp={true}
                                                    IsSearch={false}
                                                    IsFullScreen={false}
                                                    sHeight={"300px"}
                                                    arrMarker={arrMarkerView}
                                                    setarrMarker={setarrMarkerView}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header="ผู้ที่มีส่วนได้ส่วนเสียที่สำคัญ/แกนนำชุมชน:"
                                                lstText={oArea?.lstStakeholderInfo}
                                                IsFlex={false}
                                                IsFlexList
                                                IsList
                                                IsOrder
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <RenderText
                                                        header="ผลการประเมินศักยภาพชุมชน"
                                                        text={" "}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <RenderText
                                                                header="ก่อนดำเนินการ"
                                                                lstText={(oArea?.lstBeforeScore ?? []).map((m) => m.sScoreTypeName)}
                                                                lstSubtext={(oArea?.lstBeforeScore ?? []).map((m) => m.sScore)}
                                                                IsList={true}
                                                                IsFlexList={true}
                                                                IsFlex={false}
                                                                IsFormat
                                                                endAdornment={"คะแนน"}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <RenderText
                                                                header={"หลังดำเนินการ " + (oArea?.IsBudgetProject ? "(รวมโครงการ)" : "(รายพื้นที่)")}
                                                                lstText={(oArea?.lstAfterScore ?? []).map((m) => m.sScoreTypeName)}
                                                                lstSubtext={(oArea?.lstAfterScore ?? []).map((m) => m.sScore)}
                                                                IsList={true}
                                                                IsFlexList={true}
                                                                IsFlex={false}
                                                                IsFormat
                                                                endAdornment={"คะแนน"}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header={(oArea?.lstCommunity ?? []).filter(f => f.IsTitle).map((m) => m.sCommunityTypeName).toString()}
                                                text={(oArea?.lstCommunity ?? []).filter(f => f.IsTitle).map((m) => m.sCommunityTypeValue).toString()}
                                                IsFlex={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Table style={{ border: "1px solid #3E97FF" }}>
                                                <TableBody>
                                                    {(oArea?.lstCommunity ?? []).filter(f => f.IsList).map((row) => (
                                                        <StyledTableRow key={row.sID}>
                                                            <TableCell align="left" style={{ padding: 5, fontSize: "1.2rem", background: "#3E97FF", color: "#fff" }}>
                                                                {row.sCommunityTypeName}
                                                            </TableCell>
                                                            <TableCell align="right" style={{ padding: 5, fontSize: "1.2rem" }}>
                                                                {row.sCommunityTypeValue}
                                                            </TableCell>
                                                        </StyledTableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <RenderText
                                                        header={(oArea?.lstResource ?? []).filter(f => f.IsTitle).map((m) => m.sCommunityTypeName).toString()}
                                                        text={" "}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {(oArea?.lstResource ?? []).filter(f => !f.IsTitle).map((m, i) =>
                                                        <RenderText
                                                            key={m.sCommunityTypeName}
                                                            header={`${m.sCommunityTypeName}:`}
                                                            text={m.sCommunityTypeValue}
                                                            IsFlex={false}
                                                        />
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <RenderText
                                                        header={(oArea?.lstCommunityProject ?? []).filter(f => f.IsTitle).map((m) => m.sCommunityTypeName).toString()}
                                                        text={" "}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {(oArea?.lstCommunityProject ?? []).filter(f => !f.IsTitle).map((m, i) =>
                                                        <RenderText
                                                            key={m.sCommunityTypeName}
                                                            header={`${m.sCommunityTypeName}:`}
                                                            text={m.sCommunityTypeValue}
                                                            IsFlex={false}
                                                        />
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header={"ความคิดเห็นชุมชน"}
                                                text={oArea?.sComment}
                                                IsFlex={false}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                header={"งบประมาณ " + (oArea?.IsBudgetProject ? "(รวมโครงการ)" : "(รายพื้นที่)")}
                                                text={" "}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} >
                                            <DataGrid
                                                isLoading={IsLoading}
                                                columns={dataColumnAreaBudget}
                                                rows={DataRowAreaBudget}
                                                isHiddenToolHead
                                                onLoadData={(e) => { }}
                                                isNotShowPagination
                                                isNotShowTotal
                                                isHideFooter
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <RenderText
                                                Icon={<Folder htmlColor="#F6C000" />}
                                                header={"เอกสารแผนการดำเนินงานตามตัวชี้วัด"}
                                                text={" "}
                                            />
                                            <FormProvider {...form}>
                                                <UploadFile
                                                    IsRequired={false}
                                                    modeDisplay={"list"}
                                                    id={"oFileIndicator"}
                                                    name={"oFileIndicator"}
                                                    keyID={4}
                                                    IsDrag={false}
                                                    arrFile={
                                                        lstFileIndicator
                                                    }
                                                    setarrFile={
                                                        setLstFileIndicator
                                                    }
                                                    Extension={
                                                        Extension.ImageDocument
                                                    }
                                                    IsFolder={false}
                                                    isFileChange={true}
                                                    IsMultiple={true}
                                                    onClearFile={
                                                        onClearFileIndicator
                                                    }
                                                    sFolderTemp="Indicator"
                                                    nLimitFile={3}
                                                    sLimitFile="MB"
                                                    sPositionText="right"
                                                    IsMultiDelete={false}
                                                    disabled
                                                    IsHide
                                                />
                                            </FormProvider>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SwiperGellary id="AreaImage" arrImage={oArea?.lstImageArea} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} mt={3}>
                                <Grid item xs={12}>
                                    <Divider textAlign="center">
                                        <Chip
                                            label="ผลการดำเนินโครงการ"
                                            className="divider-chip"
                                        />
                                    </Divider>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <RenderText
                                        header={"ผลการดำเนินงานตามตัวชี้วัด " + (oArea?.IsBudgetProject ? "(รวมโครงการ)" : "(รายพื้นที่)")}
                                        text={" "}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} >
                                    <DataGrid
                                        isLoading={IsLoading}
                                        columns={dataColumnIndicator}
                                        rows={DataRowIndicator}
                                        isHiddenToolHead
                                        onLoadData={(e) => { }}
                                        isNotShowPagination
                                        isNotShowTotal
                                        isHideFooter
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <GraphProject
                                        lstData={lstGraph}
                                        setsImgChart={setsImgChart}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header="การนำองค์ความรู้ที่มีมาประยุกต์ใช้"
                                        text={oArea?.oResultOperation?.sExplicitKnowledge}
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header="การถ่ายทอดองค์ความรู้ใหม่จากการดำเนินงาน"
                                        text={oArea?.oResultOperation?.sPassOnKnowledge}
                                        IsFlex={false}
                                    />
                                </Grid>
                            </Grid>
                        </AccordionCustom>
                    </Grid>
                }
            </Grid >
            <ModalExportMap
                isOpen={isOpenExportPDF}
                setIsOpen={setisOpenExportPDF}
                Title={"Export PDF"}
                locationLatLng={locationLatLng}
                bgColor={"#e5252a"}
                setBase64={setBase64PDF}
                onClick={ExportPDF}
            />
            <ModalExportMap
                isOpen={isOpenExportExcel}
                setIsOpen={setisOpenExportExcel}
                Title={"Export Excel"}
                locationLatLng={locationLatLng}
                bgColor={"#00733b"}
                setBase64={setBase64Excel}
                onClick={ExportExcel}
            />
        </React.Fragment >
    );
}

export default ProjectReport;