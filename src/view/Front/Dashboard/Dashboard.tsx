import React ,{ useEffect, useState, useRef }  from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import { Breadcrumbs, Grid, Typography, useMediaQuery, Chip, Skeleton } from "@mui/material";
import * as yup from "yup";
import DataGridMui, { PaginationInterface, initRows } from "components/DataGrid";
import CardFrom from "components/CardContent/CardFrom";
import { DateTimeToString, FnDialog, undefinedOrNull } from "utilities/ST_Function";
import { useNavigate } from "react-router-dom";
import { BtnAdditionnel, BtnClear, BtnExcel, BtnSearch, BtnViewDataOnTable } from "components/Button";
import { DateRangePickerFrom, SelectFormItem, SelectMultipleFormItem } from "components/Input";
import { GetDataSearchProject, GetDistrict, GetInitailData, GetProvice, GetSubDistrict } from './CallAPI';
import i18n from "config/i18nConfig";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { LocalLibrary, Public, CorporateFare, Person, CalendarMonth, Telegram, Insights, Forest, PeopleAlt, Hub, Room, Map, StarBorderPurple500} from "@mui/icons-material";
import No_BG from "assets/images/NoImage/no-image-available.png";
import MapCompoents from "view/Map/MapCompoents";
import { AxiosPostFileExcel } from "utilities/ST_Axios";
import CheckBoxImage from "./CheckBoxImage";
import DialogPreview from "components/Dialog/DialogPreview";
import { FilterFieldInterface } from "components/DataGrid/DataGridProps";
import { TypeModeBtn } from "components/enum/enumSystem";
import moment from "moment";
import html2canvas from "html2canvas";

const Dashboard = () => {
  const LayoutMin900 = useMediaQuery('(min-width:900px)');

  const navigate = useNavigate();
  const DialogFn = FnDialog();

  const [isPage, SetisPage] = useState<any>(true);
  const [nProjectAll, SetnProjectAll] = useState<any>(0);  
  const [sProjectSum, SetsProjectSum] = useState<any>("0");
  const [lstProject, SetlstProject] = useState<any>([]);
  const [lstnProjectIDAll, SetlstnProjectIDAll] = useState<any>([]);  
  const [lstMap, SetlstMap] = useState<any>([]);

  const [isOpenPopup, SetOpenPopup] = useState<any>(false);
  const [sProjectTitle, SetsProjectTitle] = useState<any>(null);  
  const [arrCheckSDGs, setarrCheckSDGs] = useState([] as any);
  const [lstTMSDGs, SetlstTMSDGs] = useState<any>([]); //Global Strategy (SDGs)
  const [lstTMCorporateStrategy, SetlstTMCorporateStrategy] = useState<any>([]); //Corporate Strategy
  const [lstTMAreaType, SetlstTMAreaType] = useState<any>([]); //ประเภทพื้นที่
  const [lstTMAgency, SetlstTMAgency] = useState<any>([]); //หน่วยงานรับผิดชอบ
  const [lstTMIndicator, SetlstTMIndicator] = useState<any>([]); //ตัวชี้วัด
  const [lstTMAgriculture, SetlstTMAgriculture] = useState<any>([]); //การเกษตร
  const [lstTMProduct, SetlstTMProduct] = useState<any>([]); //ผลิตภัณฑ์
  const [lstTMStakeholders, SetlstTMStakeholders] = useState<any>([]); //ผู้มีส่วนได้ส่วนเสียที่สำคัญ
  const [lstTMPTTProject, SetlstTMPTTProject] = useState<any>([]); //โครงการพัฒนาของ ปตท. และกลุ่ม ปตท. ในอดีต
  const [lstTMProvice, SetlstTMProvice] = useState<any>([]); //จังหวัด
  const [lstTMDistrict, SetlstTMDistrict] = useState<any>([]); //เขตหรืออำเภอ
  const [lstTMSubDistrict, SetlstTMSubDistrict] = useState<any>([]); //แขวงหรือตำบล

  const mapRefView = useRef(null);
	const [, setoMarker] = useState(null);
  const [sSearchMap, setSearchMap] = useState(null);
	const [, setProviceName] = useState(null);

  const schema = yup.object().shape({});
  const formResolver = yupResolver(schema);
  const form = useForm({
      resolver: formResolver,
      shouldUnregister: false,
      shouldFocusError: true,
      mode: "all"
  });

  useEffect(() => {
    OnGetData();
    onGetProvice();
    onSearch(4);
  }, []);

  const OnGetData = async () => {
    DialogFn.BlockUI();
    await GetInitailData({}, (res) => {
      DialogFn.UnBlockUI();
      if (res.Status === 200) {
        SetlstTMSDGs(res.Data.lstTMSDGs ?? []);  //Global Strategy (SDGs)
        SetlstTMCorporateStrategy(res.Data.lstTMCorporateStrategy ?? []);  //Corporate Strategy
        SetlstTMAreaType(res.Data.lstTMAreaType ?? []);  //ประเภทพื้นที่
        SetlstTMAgency(res.Data.lstTMAgency ?? []);  //หน่วยงานรับผิดชอบ
        SetlstTMIndicator(res.Data.lstTMIndicator ?? []);  //ตัวชี้วัด
        SetlstTMAgriculture(res.Data.lstTMAgriculture ?? []);  //การเกษตร
        SetlstTMProduct(res.Data.lstTMProduct ?? []);  //ผลิตภัณฑ์
        SetlstTMStakeholders(res.Data.lstTMStakeholders ?? []);  //ผู้มีส่วนได้ส่วนเสียที่สำคัญ
        SetlstTMPTTProject(res.Data.lstTMPTTProject ?? []);  //โครงการพัฒนาของ ปตท. และกลุ่ม ปตท. ในอดีต
      }
      else {
        DialogFn.Warning(res.Message);
      }
    }, (err) => {
      if (!err.response) {
        DialogFn.Warning(err.Message);
      }
    })
  };

  const onSearch = async (nTake = null) => {
    DialogFn.BlockUI();
    let ObjValue = form.getValues(); 
    let ObjDataProject = {
      lstTMSDGs: (arrCheckSDGs ?? []).map(m=> undefinedOrNull(m, "number")), //Global Strategy (SDGs)
      lstTMCorporateStrategy: (ObjValue.sCorporateStrategy ?? []).map(m=> undefinedOrNull(m, "number")), //Corporate Strategy
      lstTMAreaType: (ObjValue.sAreaTypeName ?? []).map(m=> undefinedOrNull(m, "number")), //ประเภทพื้นที่
      lstTMAgency: (ObjValue.sAgencyName ?? []).map(m=> undefinedOrNull(m, "number")), //หน่วยงานรับผิดชอบ
      sDateStart: ObjValue.sDateStart ? DateTimeToString(ObjValue.sDateStart, "YYYY-MM-DD") : null, //ระยะเวลาดำเนินงาน Start 
      sDateEnd: ObjValue.sDateEnd ? DateTimeToString(ObjValue.sDateEnd, "YYYY-MM-DD") : null, //ระยะเวลาดำเนินงาน End 
      lstTMIndicator: (ObjValue.sIndicator ?? []).map(m=> undefinedOrNull(m, "number")), //ตัวชี้วัด
      lstTMAgriculture: (ObjValue.sAgriculture ?? []).map(m=> undefinedOrNull(m, "number")), //การเกษตร
      lstTMProduct: (ObjValue.sProduct ?? []).map(m=> undefinedOrNull(m, "number")), //ผลิตภัณฑ์
      lstTMStakeholders: (ObjValue.sStakeholders ?? []).map(m=> undefinedOrNull(m, "number")), //ผู้มีส่วนได้ส่วนเสียที่สำคัญ
      lstTMPTTProject: (ObjValue.sPTTProject ?? []).map(m=> undefinedOrNull(m, "number")), //โครงการพัฒนาของ ปตท. และกลุ่ม ปตท. ในอดีต
      nProviceID: undefinedOrNull(ObjValue.sProvice, "number"), //จังหวัด
      nDistrictID: undefinedOrNull(ObjValue.sDistrict, "number"), //อำเภอ
      nSubDistrictID: undefinedOrNull(ObjValue.sSubDistrict, "number"), //ตำบล
      nTake: nTake ?? null, //nTake ?? 4, //
    } 
    await GetDataSearchProject(ObjDataProject, (res) => {
      DialogFn.UnBlockUI();
      if (res.Status === 200) {
        SetlstProject(res.lstSearchProject ?? []);
        SetlstnProjectIDAll(res.lstnProjectIDAll ?? []);        
        SetlstMap(res.lstMap ?? []);
        SetnProjectAll(res.nProjectAll);
        SetsProjectSum(res.sProjectSum);
        SetisPage(false);
      }
      else {
        DialogFn.Warning(res.Message);
      } 
    }, (err) => {
      if (!err.response) {
        DialogFn.Warning(err.Message);
      }
    })
  }

  const onClear = () => {
    setarrCheckSDGs([]); //Global Strategy (SDGs)
    form.setValue("sCorporateStrategy", null); //Corporate Strategy
    form.setValue("sAreaTypeName", null); //ประเภทพื้นที่
    form.setValue("sAgencyName", null); //หน่วยงานรับผิดชอบ
    form.setValue("sDateStart", null); //ระยะเวลาดำเนินงาน Start 
    form.setValue("sDateEnd", null); //ระยะเวลาดำเนินงาน End
    form.setValue("sIndicator", null); //ตัวชี้วัด
    form.setValue("sAgriculture", null); //การเกษตร
    form.setValue("sProduct", null); //ผลิตภัณฑ์
    form.setValue("sStakeholders", null); //ผู้มีส่วนได้ส่วนเสียที่สำคัญ
    form.setValue("sPTTProject", null); //โครงการพัฒนาของ ปตท. และกลุ่ม ปตท. ในอดีต
    form.setValue("sProvice", null); //จังหวัด
    form.setValue("sDistrict", null); //อำเภอ
    form.setValue("sSubDistrict", null); //ตำบล
    setSearchMap(null);
    onSearch(4);
  }

  const onImageError = (e) => {
    e.target.src = No_BG;
  }

  const onGetProvice = async () => {
		form.setValue("sSubDistrict", null);
		form.setValue("sDistrict", null);
		DialogFn.BlockUI();
    await GetProvice({}, (res) => { 
      if (res.Status === 200) {
        SetlstTMProvice(res.Data.lstTMProvice);    
      }
      DialogFn.UnBlockUI();
    }, (err) => {
      if (!err.response) {
        DialogFn.Warning(err.Message);
      }
    });
	};

	const onGetDistrict = async (nProviceID) => {
		form.setValue("sSubDistrict", null);
		if (nProviceID) {
			DialogFn.BlockUI();
      await GetDistrict({ nProviceID: parseInt(nProviceID) }, (res) => { 
        if (res.Status === 200) {
          SetlstTMDistrict(res.Data.lstTMDistrict); 
        }
        DialogFn.UnBlockUI();
      }, (err) => {
        if (!err.response) {
          DialogFn.Warning(err.Message);
        }
      });
		} else {
			SetlstTMDistrict([]);
		}
	};

	const onGetSubDistrict = async (nDistrictID) => {
		if (nDistrictID) {
			DialogFn.BlockUI();
      await GetSubDistrict({ nDistrictID: parseInt(nDistrictID) }, (res) => { 
        if (res.Status === 200) {
          SetlstTMSubDistrict(res.Data.lstTMSubDistrict); 
        }
        DialogFn.UnBlockUI();
      }, (err) => {
        if (!err.response) {
          DialogFn.Warning(err.Message);
        }
      });
		} else {
			SetlstTMSubDistrict([]);
		}
	};

  const onExportExcel = async () => {
    DialogFn.BlockUI();
    let sImgMap = "";
    let strHTMLMap = document.getElementById("div-view-dashboard"); 
    if (strHTMLMap) {
        let Element = strHTMLMap as HTMLDivElement;
        let canvas = await html2canvas(Element);
        let image = canvas.toDataURL("image/png", 1.0);
        sImgMap = image;
    }
    let param = {
      lstnProjectIDAll: lstnProjectIDAll,
      sBase64Map: sImgMap,
    }
    let fileName = `CRSR_SearchProjectAll_${moment().format('yyyyMMDDHHmmss')}.xls`;
    AxiosPostFileExcel("Export/ExportExcelProjectAll", param, fileName, () => { DialogFn.UnBlockUI(); });
  }

  //#region Open Popup Area All
  const onOpenPopup = (item, sProject) => {
    SetOpenPopup(true);
    SetsProjectTitle(sProject);

    let lstData = [];
    let nID = 1;
    (item ?? []).forEach((f) => {
      let ObjData = {
        sID: nID + "",
        No: nID,
        sAreaName: f.sAreaName,
        nProjectID: f.nProjectID,
        nAreaID: f.nAreaID,
        IsView: f.IsView,
      };
      lstData.push(ObjData);
      nID++;
    });
    SetDataRow({
      ...initRows,
      arrRows: lstData,
      nDataLength: lstData.length,
      nPageIndex: 0, //ต้องใส่นะจร๊ ถ้าไม่ใส่ ต่อให้ข้อมูลมีกี่ตัวก็ตาม แต่ตารางจะโชว์ข้อมูลแค่ 1 ตัวแบบอันล่าสุด 
    });
    SetArrData(lstData);
  };

  const [loadingTable, SetLoadingTable] = useState(false);
  const [ArrData, SetArrData] = useState([] as any);
  const [DataRow, SetDataRow] = useState<PaginationInterface>({
    ...initRows,
    sSortExpression: "No",
    sSortDirection: "desc"
  });

  const filterField: FilterFieldInterface[] = [
    {
      sFieldName: "sSearch",
      sTypeFilterMode: "input",
      sLabel: "ชื่อพื้นที่",
    },
  ];

  const DataColumn : any = [
    {
      field: "No",
      headerName: "ลำดับที่",
      headerAlign: "center",
      align: "center",
      sortable: false,
      flex: 1,
      // isHeadMobile: true
    },
    {
      field: "sAreaName",
      headerName: "ชื่อพื้นที่",
      headerAlign: "center",
      align: "left",
      resizable: false,
      sortable: true,
      flex: 3,
    },
    {
      field: "Button",
      align: "center",
      type: "actions",
      resizable: false,
      sortable: false,
      flex: 1,
      getActions: (item) => {
          return [
            item.row.IsView === true ?
              <>
                <BtnViewDataOnTable 
                  id={`BtnView_${item.row.sID}`}
                  onClick={() => {
                    navigate(`/project-report`, 
                    { state: {
                        nProjectID: item.row.nProjectID,
                        nAreaID: item.row.nAreaID,
                        sModeBtn: TypeModeBtn.ViewProject,
                        nRequestTypeID: item.row.nRequestTypeID,
                      }
                    }); 
                  }} 
                />
              </>
              :
              <></>
          ];
      },
    },
  ];

  const onLoadData = (dataPagination = null) => {
    SetLoadingTable(true);
    let _arrData = [...ArrData];
    if (_arrData.length > 0 && dataPagination != null) {
      let sSearch = dataPagination?.sSearch ?? null;
      if (sSearch) _arrData = _arrData.filter(w => (w.sAreaName + "").trim().toLowerCase().includes((sSearch + "").trim().toLowerCase()));
    }

    let p = dataPagination ? dataPagination : initRows;
    SetDataRow({
      ...p,
      arrRows: _arrData,
      nDataLength: _arrData.length,
    })
    SetLoadingTable(false);
  }
  //#endregion

  return (
    <React.Fragment>
      <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormProvider {...form}>
                <Grid container spacing={2} justifyContent="start" alignItems="flex-start">
                  {/* Search */}
                  <Grid item xs={12} sm={12} md={8} container spacing={2} justifyContent="start" alignItems="flex-start">
                    {/* Row 1 */} 
                    <Grid item xs={12} sm={6} md={6} container spacing={1}> {/* spacing={LayoutMin1400 ? 2.5 : 1} */}
                      {/* Global Strategy (SDGs) */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <Public fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sSDGs")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                        <CardFrom>         
                          <CheckBoxImage
                            lstTMSDGs={lstTMSDGs}
                            arrCheckSDGs={arrCheckSDGs}
                            setarrCheckSDGs={setarrCheckSDGs}
                          />
                        </CardFrom>  
                        </Grid>
                      </Grid>

                      {/* Corporate Strategy */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <CorporateFare fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sCorporateStrategy")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <SelectMultipleFormItem
                              placeholder={`${i18n.t("dashboard.sCorporateStrategy")}`}
                              id={"sCorporateStrategy"}
                              name={"sCorporateStrategy"}
                              label={`${i18n.t("dashboard.sCorporateStrategy")}`}
                              required={false}
                              fullWidth={true}
                              disabled={false}
                              options={lstTMCorporateStrategy}
                              isPopperCustom={false}
                            />
                          </CardFrom>
                        </Grid>
                      </Grid>

                      {/* ประเภทพื้นที่ */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <Telegram fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sAreaTypeName")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <SelectMultipleFormItem
                              placeholder={`${i18n.t("dashboard.sAreaTypeName")}`}
                              id={"sAreaTypeName"}
                              name={"sAreaTypeName"}
                              label={`${i18n.t("dashboard.sAreaTypeName")}`}
                              required={false}
                              fullWidth={true}
                              disabled={false}
                              options={lstTMAreaType}
                              isPopperCustom={false}
                            />
                          </CardFrom>
                        </Grid>
                      </Grid>

                      {/* หน่วยงานที่รับผิดชอบ */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <Person fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sAgencyName")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <SelectMultipleFormItem
                              placeholder={`${i18n.t("dashboard.sAgencyName")}`}
                              id={"sAgencyName"}
                              name={"sAgencyName"}
                              label={`${i18n.t("dashboard.sAgencyName")}`}
                              required={false}
                              fullWidth={true}
                              disabled={false}
                              options={lstTMAgency}
                              isPopperCustom={false}
                            />
                          </CardFrom>
                        </Grid>
                      </Grid>

                      {/* ระยะเวลาดำเนินงาน */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <CalendarMonth fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sProcess")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <DateRangePickerFrom
                              nameStart={'sDateStart'}
                              labelStart={`${i18n.t("dashboard.dStart")}`}
                              nameEnd={'sDateEnd'}
                              labelEnd={`${i18n.t("dashboard.dEnd")}`}
                              required={false}
                              disabled={false}
                            />
                          </CardFrom>
                        </Grid>
                      </Grid>                      
                    </Grid>

                    {/* Row 2 */}
                    <Grid item xs={12} sm={6} md={6} container spacing={1} justifyContent="start" alignItems="flex-start">
                      {/* ตัวชี้วัด */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <Insights fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sIndicator")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <SelectMultipleFormItem
                              placeholder={`${i18n.t("dashboard.sIndicator")}`}
                              id={"sIndicator"}
                              name={"sIndicator"}
                              label={`${i18n.t("dashboard.sIndicator")}`}
                              required={false}
                              fullWidth={true}
                              disabled={false}
                              options={lstTMIndicator}
                              isPopperCustom={false}
                            />
                          </CardFrom>
                        </Grid>
                      </Grid>

                      {/* ทรัพยากร */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <Forest fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sResource")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <Grid item xs={12} sm={12} md={12} container spacing={1}>                                                     
                              <Grid item xs={12} sm={12} md={12}>
                                <SelectMultipleFormItem
                                  placeholder={`${i18n.t("dashboard.sAgriculture")}`}
                                  id={"sAgriculture"}
                                  name={"sAgriculture"}
                                  label={`${i18n.t("dashboard.sAgriculture")}`}
                                  required={false}
                                  fullWidth={true}
                                  disabled={false}
                                  options={lstTMAgriculture}
                                  isPopperCustom={false}
                                />
                              </Grid>
                              <Grid item xs={12} sm={12} md={12}>
                                <SelectMultipleFormItem
                                  placeholder={`${i18n.t("dashboard.sProduct")}`}
                                  id={"sProduct"}
                                  name={"sProduct"}
                                  label={`${i18n.t("dashboard.sProduct")}`}
                                  required={false}
                                  fullWidth={true}
                                  disabled={false}
                                  options={lstTMProduct}
                                  isPopperCustom={false}
                                />
                              </Grid>
                            </Grid>
                          </CardFrom>
                        </Grid>
                      </Grid>

                      {/* ผู้มีส่วนได้ส่วนเสียที่สำคัญ */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <PeopleAlt fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sStakeholders")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <SelectMultipleFormItem
                              placeholder={`${i18n.t("dashboard.sStakeholders")}`}
                              id={"sStakeholders"}
                              name={"sStakeholders"}
                              label={`${i18n.t("dashboard.sStakeholders")}`}
                              required={false}
                              fullWidth={true}
                              disabled={false}
                              options={lstTMStakeholders}
                              isPopperCustom={false}
                            />
                          </CardFrom>
                        </Grid>
                      </Grid>

                      {/* โครงการพัฒนาของ ปตท. และกลุ่ม ปตท. ในอดีต */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <Hub fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sPTTProject")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <SelectMultipleFormItem
                              placeholder={`${i18n.t("dashboard.sPTTProject")}`}
                              id={"sPTTProject"}
                              name={"sPTTProject"}
                              label={`${i18n.t("dashboard.sPTTProject")}`}
                              required={false}
                              fullWidth={true}
                              disabled={false}
                              options={lstTMPTTProject}
                              isPopperCustom={false}
                            />
                          </CardFrom>
                        </Grid>                        
                      </Grid>

                      {/* พื้นที่ดำเนินการ */}
                      <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <Room fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sAreaName")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                            <Grid item xs={12} sm={12} md={12} container spacing={1}>
                              {/* จังหวัด */}                              
                              <Grid item xs={12} sm={12} md={12}>
                                <SelectFormItem
                                  id="sProvice"
                                  name="sProvice"
                                  options={lstTMProvice}
                                  label={`${i18n.t("dashboard.sProvice")}`}
                                  placeholder="เลือกจังหวัด"
                                  required={false}
                                  onChange={(e) => {
                                    onGetDistrict(e?.value);
                                    setProviceName(e?.label);
                                  }}
                                  isPopperCustom={false} //True เพื่อ Popper ให้อยู่ภายใต้ Body  
                                />
                              </Grid>
                              
                              {/* เขตหรืออำเภอ */}
                              <Grid item xs={12} sm={12} md={12}>
                                <SelectFormItem
                                  id="sDistrict"
                                  name="sDistrict"
                                  options={lstTMDistrict}
                                  label={`${i18n.t("dashboard.sDistrict")}`}
                                  placeholder="เลือกอำเภอ"
                                  required={false}
                                  onChange={(e) => {
                                    onGetSubDistrict(e?.value);
                                  }}
                                  isPopperCustom={false} //True เพื่อ Popper ให้อยู่ภายใต้ Body  
                                />
                              </Grid>

                              {/* แขวงหรือตำบล */}
                              <Grid item xs={12} sm={12} md={12}>
                                <SelectFormItem
                                  id="sSubDistrict"
                                  name="sSubDistrict"
                                  options={lstTMSubDistrict}
                                  label={`${i18n.t("dashboard.sSubDistrict")}`}
                                  placeholder="เลือกตำบล"
                                  required={false}
                                  isPopperCustom={false} //True เพื่อ Popper ให้อยู่ภายใต้ Body  
                                />
                              </Grid>

                              {/* แผนที่ */}
                              {/* <Grid item xs={12} sm={12} md={12}>
                                <MapCompoents
                                id={"div-dashboard"}
                                  mapRef={setMapRef}
                                  IsMultiMarker={false}
                                  Isdisable={false}
                                  IsPopUp={true}
                                  IsSearch={true}
                                  formArea={form}                         
                                  markerSearch={oMarker}
                                  setmarkerSearch={setoMarker}
                                  sSearch={sSearchMap}
                                  sHeight={"200px"}
                                  IsMarker={false}
                                />
                              </Grid> */}
                            </Grid>
                          </CardFrom>
                        </Grid>
                      </Grid>
                     
                      {/* ปุ่มค้นหา | ล้างข้อมูลค้นหา */}
                      <Grid item xs={12} sm={12} md={12} container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>
                            <BtnSearch id={"BtnConfirmSearch_Sheach"} txt={`${i18n.t("Btn.sSheach")}`} onClick={() => { onSearch(); SetisPage(true); }} />
                        </Grid>
                        <Grid item>
                            <BtnClear id={"BtnClearFilter_Sheach"} txt={`${i18n.t("Btn.sClear")}`} onClick={() => onClear() } />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Row 3 แผนที่ ผลลัพธ์ */}
                    <Grid item xs={12} sm={12} md={12} container spacing={0.5} justifyContent="start" alignItems="flex-start">
                        {/* หัวข้อ */}
                        <Grid item xs={12} sm={12} md={12}>
                          <Grid item className='Divbreadcrumb_' >
                            <Breadcrumbs
                                maxItems={!LayoutMin900 ? 3 : 4}
                                separator={<ArrowRightIcon fontSize="small" />}
                                aria-label="breadcrumb"
                                style={{ color: "#fff" }}
                            >
                              <Grid item xs={12} sm={12} md={12} container spacing={1}>
                                <Grid item>
                                  <Map fontSize="small"/>
                                </Grid>
                                <Grid item>
                                  <Typography>{`${i18n.t("dashboard.sMap")}`}</Typography>                          
                                </Grid>                         
                              </Grid>                                
                            </Breadcrumbs>
                          </Grid>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={12}>
                          <CardFrom>
                              {/* แผนที่ */}
                              <Grid item xs={12} sm={12} md={12}>
                                {/* <MapCompoents
                                  id="div-dashboard"
                                  mapRef={mapRefView}
                                  IsMultiMarker={false}
                                  Isdisable={false}
                                  IsPopUp={true}
                                  IsSearch={true}
                                  IsMarker={false}
                                  formArea={form}                         
                                  markerSearch={oMarker}
                                  setmarkerSearch={setoMarker}
                                  sSearch={sSearchMap}
                                  sHeight={"300px"}
                                  setarrMarker={setoMarker}
                                /> */}
                                <MapCompoents
                                  id={"div-view-dashboard"}
                                  mapRef={mapRefView}
                                  IsMultiMarker={true}
                                  Isdisable={false}
                                  IsMarker={false}
                                  IsPopUp={true}
                                  IsSearch={true}
                                  IsFullScreen={true}
                                  sHeight={"300px"}
                                  arrMarker={lstMap}
                                  setarrMarker={SetlstMap}
                                  sSearch={sSearchMap}
                                  setmarkerSearch={setoMarker}
                                />
                            </Grid>
                          </CardFrom>
                        </Grid>
                    </Grid>
                  </Grid>

                  {/* Project */}
                  <Grid item xs={12} sm={12} md={4} container spacing={1}>
                    {/* หัวข้อโครงการ */}
                    <Grid item xs={12} sm={12} md={12}>
                      <div className='Divbreadcrumb_' >
                        <Breadcrumbs
                            maxItems={!LayoutMin900 ? 3 : 4}
                            separator={<ArrowRightIcon fontSize="small" />}
                            aria-label="breadcrumb"
                            style={{ color: "#fff" }}
                        >
                          {/* <Grid item xs={12} sm={12} md={12} container>
                            <Grid item xs={12} sm={12} md={6} container spacing={1}>
                              <Grid item>
                                <LocalLibrary fontSize="small"/>
                              </Grid>
                              <Grid item>
                                <Typography>โครงการ</Typography>                          
                              </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} container justifyContent="end" alignItems="flex-end">
                              <Typography>{ nProjectAll + " Projects ( " + nProjectSum + " บาท)"}</Typography>                             
                            </Grid>                            
                          </Grid>*/}
                          <Grid item xs={12} sm={12} md={12} container spacing={1}>
                            <Grid item>
                              <LocalLibrary fontSize="small"/>
                            </Grid>
                            <Grid item>
                              <Typography>{`${i18n.t("dashboard.sProject")}`}</Typography>                          
                            </Grid>                         
                          </Grid>
                        </Breadcrumbs>
                      </div>
                    </Grid>

                    {/* จำนวณ Projects และงบประมาณทั้งหมด && Excet */}
                    <Grid item xs={12} sm={12} md={12} container style={{paddingBottom: '3%'}} spacing={0.5} justifyContent="start" alignItems="flex-start">
                      <Grid item xs={12} sm={2} md={1} style={{display: (lstProject.length > 0 ? "" : "none")}}>      
                        <BtnExcel 
                          onClick={() => { onExportExcel(); }} 
                          nWidth={'2em'} 
                          nHeight={'1.6em'} 
                        />                            
                      </Grid>
                      <Grid item xs={12} sm={10} md={(lstProject.length > 0 ? 11 : 12)} container justifyContent="end" alignItems="flex-end">
                        <Typography>{"จำนวน " + nProjectAll + " " + i18n.t("dashboard.sProject") + " ( " + sProjectSum + " บาท )"}</Typography>                             
                      </Grid>                         
                    </Grid>

                    {/* ข้อมูลโครงการ */}
                    <Grid item xs={12} sm={12} md={12}>
                      {isPage ? 
                        <>
                          <Skeleton
                            // sx={{ bgcolor: 'grey.900' }}
                            variant="rounded"
                            height={280}
                          />
                          <br/>
                          <Skeleton
                            // sx={{ bgcolor: 'grey.900' }}
                            variant="rounded"
                            height={280}
                          />
                          <br/>
                          <Skeleton
                            // sx={{ bgcolor: 'grey.900' }}
                            variant="rounded"
                            height={280}
                          />
                          <br/>
                          <Skeleton
                            // sx={{ bgcolor: 'grey.900' }}
                            variant="rounded"
                            height={280}
                          />
                        </>
                      :
                        (lstProject.length > 0 ?
                            <Grid item xs={12} sm={12} md={12} container spacing={1} style={{ overflow: 'auto', maxHeight: '1210px', boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px !important", }} >
                              {lstProject.map((iProject, index) => {
                                return (
                                  <Grid item xs={12} sm={12} md={12} key={"Project_" + iProject.index} style={{ padding: '2%'}}>
                                    <CardFrom
                                      footer={ 
                                        <Grid item container spacing={1} justifyContent={"end"}>
                                          {/* แสดงเพิ่มเติม พื้นที่ทั้งหมดใน โครงการ แบบ Pop-up */}
                                          <BtnAdditionnel id={"BtnAdditionnel"} txt={`${i18n.t("Btn.sPreview")}`} onClick={() => { onOpenPopup(iProject.lstArea, iProject.sProjectName + " (" + iProject.nSumArea + " พื้นที่)"); }} />                                
                                        </Grid>
                                      }
                                    >
                                      <Grid item xs={12} sm={12} md={12}>
                                        {/* ชื่อโครงการ */}
                                        <Grid item xs={12} sm={12} md={12}>
                                          <Typography>{iProject.sProjectName}</Typography>   
                                        </Grid>

                                        {/* Corporate Strategy && หน่วยงานที่รับผิดชอบ */}
                                        <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                                          {/* Corporate Strategy */}
                                          <Chip
                                            size="small"
                                            label={iProject.sCorporateStrategyName}
                                            style={{
                                              color: "#FFFFFF",
                                              backgroundColor: "#7F61A7",
                                              margin: "0.2rem",
                                              fontSize: "1.05rem"
                                            }}
                                          />
                                          {/* หน่วยงานที่รับผิดชอบ */}
                                          {iProject.lstAgencys.length > 0 &&
                                            iProject.lstAgencys.map((iAgency, index) => {
                                              return (                              
                                                <Chip
                                                  key={"Agency_" + iAgency.index}
                                                  size="small"
                                                  label={iAgency.sAgencyName}
                                                  style={{
                                                    color: "#FFFFFF",
                                                    backgroundColor: (iAgency.nOrder === 0 ? "rgb(209 74 163)" : "#DF865D"),
                                                    margin: "0.2rem",
                                                    fontSize: "1.05rem"
                                                  }}
                                                />
                                              )
                                            })
                                          }                                       
                                        </Grid>

                                        {/* งบประมาณสะสม */}
                                        <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                                          <Grid item xs={12} sm={12} md={5} container spacing={0.5}>
                                            <Grid item>
                                              <Typography>{`${i18n.t("dashboard.sSumResultBudgetProject")}`}</Typography>                          
                                            </Grid>
                                          </Grid>
                                          <Grid item xs={12} sm={12} md={7} container justifyContent="end" alignItems="flex-end">
                                            <Typography>{iProject.sSumResultBudgetProject + " บาท"}</Typography>
                                          </Grid>
                                        </Grid>

                                        {/* จำนวนพื้นที่ในโครงการ  */}
                                        <Grid item xs={12} sm={12} md={12} container spacing={0.5}>
                                          <Grid item xs={12} sm={12} md={8} container spacing={1}>
                                            <Grid item>
                                              <Typography>{`${i18n.t("dashboard.sSumArea")}`}</Typography>                          
                                            </Grid>
                                          </Grid>
                                          <Grid item xs={12} sm={12} md={4} container justifyContent="end" alignItems="flex-end">
                                            <Typography>{iProject.nSumArea + " พื้นที่"}</Typography>
                                          </Grid>
                                        </Grid>

                                        {/* SDGs */}
                                        <Grid item xs={12}>
                                          <div className='container-itemsA'>
                                            <div className='itemsA'>
                                              {iProject.lstSDGs.length > 0 &&
                                                iProject.lstSDGs.map((iSDGs, index) => {
                                                  return (
                                                    <div key={"iSDGs_" + iSDGs.index} className="itemA">
                                                      {iSDGs.nOrder === 0 && <StarBorderPurple500 className='CardSDG_Main'/>}
                                                      <img className='img-DashboardCardSDG' alt="" src={iSDGs.sPathSDGs != null ? process.env.REACT_APP_API_URL + iSDGs.sPathSDGs : No_BG} onError={onImageError} title={iSDGs.sSDGsName}/>
                                                      {/* <img className='img-DashboardCardSDG' alt="" src={iSDGs.sPathSDGs != null ? "https://softthaiapp.com/PTT-CRSR-API/" + iSDGs.sPathSDGs : No_BG} onError={onImageError} />                                                 */}
                                                    </div>
                                                  )
                                                })
                                              }
                                            </div>
                                          </div>
                                        </Grid>
                                      </Grid>
                                    </CardFrom>
                                  </Grid>
                                )                          
                              })}
                            </Grid>
                          : 
                          //No Data
                          <Grid item xs={12} sm={12} md={12}>
                            <CardFrom>
                              <h3 style={{ textAlign: "center", color: 'darkgray' }}>{`${i18n.t("noDataView")}`}</h3>
                            </CardFrom>
                          </Grid>
                        )
                      }
                    </Grid>
                  </Grid>
                </Grid>
            </FormProvider >
          </Grid>

          <DialogPreview
            IsOpen={isOpenPopup}
            onClose={() => { SetOpenPopup(false); SetsProjectTitle(null); }}
            Title={sProjectTitle}
            sMaxWidth='sm'
            bgColor={"#004285"}
            Color='#FFFFFF'
          >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <DataGridMui
                isLoading={loadingTable}
                columns={DataColumn}
                rows={DataRow}
                onLoadData={(dataPagination) => {
                  onLoadData(dataPagination);
                }}
                isShowCheckBox={false}
                handleDataMode='client'
                filterField={filterField}
                groupRowByField='brand'
                // modeFilter={1} //ให้โชว์ช่องหัว ค้นหาเลย
                isShowColomnTool={false} //ปิดตรง Colomn ให้เหลือกแค่ ค้นหา
                // isHiddenToolHead={true}
              />
            </Grid>
          </DialogPreview>
      </Grid >
    </React.Fragment>
  )
}

export default Dashboard
