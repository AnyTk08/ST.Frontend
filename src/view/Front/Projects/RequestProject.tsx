/* eslint-disable react-hooks/exhaustive-deps */
import {
	Box,
	Chip,
	Fade,
	Grid,
	Skeleton,
	Tooltip,
	Typography,
} from "@mui/material";
import {
	AutocompleteForm,
	CheckboxFormItem,
	DatePickerFromItem,
	InputBasicNumberForm,
	RadioForm,
	SelectFormItem,
	SelectMultipleFormItem,
	TextBoxForm,
} from "components/Input";
import { Fragment, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { List as LINQ } from "linqts";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import yupFormSchemas from "components/FormItem/yupFormSchemas";
import {
	BtnAdd,
	BtnAddOnTable,
	BtnDeleteOnTable,
	BtnEdit,
	BtnEditOnTable,
	BtnSave,
} from "components/Button";
import DataGrid, { PaginationInterface, initRows } from "components/DataGrid";
import { GridColumns } from "@mui/x-data-grid-pro";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import UploadFile from "components/Input/UploadFile/UploadFile";
import {
	Extension,
	FnDialog,
	ValidatePhoneNumber,
} from "utilities/ST_Function";
import Divider from "components/Divider";
import HeaderInput from "components/Input/HeaderInput";
import { AxiosGet } from "utilities/ST_Axios";
import moment from "moment";
import { CheckboxGroupFormItem } from "components/Input/Checkbox";
import i18n from "config/i18nConfig";
import MapCompoents from "view/Map/MapCompoents";
import AccordionCustom from "components/Accordion/AccordionCustom";
import HistoryLog from "./HistoryLog";

const RequestProject = (props) => {

	const { IsSave, onSave, sMode, nAreaID, nProjectID, IsEditProject, IsReject } = props;
	const DialogFn = FnDialog();

	const mapRefView = useRef(null);
	const mapRefArea = useRef(null);

	const [IsProject, setIsProject] = useState(false);
	const [IsCoSDGsLoading, setIsCoSDGsLoading] = useState(false);
	const [IsIndicatorLoading, setIsIndicatorLoading] = useState(false);
	const [IsStakeholderLoading, setIsStakeholderLoading] = useState(false);
	const [IsAreaLoading, setIsAreaLoading] = useState(true);
	const [IsProjectLoading, setProjectLoading] = useState(true);
	const [IsMoreSubjob, setIsMoreSubjob] = useState(false);
	const [IsNewProject, setIsNewProject] = useState(true);
	const [IsNewStakeholder, setIsNewStakeholder] = useState(false);
	const [IsCurrent, setIsCurrent] = useState(false);
	const [sStakeholderEdit, setsStakeholderEdit] = useState(null);
	const [sAreaEdit, setsAreaEdit] = useState(null);
	const [arrStakeholder, setArrStakeholder] = useState([]);
	const [arrGroupSubJob, setArrGroupSubJob] = useState([]);
	const [arrSecondaryOccupation, setArrSecondaryOccupation] = useState([]);
	const [arrFileDocumentProject, setFileDocumentProject] = useState([]);
	const [arrFileDocumentIndicator, setFileDocumentIndicator] = useState([]);
	const [arrProjectPTT, setArrProjectPTT] = useState([]);
	const [arrProject, setArrProject] = useState([]);
	const [arrProvice, setArrProvice] = useState([]);
	const [arrDistrict, setArrDistrict] = useState([]);
	const [arrSubDistrict, setArrSubDistrict] = useState([]);
	const [arrProjectPartner, setArrProjectPartner] = useState([]);
	const [oProjectNature, setProjectNature] = useState([]);
	const [oAgency, setObjAgency] = useState([]);
	const [oCoAgency, setObjCoAgency] = useState([]);
	const [oStakeholderType, setObjStakeholderType] = useState([]);
	const [oSDGs, setObjSDGs] = useState([]);
	const [oCoSDGs, setObjCoSDGs] = useState([]);
	const [oCorpStrategy, setObjCorpStrategy] = useState([]);
	const [oIndicator, setObjIndicator] = useState([]);
	const [arrAreaIndicator, setArrAreaIndicator] = useState([]);
	const [arrProjectIndicator, setArrProjectIndicator] = useState([]);
	const [oBudgetType, setObjBudgetType] = useState([]);
	const [oUpdateType, setObjUpdateType] = useState([]);
	const [oCommunityType, setObjCommunityType] = useState([]);
	const [oOccupationGrp, setObjOccupationGrp] = useState([]);
	const [oOccupation, setObjOccupation] = useState([]);
	const [arrOcupation, setArrOcupation] = useState([]);
	const [oScoreType, setObjScoreType] = useState([]);
	const [oStakeholder, setObjStakeholder] = useState([]);
	const [oProduct, setObjProduct] = useState([]);
	const [oAgriculture, setObjAgriculture] = useState([]);
	const [oNatureGroupingType, setObjNatureGroupingType] = useState([]);
	const [oBundleTypeFormal, setObjBundleTypeFormal] = useState([]);
	const [oBundleTypeInFormal, setObjBundleTypeInFormal] = useState([]);
	const [oAreaType, setObjAreaType] = useState([]);
	const [oGeography, setObjGeography] = useState([]);
	const [sMinDateProject, setMinDateProject] = useState(null);
	const [sSearchMap, setSearchMap] = useState(null);
	const [sProviceName, setProviceName] = useState(null);
	const [arrDurationYear, setDurationYear] = useState([]);
	const [arrProjectArea, setArrProjectArea] = useState([]);
	const [arrSumBudgetArea, setSumBudgetArea] = useState([]);
	const [arrAreaForm, setAreaForm] = useState([]);
	const [arrAllSecondarySDG, setAllSecondarySDG] = useState([]);

	const onClearFile = useRef(null);
	const onClearFileProject = useRef(null);

	const [arrMarkerView, setarrMarkerView] = useState([] as any);

	const [oMarkerArea, setoMarkerArea] = useState(null);

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

	const [objShcemaProject, setObjShcemaProject] = useState({} as any);

	const [objShcemaArea, setObjShcemaArea] = useState({} as any);

	let objSchema = {
		sProjectName: yupFormSchemas.string("ชื่อโครงการ", {
			required: IsNewProject,
		}),
		oProjectName: yupFormSchemas.object("ชื่อโครงการ", {
			required: !IsNewProject,
		}),
		sStartDate: yupFormSchemas.string("วันที่เริ่มต้น", {
			required: true,
		}),
		sEndDate: yupFormSchemas.string("วันที่สิ้นสุด", {
			required: !IsCurrent,
		}),
		sProjectNature: yupFormSchemas.string("ลักษณะโครงการ", {
			required: true,
		}),
		sAgency: yupFormSchemas.string("หน่วยงานที่รับผิดชอบหลัก", {
			required: true,
		}),
		sCoAgency: yupFormSchemas.stringArray("หน่วยงานที่รับผิดชอบรอง", {
			required: false,
		}),
		sSDGs: yupFormSchemas.string("SDGs หลัก", {
			required: true,
		}),
		sCorporateStrategy: yupFormSchemas.string("Corporate Strategy", {
			required: true,
		}),
		sProjectOrigin: yupFormSchemas.string("ที่มาของโครงการ", {
			required: true,
		}),
		sObjective: yupFormSchemas.string("วัตถุประสงค์", {
			required: true,
		}),
		sTarget: yupFormSchemas.string("เป้าหมาย", {
			required: true,
		}),
		sBusinessConnection: yupFormSchemas.string("ความเชื่อมโยงกับธุรกิจ", {
			required: true,
		}),
		sBudgetType: yupFormSchemas.string("รูปแบบการใช้งบประมาณ", {
			required: true,
		}),
		sUpdateProgessType: yupFormSchemas.string(
			" รูปแบบการรายงานผลการดำเนินการ (คะแนน/ ตัวชี้วัด)",
			{
				required: true,
			}
		),
	};

	let objSchemaArea = {
		sAreaType: yupFormSchemas.string("ลักษณะพื้นที่", {
			required: true,
		}),
		sProvice: yupFormSchemas.string("จังหวัด", {
			required: true,
		}),
		sDistrict: yupFormSchemas.string("อำเภอ", {
			required: false,
		}),
		sSubDistrict: yupFormSchemas.string("ตำบล", {
			required: false,
		}),
		oGeographyType: yupFormSchemas.stringArray("ลักษณะทางภูมิศาสตร์", {
			required: true,
		}),
		sAreaName: yupFormSchemas.string("สถานที่", {
			required: false,
		}),
		sLatitude: yupFormSchemas.string("ละติจูด", {
			required: false,
		}),
		sLongitude: yupFormSchemas.string("ลองจิจูด", {
			required: false,
		}),
		sPathMap: yupFormSchemas.string("ลองจิจูด", {
			required: false,
		}),
		oAreaIndicator: yupFormSchemas.stringArray("ตัวชี้วัดที่สำคัญ", {
			required: false,
		}),
		sCommunityType: yupFormSchemas.stringArray("ประเภทชุมชน", {
			required: true,
		}),
		nPopulation: yupFormSchemas.integer("จำนวนประชากร", {
			required: false,
		}),
		nHousehold: yupFormSchemas.integer("จำนวนครัวเรือน", {
			required: false,
		}),
		sGroupMainJob: yupFormSchemas.string("กลุ่มอาชีพหลัก", {
			required: true,
		}),
		sMainJob: yupFormSchemas.stringArray("อาชีพหลัก", {
			required: false,
		}),
	};

	const schema = yup
		.object()
		.shape(Object.assign(objSchema, objShcemaProject));

	const schemaArea = yup
		.object()
		.shape(Object.assign(objSchemaArea, objShcemaArea));

	const schemaStakeholder = yup.object().shape({
		sStakeholderName: yupFormSchemas.string("ชื่อผู้มีส่วนได้ส่วนเสีย", {
			required: IsNewStakeholder,
		}),
		oStakeholderName: yupFormSchemas.object("ชื่อผู้มีส่วนได้ส่วนเสีย", {
			required: !IsNewStakeholder,
		}),
		sStakeholderType: yupFormSchemas.stringArray("ประเภท", {
			required: true,
		}),
		sStakeholderPosition: yupFormSchemas.string("ตำแหน่ง", {
			required: false,
		}),
		sStakeholderAgency: yupFormSchemas.string("สังกัด", { required: false }),
		sStakeholderTel: yupFormSchemas.string("เบอร์โทรศัพท์", {
			required: false,
			matches: ValidatePhoneNumber(true),
			labelmatches: "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง",
		}),
		sStakeholderAddr: yupFormSchemas.string("ที่อยู่", { required: false }),
		sStakeholderDetail: yupFormSchemas.string("คำอธิบายเพิ่มเติม", {
			required: false,
		}),
	});

	const form = useForm({
		resolver: yupResolver(schema),
		mode: "all",
		shouldFocusError: true,
		criteriaMode: "firstError",
	});

	const formArea = useForm({
		resolver: yupResolver(schemaArea),
		mode: "all",
		shouldFocusError: true,
		criteriaMode: "firstError",
	});

	const formStakeholder = useForm({
		resolver: yupResolver(schemaStakeholder),
		mode: "all",
		shouldFocusError: true,
		criteriaMode: "firstError",
	});

	useEffect(() => {
		console.log("IsSave", IsSave);
		if (IsSave) {
			if (sMode === "S") {
				if (IsReject || IsEditProject) {
					document.getElementById("edit-project-area-reject").click();
				} else if (arrProjectArea.length === 0) {
					DialogFn.Warning("กรุณาเพิ่มพื้นที่ อย่างน้อย 1 พื้นที่");
					onSave(null);
				} else {
					document.getElementById("submit").click();
				}
			} else if (sMode === "D") {
				onSaveDraft();
			}
		}
	}, [IsSave]);

	useEffect(() => {

		let e = form.getValues("sAgency");
		if (e) {
			let co = oAgency.filter((f) => f.value !== e);
			let coSelect = form.getValues("sCoAgency") ?? [];
			let data = coSelect.filter((f) => f !== e);
			form.setValue("sCoAgency", data);
			setObjCoAgency(co);
		} else {
			setObjCoAgency(oAgency);
		}
	}, [form.getValues("sAgency")]);

	useEffect(() => {
		//get initail
		form.setValue("IsNewProject", true);
		DialogFn.UnBlockUI();
		onGetInitail();
		onGetProvice();
		setProjectLoading(false);
		setIsAreaLoading(false);
	}, []);

	useEffect(() => {
		if ((arrGroupSubJob ?? []).length === 0) {
			onAddGroupSubJob();
		} else {
			(arrSecondaryOccupation ?? []).forEach(item => {
				let sID = item.sID ?? item.nOccupationGroupID;
				formArea.setValue("oGroupSubJob_" + sID, item.nOccupationGroupID + "");
				formArea.setValue("oSubJob_" + sID, (item.lstOccupation ?? []).map((m) => m + ""));
			});
		}
	}, [arrGroupSubJob]);

	useEffect(() => {
		DialogFn.UnBlockUI();
		if ((IsReject || IsEditProject) && nAreaID) {
			onGetArea();
		} else if (nProjectID !== null) {
			onGetProject();
		}
	}, [nProjectID]);

	const onGetProject = () => {
		setProjectLoading(true);
		AxiosGet(
			"Project/GetProjectInfo",
			{ nProjectID: nProjectID, IsHasArea: true, IsActivated: true },
			(Result) => {
				console.log("Result", Result);
				OnSetDataProject(Result.Data);
				setProjectLoading(false);
			});
	}

	const onGetArea = () => {
		setIsAreaLoading(true);
		AxiosGet(
			"Project/GetAreaInfo",
			{ nAreaID: nAreaID },
			(Result) => {
				console.log("Result", Result);
				if (Result.Status === 200) {
					OnSetDataProject(Result.Data);
					let objArea = Result.Data.objArea;

					if (objArea) {
						onGetDistrict(objArea.nProviceID);
						onGetSubDistrict(objArea.nDistrictID);

						formArea.setValue("sAreaType", objArea.nAreaTypeID + "");
						formArea.setValue("sProvice", objArea.nProviceID + "");
						formArea.setValue("sDistrict", objArea.nDistrictID + "");
						formArea.setValue("sSubDistrict", objArea.nSubDistrictID + "");
						formArea.setValue("oGeographyType", (objArea.lstGeographyType ?? []).map((f) => f + ""));
						formArea.setValue("sAreaName", objArea.sAreaName);
						formArea.setValue("sLatitude", objArea.sLatitude);
						formArea.setValue("sLongitude", objArea.sLongitude);
						formArea.setValue("sPathMap", objArea.sPathMap);

						onSetTableStakeholder([...objArea.lstStakeholder]);

						setArrStakeholder([...objArea.lstStakeholder]);

						//add co partner
						let arrPartner = [];
						if ((objArea.lstAgencyCooperation ?? []).length > 0) {
							objArea.lstAgencyCooperation.forEach((item) => {
								if (item.sAgency !== null && item.sAgency !== "") {
									let partner = {
										value: item,
										label: item,
									};

									arrPartner.push(partner);
								}
							});
						} else {
							let arrStakeholderData = [...objArea.lstStakeholder];
							arrStakeholderData.forEach((m) => {

								if (m.sAgency !== null && m.sAgency !== "") {
									let partner = {
										value: m.sAgency,
										label: m.sAgency,
									};

									arrPartner.push(partner);
								}

							})
						}
						setArrProjectPartner([...arrPartner]);

						formArea.setValue("sProjectPTT", (objArea.lstPTTProject ?? []).map((f) => f + ""));
						formArea.setValue("sProjectPartner", objArea.lstAgencyCooperation);

						(objArea.lstBeforeScore ?? []).forEach((item) => {
							formArea.setValue(`sScorebefore_${item.nScoreTypeID}`, item.nScore);
						});
						formArea.setValue("sConnection", objArea.sConnection);
						formArea.setValue("oAreaIndicator", (objArea.lstIndicator ?? []).map((m) => m + ""));
						setFileDocumentIndicator(objArea.lstFileIndicatorDocument ?? []);
						(objArea.lstBudget ?? []).forEach((item) => {
							formArea.setValue(`sBudgetArea_${item.sYear}`, item.nBudget);
						});
						formArea.setValue(
							"sCommunityType",
							(objArea.lstCommunityType ?? []).map((m) => m + "")
						);
						formArea.setValue("sExplainMore", objArea.sExplainMore);
						formArea.setValue("nPopulation", objArea.nPopulation);
						formArea.setValue("nHousehold", objArea.nHousehold);
						formArea.setValue("nAverageIncome", objArea.nAverageIncome);

						if (objArea.oMainOccupation != null) {
							let oJob = objArea.oMainOccupation;
							onMainGroupJob(oJob.nOccupationGroupID + "");
							formArea.setValue("sGroupMainJob", oJob.nOccupationGroupID + "");
							formArea.setValue("sMainJob", (oJob.lstOccupation ?? []).map((m) => m + ""));
						}

						let arrSub = [];

						(objArea.lstSecondaryOccupation ?? []).forEach((item) => {
							let oData = {
								sID: item.nOccupationGroupID,
								sGroupSubJobID: "oGroupSubJob_" + item.nOccupationGroupID,
								sSubJobID: "oSubJob_" + item.nOccupationGroupID,
							};
							arrSub.push(oData);
						});

						if (arrSub.length > 1) {
							setIsMoreSubjob(true);
						} else {
							setIsMoreSubjob(false);
						}
						setArrSecondaryOccupation(objArea.lstSecondaryOccupation ?? []);
						setArrGroupSubJob([...arrSub]);

						formArea.setValue("sTravel", objArea.sTravel);
						formArea.setValue("sCulture", objArea.sCulture);
						formArea.setValue("sRisk", objArea.sRisk);
						formArea.setValue("sComment", objArea.sComment);
						formArea.setValue("sAnotherAgency", objArea.sAnotherAgency);
						formArea.setValue(
							"sAgriculture",
							(objArea.lstAgriculture ?? []).map((m) => m + "")
						);
						formArea.setValue(
							"sProduct",
							(objArea.lstProduct ?? []).map((m) => m + "")
						);

						(objArea.lstNatureGroupingType ?? []).forEach((item) => {
							formArea.setValue(
								`NatureGroupingType_${item.nNatureGroupingTypeID}`,
								item.IsChecked
							);
							formArea.setValue(
								`BundleType_${item.nNatureGroupingTypeID}`,
								(item.lstBundleType ?? []).map((m) => m + "")
							);
							formArea.setValue(
								`sDescriptionFormal_${item.nNatureGroupingTypeID}`,
								item.sDescription
							);
						});
					}

					setIsAreaLoading(false);
				}
			}
		);
	};

	const onGetProvice = () => {
		formArea.setValue("sSubDistrict", null);
		formArea.setValue("sDistrict", null);
		DialogFn.BlockUI();
		AxiosGet(
			"Project/GetProviceData",
			{},
			(Result) => {
				if (Result.Status === 200) {
					setArrProvice(Result.Data.lstTMProvice);
				}
				DialogFn.UnBlockUI();
			},
			(err) => {
				DialogFn.UnBlockUI();
			}
		);
	};

	const onGetDistrict = (nProviceID) => {
		formArea.setValue("sSubDistrict", null);
		if (nProviceID) {
			DialogFn.BlockUI();
			AxiosGet(
				"Project/GetDistrictData",
				{ nProviceID: parseInt(nProviceID) },
				(Result) => {
					if (Result.Status === 200) {
						setArrDistrict(Result.Data.lstTMDistrict);
					}
					DialogFn.UnBlockUI();
				},
				(err) => {
					DialogFn.UnBlockUI();
				}
			);
		} else {
			setArrDistrict([]);
		}
	};

	const onGetSubDistrict = (nDistrictID) => {
		if (nDistrictID) {
			DialogFn.BlockUI();
			AxiosGet(
				"Project/GetSubDistrictData",
				{ nDistrictID: parseInt(nDistrictID) },
				(Result) => {
					if (Result.Status === 200) {
						setArrSubDistrict(Result.Data.lstTMSubDistrict);
					}
					DialogFn.UnBlockUI();
				},
				(err) => {
					DialogFn.UnBlockUI();
				}
			);
		} else {
			setArrSubDistrict([]);
		}
	};

	const onGetInitail = () => {
		DialogFn.BlockUI();
		AxiosGet(
			"Project/GetInitailData",
			{},
			(Result) => {
				if (Result.Status === 200) {
					setArrProject(Result.Data.lstTMProject);
					setProjectNature(Result.Data.lstTMProjectNature);
					setObjAgency(Result.Data.lstTMAgency);
					setObjCoAgency(Result.Data.lstTMAgency);
					setObjSDGs(Result.Data.lstTMSDGs);
					setObjCoSDGs(Result.Data.lstTMSDGs);
					setObjCorpStrategy(Result.Data.lstTMCorporateStrategy);
					setObjIndicator(Result.Data.lstTMIndicator);
					setObjBudgetType(Result.Data.lstTMBudgetType);
					setObjUpdateType(Result.Data.lstTMUpdateProgressType);
					setObjScoreType(Result.Data.lstTMScoreType);
					setObjStakeholder(Result.Data.lstTMStakeholder);
					setObjStakeholderType(Result.Data.lstTMStakeholderType);
					setObjCommunityType(Result.Data.lstTMCommunityType);
					setObjOccupationGrp(Result.Data.lstTMOccupation);
					setObjOccupation(Result.Data.lstTMSubOccupation);
					setArrProjectPTT(Result.Data.lstTMPTTProject);
					setObjProduct(Result.Data.lstTMProduct);
					setObjAgriculture(Result.Data.lstTMAgriculture);
					setObjNatureGroupingType(
						Result.Data.lstTMNatureGroupingType
					);
					setObjBundleTypeFormal(Result.Data.lstTMBundleTypeFormal);
					setObjBundleTypeInFormal(Result.Data.lstTMBundleTypeInFormal);
					setObjAreaType(Result.Data.lstTMAreaType);
					setObjGeography(Result.Data.lstTMGeographyType);

					//set
					onSetYubScore(Result.Data.lstTMScoreType);
				}
				DialogFn.UnBlockUI();
			},
			(err) => {
				DialogFn.UnBlockUI();
			}
		);
	};

	const onSetYubScore = (data) => {
		//set yub required
		let objSchemaformArea = { ...objShcemaArea };
		let oScoreType = data ?? [];
		oScoreType.forEach((item) => {
			objSchemaformArea[`sScorebefore_${item.value}`] = yupFormSchemas
				.decimal("คะแนน", {
					required: true,
				})
				.max(5, "ระบุคะแนนได้ไม่เกิน 5");

			setObjShcemaArea({ ...objSchemaformArea });
		});

		formArea.clearErrors();
	};

	const onSetYubDuration = (data, IsRequired = true, oldData = null) => {
		//set yub required
		let objSchemaformProject = { ...objShcemaProject };
		let objSchemaformArea = { ...objShcemaArea };
		let oYear = data ?? [];

		if (oldData) {
			let d = oldData.filter((f) => !data.includes(f));

			d.forEach((item) => {
				objSchemaformProject[`sBudget_${item}`] =
					yupFormSchemas.integer("งบประมาณตามแผน", {
						required: false,
					});
				objSchemaformArea[`sBudgetArea_${item}`] =
					yupFormSchemas.integer("งบประมาณตามแผน", {
						required: false,
					});
			});
		}

		oYear.forEach((item) => {
			objSchemaformProject[`sBudget_${item}`] = yupFormSchemas.integer(
				"งบประมาณตามแผน",
				{
					required: IsRequired ? IsProject : false,
				}
			);
			objSchemaformArea[`sBudgetArea_${item}`] = yupFormSchemas.integer(
				"งบประมาณตามแผน",
				{
					required: IsRequired ? !IsProject : false,
				}
			);
		});

		setObjShcemaArea({ ...objSchemaformArea });
		setObjShcemaProject({ ...objSchemaformProject });

		formArea.clearErrors();
	};

	const onSetYubDurationOnChange = (IsRequired = false) => {
		//set yub required
		let objSchemaformProject = { ...objShcemaProject };
		let objSchemaformArea = { ...objShcemaArea };
		let oYear = arrDurationYear;

		oYear.forEach((item) => {
			objSchemaformProject[`sBudget_${item}`] = yupFormSchemas.integer(
				"งบประมาณตามแผน",
				{
					required: IsRequired,
				}
			);
			objSchemaformArea[`sBudgetArea_${item}`] = yupFormSchemas.integer(
				"งบประมาณตามแผน",
				{
					required: !IsRequired,
				}
			);
		});

		setObjShcemaArea({ ...objSchemaformArea });
		setObjShcemaProject({ ...objSchemaformProject });

		formArea.clearErrors();
	};

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
			field: "sCoSDGName",
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
			field: "sIndicator",
			headerName: "ตัวชี้วัด",
			headerAlign: "center",
			align: "left",
			sortable: false,
			resizable: false,
			flex: 2,
		},
		{
			field: "sIndicatorUnit",
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
			field: "Button (Add/Edit)",
			type: "actions",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			width: 10,
			getActions: (item) => {
				return [
					<Box
						key={item.row.sID}
						sx={{
							display: "flex",
							width: "100%",
							alignItems: "flex-start",
						}}
					>
						<BtnEditOnTable
							id={`edit-area-ontable-project-${item.row.sID}`}
							txt="แก้ไข"
							onClick={() => onEditArea(item.row.nID)}
						/>
					</Box>,
				];
			},
		},
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
			field: "sArea",
			headerName: "พื้นที่ดำเนินการ",
			headerAlign: "center",
			align: "left",
			sortable: false,
			resizable: false,
			flex: 2,
		},
		{
			field: "sAreaType",
			headerName: "ลักษณะพื้นที่",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			flex: 1,
		},
		{
			field: "sStakeholder",
			headerName: "ผู้มีส่วนได้ส่วนเสียที่สำคัญ",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			flex: 2,
		},
		{
			field: "sCommunityType",
			headerName: "ประเภทชุมชน",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			flex: 1,
		},
	];

	const dataColumnStakeholder: GridColumns = [
		{
			field: "Button (Add/Edit)",
			type: "actions",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			width: 10,
			getActions: (item) => {
				return [
					<Box
						key={item.row.sID}
						sx={{
							display: "flex",
							width: "100%",
							alignItems: "flex-start",
						}}
					>
						<BtnEditOnTable
							id={`edit-stake-ontable-project-${item.row.sID}`}
							txt="แก้ไข"
							onClick={() => onEditStakeholder(item.row.sID)}
						/>
					</Box>,
				];
			},
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

	const onDeleteCoSDGs = (event) => {
		setIsCoSDGsLoading(true);
		DialogFn.Submit(i18n.t("msgConfirmDelete"), async () => {
			DialogFn.BlockUI();
			let arrCoSDGs: any[] = arrAllSecondarySDG;

			let result = arrCoSDGs.filter((f) => !event.includes(f.sID));

			DialogFn.UnBlockUI();
			DialogFn.Success(i18n.t("msgDeleteComplete"));
			let nID = 1;
			result.forEach((f) => {
				f.sNo = nID++;
			});
			setAllSecondarySDG(result);
			onSetTableSecondarySDG(result);
			setIsCoSDGsLoading(false);
		});
		setIsCoSDGsLoading(false);
	};

	const onAddCoSDGs = (event) => {
		setIsCoSDGsLoading(true);
		let arrCoSDGs: any[] = arrAllSecondarySDG;
		let arr: any[] = [];

		if (event !== null || event !== "") {
			let data = oCoSDGs.filter((f) => event.includes(f.value));


			data.forEach((item) => {
				if (
					arrCoSDGs.filter((f) => f.sID === item.value).length === 0
				) {
					let oData = {
						nID: item.value,
						sID: item.value,
						sCoSDGName: item.label,
					};
					arr.push(oData);
				}
			});

			let result = [...arrCoSDGs, ...arr];
			let nID = 1;
			result.forEach((f) => {
				f.sNo = nID++;
			});

			setAllSecondarySDG(result);
			onSetTableSecondarySDG(result);
		}

		form.setValue("sCoSDGs", null);
		setIsCoSDGsLoading(false);
	};

	const onSetTableSecondarySDG = (data, e = DataRowCoSDGs) => {
		let nSkip = e.nPageSize * (e.nPageIndex - 1);
		nSkip = nSkip < 0 ? 0 : nSkip;

		let result = new LINQ<any>(data)
			.Skip(nSkip)
			.Take(e.nPageSize)
			.ToArray();

		if (result.length === 0) {
			e.nPageIndex =
				e.nPageIndex === 1 ? 1 : Math.ceil(data.length / e.nPageSize);

			nSkip = e.nPageSize * (e.nPageIndex - 1);
			nSkip = nSkip < 0 ? 0 : nSkip;
			result = new LINQ<any>(data)
				.Skip(nSkip)
				.Take(e.nPageSize)
				.ToArray();
		}

		setDataRowCoSDGs({
			...e,
			nDataLength: data.length,
			arrRows: result,
		});
	};

	const onSetTableIndicator = (data, e = DataRowIndicator) => {
		let nSkip = e.nPageSize * (e.nPageIndex - 1);
		nSkip = nSkip < 0 ? 0 : nSkip;

		let result = new LINQ<any>(data)
			.Skip(nSkip)
			.Take(e.nPageSize)
			.ToArray();

		if (result.length === 0) {
			e.nPageIndex =
				e.nPageIndex === 1 ? 1 : Math.ceil(data.length / e.nPageSize);

			nSkip = e.nPageSize * (e.nPageIndex - 1);
			nSkip = nSkip < 0 ? 0 : nSkip;
			result = new LINQ<any>(data)
				.Skip(nSkip)
				.Take(e.nPageSize)
				.ToArray();
		}

		setDataRowIndicator({
			...e,
			nDataLength: data.length,
			arrRows: result,
		});
	};

	const onSetTableStakeholder = (data, e = DataRowStakeholder) => {
		let nSkip = e.nPageSize * (e.nPageIndex - 1);
		nSkip = nSkip < 0 ? 0 : nSkip;

		let result = new LINQ<any>(data)
			.Skip(nSkip)
			.Take(e.nPageSize)
			.ToArray();

		if (result.length === 0) {
			e.nPageIndex =
				e.nPageIndex === 1 ? 1 : Math.ceil(data.length / e.nPageSize);

			nSkip = e.nPageSize * (e.nPageIndex - 1);
			nSkip = nSkip < 0 ? 0 : nSkip;
			result = new LINQ<any>(data)
				.Skip(nSkip)
				.Take(e.nPageSize)
				.ToArray();
		}

		setDataRowStakeholder({
			...e,
			nDataLength: data.length,
			arrRows: result,
		});
	};

	const onSDGChange = (event) => {
		if (event != null) {
			let co = oSDGs.filter((f) => f.value !== event.value);
			setObjCoSDGs(co);

			//check tabel coSDGs
			let arrCoSDGs: any[] = arrAllSecondarySDG;
			arrCoSDGs = arrCoSDGs.filter((f) => f.sID !== event.value);

			let nID = 1;
			arrCoSDGs.forEach((f) => {
				f.sNo = nID++;
			});
			setAllSecondarySDG(arrCoSDGs);
			onSetTableSecondarySDG(arrCoSDGs, DataRowCoSDGs);
		} else {
			setObjCoSDGs(oSDGs);
		}
	};

	const onAddIndicator = (event) => {
		setIsIndicatorLoading(true);
		let arrIndicator: any[] = arrProjectIndicator;
		let arr: any[] = [];
		let arrCheckbox = [];

		if (event != null || event !== "") {
			let data = oIndicator.filter((f) => event.includes(f.value));

			data.forEach((item) => {
				if (arrIndicator.filter((f) => f.sID === item.value).length === 0) {
					arrCheckbox.push(item);

					let oData = {
						sID: item.value,
						sIndicator: item.label,
						sIndicatorUnit: item.text,
					};
					arr.push(oData);
				}
			});

			let result = [...arrIndicator, ...arr];
			let nID = 1;
			result.forEach((f) => {
				f.sNo = nID++;
			});
			setArrProjectIndicator(result);
			onSetTableIndicator(result);
		}
		form.setValue("sIndicator", null);
		setIsIndicatorLoading(false);
		setArrAreaIndicator(arrCheckbox.concat(arrAreaIndicator));
	};

	const onDeleteIndicator = (event) => {
		setIsIndicatorLoading(true);
		let arrCheckbox = [];

		DialogFn.Submit(i18n.t("msgConfirmDelete"), async () => {
			DialogFn.BlockUI();
			let arrIndicator: any[] = arrProjectIndicator;

			let result = arrIndicator.filter((f) => !event.includes(f.sID));
			arrCheckbox = arrAreaIndicator.filter((f) => !event.includes(f.value));

			let nID = 1;
			result.forEach((f) => {
				f.sNo = nID++;
			});

			DialogFn.UnBlockUI();
			DialogFn.Success(i18n.t("msgDeleteComplete"));
			setArrProjectIndicator(result);
			onSetTableIndicator(result);
			setIsIndicatorLoading(false);
			setArrAreaIndicator(arrCheckbox);

			//set value oAreaIndicator
			let arr = formArea.getValues("oAreaIndicator");
			if (arr) {
				arr = arr.filter(f => !event.includes(f));
				formArea.setValue("oAreaIndicator", arr);
			}
		});
		setIsIndicatorLoading(false);
	};

	const onAddStakeholder = () => {
		setIsStakeholderLoading(true);
		let arrStakeholderData: any[] = arrStakeholder;
		let result: any[];
		let arrPartner: any[] = [];

		let nMaxID = new LINQ<any>(arrStakeholderData).Any()
			? new LINQ<any>(arrStakeholderData).Max((m) => m.sID) + 1
			: 1;
		let Type = formStakeholder.getValues("sStakeholderType");
		let lstType = oStakeholderType
			.filter((f) => Type.includes(f.value))
			.map((m) => m.label);

		let sIDEdit = sStakeholderEdit;

		if (sIDEdit) {
			arrStakeholderData = arrStakeholderData.filter(
				(f) => f.sID !== sIDEdit
			);
			nMaxID = sIDEdit;
		}

		let nStakeholderID = 0;
		let sNameStakeholder = formStakeholder.getValues("sStakeholderName");

		if (formStakeholder.getValues("oStakeholderName")) {
			nStakeholderID = parseInt(formStakeholder.getValues("oStakeholderName")?.value);
			sNameStakeholder = formStakeholder.getValues("oStakeholderName")?.label;
			arrStakeholderData = arrStakeholderData.filter(f => f.nStakeholderID !== nStakeholderID);
		}

		let oData = {
			nID: nMaxID,
			sID: nMaxID.toString(),
			nStakeholderID: nStakeholderID,
			IsNew: formStakeholder.getValues("IsNewStakeholder") ?? false,
			sNameStakeholder: sNameStakeholder,
			sType: lstType.join(","),
			lstType: (Type ?? []).map((m) => parseInt(m)),
			sPosition: formStakeholder.getValues("sStakeholderPosition"),
			sAgency: formStakeholder.getValues("sStakeholderAgency"),
			sTel: formStakeholder.getValues("sStakeholderTel"),
			sAddress: formStakeholder.getValues("sStakeholderAddr"),
			sDetail: formStakeholder.getValues("sStakeholderDetail"),
		};

		result = [...arrStakeholderData, oData];
		result.sort((a, b) => a.sID - b.sID);

		onSetTableStakeholder(result);
		setArrStakeholder(result);

		//add co partner
		result.forEach((item) => {
			if (arrProjectPartner.filter((f) => item.sAgency === f.value)) {
				if (item.sAgency !== null && item.sAgency !== "") {
					let partner = {
						value: item.sAgency,
						label: item.sAgency,
					};

					arrPartner.push(partner);
				}

			}
		});

		// sProjectPartner
		let old = form.getValues("sProjectPartner");
		let dataPart = (old ?? []).filter((f) =>
			arrPartner.map((m) => m.value).includes(f)
		);

		form.setValue("sProjectPartner", dataPart);

		setArrProjectPartner([...arrPartner]);

		formStakeholder.setValue("IsNewStakeholder", false);
		formStakeholder.setValue("oStakeholderName", null);
		formStakeholder.setValue("sStakeholderName", null);
		formStakeholder.setValue("sStakeholderType", null);
		formStakeholder.setValue("sStakeholderPosition", null);
		formStakeholder.setValue("sStakeholderAgency", null);
		formStakeholder.setValue("sStakeholderTel", null);
		formStakeholder.setValue("sStakeholderAddr", null);
		formStakeholder.setValue("sStakeholderDetail", null);
		setIsNewStakeholder(false);
		formStakeholder.reset();

		setIsStakeholderLoading(false);
		setsStakeholderEdit(null);
	};

	const onDeleteStakeholder = (event) => {
		setIsStakeholderLoading(true);
		DialogFn.Submit(i18n.t("msgConfirmDelete"), async () => {
			DialogFn.BlockUI();
			let arrStakeholderData: any[] = arrStakeholder;
			let dataProjectPartner = formArea.getValues("sProjectPartner");

			let result = arrStakeholderData.filter((f) => !event.includes(f.sID));
			let arrAgency = result.map(m => m?.sAgency);
			let arrPartner = [];
			if (arrAgency) {
				arrPartner = arrProjectPartner.filter((f) => arrAgency.includes(f.value));
				let resultPartner = arrPartner.filter((f) => dataProjectPartner.includes(f.value));
				formArea.setValue("sProjectPartner", resultPartner);
			}

			let nID = 1;
			result.forEach((f) => {
				f.sNo = nID++;
			});

			DialogFn.UnBlockUI();
			DialogFn.Success(i18n.t("msgDeleteComplete"));
			onSetTableStakeholder(result);
			setIsStakeholderLoading(false);

			setArrStakeholder([...result]);
			setArrProjectPartner([...arrPartner]);
		});
		setIsStakeholderLoading(false);
	};

	const onEditStakeholder = (sID) => {
		setsStakeholderEdit(sID);

		let arrData = new LINQ<any>(arrStakeholder).Any()
			? new LINQ<any>(arrStakeholder).FirstOrDefault((w) => w.sID === sID)
			: null;

		if (arrData) {
			setIsNewStakeholder(arrData.IsNew);
			formStakeholder.setValue("IsNewStakeholder", arrData.IsNew);
			formStakeholder.setValue(
				"oStakeholderName",
				arrData.nStakeholderID > 0
					? {
						value: arrData.nStakeholderID.toString(),
						label: arrData.sNameStakeholder,
					}
					: null
			);
			formStakeholder.setValue(
				"sStakeholderName",
				arrData.sNameStakeholder
			);
			formStakeholder.setValue(
				"sStakeholderType",
				(arrData.lstType ?? []).map((m) => m.toString())
			);
			formStakeholder.setValue("sStakeholderPosition", arrData.sPosition);
			formStakeholder.setValue("sStakeholderAgency", arrData.sAgency);
			formStakeholder.setValue("sStakeholderTel", arrData.sTel);
			formStakeholder.setValue("sStakeholderAddr", arrData.sAddress);
			formStakeholder.setValue("sStakeholderDetail", arrData.sDetail);
			formStakeholder.clearErrors();
		}
	};

	const onAddGroupSubJob = () => {
		let nMaxID = new LINQ<any>(arrGroupSubJob).Any()
			? new LINQ<any>(arrGroupSubJob).Max((m) => m.sID) + 1
			: 1;
		let oldData = arrGroupSubJob;

		let oData = {
			sID: nMaxID,
			sGroupSubJobID: "oGroupSubJob_" + nMaxID,
			sSubJobID: "oSubJob_" + nMaxID,
		};

		let result = [...oldData, oData];
		if (result.length > 1) {
			setIsMoreSubjob(true);
		} else {
			setIsMoreSubjob(false);
		}

		setArrGroupSubJob(result);
	};

	const onDeleteGroupSubJob = (sID) => {
		let old = arrGroupSubJob.filter((f) => f.sID === sID);
		let data = arrGroupSubJob.filter((f) => f.sID !== sID);

		let result = [...data];
		if (result.length > 1) {
			setIsMoreSubjob(true);
		} else {
			setIsMoreSubjob(false);
		}

		setArrGroupSubJob(result);

		if (old.length > 0) {
			let arr = arrOcupation.filter(
				(f) => f.value !== form.getValues(old[0].sGroupSubJobID)
			);
			setArrOcupation(arr);

			form.setValue(old[0].sGroupSubJobID, null);
			form.setValue(old[0].sSubJobID, null);
		}
	};

	const onDurationChange = () => {
		let arrOldDuration = arrDurationYear;

		//set yubold
		if (form.getValues("sStartDate") > form.getValues("sEndDate")) {
			form.setValue("sEndDate", null);
		}

		let dStart = form.getValues("sStartDate")
			? moment(form.getValues("sStartDate"))
				// .add(543, "years")
				.format("YYYY")
			: null;
		let dEnd = form.getValues("sEndDate")
			? moment(form.getValues("sEndDate"))
				// .add(543, "years")
				.format("YYYY")
			: moment().format("YYYY");

		let duration = [];

		if (IsCurrent) {
			dEnd = moment().format("YYYY");
		}

		if (dStart) {
			if (parseInt(dEnd) === parseInt(dStart)) {
				duration.push(dStart);
			} else {
				duration = Array.from(
					Array(parseInt(dEnd) - (parseInt(dStart) - 1)),
					(_, i) => (i + parseInt(dStart)).toString()
				);
			}
		}
		duration = duration.reverse();
		setDurationYear(duration);
		onSetYubDuration(duration, true, arrOldDuration);
	};
	const onSelectProject = (event) => {
		form.clearErrors();
		formArea.clearErrors();

		onSetYubDuration(arrDurationYear, false);

		let oProject = event;

		if (oProject) {
			DialogFn.BlockUI();
			AxiosGet(
				"Project/GetProjectInfo",
				{ nProjectID: oProject?.value, IsHasArea: false, IsActivated: false },
				(Result) => {
					if (Result.Status === 200) {
						console.log("=====Result=====", Result);
						OnSetDataProject(Result.Data);
					}
					DialogFn.UnBlockUI();
				},
				(err) => {
					console.log("err", err);
					DialogFn.UnBlockUI();
				}
			);
		}
	};

	const OnSetDataProject = (data) => {
		setProjectLoading(true);
		setarrMarkerView(data.lstMarkerMap ?? []);

		// if()
		form.setValue("IsNewProject", data.IsNewProject);
		setIsNewProject(data.IsNewProject);
		if (data.IsNewProject) {
			form.setValue("sProjectName", data.sProjectName);
		} else {
			form.setValue("oProjectName", { value: data.nProjectID.toString(), label: data.sProjectName });
		}
		form.setValue(
			"sProjectNature",
			data.nProjectNatureID
				? data.nProjectNatureID.toString()
				: null
		);
		form.setValue("sAgency", data.nAgencyID ? data.nAgencyID.toString() : null);

		form.setValue(
			"sCoAgency",
			data.lstProjectAgencySecondary
				? (data.lstProjectAgencySecondary ?? []).map(
					(m) => m.value
				)
				: null
		);
		form.setValue(
			"sStartDate",
			data.dStartDate ? moment(data.dStartDate) : null
		);
		form.setValue(
			"sEndDate",
			data.dEndDate && !data.IsCurrent
				? moment(data.dEndDate)
				: null
		);
		form.setValue("IsCurrent", data.IsCurrent);
		setIsCurrent(data.IsCurrent);
		onDurationChange();

		form.setValue(
			"sSDGs",
			data.nSDGsID ? data.nSDGsID.toString() : null
		);
		form.setValue(
			"sSDGsDescription",
			data.sSDGsDescription
		);
		if (data.nSDGsID) {
			setObjCoSDGs(
				oCoSDGs.filter(
					(f) => f.value !== data.nSDGsID.toString()
				)
			);
		}

		form.setValue("sCoSDGsDescription", data.sSDGsSecondaryDescription);
		form.setValue("sCorporateStrategy", data.nCorporateStrategyID);
		form.setValue("sProjectOrigin", data.sProjectOrigin);
		form.setValue("sObjective", data.sObjective);
		form.setValue("sBusinessConnection", data.sBusinessConnection);
		form.setValue("sTarget", data.sTarget);
		form.setValue("sRisk", data.sRisk);
		form.setValue("sBudgetType", data.nBudgetTypeID);
		form.setValue("sUpdateProgessType", data.nUpdateTypeID);
		setFileDocumentProject(data.lstFileProjectDocument);

		setIsProject(data.nBudgetTypeID === 14);
		onSetYubDurationOnChange(data.nBudgetTypeID === 14);

		(data.lstBudget ?? []).forEach((item) => {
			form.setValue(
				`sBudget_${item.sYear}`,
				item.nBudget ?? null
			);
		});

		let arrCoSDGs = [];
		let nID = 1;

		if (data.lstSDGsSecondary != null) {
			if ((oCoSDGs ?? []).length > 0) {
				data.lstSDGsSecondary.forEach((item) => {
					let data = oCoSDGs.filter(
						(f) => f.value === item.nID.toString()
					);
					if (data.length > 0) {
						if (
							arrCoSDGs.filter(
								(f) => f.sID === item.nID.toString()
							).length === 0
						) {
							let oData = {
								sID: item.nID.toString(),
								sCoSDGName: data[0].label,
							};
							arrCoSDGs.push(oData);
						}
					}
				});
				arrCoSDGs.forEach((f) => {
					f.sNo = nID++;
				});
			} else {
				data.lstSDGsSecondary.forEach(f => {
					let oData = {
						sNo: f.sNo,
						sID: f.nID.toString(),
						sCoSDGName: f.sName,
					};
					arrCoSDGs.push(oData);
				});
			}
		}

		setAllSecondarySDG(arrCoSDGs);
		onSetTableSecondarySDG(arrCoSDGs);

		let arr: any[] = [];
		let arrCheckbox: any[] = [];

		let lstIndicator = [];

		if ((data.lstIndicator ?? []).length > 0) {
			lstIndicator = data.lstIndicator.map(f => f.nID);
		}
		if ((oIndicator ?? []).length > 0) {
			lstIndicator.forEach((item) => {

				let event = item.toString();
				let data = oIndicator.filter((f) =>
					event.includes(f.value)
				);
				if (data.length > 0) {
					if (arr.filter((f) => f.sID === data[0].value).length === 0) {
						console.log("data[0]", data[0]);
						arrCheckbox.push(data[0]);
						let oData = {
							sID: data[0].value,
							sIndicator: data[0].label,
							sIndicatorUnit: data[0].text,
						};
						arr.push(oData);
					}
				}
			})
		} else {
			if (data.lstIndicator !== null) {
				data.lstIndicator.forEach((item) => {
					let oData = {
						sID: item.nID.toString(),
						sIndicator: item.sName,
						sIndicatorUnit: item.sUnit,
					};

					let checkbox = {
						label: item.sName,
						value: item.nID.toString(),
						text: item.sUnit,
					}
					arrCheckbox.push(checkbox);
					arr.push(oData);
				});
			}
		}
		console.log("arrCheckboxss", arrCheckbox);
		setArrAreaIndicator(arrCheckbox);

		let result = [...arr];
		nID = 1;
		result.forEach((f) => {
			f.sNo = nID++;
		});
		setArrProjectIndicator(result);
		onSetTableIndicator(result);

		//Area
		console.log(data.lstArea)
		if (data.lstArea !== null) {
			let sNo = 1;
			let result = [];
			data.lstArea.forEach(item => {
				let obj = {
					nAreaID: item.nAreaID,
					nID: item.nAreaID,
					sID: item.nAreaID.toString(),
					sNo: sNo++,
					lstArea: item,
					sArea: item.sAreaName,
					sAreaType: item.sAreaTypeName,
					sStakeholder: item.lstStakeholder.map((m) => m.sNameStakeholder),
					sCommunityType: item.lstCommunityTypeName,
					IsNew: false,
					IsDelete: false
				};
				result.push(obj);
			});
			setDataRowArea({
				...DataRowArea,
				nDataLength: result.length,
				arrRows: result,
			});

			setsAreaEdit(null);
			setArrProjectArea(result);
		}

		setProjectLoading(false);

	}

	const onSelectStakeholder = (event) => {
		console.log("==============onSelectStakeholder==============", event);

		let stakeholder = event;

		if (stakeholder) {
			AxiosGet(
				"Project/GetStakeholdersInfo",
				{ nStakeholdersID: stakeholder?.value },
				(Result) => {
					if (Result.Status === 200) {
						let data = Result.Data;
						formStakeholder.setValue("sStakeholderType", (data.lstTMStakeholderType ?? []).map((m) => m.toString()));
						formStakeholder.setValue("sStakeholderPosition", data.sPosition);
						formStakeholder.setValue("sStakeholderAgency", data.sAffiliation);
						formStakeholder.setValue("sStakeholderTel", data.sTel);
						formStakeholder.setValue("sStakeholderAddr", data.sAddress);
					}
					DialogFn.UnBlockUI();
				},
				(err) => {
					DialogFn.UnBlockUI();
				}
			);
		}
	};

	const onDeleteArea = (event) => {
		setIsStakeholderLoading(true);
		DialogFn.Submit(i18n.t("msgConfirmDelete"), async () => {
			DialogFn.BlockUI();
			let dataRow = DataRowArea;
			let arrAreaData: any[] = arrProjectArea;
			let arrSum = arrSumBudgetArea;


			arrDurationYear.forEach((f) => {
				let nBudget = arrSum.filter((b) => b.sYear === f + "" && event.includes(b.sID)).map(m => m.nBudget).reduce((a, b) => a + b, 0);

				let nProjectBudget = form.getValues(`sBudget_${f}`);

				if (nProjectBudget !== null) {
					form.setValue(`sBudget_${f}`, nProjectBudget - nBudget);
				}

			});

			setSumBudgetArea(arrSum.filter((b) => !event.includes(b.sID)));

			let result = arrAreaData.filter((f) => !event.includes(f.sID));
			let arrDelete = arrAreaData.filter((f) => event.includes(f.sID) && !f.IsNew);

			arrDelete.forEach(item => {
				item.IsDelete = true;
				item.lstArea.IsDelete = true;
			})

			let nID = 1;
			result.forEach((f) => {
				f.sNo = nID++;
			});
			DialogFn.UnBlockUI();
			DialogFn.Success(i18n.t("msgDeleteComplete"));
			setDataRowArea({
				...dataRow,
				nDataLength: result.length,
				arrRows: [...result],
			});
			setIsStakeholderLoading(false);
			setArrProjectArea([...result, ...arrDelete]);
		});
		setIsStakeholderLoading(false);
	};

	const onEditArea = (nID) => {
		setsAreaEdit(nID);
		let arrArea = arrProjectArea.filter((f) => f.nID === nID);
		if (arrArea.length > 0) {
			let objArea = arrArea[0].lstArea;
			onGetDistrict(objArea.nProviceID);
			onGetSubDistrict(objArea.nDistrictID);

			formArea.setValue("sAreaType", objArea.nAreaTypeID + "");
			formArea.setValue("sProvice", objArea.nProviceID + "");
			formArea.setValue("sDistrict", objArea.nDistrictID + "");
			formArea.setValue("sSubDistrict", objArea.nSubDistrictID + "");
			formArea.setValue("oGeographyType", (objArea.lstGeographyType ?? []).map((f) => f + ""));
			formArea.setValue("sAreaName", objArea.sAreaName);
			formArea.setValue("sLatitude", objArea.sLatitude);
			formArea.setValue("sLongitude", objArea.sLongitude);
			formArea.setValue("sPathMap", objArea.sPathMap);

			onSetTableStakeholder([...objArea.lstStakeholder]);

			setArrStakeholder([...objArea.lstStakeholder]);

			//add co partner
			let arrPartner = [];
			if ((objArea.lstAgencyCooperation ?? []).length > 0) {
				objArea.lstAgencyCooperation.forEach((item) => {
					if (item.sAgency !== null && item.sAgency !== "") {
						let partner = {
							value: item,
							label: item,
						};

						arrPartner.push(partner);
					}
				});
			} else {
				let arrStakeholderData = [...objArea.lstStakeholder];
				arrStakeholderData.forEach((m) => {

					if (m.sAgency !== null && m.sAgency !== "") {
						let partner = {
							value: m.sAgency,
							label: m.sAgency,
						};

						arrPartner.push(partner);
					}

				})
			}
			setArrProjectPartner([...arrPartner]);

			formArea.setValue("sProjectPTT", (objArea.lstPTTProject ?? []).map((f) => f + ""));
			formArea.setValue("sProjectPartner", objArea.lstAgencyCooperation);

			(objArea.lstBeforeScore ?? []).forEach((item) => {
				formArea.setValue(`sScorebefore_${item.nScoreTypeID}`, item.nScore);
			});
			formArea.setValue("sConnection", objArea.sConnection);
			formArea.setValue("oAreaIndicator", (objArea.lstIndicator ?? []).map((m) => m + ""));
			setFileDocumentIndicator(objArea.lstFileIndicatorDocument ?? []);
			(objArea.lstBudget ?? []).forEach((item) => {
				formArea.setValue(`sBudgetArea_${item.sYear}`, item.nBudget);
			});
			formArea.setValue("sCommunityType", (objArea.lstCommunityType ?? []).map((m) => m + ""));
			formArea.setValue("sExplainMore", objArea.sExplainMore);
			formArea.setValue("nPopulation", objArea.nPopulation);
			formArea.setValue("nHousehold", objArea.nHousehold);
			formArea.setValue("nAverageIncome", objArea.nAverageIncome);

			if (objArea.oMainOccupation != null) {
				let oJob = objArea.oMainOccupation;
				onMainGroupJob(oJob.nOccupationGroupID + "");
				formArea.setValue("sGroupMainJob", oJob.nOccupationGroupID + "");
				formArea.setValue("sMainJob", (oJob.lstOccupation ?? []).map((m) => m + ""));
			}

			if ((objArea.lstSecondaryOccupation ?? []).length === 0) {
				onAddGroupSubJob();
			}

			let arrSub = [];

			(objArea.lstSecondaryOccupation ?? []).forEach((item) => {
				let oData = {
					sID: item.sID,
					sGroupSubJobID: "oGroupSubJob_" + item.sID,
					sSubJobID: "oSubJob_" + item.sID,
				};
				arrSub.push(oData);
			});

			if (arrSub.length > 1) {
				setIsMoreSubjob(true);
			} else {
				setIsMoreSubjob(false);
			}
			setArrSecondaryOccupation(objArea.lstSecondaryOccupation ?? []);
			setArrGroupSubJob([...arrSub]);

			formArea.setValue("sTravel", objArea.sTravel);
			formArea.setValue("sCulture", objArea.sCulture);
			formArea.setValue("sRisk", objArea.sRisk);
			formArea.setValue("sComment", objArea.sComment);
			formArea.setValue("sAnotherAgency", objArea.sAnotherAgency);
			formArea.setValue("sAgriculture", (objArea.lstAgriculture ?? []).map((m) => m + ""));
			formArea.setValue("sProduct", (objArea.lstProduct ?? []).map((m) => m + ""));

			(objArea.lstNatureGroupingType ?? []).forEach((item) => {
				formArea.setValue(`NatureGroupingType_${item.nNatureGroupingTypeID}`, item.IsChecked);
				formArea.setValue(`BundleType_${item.nNatureGroupingTypeID}`, (item.lstBundleType ?? []).map((m) => m + ""));
				formArea.setValue(`sDescriptionFormal_${item.nNatureGroupingTypeID}`, item.sDescription);
			});
		}
	};

	const onClickEdit = () => {
		if (sMode === "S") {
			document.getElementById("submit").click();
		}
	}

	const onSetEditArea = () => {
		let arrMark = [oMarkerArea];
		let arrConcat = [...arrMarkerView, ...arrMark].filter(
			(f) => f !== null
		);

		setarrMarkerView(arrConcat);
		let oForm = formArea.getValues();
		setAreaForm([...arrAreaForm, oForm]);

		let arrAreaType = oAreaType
			.filter((f) => f.value === oForm.sAreaType)
			.map((m) => m.label);
		let arrProviceData = arrProvice
			.filter((f) => f.value === oForm.sProvice)
			.map((m) => m.label);
		let arrDistrictData = arrDistrict
			.filter((f) => f.value === oForm.sDistrict)
			.map((m) => m.label);
		let arrSubDistrictData = arrSubDistrict
			.filter((f) => f.value === oForm.sSubDistrict)
			.map((m) => m.label);

		//score

		let lstGroupSubJob = [];
		let lstNatureGroupingType = [];
		let lstBeforeScore = [];
		let lstBudget = [];

		arrDurationYear.forEach((f) => {
			let nBudget = oForm[`sBudgetArea_${f}`] !== "" ? oForm[`sBudgetArea_${f}`] : null;
			let arr = {
				sYear: f,
				nBudget: nBudget > -1 ? nBudget : null,
			};
			lstBudget.push(arr);
		});
		
		oNatureGroupingType.forEach((f) => {
			let arr = {
				nNatureGroupingTypeID: parseInt(f.value),
				IsChecked: oForm[`NatureGroupingType_${f.value}`] ?? false,
				lstBundleType: (oForm[`BundleType_${f.value}`] ?? []).map((m) =>
					parseInt(m)
				),
				sDescription: oForm[`sDescriptionFormal_${f.value}`] ?? null,
			};
			lstNatureGroupingType.push(arr);
		});

		oScoreType.forEach((f) => {
			let arr = {
				nScoreTypeID: parseInt(f.value),
				nScore: oForm[`sScorebefore_${f.value}`],
			};
			lstBeforeScore.push(arr);
		});

		arrGroupSubJob.forEach((f) => {
			if (oForm[f.sGroupSubJobID]) {
				let arr = {
					sID: f.sID,
					nOccupationGroupID: parseInt(oForm[f.sGroupSubJobID]),
					lstOccupation: (oForm[f.sSubJobID] ?? []).map((m) =>
						parseInt(m)
					),
				};
				lstGroupSubJob.push(arr);
			}
		});

		console.log("oForm", oForm);

		let objArea = {
			IsNew: nAreaID ? false : true,
			IsDelete: false,
			nAreaID: nAreaID,
			nAreaTypeID: parseInt(oForm.sAreaType),
			sAreaTypeName: arrAreaType.length > 0 ? arrAreaType[0] : null,
			nProviceID: parseInt(oForm.sProvice),
			sProviceName: arrProviceData.length > 0 ? arrProviceData[0] : null,
			nDistrictID: parseInt(oForm.sDistrict) ?? null,
			sDistrictName:
				arrDistrictData.length > 0 ? arrDistrictData[0] : null,
			nSubDistrictID: parseInt(oForm.sSubDistrict) ?? null,
			sSubDistrictName:
				arrSubDistrictData.length > 0 ? arrSubDistrictData[0] : null,
			lstGeographyType: (oForm.oGeographyType ?? []).map((m) =>
				parseInt(m)
			),
			sGeographyType: oGeography
				.filter((f) => oForm.oGeographyType.includes(f.value))
				.map((m) => m.label),
			sAreaName: oForm.sAreaName,
			sLatitude: oForm.sLatitude + "",
			sLongitude: oForm.sLongitude + "",
			sPathMap: oForm.sPathMap,
			lstCommunityType: (oForm.sCommunityType ?? []).map((m) =>
				parseInt(m)
			),
			sCommunityTypeName: oCommunityType
				.filter((f) => oForm.sCommunityType.includes(f.value))
				.map((m) => m.label),
			lstStakeholder: arrStakeholder,
			lstIndicator: (oForm.oAreaIndicator ?? []).map((m) => parseInt(m)),
			lstPTTProject: (oForm.sProjectPTT ?? []).map((m) => parseInt(m)),
			lstAgencyCooperation: oForm.sProjectPartner ?? null,
			sTravel: oForm.sTravel,
			sConnection: oForm.sConnection,
			sExplainMore: oForm.sExplainMore,
			sComment: oForm.sComment,
			sRisk: oForm.sRisk,
			lstProduct: (oForm.sProduct ?? []).map((m) => parseInt(m)),
			lstAgriculture: (oForm.sAgriculture ?? []).map((m) => parseInt(m)),
			sCulture: oForm.sCulture,
			nHousehold: oForm.nHousehold * 1 > 0 ? oForm.nHousehold : null,
			nPopulation: oForm.nPopulation * 1 > 0 ? oForm.nPopulation : null,
			nAverageIncome: oForm.nAverageIncome * 1 > 0 ? oForm.nAverageIncome : null,
			lstFileIndicatorDocument: arrFileDocumentIndicator,
			oMainOccupation: {
				nOccupationGroupID: parseInt(oForm.sGroupMainJob),
				lstOccupation: (oForm.sMainJob ?? []).map((m) => parseInt(m)),
			},
			// nMainOccupationGroup: parseInt(oForm.sGroupMainJob),
			// lstMainOccupation: (oForm.sMainJob ?? []).map((m) => parseInt(m)),
			lstSecondaryOccupation: lstGroupSubJob,
			sAnotherAgency: oForm.sAnotherAgency,
			lstNatureGroupingType: lstNatureGroupingType,
			lstBeforeScore: lstBeforeScore,
			lstBudget: lstBudget,
		};

		return objArea;
	}

	const onAddArea = () => {
		// Map
		let arrMark = [oMarkerArea];
		let nAreaID = null;
		let arrConcat = [...arrMarkerView, ...arrMark].filter(
			(f) => f !== null
		);

		setarrMarkerView(arrConcat);
		setoMarkerArea(null);

		let dataRow = DataRowArea;
		let arrArea = arrProjectArea ?? [];
		let oForm = formArea.getValues();
		setAreaForm([...arrAreaForm, oForm]);

		let nMaxID = new LINQ<any>(arrArea).Any()
			? new LINQ<any>(arrArea).Max((m) => m.nID) + 1
			: 1;

		let sIDEdit = sAreaEdit;

		if (sIDEdit) {
			arrArea = arrArea.filter((f) => f.nID !== sIDEdit);
			nAreaID = arrProjectArea.find((f) => f.nID === sIDEdit)?.nAreaID;
			nMaxID = sIDEdit;
		}

		let arrAreaType = oAreaType
			.filter((f) => f.value === oForm.sAreaType)
			.map((m) => m.label);
		let arrProviceData = arrProvice
			.filter((f) => f.value === oForm.sProvice)
			.map((m) => m.label);
		let arrDistrictData = arrDistrict
			.filter((f) => f.value === oForm.sDistrict)
			.map((m) => m.label);
		let arrSubDistrictData = arrSubDistrict
			.filter((f) => f.value === oForm.sSubDistrict)
			.map((m) => m.label);

		//score

		let lstGroupSubJob = [];
		let lstNatureGroupingType = [];
		let lstBeforeScore = [];
		let lstBudget = [];
		let arrSum = arrSumBudgetArea;
		let arrResultSum = [];

		arrDurationYear.forEach((f) => {
			let nBudget = oForm[`sBudgetArea_${f}`] !== "" ? oForm[`sBudgetArea_${f}`] : null;
			let arr = {
				sYear: f,
				nBudget: nBudget > -1 ? nBudget : null,
			};
			lstBudget.push(arr);

			//sum budget
			let oBudget = arrSum.find(
				(b) => b.sYear === f + "" && b.sID === nMaxID.toString()
			);
			let nProjectBudget = form.getValues(`sBudget_${f}`);
			nBudget = nBudget + nProjectBudget;

			if (oBudget) {
				nBudget = nBudget - oBudget.nBudget;
			}

			arr["sID"] = nMaxID.toString();
			arrResultSum.push(arr);

			if (!IsProject) {
				form.setValue(`sBudget_${f}`, nBudget);
			}
		});
		arrSum = arrSum.filter(b => b.sID !== nMaxID.toString());
		setSumBudgetArea([...arrSum, ...arrResultSum]);

		oNatureGroupingType.forEach((f) => {
			let arr = {
				nNatureGroupingTypeID: parseInt(f.value),
				IsChecked: oForm[`NatureGroupingType_${f.value}`] ?? false,
				lstBundleType: (oForm[`BundleType_${f.value}`] ?? []).map((m) =>
					parseInt(m)
				),
				sDescription: oForm[`sDescriptionFormal_${f.value}`] ?? null,
			};
			lstNatureGroupingType.push(arr);
		});

		oScoreType.forEach((f) => {
			let arr = {
				nScoreTypeID: parseInt(f.value),
				nScore: oForm[`sScorebefore_${f.value}`],
			};
			lstBeforeScore.push(arr);
		});

		arrGroupSubJob.forEach((f) => {
			if (oForm[f.sGroupSubJobID]) {
				let arr = {
					sID: f.sID,
					nOccupationGroupID: parseInt(oForm[f.sGroupSubJobID]),
					lstOccupation: (oForm[f.sSubJobID] ?? []).map((m) =>
						parseInt(m)
					),
				};
				lstGroupSubJob.push(arr);
			}
		});

		console.log("oForm", oForm);

		let objArea = {
			IsNew: nAreaID ? false : true,
			IsDelete: false,
			nAreaID: nAreaID,
			nAreaTypeID: parseInt(oForm.sAreaType),
			sAreaTypeName: arrAreaType.length > 0 ? arrAreaType[0] : null,
			nProviceID: parseInt(oForm.sProvice),
			sProviceName: arrProviceData.length > 0 ? arrProviceData[0] : null,
			nDistrictID: parseInt(oForm.sDistrict) ?? null,
			sDistrictName:
				arrDistrictData.length > 0 ? arrDistrictData[0] : null,
			nSubDistrictID: parseInt(oForm.sSubDistrict) ?? null,
			sSubDistrictName:
				arrSubDistrictData.length > 0 ? arrSubDistrictData[0] : null,
			lstGeographyType: (oForm.oGeographyType ?? []).map((m) =>
				parseInt(m)
			),
			sGeographyType: oGeography
				.filter((f) => oForm.oGeographyType.includes(f.value))
				.map((m) => m.label),
			sAreaName: oForm.sAreaName,
			sLatitude: oForm.sLatitude + "",
			sLongitude: oForm.sLongitude + "",
			sPathMap: oForm.sPathMap,
			lstCommunityType: (oForm.sCommunityType ?? []).map((m) =>
				parseInt(m)
			),
			sCommunityTypeName: oCommunityType
				.filter((f) => oForm.sCommunityType.includes(f.value))
				.map((m) => m.label),
			lstStakeholder: arrStakeholder,
			lstIndicator: (oForm.oAreaIndicator ?? []).map((m) => parseInt(m)),
			lstPTTProject: (oForm.sProjectPTT ?? []).map((m) => parseInt(m)),
			lstAgencyCooperation: oForm.sProjectPartner ?? null,
			sTravel: oForm.sTravel,
			sConnection: oForm.sConnection,
			sExplainMore: oForm.sExplainMore,
			sComment: oForm.sComment,
			sRisk: oForm.sRisk,
			lstProduct: (oForm.sProduct ?? []).map((m) => parseInt(m)),
			lstAgriculture: (oForm.sAgriculture ?? []).map((m) => parseInt(m)),
			sCulture: oForm.sCulture,
			nHousehold: oForm.nHousehold * 1 > 0 ? oForm.nHousehold : null,
			nPopulation: oForm.nPopulation * 1 > 0 ? oForm.nPopulation : null,
			nAverageIncome: oForm.nAverageIncome * 1 > 0 ? oForm.nAverageIncome : null,
			lstFileIndicatorDocument: arrFileDocumentIndicator,
			oMainOccupation: {
				nOccupationGroupID: parseInt(oForm.sGroupMainJob),
				lstOccupation: (oForm.sMainJob ?? []).map((m) => parseInt(m)),
			},
			// nMainOccupationGroup: parseInt(oForm.sGroupMainJob),
			// lstMainOccupation: (oForm.sMainJob ?? []).map((m) => parseInt(m)),
			lstSecondaryOccupation: lstGroupSubJob,
			sAnotherAgency: oForm.sAnotherAgency,
			lstNatureGroupingType: lstNatureGroupingType,
			lstBeforeScore: lstBeforeScore,
			lstBudget: lstBudget,
		};

		let IsBKK = objArea.nProviceID === 10;
		let sSubDistrictName = (objArea.sSubDistrictName ? (IsBKK ?? "ตำบล") + objArea.sSubDistrictName + " " : "");
		let sDistrictName = (objArea.sDistrictName ? (IsBKK ?? "อำเภอ") + objArea.sDistrictName + " " : "");
		let sProviceName = (objArea.sProviceName ? (IsBKK ?? "จังหวัด") + objArea.sProviceName + " " : "");
		let sAreaName = objArea.sAreaName ? objArea.sAreaName + " " :
			sSubDistrictName + sDistrictName + sProviceName;

		let obj = {
			IsNew: objArea.IsNew,
			IsDelete: objArea.IsDelete,
			nAreaID: nAreaID,
			nID: nMaxID,
			sID: nMaxID.toString(),
			sNo: nMaxID,
			lstArea: objArea,
			sArea: sAreaName,
			sAreaType: objArea.sAreaTypeName,
			sStakeholder: arrStakeholder.map((m) => m.sNameStakeholder),
			sCommunityType: objArea.sCommunityTypeName,
		};
		let nNo = 1;
		let result = [...arrArea, obj];

		result.forEach(f => f.sNo = nNo++);

		let arrTable = result.filter(f => !f.IsDelete);

		setDataRowArea({
			...dataRow,
			nDataLength: arrTable.length,
			arrRows: arrTable,
		});

		setsAreaEdit(null);
		setArrProjectArea(result);
		ClearFieldArea();
		setArrSecondaryOccupation([]);
		setFileDocumentIndicator([]);
		onClearFile.current();
		setArrStakeholder([]);
		setArrOcupation([]);
		setArrGroupSubJob([]);
		setDataRowStakeholder({
			...DataRowStakeholder,
			nDataLength: 0,
			arrRows: [],
		});
		console.log("data", obj);
	};

	const ClearFieldArea = () => {
		Object.keys(formArea.getValues()).forEach((key) => {
			formArea.setValue(key, null);
			formArea.clearErrors(key);
		});
	};

	const onSetDataToSave = () => {
		let arrForm = form.getValues();
		let lstBudget = [];
		let lstAgencySecondary = [];
		let lstSDGsSecondary = [];

		arrDurationYear.forEach((f) => {
			let nBudget = arrForm[`sBudget_${f}`] ?? null;
			let arr = {
				sYear: f,
				nBudget: nBudget > -1 ? nBudget : null,
			};
			lstBudget.push(arr);
		});

		(arrForm.sCoAgency ?? []).forEach((f) => {
			let arr = {
				nID: parseInt(f),
				sOther: null,
			};
			lstAgencySecondary.push(arr);
		});
		(DataRowCoSDGs.arrRows ?? []).forEach((f) => {
			let arr = {
				nID: parseInt(f.sID),
				sOther: null,
			};
			lstSDGsSecondary.push(arr);
		});

		let oData = {
			sMode: null,
			IsNewProject: IsNewProject,
			nProjectID: arrForm.oProjectName?.value ?? nProjectID,
			sProjectName: IsNewProject
				? arrForm.sProjectName
				: arrForm.oProjectName?.label,
			IsCurrent: IsCurrent,
			lstFileProjectDocument: arrFileDocumentProject,
			nAgencyID: arrForm.sAgency,
			lstAgencySecondary: lstAgencySecondary,
			nStartDate: moment(arrForm.sStartDate).valueOf(),
			nEndDate: moment(arrForm.sEndDate).isValid()
				? moment(arrForm.sEndDate).valueOf()
				: null,
			nSDGsID: arrForm.sSDGs,
			lstSDGsSecondary: lstSDGsSecondary,
			sSDGsDescription: arrForm.sSDGsDescription,
			sSDGsSecondaryDescription: arrForm.sCoSDGsDescription,
			nCorporateStrategyID: arrForm.sCorporateStrategy,
			lstIndicator: (DataRowIndicator.arrRows ?? []).map((m) =>
				parseInt(m.sID)
			),
			sProjectOrigin: arrForm.sProjectOrigin,
			sObjective: arrForm.sObjective,
			nProjectNatureID: arrForm.sProjectNature,
			sBusinessConnection: arrForm.sBusinessConnection,
			sRisk: arrForm.sRisk,
			sTarget: arrForm.sTarget,
			nBudgetTypeID: arrForm.sBudgetType,
			lstBudget: lstBudget,
			nUpdateTypeID: arrForm.sUpdateProgessType,
			lstArea: (arrProjectArea ?? []).map((m) => m.lstArea),
			nCountlstArea: (arrProjectArea ?? []).filter(f => !f.IsDelete).map((m) => m.lstArea).length,
		};
		return oData;
	}

	const onSubmit = () => {
		let oData = onSetDataToSave();

		if (IsEditProject || IsReject) {
			let arrArea = onSetEditArea();
			oData.lstArea = [arrArea];
			oData.nCountlstArea = 1;
		}
		oData.sMode = "S";
		console.log("submit :: ", oData);
		onSave(oData);
	};

	const onSaveDraft = () => {
		let oName = form.getValues("oProjectName");
		let sName = form.getValues("sProjectName");

		if (oName || (sName && sName !== "")) {
			let oData = onSetDataToSave();

			if (IsEditProject || IsReject) {
				let arrArea = onSetEditArea();
				oData.lstArea = [arrArea];
				oData.nCountlstArea = 1;
			}
			oData.sMode = "D";
			console.log("submit :: ", oData);
			onSave(oData);
		} else {
			onSave(null);
			DialogFn.Warning(i18n.t("pleaseSpecify") + i18n.t("Project.Name"));
			if (IsNewProject) {
				form.setFocus("sProjectName");
			} else {
				document.getElementById("oProjectName").focus();
			}
		}
	};

	const onResetStakeholder = () => {
		formStakeholder.setValue("sStakeholderName", null);
		formStakeholder.setValue("oStakeholderName", null);
		formStakeholder.setValue("sStakeholderType", null);
		formStakeholder.setValue("sStakeholderPosition", null);
		formStakeholder.setValue("sStakeholderAgency", null);
		formStakeholder.setValue("sStakeholderTel", null);
		formStakeholder.setValue("sStakeholderAddr", null);
		formStakeholder.setValue("sStakeholderDetail", null);
	};

	const onResetProject = () => {
		setArrAreaIndicator([]);
		formArea.setValue("oAreaIndicator", null);
		form.setValue("sProjectName", null);
		form.setValue("oProjectName", null);

		form.setValue("sProjectNature", null);
		form.setValue("sAgency", null);
		form.setValue("sCoAgency", null);
		form.setValue("sStartDate", null);
		form.setValue("sEndDate", null);
		form.setValue("IsCurrent", false);
		setIsCurrent(false);

		form.setValue("sSDGs", null);
		form.setValue("sSDGsDescription", null);
		form.setValue("sCoSDGsDescription", null);
		form.setValue("sCorporateStrategy", null);
		form.setValue("sProjectOrigin", null);
		form.setValue("sObjective", null);
		form.setValue("sBusinessConnection", null);
		form.setValue("sTarget", null);
		form.setValue("sRisk", null);
		form.setValue("sBudgetType", null);
		form.setValue("sUpdateProgessType", null);
		setFileDocumentProject([]);

		setIsProject(false);

		onSetYubDuration(arrDurationYear, false);
		(arrDurationYear ?? []).forEach((item) => {
			form.setValue(`sBudget_${item}`, null);
		});
		setDataRowCoSDGs({
			...DataRowCoSDGs,
			nDataLength: 0,
			arrRows: [],
		});
		setDataRowIndicator({
			...DataRowIndicator,
			nDataLength: 0,
			arrRows: [],
		});

		setDurationYear([]);

		form.clearErrors();
	};

	const onResetCurrent = () => {
		form.setValue("sEndDate", null);
		form.clearErrors();
	};

	const onMainGroupJob = (e) => {
		formArea.setValue("sMainJob", null);
		let arr = arrOcupation;
		let old = arr.filter((f) => f.sID === "sGroupMainJob");

		if ((old ?? []).length > 0) {
			old[0].value = e?.value ?? e;
		} else {
			let data = {
				sID: "sGroupMainJob",
				value: e?.value ?? e,
			};
			old = [data];
		}

		arr = arr.filter((f) => f.sID !== "sGroupMainJob");
		setArrOcupation([...arr, ...old]);
	};

	return (
		<Fragment>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<FormProvider {...form}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<AccordionCustom header="รายละเอียดโครงการ">
									<Grid container spacing={2}>
										<Grid item container spacing={2}>
											<Grid item xs={12} md={2}>
												{IsProjectLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<CheckboxFormItem
														name="IsNewProject"
														label={"โครงการใหม่"}
														disabled={IsReject ? true : IsEditProject}
														onChange={(e) => { setIsNewProject(e ?? false); onResetProject(); }}
													/>
												}
											</Grid>
											<Grid item xs={12} md={10}>
												{IsProjectLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<>
														{IsNewProject ? (
															<TextBoxForm
																required
																disabled={IsReject ? true : IsEditProject}
																id="sProjectName"
																name="sProjectName"
																maxLength={0}
																label="ชื่อโครงการ"
																fullWidth
																placeholder="ชื่อโครงการ"
															/>
														) : (
															<AutocompleteForm
																disabled={IsReject ? true : IsEditProject}
																label="ชื่อโครงการ"
																id="oProjectName"
																name="oProjectName"
																placeholder="ชื่อโครงการ"
																onSelect={
																	(e, value) =>
																		onSelectProject(value)
																}
																required={true}
																TextFilterCount={1}
																fnLoadData={(sSearch, setloaded) => {
																	let lstDataAuto = arrProject;
																	sSearch = sSearch.trim().toLowerCase();
																	setloaded(sSearch ? lstDataAuto.filter((f) => f.label.toLowerCase().includes(sSearch)) : lstDataAuto);
																}}
															/>
														)}
													</>
												}
											</Grid>
										</Grid>
										<Grid item container spacing={2}>
											<Grid item xs={12} md={6}>
												<Grid container spacing={2}>
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<SelectFormItem
																required
																id="sProjectNature"
																name="sProjectNature"
																options={oProjectNature}
																label={"ลักษณะโครงการ"}
																placeholder="ลักษณะโครงการ"
																disabled={!IsNewProject}
															/>
														}
													</Grid>
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<SelectFormItem
																required
																disabled={!IsNewProject}
																id="sAgency"
																name="sAgency"
																options={oAgency}
																label={"หน่วยงานที่รับผิดชอบหลัก"}
																placeholder="หน่วยงานที่รับผิดชอบหลัก"
															// onChange={(e) => {}}
															/>
														}
													</Grid>
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<SelectMultipleFormItem
																disabled={!IsNewProject}
																required={false}
																id="sCoAgency"
																name="sCoAgency"
																options={oCoAgency}
																label={"หน่วยงานที่รับผิดชอบรอง"}
																placeholder="หน่วยงานที่รับผิดชอบรอง"
																nLimits={200}
															/>
														}
													</Grid>
													{/* duration */}
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={100} />
															:
															<HeaderInput
																text={"ระยะเวลาดำเนินการ"}
																required
															/>
														}
													</Grid>
													<Grid item xs={12} md={4}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<DatePickerFromItem
																disabled={!IsNewProject}
																required
																name="sStartDate"
																label="วันที่เริ่มต้น"
																onChange={(e) => {
																	onDurationChange();
																	setMinDateProject(e);
																}}
															/>
														}
													</Grid>
													<Grid item xs={12} md={4}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<DatePickerFromItem
																disabled={IsNewProject ? IsCurrent : true}
																required={!IsCurrent}
																name="sEndDate"
																label="วันที่สิ้นสุด"
																onChange={onDurationChange}
																minDate={sMinDateProject}
															/>
														}
													</Grid>
													<Grid item>
														{IsProjectLoading ?
															<></>
															:
															<CheckboxFormItem
																disabled={!IsNewProject}
																name="IsCurrent"
																label={"จนถึงปัจจุบัน"}
																onChange={(e) => {
																	setIsCurrent(e ?? false);
																	onResetCurrent();
																	onDurationChange();
																}}
															/>
														}
													</Grid>
													{/* SDGs */}
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<HeaderInput
																text={"SDGs"}
															/>
														}
													</Grid>
													<Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<SelectFormItem
																disabled={!IsNewProject}
																required
																id="sSDGs"
																name="sSDGs"
																placeholder="SDGs หลัก"
																options={oSDGs}
																label={"SDGs หลัก"}
																onChange={(e) => {
																	onSDGChange(e);
																}}
															/>
														}
													</Grid>
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="rounded" height={200} />
															:
															<TextBoxForm
																disabled={!IsNewProject}
																required={false}
																id="sSDGsDescription"
																name="sSDGsDescription"
																label={"คำอธิบายเพิ่มเติม"}
																placeholder="คำอธิบายเพิ่มเติม"
																maxLength={2000}
																multiline
																rows={10}
															/>
														}
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={12} md={6}>
												{IsProjectLoading ?
													<Skeleton variant="rounded" sx={{ fontSize: '2.5rem' }} width={"100%"} height="100%" style={{ minHeight: "500px" }} />
													:
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
												}
											</Grid>
											<Grid item xs={12}>
												<Grid container spacing={2}>
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"50%"} />
															:
															<HeaderInput
																alignItems="end"
																text={"SDGs รอง"}
																subtext={"(เลือกได้มากกว่า 1 รายการ)"}
																display="flex"
																sxSubText={{
																	marginLeft: "0.5rem",
																}}
															/>
														}
													</Grid>
													<Grid item xs={12} md={6} sx={{ paddingTop: "0 !important" }}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<SelectMultipleFormItem
																disabled={!IsNewProject}
																required={false}
																id="sCoSDGs"
																name="sCoSDGs"
																options={oCoSDGs}
																label={"SDGs รอง"}
																placeholder="SDGs รอง"
															/>
														}
													</Grid>
													<Grid item xs={12} md={2} display={"flex"} sx={{ paddingTop: "0 !important", height: "fit-content" }}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"100%"} />
															:
															<BtnAdd
																id="add-project"
																txt="เพิ่ม"
																onClick={() =>
																	onAddCoSDGs(form.getValues("sCoSDGs"))
																}
																isDisabled={!IsNewProject}
															/>
														}
													</Grid>
													<Grid item xs={12} >
														{IsProjectLoading ?
															<Skeleton variant="rounded" height={200} />
															:
															<DataGrid
																isLoading={IsCoSDGsLoading}
																columns={dataColumnCoSDGs}
																rows={DataRowCoSDGs}
																isShowColomnTool={false}
																isHiddenToolHead={true}
																isShowCheckBox={IsNewProject}
																onDelete={onDeleteCoSDGs}
																onLoadData={(e) =>
																	onSetTableSecondarySDG(arrAllSecondarySDG, e)
																}
															/>
														}
													</Grid>
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="rounded" height={200} />
															:
															<TextBoxForm
																disabled={!IsNewProject}
																required={false}
																id="sCoSDGsDescription"
																name="sCoSDGsDescription"
																label={"คำอธิบายเพิ่มเติม"}
																placeholder="คำอธิบายเพิ่มเติม"
																maxLength={2000}
																multiline
																rows={5}
															/>
														}
													</Grid>
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<RadioForm
																id="radio-project"
																disabled={!IsNewProject}
																name="sCorporateStrategy"
																label="Corporate Strategy"
																required={true}
																options={oCorpStrategy}
																row
															/>
														}
													</Grid>
													<Grid
														item
														xs={12}
														container
														spacing={0}
													>
														<Grid
															item
															xs={12}
															style={{
																zIndex: 1,
															}}
														>
															{IsProjectLoading ?
																<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																:
																<Typography>
																	<HeaderInput
																		text={"ตัวชี้วัดที่สำคัญ"}
																		subtext={"(เลือกได้มากกว่า 1 รายการ)"}
																		display="flex"
																		sxSubText={{
																			margin: "0 0.25rem 0 0.5rem",
																		}}
																		alignItems="end"
																		IsTooltip
																		tooltip={
																			<Tooltip
																				arrow
																				TransitionComponent={Fade}
																				TransitionProps={{
																					timeout: 200,
																				}}
																				title={
																					<Fragment>
																						<Typography fontSize={"10pt"} >
																							หากไม่มีตัวชี้วัดที่ต้องการใช้
																							กรุณาติดต่อแอดมินได้ที่
																							090-0000000
																						</Typography>
																					</Fragment>
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
																</Typography>
															}
														</Grid>
														<Grid
															item
															xs={12}
															container
															spacing={2}
														>
															<Grid
																item
																xs={12}
																md={10}
															>
																{IsProjectLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<SelectMultipleFormItem
																		required={false}
																		id="sIndicator"
																		name="sIndicator"
																		options={oIndicator}
																		placeholder="เลือกตัวชี้วัดที่สำคัญ"
																		nlimitTags={1}
																		disabled={!IsNewProject}
																	/>
																}
															</Grid>
															<Grid
																item
																xs={12}
																md={2}
																display={"flex"}
																sx={{ height: "fit-content" }}
															>
																{IsProjectLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"100%"} />
																	:
																	<BtnAdd
																		id="add-project-indicator"
																		txt="เพิ่ม"
																		onClick={() =>
																			onAddIndicator(form.getValues("sIndicator"))
																		}
																		isDisabled={!IsNewProject}
																	/>
																}
															</Grid>
														</Grid>
													</Grid>
													<Grid item xs={12}>
														{IsProjectLoading ?
															<Skeleton variant="rounded" height={200} />
															:
															<DataGrid
																isLoading={IsIndicatorLoading}
																columns={dataColumnIndicator}
																rows={DataRowIndicator}
																isShowColomnTool={false}
																isHiddenToolHead={true}
																isShowCheckBox={IsNewProject}
																onDelete={onDeleteIndicator}
																onLoadData={(e) =>
																	onSetTableIndicator(arrProjectIndicator, e)
																}
															/>
														}
													</Grid>
													<Grid
														item
														xs={12}
														container
														spacing={2}
														marginTop={1}
													>
														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="rounded" height={200} />
																:
																<TextBoxForm
																	required
																	id="sProjectOrigin"
																	name="sProjectOrigin"
																	label={"ที่มาของโครงการ"}
																	placeholder="ที่มาของโครงการ"
																	maxLength={5000}
																	multiline
																	rows={5}
																	disabled={!IsNewProject}
																/>
															}
														</Grid>
														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="rounded" height={200} />
																:
																<TextBoxForm
																	required
																	id="sObjective"
																	name="sObjective"
																	label={"วัตถุประสงค์"}
																	placeholder="วัตถุประสงค์"
																	maxLength={5000}
																	multiline
																	rows={5}
																	disabled={!IsNewProject}
																/>
															}
														</Grid>
														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="rounded" height={200} />
																:
																<TextBoxForm
																	required
																	id="sTarget"
																	name="sTarget"
																	label={"เป้าหมาย"}
																	placeholder="เป้าหมาย"
																	maxLength={5000}
																	multiline
																	rows={5}
																	disabled={!IsNewProject}
																/>
															}
														</Grid>
														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="rounded" height={200} />
																:
																<TextBoxForm
																	required
																	id="sBusinessConnection"
																	name="sBusinessConnection"
																	label={"ความเชื่อมโยงกับธุรกิจ"}
																	placeholder="ความเชื่อมโยงกับธุรกิจ"
																	maxLength={5000}
																	multiline
																	rows={5}
																	disabled={!IsNewProject}
																/>
															}
														</Grid>
														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="rounded" height={200} />
																:
																<TextBoxForm
																	required={false}
																	id="sRisk"
																	name="sRisk"
																	label={"ความเสี่ยง"}
																	placeholder="ความเสี่ยง"
																	maxLength={5000}
																	multiline
																	rows={5}
																	disabled={!IsNewProject}
																/>
															}
														</Grid>
													</Grid>
													<Grid
														item
														xs={12}
														container
														spacing={0}
													>

														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"20%"} />
																:
																<HeaderInput
																	text={"เอกสารที่เกี่ยวข้อง"}
																/>
															}
														</Grid>
														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="rounded" height={100} />
																:
																<UploadFile
																	disabled={!IsNewProject}
																	IsRequired={false}
																	modeDisplay={"list"}
																	id={"oFileDocument"}
																	name={"oFileDocument"}
																	keyID={1}
																	IsDrag={false}
																	arrFile={arrFileDocumentProject}
																	setarrFile={setFileDocumentProject}
																	Extension={Extension.ImageDocument}
																	IsFolder={false}
																	isFileChange={true}
																	onClearFile={onClearFileProject}
																	IsMultiple={true}
																	sFolderTemp="DocumentProject"
																	nLimitFile={3}
																	sLimitFile="MB"
																	sPositionText="right"
																	IsMultiDelete={false}
																/>
															}
														</Grid>
													</Grid>
													<Grid
														item
														xs={12}
														container
														spacing={2}
														marginTop={1}
													>
														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"100%"} />
																:
																<RadioForm
																	id="radio-project-document"
																	disabled={!IsNewProject}
																	name="sBudgetType"
																	label="รูปแบบการใช้งบประมาณ"
																	required={true}
																	options={oBudgetType}
																	row
																	onChange={(e) => {
																		if (e === "14") {
																			setIsProject(true);
																			onSetYubDurationOnChange(true);
																		} else {
																			setIsProject(false);
																			onSetYubDurationOnChange(false);
																		}

																		(arrDurationYear ?? []).forEach((item) => {
																			form.setValue(`sBudget_${item}`, null);
																		});
																	}}
																/>
															}
														</Grid>
														<Grid item xs={12} container spacing={2} >
															{IsProjectLoading ?
																<Grid item xs={12} sm={6} md={3}>
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"100%"} />
																</Grid>
																:
																<>
																	{(arrDurationYear ?? []).map((m, i) => (
																		<Grid item xs={12} sm={6} md={3} key={`keyDuration_${m}`} >
																			<InputBasicNumberForm
																				id={`sBudget_${m}`}
																				name={`sBudget_${m}`}
																				placeholder="จำนวนงบประมาณ"
																				decimalPoint={2}
																				startAdornment={`ปี ${parseInt(m) + 543}`}
																				endAdornment={"บาท"}
																				disabled={IsNewProject ? !IsProject : true}
																			/>
																		</Grid>
																	))}
																</>
															}
														</Grid>
														<Grid item xs={12}>
															{IsProjectLoading ?
																<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"100%"} />
																:
																<RadioForm
																	id="radio-project-budget"
																	name="sUpdateProgessType"
																	label=" รูปแบบการรายงานผลการดำเนินการ (คะแนน/ ตัวชี้วัด)"
																	required={true}
																	options={oUpdateType}
																	row
																	disabled={!IsNewProject}
																/>
															}
														</Grid>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</AccordionCustom>
							</Grid>
							<Grid item xs={12}>
								<AccordionCustom header="พื้นที่ดำเนินการ">
									<FormProvider {...formArea}>
										<Grid container spacing={2}>
											<Grid
												item
												xs={12}
												md={3}
												container
												spacing={0}
												display={"flex"}
												alignItems={"center"}
											>
												<Grid item xs={11}>
													{IsAreaLoading ?
														<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
														:
														<SelectFormItem
															required
															id="sAreaType"
															name="sAreaType"
															options={oAreaType}
															label={"ลักษณะพื้นที่"}
															placeholder="เลือกประเภทพื้นที่"
														/>
													}
												</Grid>
												<Grid item>
													{IsAreaLoading ?
														<></>
														:
														<Tooltip
															arrow
															TransitionComponent={Fade}
															TransitionProps={{
																timeout: 200,
															}}
															title={
																<Fragment>
																	<Typography fontSize={"10pt"} >
																		<p>
																			<b>
																				Area-based
																			</b>{" "}
																			ชุมชน/พื้นที่ดำเนินการที่อยู่ในพื้นที่ปฏิบัติงานของธุรกิจ
																		</p>
																		<p>
																			<b>
																				Social-based
																			</b>{" "}
																			ชุมชน/พื้นที่ดำเนินการโครงการเพื่อสังคมของ
																			ปตท.
																		</p>
																		<p>
																			<b>
																				Project-based
																			</b>{" "}
																			ชุมชน/พื้นที่ดำเนินการที่อยู่ในพื้นที่โครงการของธุรกิจ
																			หรือ
																			เพื่อสนับสนุนการทำ
																			EIA
																		</p>
																	</Typography>
																</Fragment>
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
												</Grid>
											</Grid>
											<Grid item xs={12} md={3}>
												{IsAreaLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<SelectFormItem
														required
														id="sProvice"
														name="sProvice"
														options={arrProvice}
														label={"จังหวัด"}
														placeholder="เลือกจังหวัด"
														onChange={(e) => {
															onGetDistrict(e?.value);
															setProviceName(e?.label);
															setSearchMap(e?.label);
														}}
													/>
												}
											</Grid>
											<Grid item xs={12} md={3}>
												{IsAreaLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<SelectFormItem
														required={false}
														id="sDistrict"
														name="sDistrict"
														options={arrDistrict}
														label={"อำเภอ"}
														placeholder="เลือกอำเภอ"
														onChange={(e) => {
															onGetSubDistrict(e?.value);
															setSearchMap(sProviceName + " " + e?.label);
														}}
													/>
												}
											</Grid>
											<Grid item xs={12} md={3}>
												{IsAreaLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<SelectFormItem
														required={false}
														id="sSubDistrict"
														name="sSubDistrict"
														options={arrSubDistrict}
														label={"ตำบล"}
														placeholder="เลือกตำบล"
														onChange={(e) =>
															setSearchMap(sProviceName + " " + e?.label)
														}
													/>
												}
											</Grid>
											<Grid item xs={12} md={4}>
												{IsAreaLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<SelectMultipleFormItem
														required
														id="oGeographyType"
														name="oGeographyType"
														options={oGeography}
														label={"ลักษณะทางภูมิศาสตร์"}
														placeholder="เลือกลักษณะทางภูมิศาสตร์"
													/>
												}
											</Grid>
											<Grid item xs={12} md={4}>
												{IsAreaLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<TextBoxForm
														required={false}
														id="sAreaName"
														name="sAreaName"
														maxLength={0}
														label="ชื่อสถานที่"
														placeholder="ชื่อสถานที่"
														fullWidth
													/>
												}
											</Grid>
											<Grid item xs={12} md={2}>
												{IsAreaLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<TextBoxForm
														required={false}
														id="sLatitude"
														name="sLatitude"
														maxLength={0}
														label="ละติจูด"
														placeholder="ละติจูด"
														fullWidth
													/>
												}
											</Grid>
											<Grid item xs={12} md={2}>
												{IsAreaLoading ?
													<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
													:
													<TextBoxForm
														required={false}
														id="sLongitude"
														name="sLongitude"
														maxLength={0}
														label="ลองจิจูด"
														placeholder="ลองจิจูด"
														fullWidth
													/>
												}
											</Grid>
											<Grid item xs={12} display={"none"}>
												<TextBoxForm
													required={false}
													id="sPathMap"
													name="sPathMap"
													maxLength={0}
													label="Path Map"
													placeholder="Path Map"
													fullWidth
												/>
											</Grid>
											<Grid item xs={12}>
												{IsAreaLoading ?
													<Skeleton variant="rounded" height={400} />
													:
													<MapCompoents
														id={"div-area"}
														mapRef={mapRefArea}
														IsMultiMarker={false}
														Isdisable={false}
														IsMarker={true}
														IsPopUp={true}
														IsSearch={true}
														formArea={formArea}
														arrMarker={arrMarkerView}
														setarrMarker={setarrMarkerView}
														markerSearch={oMarkerArea}
														setmarkerSearch={setoMarkerArea}
														sSearch={sSearchMap}
													/>
												}
											</Grid>
											<Grid
												item
												xs={12}
												container
												spacing={2}
											>
												<Grid
													item
													xs={12}
													className="topic-divider"
												>
													<Divider>
														<Chip
															label="ผู้มีส่วนได้ส่วนเสียที่สำคัญ / แกนนำชุมชน"
															className="divider-chip"
														/>
													</Divider>
												</Grid>
												<Grid
													item
													xs={12}
													container
													spacing={2}
												>
													<FormProvider
														{...formStakeholder}
													>
														<Grid
															item
															xs={12}
															container
															spacing={2}
														>
															<Grid
																item
																xs={12}
																md={3}
															>
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<CheckboxFormItem
																		name="IsNewStakeholder"
																		label={"รายชื่อผู้มีส่วนได้ส่วนเสียใหม่"}
																		onChange={(e) => {
																			setIsNewStakeholder(e);
																			onResetStakeholder();
																		}}
																	/>
																}
															</Grid>
															<Grid
																item
																xs={12}
																md={4}
															>
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<>
																		{IsNewStakeholder ? (
																			<TextBoxForm
																				required
																				id="sStakeholderName"
																				name="sStakeholderName"
																				maxLength={0}
																				label="ชื่อผู้มีส่วนได้ส่วนเสีย"
																				placeholder="ชื่อผู้มีส่วนได้ส่วนเสีย"
																				fullWidth
																			/>
																		) : (
																			<AutocompleteForm
																				label="ชื่อผู้มีส่วนได้ส่วนเสีย"
																				placeholder="ชื่อผู้มีส่วนได้ส่วนเสีย"
																				id="oStakeholderName"
																				name="oStakeholderName"
																				required={true}
																				disabled={false}
																				TextFilterCount={1}
																				onSelect={(e, value) =>
																					onSelectStakeholder(value)
																				}
																				fnLoadData={(sSearch, setloaded) => {
																					let lstDataAuto = oStakeholder;
																					sSearch = sSearch.trim().toLowerCase();
																					setloaded(sSearch ? lstDataAuto.filter((f) => f.label.toLowerCase().includes(sSearch)) : lstDataAuto);
																				}}
																			/>
																		)}
																	</>
																}
															</Grid>
															<Grid item xs={12} md={5} >
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<SelectMultipleFormItem
																		required
																		id="sStakeholderType"
																		name="sStakeholderType"
																		options={oStakeholderType}
																		label={"ประเภท"}
																		placeholder="ประเภท"
																	/>
																}
															</Grid>
															<Grid item xs={12} md={4} >
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<TextBoxForm
																		required={false}
																		id="sStakeholderPosition"
																		name="sStakeholderPosition"
																		maxLength={0}
																		label="ตำแหน่ง"
																		placeholder="ตำแหน่ง"
																		fullWidth
																	/>
																}
															</Grid>
															<Grid item xs={12} md={4} >
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<TextBoxForm
																		required={false}
																		id="sStakeholderAgency"
																		name="sStakeholderAgency"
																		maxLength={0}
																		label="สังกัด"
																		placeholder="สังกัด"
																		fullWidth
																	/>
																}
															</Grid>
															<Grid item xs={12} md={4} >
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<TextBoxForm
																		required={false}
																		id="sStakeholderTel"
																		name="sStakeholderTel"
																		maxLength={0}
																		label="เบอร์โทรศัพท์"
																		placeholder="เบอร์โทรศัพท์"
																		fullWidth
																	/>
																}
															</Grid>
															<Grid item xs={12}>
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<TextBoxForm
																		required={false}
																		id="sStakeholderAddr"
																		name="sStakeholderAddr"
																		maxLength={500}
																		label="ที่อยู่"
																		placeholder="ที่อยู่"
																		multiline
																		rows={4}
																		fullWidth
																	/>
																}
															</Grid>
															<Grid item xs={12}>
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																	:
																	<TextBoxForm
																		required={false}
																		id="sStakeholderDetail"
																		name="sStakeholderDetail"
																		maxLength={500}
																		label="รายละเอียดเพิ่มเติม"
																		placeholder="รายละเอียดเพิ่มเติม"
																		multiline
																		rows={4}
																		fullWidth
																	/>
																}
															</Grid>
															<Grid
																item
																xs={12}
																display={"flex"}
																justifyContent={"flex-end"}
															>
																{IsAreaLoading ?
																	<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"30%"} />
																	:
																	<>
																		{sStakeholderEdit ? (
																			<BtnEdit
																				id="edit-project-update"
																				txt="อัปเดตข้อมูลผู้มีส่วนได้ส่วนเสียที่สำคัญ"
																				onClick={formStakeholder.handleSubmit(() => { onAddStakeholder(); })}
																			/>
																		) : (
																			<BtnAdd
																				id="add-project-update"
																				txt="เพิ่มข้อมูลผู้มีส่วนได้ส่วนเสียที่สำคัญ"
																				onClick={formStakeholder.handleSubmit(() => { onAddStakeholder(); })}
																			/>
																		)}
																	</>
																}
															</Grid>
														</Grid>
													</FormProvider>
													<Grid item xs={12} >
														{IsAreaLoading ?
															<Skeleton variant="rounded" height={200} />
															:
															<DataGrid
																isLoading={IsStakeholderLoading}
																columns={dataColumnStakeholder}
																rows={DataRowStakeholder}
																isShowColomnTool={false}
																isHiddenToolHead={true}
																isShowCheckBox={true}
																onDelete={onDeleteStakeholder}
																onLoadData={(e) =>
																	onSetTableStakeholder(arrStakeholder, e)
																}
																onRowSelectable={(params) => params.row.nID !== sStakeholderEdit}
															/>
														}
													</Grid>
													<Grid item xs={12}>
														{IsAreaLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"30%"} />
															:
															<HeaderInput
																text={
																	"โครงการพัฒนาชุมชนในพื้นที่"
																}
															/>
														}
													</Grid>
													<Grid item xs={12} md={6} sx={{
														paddingTop: "0 !important",
													}}>
														{IsAreaLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<SelectMultipleFormItem
																required={false}
																id="sProjectPTT"
																name="sProjectPTT"
																options={arrProjectPTT}
																label={"โครงการพัฒนาของ ปตท. และกลุ่ม ปตท. ในอดีต"}
																placeholder="โครงการพัฒนาของ ปตท. และกลุ่ม ปตท. ในอดีต"
																nlimitTags={1}
															/>
														}
													</Grid>
													<Grid item xs={12} md={6} sx={{
														paddingTop: "0 !important",
													}}>
														{IsAreaLoading ?
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
															:
															<SelectMultipleFormItem
																required={false}
																id="sProjectPartner"
																name="sProjectPartner"
																options={arrProjectPartner}
																label={"ความร่วมมือกับ หน่วยงาน / องค์กรอื่นๆ"}
																placeholder="ความร่วมมือกับ หน่วยงาน / องค์กรอื่นๆ"
															/>
														}
													</Grid>
												</Grid>
											</Grid>
											<Grid
												item
												xs={12}
												container
												spacing={2}
											>
												<Grid
													item
													xs={12}
													className="topic-divider"
												>
													<Divider>
														<Chip
															label="บริบทชุมชน"
															className="divider-chip"
														/>
													</Divider>
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"30%"} />
														:
														<HeaderInput
															text={
																"ผลการประเมินศักยภาพชุมชน"
															}
														/>
													}
												</Grid>
												<Grid item xs={12}
													sx={{
														paddingTop: "0 !important",
													}}
												>
													{IsAreaLoading ?
														<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"20%"} />
														:
														<HeaderInput
															text={"ก่อนดำเนินการ"}
															required
														/>
													}
													<Grid container spacing={2}>
														<Grid
															item
															xs={12}
															md={8}
														>
															{IsAreaLoading ?
																<>
																	{(Array.from(Array(7), (e, i) => {
																		return (
																			<Grid container spacing={2} key={"skeleton_" + e}>
																				<Grid item xs={12} md={6} >
																					<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																				</Grid>
																				<Grid item xs={12} md={6} >
																					<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																				</Grid>
																			</Grid>
																		)
																	}))}
																</>
																:
																<Grid container spacing={2} >
																	{oScoreType.map((row, i) => (
																		<>
																			<Grid item xs={12} md={6} >
																				{row.label}
																			</Grid>
																			<Grid item xs={12} md={4} >
																				<InputBasicNumberForm
																					id={`sScorebefore_${row.value}`}
																					name={`sScorebefore_${row.value}`}
																					placeholder="โปรดระบุคะแนน"
																					endAdornment={"คะแนน"}
																					decimalPoint={2}
																				/>
																			</Grid>
																		</>
																	))}
																</Grid>
															}
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={200} />
														:
														<TextBoxForm
															id="sConnection"
															name="sConnection"
															maxLength={5000}
															required={false}
															multiline
															rows={5}
															label="ความเชื่อมโยง ปตท."
															placeholder="ความเชื่อมโยง ปตท."
														/>
													}
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<>
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"20%"} />
															{(Array.from(Array(4), (e, i) => {
																return (
																	<Grid container spacing={2} key={"skeletonIndicator_" + e}>
																		<Grid item xs={12} md={6} >
																			<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																		</Grid>
																	</Grid>
																)
															}))}
														</>
														:
														<>
															<HeaderInput
																text={"ตัวชี้วัดที่สำคัญ"}
																subtext={"(เลือกได้มากกว่า 1 รายการ)"}
																sxSubText={{
																	margin: "0 0.25rem 0 0.5rem",
																}}
																display="flex"
																alignItems="end"
															/>
															{arrAreaIndicator &&
																<Grid container>
																	<Grid
																		item
																		xs={12}
																	>
																		<CheckboxGroupFormItem
																			id="oAreaIndicator"
																			AllowCheckAll={arrAreaIndicator.length > 0}
																			name="oAreaIndicator"
																			row={false}
																			required={false}
																			options={arrAreaIndicator}
																			isTooltip={false}
																		/>
																	</Grid>
																</Grid>
															}
														</>
													}
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<>
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"30%"} />
															<Skeleton variant="rounded" height={100} />
														</>
														:
														<>
															<HeaderInput
																text={
																	"แผนการดำเนินงานตามตัวชี้วัด"
																}
															/>
															<UploadFile
																IsRequired={false}
																modeDisplay={"list"}
																id={"oFilePlan"}
																name={"oFilePlan"}
																keyID={2}
																arrFile={arrFileDocumentIndicator}
																setarrFile={setFileDocumentIndicator}
																Extension={Extension.ImageDocument}
																IsFolder={false}
																onClearFile={onClearFile}
																sFolderTemp="DocumentIndicator"
																IsMultiple={true}
																nLimitFile={3}
																sLimitFile="MB"
																sPositionText="right"
																IsCrop={true}
																cropShape={"retangle"}
																cropRatio={16 / 9}
																cropResize={true}
																cropMovable={true}
															/>
														</>
													}
												</Grid>
												<Grid item xs={12} sx={{ mt: 0.5 }}>
													{IsAreaLoading ?
														<>
															<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"20%"} />
															<Skeleton variant="rounded" sx={{ fontSize: '2rem' }} width={"30%"} />
														</>
														:
														<>
															<HeaderInput
																text={"งบประมาณตามแผน"}
																required={!IsProject}
															/>
															<Grid item xs={12} container spacing={2} >
																{(arrDurationYear ?? []).map((m, i) => (
																	<Grid item xs={12} sm={6} md={3} key={`keyBudgetDuration_${m}`} >
																		<InputBasicNumberForm
																			id={`sBudgetArea_${m}`}
																			name={`sBudgetArea_${m}`}
																			placeholder="จำนวนงบประมาณ"
																			decimalPoint={2}
																			startAdornment={`ปี ${parseInt(m) + 543}`}
																			endAdornment={"บาท"}
																		/>
																	</Grid>
																))}
															</Grid>
														</>
													}
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
														:
														<SelectMultipleFormItem
															required
															id="sCommunityType"
															name="sCommunityType"
															options={oCommunityType}
															label={"ประเภทชุมชน"}
															placeholder="เลือกประเภทชุมชน"
														/>
													}
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={200} />
														:
														<TextBoxForm
															id="sExplainMore"
															name="sExplainMore"
															maxLength={5000}
															required={false}
															multiline
															rows={5}
															label="คำอธิบายเพิ่มเติม"
															placeholder="คำอธิบายเพิ่มเติม"
														/>
													}
												</Grid>
												<Grid
													item
													xs={12}
													md={3}
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
														<Grid item xs={12}>
															{IsAreaLoading ?
																<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																:
																<InputBasicNumberForm
																	id="nPopulation"
																	name="nPopulation"
																	label="จำนวนประชากร"
																	placeholder="จำนวนประชากร"
																	endAdornment={"คน"}
																/>
															}
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={12} md={3}>
													<Grid
														container
														sx={{
															alignItems: "center",
														}}
													>
														<Grid item xs={12}>
															{IsAreaLoading ?
																<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																:
																<InputBasicNumberForm
																	id="nHousehold"
																	name="nHousehold"
																	label="จำนวนครัวเรือน"
																	placeholder="จำนวนครัวเรือน"
																	endAdornment={"ครัวเรือน"}
																/>
															}
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={12} md={4}>
													<Grid
														container
														sx={{
															alignItems: "center",
														}}
													>
														<Grid item xs={12}>
															{IsAreaLoading ?
																<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
																:
																<InputBasicNumberForm
																	id="nAverageIncome"
																	name="nAverageIncome"
																	label="จำนวนรายได้เฉลี่ย"
																	placeholder="จำนวนรายได้เฉลี่ย"
																	endAdornment={"บาท / เดือน / ครัวเรือน"}
																/>
															}
														</Grid>
													</Grid>
												</Grid>
												<Grid item xs={10} md={5}>
													{IsAreaLoading ?
														<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
														:
														<SelectFormItem
															required
															id="sGroupMainJob"
															name="sGroupMainJob"
															options={oOccupationGrp.filter((f) => !(arrOcupation ?? []).filter((f) => f.sID !== "sGroupMainJob").map((m) => m.value).includes(f.value))}
															label={"กลุ่มอาชีพหลัก"}
															placeholder="เลือกกลุ่มอาชีพหลัก"
															onChange={(e) => {
																onMainGroupJob(e);
															}}
														/>
													}
												</Grid>
												<Grid item xs={10} md={5}>
													{IsAreaLoading ?
														<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} />
														:
														<SelectMultipleFormItem
															required={false}
															id="sMainJob"
															name="sMainJob"
															options={oOccupation.filter((f) => f.parent === formArea.getValues("sGroupMainJob"))}
															label={"อาชีพหลัก"}
															placeholder="เลือกอาชีพหลัก"
														/>
													}
												</Grid>

												{/* multi group Occupation second */}
												{!IsAreaLoading &&
													<>
														{(arrGroupSubJob ?? []).map((m, i) => (
															<Grid item xs={12} key={`KeyGroupSubJob_${i + 1}`} >
																<Grid container spacing={2} >
																	<Grid item xs={10} md={5} >
																		<SelectFormItem
																			required={false}
																			id={`${m.sGroupSubJobID}`}
																			name={`${m.sGroupSubJobID}`}
																			options={oOccupationGrp.filter((f) => !(arrOcupation ?? []).filter((f) => f.sID !== m.sGroupSubJobID).map((m) => m.value).includes(f.value))}
																			label={"กลุ่มอาชีพเสริม"}
																			placeholder="เลือกกลุ่มอาชีพเสริม"
																			onChange={(e) => {
																				formArea.setValue(m.sSubJobID, null);
																				setObjOccupationGrp([...oOccupationGrp,]);
																				setObjOccupation([...oOccupation,]);
																				let arr = arrOcupation;
																				let old = arr.filter((f) => f.sID === m.sGroupSubJobID);

																				if ((old ?? []).length > 0) {
																					old[0].value = e?.value;
																				} else {
																					if (e != null) {
																						let data =
																						{
																							sID: m.sGroupSubJobID,
																							value: e?.value,
																						};
																						old = [data];
																					}
																				}

																				arr = arr.filter((f) => f.sID !== m.sGroupSubJobID);
																				setArrOcupation([...arr, ...old,]);
																			}}
																		/>
																	</Grid>
																	<Grid item xs={10} md={5} >
																		<SelectMultipleFormItem
																			required={false}
																			id={`${m.sSubJobID}`}
																			name={`${m.sSubJobID}`}
																			options={oOccupation.filter((f) => f.parent === formArea.getValues(m.sGroupSubJobID))}
																			label={"อาชีพเสริม"}
																			placeholder="เลือกอาชีพเสริม"
																		/>
																	</Grid>
																	{IsMoreSubjob && (
																		<Grid item display={"flex"} alignItems={"center"}
																		>
																			<BtnDeleteOnTable
																				id={"delete-project-occupation"}
																				txt="ลบ"
																				onClick={() => onDeleteGroupSubJob(m.sID)
																				}
																			/>
																		</Grid>
																	)}
																	{(arrGroupSubJob ?? []).length === i + 1 && (
																		<Grid item display={"flex"} alignItems={"center"} >
																			<BtnAddOnTable
																				id={"add-project-GroupSubJob"}
																				txt="เพิ่ม"
																				onClick={onAddGroupSubJob}
																			/>
																		</Grid>
																	)}
																</Grid>
															</Grid>
														)
														)}
													</>
												}

												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="text" sx={{ fontSize: '2.5rem' }} width={"20%"} />
														:
														<HeaderInput
															text={"ทรัพยากรชุมชน"}
														/>
													}
												</Grid>
												<Grid item xs={12} md={6}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={100} />
														:
														<>
															<HeaderInput
																text={"การท่องเที่ยว"}
															/>
															<TextBoxForm
																id="sTravel"
																name="sTravel"
																maxLength={5000}
																required={false}
																multiline
																rows={5}
																placeholder="การท่องเที่ยว"
															/>
														</>
													}
												</Grid>
												<Grid item xs={12} md={6}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={100} />
														:
														<>
															<HeaderInput
																text={"วัฒนธรรม"}
															/>
															<TextBoxForm
																id="sCulture"
																name="sCulture"
																maxLength={5000}
																required={false}
																multiline
																rows={5}
																placeholder="วัฒนธรรม"
															/>
														</>
													}
												</Grid>
												<Grid item xs={12} md={6}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={100} />
														:
														<>
															<HeaderInput
																text={"การเกษตร"}
															/>
															<SelectMultipleFormItem
																required
																id="sAgriculture"
																name="sAgriculture"
																options={oAgriculture}
																placeholder="ระบุการเกษตร"
															/>
														</>
													}
												</Grid>
												<Grid item xs={12} md={6}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={100} />
														:
														<>
															<HeaderInput
																text={"ผลิตภัณฑ์"}
															/>
															<SelectMultipleFormItem
																required
																id="sProduct"
																name="sProduct"
																options={oProduct}
																placeholder="ระบุผลิตภัณฑ์"
															/>
														</>
													}
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={200} />
														:
														<TextBoxForm
															id="sComment"
															name="sComment"
															maxLength={5000}
															required={false}
															multiline
															rows={5}
															placeholder="ความคิดเห็น ความคาดหวัง ข้อกังวัล ของชุมชน"
															label="ความคิดเห็น ความคาดหวัง ข้อกังวัล ของชุมชน"
														/>
													}
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={200} />
														:
														<TextBoxForm
															id="sRisk"
															name="sRisk"
															maxLength={5000}
															required={false}
															multiline
															rows={5}
															label="ความเสี่ยง"
															placeholder="ความเสี่ยง"
														/>
													}
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={200} />
														:
														<TextBoxForm
															id="sAnotherAgency"
															name="sAnotherAgency"
															maxLength={5000}
															required={false}
															multiline
															rows={5}
															label="หน่วยงานอื่นๆ ที่ทำงานทับซ้อนในพื้นที่"
															placeholder="หน่วยงานอื่นๆ ที่ทำงานทับซ้อนในพื้นที่"
														/>
													}
												</Grid>
												<Grid item xs={12}>
													{IsAreaLoading ?
														<Skeleton variant="rounded" height={300} />
														:
														<>
															<Grid item xs={12}>
																<HeaderInput
																	text={
																		"ลักษณะการรวมกลุ่ม"
																	}
																/>
															</Grid>
															<Grid container spacing={2}>
																{(oNatureGroupingType ?? []).map((m, i) => (
																	<Grid item key={`KeyNatureGroupingType${i + 1}`} xs={12} md={6} container spacing={2} >
																		<Grid item xs={12} >
																			<CheckboxFormItem
																				name={`NatureGroupingType_${m.value}`}
																				label={m.label}
																				onChange={(e) => {
																					if (!e) {
																						formArea.setValue(`BundleType_${m.value}`, null);
																						formArea.setValue(`sDescriptionFormal_${m.value}`, null);
																					}
																				}}
																			/>
																		</Grid>
																		<Grid item xs={12} >
																			<HeaderInput
																				text={"ประเภทการรวมกลุ่ม"}
																			/>
																			<SelectMultipleFormItem
																				required
																				id={`BundleType_${m.value}`}
																				name={`BundleType_${m.value}`}
																				options={m.value === "21" ? oBundleTypeFormal : oBundleTypeInFormal}
																				placeholder="ระบุประเภทการรวมกลุ่ม"
																				disabled={!formArea.getValues(`NatureGroupingType_${m.value}`)}
																			/>
																		</Grid>
																		<Grid item xs={12}>
																			<TextBoxForm
																				id={`sDescriptionFormal_${m.value}`}
																				name={`sDescriptionFormal_${m.value}`}
																				maxLength={500}
																				required={false}
																				multiline
																				rows={5}
																				placeholder="โปรดระบุ"
																				disabled={!formArea.getValues(`NatureGroupingType_${m.value}`)}
																			/>
																		</Grid>
																	</Grid>
																))}
															</Grid>
														</>
													}
												</Grid>
												{!(IsReject || IsEditProject) &&
													<>

														<Grid
															item
															xs={12}
															display={"flex"}
															justifyContent={"center"}
														>
															{sAreaEdit ? (
																<BtnEdit
																	id="edit-project-area"
																	txt="อัปเดตข้อมูลพื้นที่"
																	onClick={formArea.handleSubmit(onAddArea, (err) => {
																		document.getElementById(Object.keys(err)[0]).focus();
																	})}
																/>
															) : (
																<BtnAdd
																	id="add-project-area"
																	txt="เพิ่มพื้นที่"
																	onClick={formArea.handleSubmit(onAddArea, (err) => {
																		document.getElementById(Object.keys(err)[0])?.focus();
																	})}
																/>
															)}
														</Grid>
														<Grid item xs={12}
														>
															<DataGrid
																columns={dataColumnArea}
																rows={DataRowArea}
																isShowColomnTool={false}
																isHiddenToolHead={true}
																isShowCheckBox={true}
																onDelete={onDeleteArea}
																onRowSelectable={(params) => params.row.nID !== sAreaEdit}
															/>
														</Grid>
													</>
												}
											</Grid>
										</Grid>
									</FormProvider>
								</AccordionCustom>
							</Grid>
							<Grid item xs={12}>
								<Grid container display={"none"}>
									<BtnSave
										id={"submit"}
										// isDisabled={(arrProjectArea.length > 0) ? false : true}
										txt="บันทึก"
										// onClick={onSubmit}
										onClick={form.handleSubmit(onSubmit, (err) => {
											document.getElementById(Object.keys(err)[0])?.focus();
											console.log("err", err);
											onSave(null);
										})}
									/>
									<BtnSave
										id="edit-project-area-reject"
										txt="บันทึกข้อมูล"
										onClick={formArea.handleSubmit(onClickEdit, (err) => {
											document.getElementById(Object.keys(err)[0]).focus();
											console.log("err", err);
											onSave(null);
										})}
									/>
								</Grid>
							</Grid>
							{IsReject &&
								<Grid item xs={12}>
									{IsAreaLoading ?
										<Skeleton variant="rounded" height={200} />
										:
										<HistoryLog nAreaID={nAreaID} />
									}
								</Grid>
							}
						</Grid>
					</FormProvider>
				</Grid>
			</Grid >
		</Fragment >
	);
};

export default RequestProject;
