import React, { useEffect, useRef, useState } from "react";
import { Chip, Divider, Fade, Grid, Tooltip, Typography } from "@mui/material";
import { Extension, FnDialog, formatNumber } from "utilities/ST_Function";
import RenderText from "./RenderText";
import AccordionCustom from "components/Accordion/AccordionCustom";
import HeaderInput from "components/Input/HeaderInput";
import MapCompoents from "view/Map/MapCompoents";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import UploadFile from "components/Input/UploadFile/UploadFile";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FormProvider } from "react-hook-form";
import { GridColumns } from "@mui/x-data-grid-pro";
import DataGrid, { PaginationInterface, initRows } from "components/DataGrid";
import { CheckboxGroupFormItem } from "components/Input/Checkbox";
import AreaResult from "./AreaResult";
import { AxiosGet } from "utilities/ST_Axios";
import AreaKnowledge from "./AreaKnowledge";
import yupFormSchemas from "components/FormItem/yupFormSchemas";
import { BtnSave } from "components/Button";
import ProjectResult from "./ProjectResult";

const ProjectUpdate = (props) => {
    const { IsSave, onSave, sMode, nProjectID, nAreaID, arrData, IsShowSendCC, IsApprove, IsEditApprove } = props;
    const DialogFn = FnDialog();
    const mapRefView = useRef(null);
    const mapRefArea = useRef(null);
    const onClearFileProject = useRef(null);
    const [IsLoadingHistory, setLoadingHistory] = useState(false);
    const [IsClosed, setIsClosed] = useState(false);

    const [data, setData] = useState<any>({});
    const [arrMarkerView, setarrMarkerView] = useState([] as any);
    const [arrMarkerViewArea, setarrMarkerViewArea] = useState([] as any);
    const [lstFileProjectDocument, setLstFileProjectDocument] = useState([] as any);
    const [lstFileIndicatorDocument, setLstFileIndicatorDocument] = useState([] as any);

    const [arrFileResult, setArrFileResult] = useState([]);
    const [arrFileKnowlegde, setArrFileKnowlegde] = useState([]);

    const [oScoreTypeArea, setObjScoreTypeArea] = useState([]);
    const [oScoreTypeProject, setObjScoreTypeProject] = useState([]);
    const [oIndicator, setIndicator] = useState([]);
    const [oIndicatorProject, setIndicatorProject] = useState([]);
    const [oUpdateData, setUpdateData] = useState({} as any);
    const [nYear, setYear] = useState(null);
    const [nRound, setRound] = useState(null);
    const [IsUpdateByProject, setIsUpdateByProject] = useState(false);
    const [IsBudgetByProject, setIsBudgetByProject] = useState(false);
    const [oBudgetProject, setBudgetProject] = useState([]);
    const [oBudgetArea, setBudgetArea] = useState([]);
    const [sPassOnKnowledge, setPassOnKnowledge] = useState(null);
    const [sExplicitKnowledge, setExplicitKnowledge] = useState(null);
    const [nRoundEdit, setRoundEdit] = useState(null);
    const [nYearEdit, setYearEdit] = useState(null);
    const [arrYearUpdate, setArrYearUpdate] = useState([]);
    const [arrRoundUpdate, setArrRoundUpdate] = useState([]);


    const onSetYubScore = (data) => {
        //set yub required
        let objSchemaformArea = { ...objSchemaUpdate };
        let oScoreType = data || [];

        if (IsUpdateByProject) {
            oScoreType.forEach((item) => {
                objSchemaformArea[`sProjectScoreAfter_${item.value}`] = yupFormSchemas.decimal("คะแนน", { required: false, }).max(5, "ระบุคะแนนได้ไม่เกิน 5");
                setSchemaUpdate({ ...objSchemaformArea });
            });
        } else {
            oScoreType.forEach((item) => {
                objSchemaformArea[`sScoreAfter_${item.value}`] = yupFormSchemas.decimal("คะแนน", { required: false, }).max(5, "ระบุคะแนนได้ไม่เกิน 5");
                setSchemaUpdate({ ...objSchemaformArea });
            });
        }


        form.clearErrors();
    };

    const [DataRowCoSDGs, setDataRowCoSDGs] = useState<PaginationInterface>({
        ...initRows,
        sSortExpression: "dUpdate",
        sSortDirection: "desc",
    });

    const [DataRowArea, setDataRowArea] = useState<PaginationInterface>({
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

    const [DataRowStakeholder, setDataRowStakeholder] =
        useState<PaginationInterface>({
            ...initRows,
            sSortExpression: "dUpdate",
            sSortDirection: "desc",
        });

    const [DataRowAreaBudget, setDataRowAreaBudget] =
        useState<PaginationInterface>({
            ...initRows,
            sSortExpression: "dUpdate",
            sSortDirection: "desc",
        });
    const [DataRowProjectBudget, setDataRowProjectBudget] =
        useState<PaginationInterface>({
            ...initRows,
            sSortExpression: "dUpdate",
            sSortDirection: "desc",
        });
    const [DataRowHistory, setDataRowHistory] =
        useState<PaginationInterface>({
            ...initRows,
            sSortExpression: "sDateAction",
            sSortDirection: "desc",
        });

    const dataColumnAreaBudget: GridColumns = [
        {
            field: "sYear",
            headerName: "ปี (พ.ศ.)",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
            renderCell: (item) => {
                let nYear = parseInt(item.row.sYear) + 543;
                return nYear;
            }
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
    ];

    const dataColumnProjectBudget: GridColumns = [
        {
            field: "sYear",
            headerName: "ปี (พ.ศ.)",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
            renderCell: (item) => {
                let nYear = parseInt(item.row.sYear) + 543;
                return nYear;
            }
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
    ];

    const dataColumnCoSDGs: GridColumns = [
        {
            field: "sNo",
            headerName: "ลำดับที่",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 100,
        },
        {
            field: "sName",
            headerName: "Global Strategy",
            headerAlign: "center",
            align: "left",
            sortable: false,
            resizable: false,
            flex: 1,
        },
    ];

    const dataColumnIndicator: GridColumns = [
        {
            field: "sNo",
            headerName: "ลำดับที่",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 100,
        },
        {
            field: "sName",
            headerName: "ตัวชี้วัด",
            headerAlign: "center",
            align: "left",
            sortable: false,
            resizable: false,
            flex: 2,
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
    ];

    const dataColumnArea: GridColumns = [
        {
            field: "sNo",
            headerName: "ลำดับที่",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 100,
        },
        {
            field: "sAreaName",
            headerName: "พื้นที่ดำเนินการ",
            headerAlign: "center",
            align: "left",
            sortable: false,
            resizable: false,
            flex: 2,
        },
        {
            field: "sAreaTypeName",
            headerName: "ลักษณะพื้นที่",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
        },
        {
            field: "sCommunityTypeName",
            headerName: "ประเภทชุมชน",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
        },
        {
            field: "sStakeholders",
            headerName: "ผู้มีส่วนได้ส่วนเสียที่สำคัญ",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 2,
        },
    ];

    const dataColumnStakeholder: GridColumns = [
        {
            field: "sNo",
            headerName: "ลำดับที่",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 100,
        },
        {
            field: "sNameStakeholder",
            headerName: "รายชื่อ",
            headerAlign: "center",
            align: "left",
            sortable: false,
            resizable: false,
            width: 150,
            // flex: 3,
        },
        {
            field: "sType",
            headerName: "ประเภทผู้มีส่วนได้ส่วนเสีย",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            // flex: 2,
            width: 200,
        },
        {
            field: "sPosition",
            headerName: "ตำแหน่ง",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            // flex: 2,
            width: 200,
        },
        {
            field: "sAgency",
            headerName: "สังกัด",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            // flex: 2,
            width: 100,
        },
        {
            field: "sTel",
            headerName: "เบอร์โทรศัพท์",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            // flex: 1,
            width: 100,
        },
        {
            field: "sAddress",
            headerName: "ที่อยู่",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            // flex: 3,
            width: 200,
        },
        {
            field: "sDetail",
            headerName: "รายละเอียดเพิ่มเติม",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            // flex: 3,
            width: 200,
        },
    ];

    const dataColumnHistory: GridColumns = [
        {
            field: "sNo",
            headerName: "ครั้งที่",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            width: 100,
        },
        {
            field: "sDateAction",
            headerName: "วันที่ดำเนินการ",
            headerAlign: "center",
            align: "center",
            sortable: true,
            resizable: false,
            flex: 1,
        },
        {
            field: "sActionBy",
            headerName: "ชื่อผู้ดำเนินการ",
            headerAlign: "center",
            align: "left",
            sortable: false,
            resizable: false,
            flex: 2,
        },
        {
            field: "sRequestType",
            headerName: "ขั้นตอนการดำเนินการ",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
        },
        {
            field: "sStatus",
            headerName: "สถานะ",
            headerAlign: "center",
            align: "center",
            sortable: false,
            resizable: false,
            flex: 1,
        },
        {
            field: "sRemark",
            headerName: "เหตุผล",
            headerAlign: "center",
            align: "left",
            sortable: false,
            resizable: false,
            flex: 2,
        },
    ];

    useEffect(() => {
        console.log("IsSave", IsSave)
        if (IsSave) {
            if (sMode === "S") {
                document.getElementById("submit").click();
            } else if (sMode === "D") {
                onApproved();
            } else if (sMode === "A" || sMode === "R") {
                onApproved();
            }
            console.log("form", form.getValues());
        }
    }, [IsSave]);

    useEffect(() => {
        DialogFn.UnBlockUI();
        if (arrData) {
            OnSetData();
        }
    }, [arrData]);

    useEffect(() => {
        DialogFn.UnBlockUI();
        onGetProject();
        GetHistoryLog(DataRowHistory);
        if (!IsEditApprove) {
            if (IsApprove) {
                onGetDataApproved()
            } else {
                onGetInitail();
            }
        }

    }, [nAreaID]);

    useEffect(() => {
        if (IsEditApprove) {
            GetRoundUpdateProgress()
        }
    }, [IsEditApprove]);

    const GetHistoryLog = (dataPagination) => {
        console.log("dataPagination", dataPagination);
        let param =
        {
            nAreaID: nAreaID,
            nPageSize: dataPagination.nPageSize,
            nPageIndex: dataPagination.nPageIndex,
            sSortExpression: dataPagination.sSortExpression,
            IsASC: dataPagination.sSortDirection === "asc",
            IsDESC: dataPagination.sSortDirection === "desc"
        }
        console.log("param", param);
        AxiosGet(
            "Project/GetHistoryLog", param, (Result) => {
                if (Result.Status === 200) {
                    setLoadingHistory(false);
                    setDataRowHistory({
                        ...dataPagination,
                        arrRows: Result.Data.lstHistoryLog ?? [],
                        nDataLength: Result.Data.nDataLength,
                        nPageIndex: Result.Data.nPageIndex,
                    });
                }
            }
        );

    }

    const GetRoundUpdateProgress = () => {
        AxiosGet(
            "Project/GetRoundUpdateProgress",
            { nAreaID: nAreaID, nProjectID: nProjectID, IsApprove: true },
            (Result) => {
                if (Result.Status === 200) {
                    setArrYearUpdate(Result.Data.lstYearUpdate ?? []);
                    setArrRoundUpdate(Result.Data.lstRoundUpdate ?? []);
                }
            }
        );

    }

    const onGetRoundUpdate = () => {
        AxiosGet(
            "Project/GetRoundUpdate",
            { nAreaID: nAreaID },
            (Result) => {
                if (Result.Status === 200) {
                    setRound(Result.Data.nRoundUpdate);
                }
            }
        );

    }

    const onGetDataApproved = () => {
        DialogFn.BlockUI();
        AxiosGet(
            "Project/GetResultUpdateProgress",
            { nAreaID: nAreaID, nRound: null, nYear: null, IsApprove: true },
            (Result) => {
                if (Result.Status === 200) {
                    setUpdateData(Result.Data);
                    setYear(Result.Data.nYear);
                    setRound(Result.Data.nRound);
                    if (Result.Data.nRound && Result.Data.nRound === 0) {
                        onGetRoundUpdate();
                    }
                    setObjScoreTypeArea(Result.Data.lstAfterScoreArea ?? []);
                    setObjScoreTypeProject(Result.Data.lstAfterScoreProject ?? []);
                    setIndicator(Result.Data.lstTMIndicatorArea ?? []);
                    setIndicatorProject(Result.Data.lstTMIndicatorProject ?? []);
                    setIsUpdateByProject(Result.Data.IsUpdateProgressProject);
                    setIsBudgetByProject(Result.Data.IsBudgetProject);

                    setArrFileResult(Result.Data.lstFileAreaResult);
                    setArrFileKnowlegde(Result.Data.lstFileKnowledge);

                    setPassOnKnowledge(Result.Data.sPassOnKnowledge);
                    setExplicitKnowledge(Result.Data.sExplicitKnowledge);

                    if (Result.Data.oProjectResultBudget) {
                        setBudgetProject([Result.Data.oProjectResultBudget])
                    }
                    if (Result.Data.oAreaResultBudget) {
                        setBudgetArea([Result.Data.oAreaResultBudget])
                    }

                    form.setValue("IsCloseArea", Result.Data.IsCloseArea)
                }
                DialogFn.UnBlockUI();
            },
            (err) => {
                DialogFn.UnBlockUI();
            }
        );
    }

    const onGetInitail = () => {
        DialogFn.BlockUI();
        AxiosGet(
            "Project/GetInitailDataUpdate",
            { nAreaID: nAreaID },
            (Result) => {
                if (Result.Status === 200) {
                    setUpdateData(Result.Data);
                    setYear(Result.Data.nYear);
                    setRound(Result.Data.nRound);
                    setObjScoreTypeArea(Result.Data.lstTMScoreType);
                    setObjScoreTypeProject(Result.Data.lstTMScoreType);
                    setIndicator(Result.Data.lstTMIndicatorArea ?? []);
                    setIndicatorProject(Result.Data.lstTMIndicatorProject ?? []);
                    setIsUpdateByProject(Result.Data.IsUpdateProgressProject);
                    setIsBudgetByProject(Result.Data.IsBudgetProject);
                    onSetYubScore(Result.Data.lstTMScoreType);

                    (Result.Data.lstTMIndicatorArea ?? []).forEach(f => {
                        form.setValue(`sResultIndicator_${f.value}`, f.nResult)
                    });
                    (Result.Data.lstTMIndicatorProject ?? []).forEach(f => {
                        form.setValue(`sProjectResultIndicator_${f.value}`, f.nResult)
                    });
                }
                DialogFn.UnBlockUI();
            },
            (err) => {
                DialogFn.UnBlockUI();
            }
        );
    };

    const onGetProject = () => {
        AxiosGet(
            "Project/GetAreaInfo",
            { nAreaID: nAreaID },
            (Result) => {
                console.log("Result", Result);
                if (Result.Status === 200) {
                    console.log("Result", Result);
                    setData(Result.Data);
                    setDataRowCoSDGs({
                        ...DataRowCoSDGs,
                        arrRows: Result.Data.lstSDGsSecondary ?? [],
                    });
                    setDataRowArea({
                        ...DataRowArea,
                        arrRows: Result.Data.objArea.lstOtherArea ?? [],
                    });
                    setDataRowIndicator({
                        ...DataRowIndicator,
                        arrRows: Result.Data.lstIndicator ?? [],
                    });
                    setDataRowStakeholder({
                        ...DataRowStakeholder,
                        arrRows: Result.Data.objArea.lstStakeholder ?? [],
                    });
                    setDataRowAreaBudget({
                        ...DataRowAreaBudget,
                        arrRows: Result.Data.objArea.lstBudget ?? [],
                    });
                    setDataRowProjectBudget({
                        ...DataRowProjectBudget,
                        arrRows: Result.Data.lstBudget ?? [],
                    });

                    setarrMarkerView(Result.Data.lstMarkerMap);
                    setLstFileProjectDocument(
                        Result.Data.lstFileProjectDocument
                    );
                    setarrMarkerViewArea(Result.Data.objArea.lstMarkerMap);
                    setLstFileIndicatorDocument(
                        Result.Data.objArea.lstFileIndicatorDocument
                    );
                }
            }
        );
    };

    const OnSetData = () => {
        let Result = arrData;
        console.log("Result", Result);
        setData(Result.Data);
        setDataRowCoSDGs({
            ...DataRowCoSDGs,
            arrRows: Result.Data.lstSDGsSecondary ?? [],
        });
        setDataRowArea({
            ...DataRowArea,
            arrRows: Result.Data.objArea.lstOtherArea ?? [],
        });
        setDataRowIndicator({
            ...DataRowIndicator,
            arrRows: Result.Data.lstIndicator ?? [],
        });
        setDataRowStakeholder({
            ...DataRowStakeholder,
            arrRows: Result.Data.objArea.lstStakeholder ?? [],
        });
        setDataRowAreaBudget({
            ...DataRowAreaBudget,
            arrRows: Result.Data.objArea.lstBudget ?? [],
        });
        setDataRowProjectBudget({
            ...DataRowProjectBudget,
            arrRows: Result.Data.lstBudget ?? [],
        });

        setarrMarkerView(Result.Data.lstMarkerMap);
        setLstFileProjectDocument(
            Result.Data.lstFileProjectDocument
        );
        setarrMarkerViewArea(Result.Data.objArea.lstMarkerMap);
        setLstFileIndicatorDocument(
            Result.Data.objArea.lstFileIndicatorDocument
        );
    }

    const [objSchemaUpdate, setSchemaUpdate] = useState({} as any);

    let objSchema = {
        sExplicitKnowledge: yupFormSchemas.string("การนำองค์ความรู้ที่มีมาประยุกต์ใช้", {
            required: IsClosed ?? false,
        }),
        sPassOnKnowledge: yupFormSchemas.string("การถ่ายทอดองค์ความรู้ใหม่จากการดำเนินงาน", {
            required: IsClosed ?? false,
        }),
    };
    const schema = yup.object().shape(Object.assign(objSchema, objSchemaUpdate));

    const form = useForm({
        resolver: yupResolver(schema),
        mode: "all",
        shouldFocusError: true,
        criteriaMode: "firstError",
    });

    const onApproved = () => {
        let oForm = form.getValues();
        let objParam = {};

        console.log("oForm", oForm);
        console.log("arrFileResult", arrFileResult)

        if (IsApprove) {
            objParam = {
                sMode: sMode,
                sComment: null,
                nAreaID: nAreaID,
                nProjectID: nProjectID,
                nRoundUpdate: nRound,
                nYear: nYear,
                IsUpdateProject: false,
                IsRequestEdit: IsEditApprove,
                IsSendMailToDV: oForm.IsSendMail ? oForm.IsSendMail.includes("IsDV") : false,
                IsSendMailToVP: oForm.IsSendMail ? oForm.IsSendMail.includes("IsVP") : false,
                IsSendMailToAE: oForm.IsSendMail ? oForm.IsSendMail.includes("IsAE") : false,
            }
        } else {

            let oProjectResultBudget;
            let lstProjectResultScore = [];
            let lstProjectResultIndicator = [];

            if (IsUpdateByProject) {
                oScoreTypeProject.forEach(f => {
                    let nResult = form.getValues(`sProjectScoreAfter_${f.value}`);
                    let obj = {
                        nProjectID: nProjectID,
                        nProjectResultScoreID: null,
                        nRoundUpdate: nRound,
                        nYear: nYear,
                        nScoreTypeID: parseInt(f.value),
                        nResultScore: !isNaN(parseFloat(nResult)) ? parseFloat(nResult) : null,
                        sDescription: null,
                    }
                    lstProjectResultScore.push(obj);
                });

                oIndicatorProject.forEach(f => {
                    let nResult = form.getValues(`sProjectIndicator_${f.value}`);
                    let obj = {
                        nAreaID: nAreaID,
                        nRoundUpdate: nRound,
                        nYear: nYear,
                        nIndicatorID: parseInt(f.value),
                        nResultIndicator: !isNaN(parseFloat(nResult)) ? parseFloat(nResult) : null,
                        sDescription: null
                    }

                    lstProjectResultIndicator.push(obj);
                });
            }
            if (IsBudgetByProject) {
                let nResult = form.getValues(`sProjectBudget_${nYear}`);
                oProjectResultBudget = {
                    nProjectID: nProjectID,
                    nRoundUpdate: nRound,
                    nYear: nYear,
                    nResultBudget: !isNaN(parseFloat(nResult)) ? parseFloat(nResult) : null,
                    sDescription: form.getValues("sDescription")
                }
            }


            let lstAreaResultScore = [];

            oScoreTypeArea.forEach(f => {
                let nResult = form.getValues(`sScoreAfter_${f.value}`);

                let obj = {
                    nAreaID: nAreaID,
                    nAreaResultScoreID: null,
                    nRoundUpdate: nRound,
                    nYear: nYear,
                    nScoreTypeID: parseInt(f.value),
                    nResultScore: !isNaN(parseFloat(nResult)) ? parseFloat(nResult) : null,
                    sDescription: null,
                }
                lstAreaResultScore.push(obj);
            })

            let nResultBudget = form.getValues(`sAreaBudget_${nYear}`);
            let oAreaResultBudget;

            oAreaResultBudget = {
                nAreaID: nAreaID,
                nRoundUpdate: nRound,
                nYear: nYear,
                nResultBudget: !isNaN(parseFloat(nResultBudget)) ? parseFloat(nResultBudget) : null,
                sDescription: form.getValues("sDescription")
            }

            let lstAreaResultIndicator = [];

            oIndicator.forEach(f => {
                let nResult = form.getValues(`sAreaIndicator_${f.value}`);
                let obj = {
                    nAreaID: nAreaID,
                    nRoundUpdate: nRound,
                    nYear: nYear,
                    nIndicatorID: parseInt(f.value),
                    nResultIndicator: !isNaN(parseFloat(nResult)) ? parseFloat(nResult) : null,
                    sDescription: null
                }

                lstAreaResultIndicator.push(obj);
            })

            objParam = {
                sMode: sMode,
                nProjectID: nProjectID,
                nAreaID: nAreaID,
                nRoundUpdate: nRound,
                nYear: nYear,
                IsUpdateProject: false,
                IsCloseArea: oForm.IsCloseArea ?? false,
                sExplicitKnowledge: oForm.sExplicitKnowledge,
                sPassOnKnowledge: oForm.sPassOnKnowledge,
                lstFileAreaResult: arrFileResult,
                oAreaResultBudget: oAreaResultBudget ?? null,
                lstAreaResultScore: lstAreaResultScore,
                lstAreaResultIndicator: lstAreaResultIndicator,
                lstFileKnowledge: arrFileKnowlegde,
                oProjectResultBudget: oProjectResultBudget ?? null,
                lstProjectResultScore: lstProjectResultScore,
                lstProjectResultIndicator: lstProjectResultIndicator,
            }
        }

        console.log("objParam", objParam)


        onSave(objParam);
    }

    useEffect(() => {
        DialogFn.UnBlockUI();
        if (nRoundEdit && nYearEdit) {
            onGetDataResultUpdate(nRoundEdit, nYearEdit);
        }
    }, [nRoundEdit, nYearEdit]);

    const onGetDataResultUpdate = (nRound, nYear) => {
        AxiosGet(
            "Project/GetResultUpdateProgress",
            { nAreaID: nAreaID, nRound: nRound, nYear: nYear },
            (Result) => {

                console.log("Result.Data", Result.Data);
                if (Result.Status === 200) {

                    setYear(nYear);
                    let arrScoreArea = Result.Data.lstAfterScoreArea ?? [];
                    let arrIndicatorArea = Result.Data.lstTMIndicatorArea ?? [];
                    let arrIndicatorProject = Result.Data.lstTMIndicatorProject ?? [];
                    let arrScoreProject = Result.Data.lstAfterScoreProject ?? [];

                    arrScoreArea.forEach(m => {
                        m.value = m.nScoreTypeID;
                        m.label = m.sScoreTypeName;
                    });
                    arrScoreProject.forEach(m => {
                        m.value = m.nScoreTypeID;
                        m.label = m.sScoreTypeName;
                    });

                    setObjScoreTypeArea(arrScoreArea);
                    setIndicator(arrIndicatorArea);
                    setIndicatorProject(arrIndicatorProject);
                    setObjScoreTypeProject(arrScoreProject);
                    setIsUpdateByProject(Result.Data.IsUpdateProgressProject);
                    setIsBudgetByProject(Result.Data.IsBudgetProject);

                    setArrFileResult(Result.Data.lstFileAreaResult);

                    if (Result.Data.oProjectResultBudget) {
                        setBudgetProject([Result.Data.oProjectResultBudget])
                    }
                    if (Result.Data.oAreaResultBudget) {
                        setBudgetArea([Result.Data.oAreaResultBudget])
                    }

                }
            }
        );
    }

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <AccordionCustom header="รายละเอียดโครงการ">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={10}>
                                        <RenderText
                                            header={"ชื่อโครงการ"}
                                            text={data?.sProjectName}
                                            IsFlex
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={2}></Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <RenderText
                                                    header={"ลักษณะโครงการ"}
                                                    text={
                                                        data?.sProjectNatureName
                                                    }
                                                    IsFlex
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RenderText
                                                    header={
                                                        "หน่วยงานที่รับผิดชอบหลัก"
                                                    }
                                                    text={data?.sAgencyName}
                                                    IsFlex
                                                    IsChip={true}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RenderText
                                                    header={
                                                        "หน่วยงานที่รับผิดชอบรอง"
                                                    }
                                                    lstText={
                                                        data?.lstProjectAgencySecondary !=
                                                            null
                                                            ? data?.lstProjectAgencySecondary.map(
                                                                (m) =>
                                                                    m.label
                                                            )
                                                            : []
                                                    }
                                                    IsList={true}
                                                    IsFlex
                                                    IsChip={true}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RenderText
                                                    header={"ระยะเวลาดำเนินการ"}
                                                    text={data?.sDuration}
                                                    IsFlex
                                                />
                                            </Grid>
                                            <Grid item xs={12} className="topic-divider" >
                                                <Divider textAlign="left">
                                                    <Chip
                                                        label="SDGs"
                                                        className="divider-chip"
                                                    />
                                                </Divider>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RenderText
                                                    header={"SDGs หลัก"}
                                                    text={data?.sSDGsName}
                                                    IsFlex
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <RenderText
                                                    header={"คำอธิบายเพิ่มเติม"}
                                                    text={data?.sSDGsDescription}
                                                    IsFlex={false}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                minHeight: "500px",
                                            }}
                                        >
                                            <MapCompoents
                                                id={"div-view"}
                                                mapRef={mapRefView}
                                                IsMultiMarker={true}
                                                Isdisable={true}
                                                IsMarker={false}
                                                IsPopUp={true}
                                                IsSearch={false}
                                                sHeight="100%"
                                                arrMarker={arrMarkerView}
                                                setarrMarker={setarrMarkerView}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={"SDGs รอง"}
                                            text={""}
                                            IsList={true}
                                            IsFlex={false}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <DataGrid
                                            columns={dataColumnCoSDGs}
                                            rows={DataRowCoSDGs}
                                            isHiddenToolHead
                                            onLoadData={(e) => { }}
                                            isNotShowPagination
                                            isNotShowTotal
                                            isHideFooter
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={"คำอธิบายเพิ่มเติม"}
                                            text={data?.sSDGsSecondaryDescription}
                                            IsFlex={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={"Corporate Strategy"}
                                            text={data?.sCorporateStrategyName}
                                            IsFlex
                                            IsChip
                                        />
                                    </Grid>
                                    <Grid item xs={12} display={"flex"} alignItems={"center"}>
                                        <RenderText
                                            header={"ตัวชี้วัดที่สำคัญ"}
                                            text={""}
                                            IsList
                                            IsFlex
                                        />
                                        <Tooltip
                                            arrow
                                            TransitionComponent={Fade}
                                            TransitionProps={{
                                                timeout: 200,
                                            }}
                                            title={
                                                <>
                                                    <Typography fontSize={"10pt"}
                                                    >
                                                        หากไม่มีตัวชี้วัดที่ต้องการใช้
                                                        กรุณาติดต่อแอดมินได้ที่
                                                        090-0000000
                                                    </Typography>
                                                </>
                                            }
                                            placement={"right"}
                                        >
                                            <HelpRoundedIcon
                                                htmlColor="#0c6dc2"
                                                style={{
                                                    fontSize: "12pt",
                                                    cursor: "help",
                                                }}
                                            />
                                        </Tooltip>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <DataGrid
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
                                        <RenderText
                                            header={"ที่มาของโครงการ"}
                                            text={data?.sProjectOrigin}
                                            IsFlex={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={"วัตถุประสงค์"}
                                            text={data?.sObjective}
                                            IsFlex={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={"เป้าหมาย"}
                                            text={data?.sTarget}
                                            IsFlex={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={
                                                "ความเชื่อมโยงกับธุรกิจ"
                                            }
                                            text={data?.sBusinessConnection}
                                            IsFlex={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={"ความเสี่ยง"}
                                            text={data?.sRisk}
                                            IsFlex={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={"เอกสารที่เกี่ยวข้อง"}
                                            text={""}
                                            IsFlex={false}
                                            IsList
                                        />
                                        <FormProvider {...form}>
                                            <UploadFile
                                                IsRequired={false}
                                                modeDisplay={"list"}
                                                id={"oFileDocument"}
                                                name={"oFileDocument"}
                                                keyID={1}
                                                IsDrag={false}
                                                arrFile={lstFileProjectDocument}
                                                setarrFile={setLstFileProjectDocument}
                                                Extension={Extension.ImageDocument}
                                                IsFolder={false}
                                                isFileChange={true}
                                                IsMultiple={true}
                                                onClearFile={onClearFileProject}
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
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={"รูปแบบการใช้งบประมาณ"}
                                            text={data?.sBudgetTypeName}
                                            IsFlex={true}
                                            IsChip
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} >
                                        <DataGrid
                                            columns={dataColumnProjectBudget}
                                            rows={DataRowProjectBudget}
                                            isHiddenToolHead
                                            onLoadData={(e) => { }}
                                            isNotShowPagination
                                            isNotShowTotal
                                            isHideFooter
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RenderText
                                            header={
                                                "รูปแบบการรายงานผลการดำเนินการ (คะแนน/ ตัวชี้วัด)"
                                            }
                                            text={data?.sUpdateTypeName}
                                            IsFlex={true}
                                            IsChip
                                        />
                                    </Grid>
                                    {(IsUpdateByProject || IsBudgetByProject) &&
                                        <FormProvider {...form}>
                                            <Grid item xs={12}>
                                                <ProjectResult
                                                    form={form}
                                                    oIndicator={oIndicatorProject}
                                                    oUpdateData={oUpdateData}
                                                    oScoreType={oScoreTypeProject}
                                                    nYear={nYear}
                                                    arrFile={arrFileResult}
                                                    setArrFile={setArrFileResult}
                                                    IsUpdateByProject={IsUpdateByProject}
                                                    IsBudgetByProject={IsBudgetByProject}
                                                    IsApprove={IsApprove}
                                                    oBudget={oBudgetProject}
                                                    arrYearUpdate={arrYearUpdate}
                                                    arrRoundUpdate={arrRoundUpdate}
                                                    nAreaID={nAreaID}
                                                    setRoundEdit={setRoundEdit}
                                                    setYearEdit={setYearEdit}
                                                    nRoundEdit={nRoundEdit}
                                                    nYearEdit={nYearEdit}
                                                    IsEditApprove={IsEditApprove}
                                                />
                                            </Grid>
                                        </FormProvider>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </AccordionCustom>
                </Grid>
                <Grid item xs={12}>
                    <AccordionCustom header="พื้นที่ดำเนินการอื่น">
                        <Grid container spacing={2}>
                            <Grid
                                item
                                xs={12}
                                md={3}
                                container
                                spacing={0}
                                display={"flex"}
                                alignItems={"flex-start"}
                            >
                                <Grid item>
                                    <RenderText
                                        header={"ลักษณะพื้นที่"}
                                        text={
                                            data?.objArea != null
                                                ? data?.objArea
                                                    .sAreaTypeName
                                                : ""
                                        }
                                        IsFlex={false}
                                        IsChip
                                        tooltip={
                                            <Tooltip
                                                arrow
                                                TransitionComponent={Fade}
                                                TransitionProps={{
                                                    timeout: 200,
                                                }}
                                                title={
                                                    <>
                                                        <Typography
                                                            fontSize={"10pt"}
                                                        >
                                                            <p>
                                                                <b>Area-based</b>{" "}
                                                                ชุมชน/พื้นที่ดำเนินการที่อยู่ในพื้นที่ปฏิบัติงานของธุรกิจ
                                                            </p>
                                                            <p>
                                                                <b>Social-based</b>{" "}
                                                                ชุมชน/พื้นที่ดำเนินการโครงการเพื่อสังคมของ
                                                                ปตท.
                                                            </p>
                                                            <p>
                                                                <b>Project-based</b>{" "}
                                                                ชุมชน/พื้นที่ดำเนินการที่อยู่ในพื้นที่โครงการของธุรกิจ
                                                                หรือ
                                                                เพื่อสนับสนุนการทำ
                                                                EIA
                                                            </p>
                                                        </Typography>
                                                    </>
                                                }
                                                placement={"right"}
                                            >
                                                <HelpRoundedIcon
                                                    htmlColor="#0c6dc2"
                                                    style={{
                                                        fontSize: "12pt",
                                                        cursor: "help",
                                                    }}
                                                />
                                            </Tooltip>
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <RenderText
                                    header={"จังหวัด"}
                                    text={
                                        data?.objArea != null
                                            ? data?.objArea.sProviceName
                                            : ""
                                    }
                                    IsFlex={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <RenderText
                                    header={"อำเภอ"}
                                    text={
                                        data?.objArea != null
                                            ? data?.objArea.sDistrictName
                                            : ""
                                    }
                                    IsFlex={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <RenderText
                                    header={"ตำบล"}
                                    text={
                                        data?.objArea != null
                                            ? data?.objArea.sSubDistrictName
                                            : ""
                                    }
                                    IsFlex={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <RenderText
                                    header={"ลักษณะทางภูมิศาสตร์"}
                                    lstText={
                                        data?.objArea != null
                                            ? data?.objArea
                                                .lstGeographyTypeName
                                            : []
                                    }
                                    IsList
                                    IsChip
                                    IsFlex={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <RenderText
                                    header={"ชื่อสถานที่"}
                                    text={
                                        data?.objArea != null
                                            ? data?.objArea.sAreaName
                                            : ""
                                    }
                                    IsFlex={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <RenderText
                                    header={"ละติจูด"}
                                    text={
                                        data?.objArea != null
                                            ? data?.objArea.sLatitude
                                            : ""
                                    }
                                    IsFlex={false}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <RenderText
                                    header={"ละติจูด"}
                                    text={
                                        data?.objArea != null
                                            ? data?.objArea.sLongitude
                                            : ""
                                    }
                                    IsFlex={false}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        minHeight: "500px",
                                    }}
                                >
                                    <MapCompoents
                                        id={"div-area"}
                                        mapRef={mapRefArea}
                                        IsMultiMarker={true}
                                        Isdisable={true}
                                        IsMarker={false}
                                        IsPopUp={true}
                                        IsSearch={false}
                                        sHeight="100%"
                                        arrMarker={arrMarkerViewArea}
                                        setarrMarker={setarrMarkerViewArea}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={12} container spacing={2}>
                                <Grid
                                    item
                                    xs={12}
                                    className="topic-divider"
                                >
                                    <Divider textAlign="left">
                                        <Chip
                                            label="ผู้มีส่วนได้ส่วนเสียที่สำคัญ / แกนนำชุมชน"
                                            className="divider-chip"
                                        />
                                    </Divider>
                                </Grid>
                                <Grid item xs={12} container spacing={2}>
                                    <Grid
                                        item
                                        xs={12}
                                    >
                                        <DataGrid
                                            columns={dataColumnStakeholder}
                                            rows={DataRowStakeholder}
                                            isHiddenToolHead
                                            onLoadData={(e) => { }}
                                            isNotShowPagination
                                            isNotShowTotal
                                            isHideFooter
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <HeaderInput
                                            text={
                                                "โครงการพัฒนาชุมชนในพื้นที่"
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{
                                        paddingTop: "0 !important",
                                    }}>
                                        <RenderText
                                            header={
                                                "โครงการพัฒนาของ ปตท. และกลุ่ม ปตท. ในอดีต"
                                            }
                                            lstText={
                                                data?.objArea != null
                                                    ? data?.objArea
                                                        .lstPTTProjectName
                                                    : []
                                            }
                                            IsList
                                            IsChip
                                            IsFlex={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{
                                        paddingTop: "0 !important",
                                    }}>
                                        <RenderText
                                            header={
                                                "ความร่วมมือกับ หน่วยงาน / องค์กรอื่นๆ"
                                            }
                                            lstText={
                                                data?.objArea != null
                                                    ? data?.objArea
                                                        .lstAgencyCooperation
                                                    : []
                                            }
                                            IsList
                                            IsChip
                                            IsFlex={false}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container spacing={2}>
                                <Grid
                                    item
                                    xs={12}
                                    className="topic-divider"
                                >
                                    <Divider textAlign="left">
                                        <Chip
                                            label="บริบทชุมชน"
                                            className="divider-chip"
                                        />
                                    </Divider>
                                </Grid>
                                <Grid item xs={12}>
                                    <HeaderInput
                                        text={"ผลการประเมินศักยภาพชุมชน"}
                                    // text={""}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        paddingTop: "0 !important",
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={8}>
                                            <RenderText
                                                header={"ก่อนดำเนินการ"}
                                                lstText={
                                                    data?.objArea != null
                                                        ? data.objArea.lstBeforeScore.map(
                                                            (m) =>
                                                                m.sScoreTypeName
                                                        )
                                                        : []
                                                }
                                                lstSubtext={
                                                    data?.objArea != null
                                                        ? data.objArea.lstBeforeScore.map(
                                                            (m) =>
                                                                m.nScore
                                                        )
                                                        : []
                                                }
                                                IsList={true}
                                                IsFlexList={true}
                                                IsFlex={false}
                                                IsFormat
                                                endAdornment={"คะแนน"}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <RenderText
                                        header={"ความเชื่อมโยง ปตท."}
                                        text={
                                            data.objArea != null
                                                ? data.objArea.sConnection
                                                : ""
                                        }
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header={"ตัวชี้วัดที่สำคัญ"}
                                        lstText={
                                            data.objArea != null
                                                ? data.objArea
                                                    .lstIndicatorName
                                                : []
                                        }
                                        IsList
                                        IsFlex={false}
                                        columnGap={"1rem"}
                                        IsOrder
                                        IsFlexList
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header={
                                            "ไฟล์แนบแผนการดำเนินงานตามตัวชี้วัด"
                                        }
                                        text={" "}
                                        IsFlex={false}
                                    // IsList
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
                                                lstFileIndicatorDocument
                                            }
                                            setarrFile={
                                                setLstFileIndicatorDocument
                                            }
                                            Extension={
                                                Extension.ImageDocument
                                            }
                                            IsFolder={false}
                                            isFileChange={true}
                                            IsMultiple={true}
                                            onClearFile={onClearFileProject}
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
                                <Grid item xs={12} sx={{ mt: 0.5 }}>
                                    <RenderText
                                        header={"งบประมาณตามแผน"}
                                        text={""}
                                        IsFlex={false}
                                        IsList
                                    />
                                </Grid>
                                <Grid item xs={12} >
                                    <DataGrid
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
                                        header={"ประเภทชุมชน"}
                                        lstText={
                                            data.objArea != null
                                                ? data.objArea
                                                    .lstCommunityTypeName
                                                : []
                                        }
                                        IsList
                                        IsChip
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header={"คำอธิบายเพิ่มเติม"}
                                        text={
                                            data.objArea != null
                                                ? data.objArea.sExplainMore
                                                : ""
                                        }
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Grid
                                        container
                                        sx={{
                                            alignItems: "center",
                                        }}
                                    >
                                        <RenderText
                                            header={"จำนวนประชากร"}
                                            text={
                                                data.objArea?.nPopulation != null ? formatNumber(data.objArea.nPopulation, 0) + " คน" : ""
                                            }
                                            IsFlex={false}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Grid
                                        container
                                        sx={{
                                            alignItems: "center",
                                        }}
                                    >
                                        <RenderText
                                            header={"จำนวนครัวเรือน"}
                                            text={
                                                data.objArea?.nHousehold != null ? formatNumber(data.objArea.nHousehold, 0) + " ครัวเรือน" : ""
                                            }
                                            IsFlex={false}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Grid
                                        container
                                        sx={{
                                            alignItems: "center",
                                        }}
                                    >
                                        <RenderText
                                            header={"จำนวนรายได้เฉลี่ย"}
                                            text={
                                                data.objArea?.nAverageIncome != null ? formatNumber(data.objArea.nAverageIncome, 2) + " บาท / เดือน / ครัวเรือน" : ""
                                            }
                                            IsFlex={false}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RenderText
                                        header={"กลุ่มอาชีพหลัก"}
                                        text={
                                            data.objArea != null
                                                ? data.objArea
                                                    .oMainOccupation
                                                    ?.sOccupationGroupName
                                                : ""
                                        }
                                        IsFlex={false}
                                        IsChip
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RenderText
                                        header={"อาชีพหลัก"}
                                        lstText={
                                            data.objArea != null
                                                ? data.objArea
                                                    .oMainOccupation
                                                    ?.lstOccupationName
                                                : []
                                        }
                                        IsFlex={false}
                                        IsList
                                        IsChip
                                    />
                                </Grid>
                                {data?.objArea?.lstSecondaryOccupation && data?.objArea?.lstSecondaryOccupation.map((m, i) => (
                                    <>
                                        <Grid item xs={12} md={6}>
                                            <RenderText
                                                header={"กลุ่มอาชีพเสริม"}
                                                text={m.sOccupationGroupName}
                                                IsFlex={false}
                                                IsChip
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <RenderText
                                                header={"อาชีพเสริม"}
                                                lstText={m.lstOccupationName}
                                                IsFlex={false}
                                                IsList
                                                IsChip
                                            />
                                        </Grid>
                                    </>
                                ))}
                                <Grid item xs={12}>
                                    <HeaderInput
                                        text={"ทรัพยากรชุมชน"}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{
                                    paddingTop: "0 !important",
                                }}>
                                    <RenderText
                                        header={"การท่องเที่ยว"}
                                        text={
                                            data.objArea != null
                                                ? data.objArea.sTravel
                                                : ""
                                        }
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header={"วัฒนธรรม"}
                                        text={
                                            data.objArea != null
                                                ? data.objArea.sCulture
                                                : ""
                                        }
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RenderText
                                        header={"การเกษตร"}
                                        lstText={
                                            data.objArea != null
                                                ? data.objArea
                                                    .lstAgricultureName
                                                : []
                                        }
                                        IsFlex={false}
                                        IsList
                                        IsChip
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <RenderText
                                        header={"ผลิตภัณฑ์"}
                                        lstText={
                                            data.objArea != null
                                                ? data.objArea
                                                    .lstProductName
                                                : []
                                        }
                                        IsFlex={false}
                                        IsList
                                        IsChip
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header={
                                            "ความคิดเห็น ความคาดหวัง ข้อกังวัล ของชุมชน"
                                        }
                                        text={
                                            data.objArea != null
                                                ? data.objArea.sComment
                                                : ""
                                        }
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header={"ความเสี่ยง"}
                                        text={
                                            data.objArea != null
                                                ? data.objArea.sRisk
                                                : ""
                                        }
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <RenderText
                                        header={
                                            "หน่วยงานอื่นๆ ที่ทำงานทับซ้อนในพื้นที่"
                                        }
                                        text={
                                            data.objArea != null
                                                ? data.objArea
                                                    .sAnotherAgency
                                                : ""
                                        }
                                        IsFlex={false}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid item xs={12}>
                                        <HeaderInput
                                            text={"ลักษณะการรวมกลุ่ม"}
                                        />
                                    </Grid>
                                    <Grid container spacing={2}>
                                        {data?.objArea?.lstNatureGroupingType && data?.objArea?.lstNatureGroupingType.map((m, i) => (
                                            <Grid item xs={12} md={6} key={"NatureGroupingType" + m.nNatureGroupingTypeID}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12}>
                                                        <RenderText
                                                            header={m.sNatureGroupingTypeName}
                                                            text={" "}
                                                            IsFlex={false}
                                                            IsList
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <RenderText
                                                            header={
                                                                "ประเภทการรวมกลุ่ม"
                                                            }
                                                            color={"rgb(52, 71, 103)"}
                                                            lstText={m.lstBundleTypeName}
                                                            IsFlex={false}
                                                            IsList
                                                            IsChip
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <RenderText
                                                            header={"คำอธิบาย"}
                                                            text={m.sDescription}
                                                            IsFlex={false}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        ))}
                                        <Grid item xs={12}>
                                            <RenderText
                                                header={"พื้นที่ดำเนินการ"}
                                                text={""}
                                                IsFlex={false}
                                                IsList
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <DataGrid
                                                columns={dataColumnArea}
                                                rows={DataRowArea}
                                                isHiddenToolHead
                                                onLoadData={(e) => { }}
                                                isNotShowPagination
                                                isNotShowTotal
                                                isHideFooter
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {IsApprove && IsShowSendCC &&
                                <>
                                    <Grid item xs={12} className="topic-divider" >
                                        <Divider textAlign="left">
                                            <Chip
                                                label="การแจ้งเตือน"
                                                className="divider-chip"
                                            />
                                        </Divider>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormProvider {...form}>
                                            <CheckboxGroupFormItem
                                                AllowCheckAll={false}
                                                name="IsSendMail"
                                                isTooltip={false}
                                                id="IsSendMail"
                                                label="ต้องการให้ส่งอีเมลแจ้งเตือนถึง"
                                                disabled={false}
                                                options={[
                                                    { value: "IsDV", label: "ผู้จัดการส่วน", check: false, disabled: false },
                                                    { value: "IsVP", label: "ผู้จัดการฝ่าย", check: false, disabled: false },
                                                    // { value: "IsAE", label: "AE Manager", check: false, disabled: false }
                                                ]}
                                            />
                                        </FormProvider>
                                    </Grid>
                                </>
                            }
                        </Grid>
                    </AccordionCustom>
                </Grid>

                {/* {arrYearUpdate.length > 0 && arrRoundUpdate.length > 0 && */}
                <FormProvider {...form}>
                    <Grid item xs={12}>
                        <AreaResult
                            form={form}
                            oIndicator={oIndicator}
                            oUpdateData={oUpdateData}
                            oScoreType={oScoreTypeArea}
                            nYear={nYear}
                            arrFile={arrFileResult}
                            setArrFile={setArrFileResult}
                            IsApprove={IsApprove}
                            oBudget={oBudgetArea}
                            arrYearUpdate={arrYearUpdate}
                            arrRoundUpdate={arrRoundUpdate}
                            nAreaID={nAreaID}
                            setRoundEdit={setRoundEdit}
                            setYearEdit={setYearEdit}
                            nRoundEdit={nRoundEdit}
                            nYearEdit={nYearEdit}
                            IsEditApprove={IsEditApprove}
                        />
                    </Grid>
                    {!IsEditApprove &&
                        <Grid item xs={12}>
                            <AreaKnowledge
                                form={form}
                                arrFile={arrFileKnowlegde}
                                setArrFile={setArrFileKnowlegde}
                                IsApprove={IsApprove}
                                sPassOnKnowledge={sPassOnKnowledge}
                                sExplicitKnowledge={sExplicitKnowledge}
                                setIsClosed={setIsClosed}
                            />
                        </Grid>
                    }

                </FormProvider>
                {/* } */}

                <Grid item xs={12} display={"none"}>
                    <Grid container display={"none"}>
                        <BtnSave
                            id={"submit"}
                            // isDisabled={(arrProjectArea.length > 0) ? false : true}
                            txt="บันทึก"
                            // onClick={onSubmit}
                            onClick={form.handleSubmit(
                                onApproved,
                                (err) => {
                                    document.getElementById(Object.keys(err)[0])?.focus();
                                    console.log("err", err);
                                    onSave(null);
                                }
                            )}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <AccordionCustom header="History Log">
                        <Grid container>
                            <Grid item xs={12}>
                                <DataGrid
                                    isLoading={IsLoadingHistory}
                                    columns={dataColumnHistory}
                                    rows={DataRowHistory}
                                    isHiddenToolHead
                                    onLoadData={(e) => { GetHistoryLog(e) }}
                                />
                            </Grid>
                        </Grid>
                    </AccordionCustom>
                </Grid>
            </Grid >
            {/* </StepItem> */}
        </React.Fragment >
    );
};

export default ProjectUpdate;
