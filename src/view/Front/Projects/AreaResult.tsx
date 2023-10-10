import { Grid } from "@mui/material";
import AccordionCustom from "components/Accordion/AccordionCustom";
import {
	InputBasicNumberForm,
	InputNumberForm,
	SelectFormItem,
	TextBoxForm,
} from "components/Input";
import HeaderInput from "components/Input/HeaderInput";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider } from "react-hook-form";
import UploadFile from "components/Input/UploadFile/UploadFile";
import {
	Extension,
} from "utilities/ST_Function";

import RenderText from "./RenderText";
import { GridColumns } from "@mui/x-data-grid-pro";
import DataGrid, { PaginationInterface, initRows } from "components/DataGrid";

const AreaResult = (props) => {

	const {
		form,
		oIndicator,
		oUpdateData,
		oScoreType,
		nYear,
		arrFile,
		setArrFile,
		IsApprove,
		oBudget,
		arrYearUpdate,
		arrRoundUpdate,
		IsEdit,
		setRoundEdit,
		setYearEdit,
		IsEditApprove
	} = props;
	const onClearFile = useRef(null);
	const [DataRowIndicator, setDataRowIndicator] =
		useState<PaginationInterface>({
			...initRows,
			sSortExpression: "dUpdate",
			sSortDirection: "desc",
		});

	const [DataRowBudget, setDataRowBudget] =
		useState<PaginationInterface>({
			...initRows,
			sSortExpression: "dUpdate",
			sSortDirection: "desc",
		});

	useEffect(() => {
		console.log("oIndicator", oIndicator)
		if (IsApprove) {
			setDataRowIndicator({
				...DataRowIndicator,
				arrRows: oIndicator ?? [],
			});
		}
	}, [oIndicator])

	useEffect(() => {
		console.log("oBudget", oBudget)
		if (IsApprove) {
			setDataRowBudget({
				...DataRowBudget,
				arrRows: oBudget ?? [],
			});
		}
	}, [oBudget])

	useEffect(() => {
		if (IsEdit) {
			if (arrRoundUpdate) {
				form.setValue("sRound", arrRoundUpdate[0].value);
				form.setValue("sYear", arrRoundUpdate[0].nYear + "");
				setRoundEdit(arrRoundUpdate[0].nRound);
				setYearEdit(arrRoundUpdate[0].nYear);
			}
		}
	}, [IsEdit])

	useEffect(() => {
		if (IsEditApprove) {
			console.log("arrRoundUpdate", arrRoundUpdate)
			if (arrRoundUpdate) {
				form.setValue("sRound", arrRoundUpdate[0]?.value);
				form.setValue("sYear", arrRoundUpdate[0]?.nYear + "");
				setRoundEdit(arrRoundUpdate[0]?.nRound);
				setYearEdit(arrRoundUpdate[0]?.nYear);
			}
		}
	}, [arrRoundUpdate])

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
			headerName: "งบประมาณใช้จริง (บาท)",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			flex: 1,
		},
		{
			field: "nResult",
			headerName: "รวม (บาท)",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			flex: 1,
		},
	];

	const dataColumnBudget: GridColumns = [
		{
			field: "sRound",
			headerName: "ปี (พ.ศ.)",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			width: 100,
		},
		{
			field: "nResultBudget",
			headerName: "ข้อมูลการใช้งบประมาณจริง (บาท)",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			flex: 3,
		}
	];

	const onYearChange = (sYear) => {
		if (sYear) {
			let arrRoundOfYear = arrRoundUpdate.filter(f => f.nYear === parseInt(sYear));
			if (arrRoundOfYear) {
				form.setValue("sRound", arrRoundOfYear[0].value);
				setRoundEdit(arrRoundOfYear[0].nRound);
				setYearEdit(arrRoundOfYear[0].nYear);
			} else {
				form.setValue("sRound", null);
			}
		} else {
			form.setValue("sRound", null);
		}

	}

	return (
		<React.Fragment>
			<FormProvider {...form}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<AccordionCustom header="ผลการดำเนินการ" color="#7239ea" bgColor="#f8f5ff" borderColor="1px solid #7239ea">
							<Grid container spacing={2}>
								{IsEdit || IsEditApprove ?
									<>
										<Grid item xs={12} md={6} display={"flex"} alignItems={"center"}>
											<Grid item sx={{ fontWeight: "700", mr: "0.5rem" }}>
												ผลการดำเนินงานประจำปี
											</Grid>
											<Grid item xs={3}>
												<SelectFormItem
													id={"sYear"}
													name={"sYear"}
													placeholder="ปี"
													required={false}
													options={arrYearUpdate}
													onChange={(e) => onYearChange(e?.value)}
												/>

											</Grid>
										</Grid>
										<Grid item xs={12} md={6} display={"flex"} alignItems={"center"}>
											<Grid item sx={{ fontWeight: "700", mr: "0.5rem" }}>
												รอบที่
											</Grid>
											<Grid item xs={3}>
												<SelectFormItem
													id={"sRound"}
													name={"sRound"}
													placeholder="รอบที่"
													required={false}
													options={arrRoundUpdate}
												/>

											</Grid>
										</Grid>
									</>
									:
									<>
										<Grid item xs={6}>
											<RenderText
												header={
													"ผลการดำเนินงานประจำปี"
												}
												text={(oUpdateData?.nYear + 543)}
												IsFlex
												IsChip={true}
											/>

										</Grid>
										<Grid item xs={6}>
											<RenderText
												header={
													"รอบที่"
												}
												text={oUpdateData?.sRound}
												IsFlex
												IsChip={true}
											/>
										</Grid>
									</>
								}

								<Grid item xs={12}>
									<HeaderInput text="ผลการประเมินศักยภาพชุมชน" />
								</Grid>
								<Grid
									item
									xs={12}
									sx={{ paddingTop: "0 !important" }}
								>
									{IsApprove ?
										<RenderText
											header={"หลังดำเนินการ"}
											lstText={oScoreType != null ? oScoreType.map((m) => m.sScoreTypeName) : []}
											lstSubtext={oScoreType != null ? oScoreType.map((m) => m.sScore) : []}
											IsList={true}
											IsFlexList={true}
											IsFlex={false}
											IsFormat
											endAdornment={"คะแนน"}
										/>
										: <>
											<HeaderInput
												text={"หลังดำเนินการ"}
											/>
											<Grid container spacing={2}>
												<Grid item xs={12} md={8}>
													<Grid container spacing={2}>
														{oScoreType.map((row, i) => (
															<>
																<Grid
																	item
																	xs={12}
																	md={6}
																>
																	{row.label}
																</Grid>
																<Grid
																	item
																	xs={12}
																	md={4}
																>
																	<InputNumberForm
																		id={`sScoreAfter_${row.value}`}
																		name={`sScoreAfter_${row.value}`}
																		placeholder="โปรดระบุคะแนน"
																		maxDigits={2}
																		endAdornment={"คะแนน"}
																		ShowDigits={2}
																	/>
																</Grid>
															</>
														))}
													</Grid>
												</Grid>
											</Grid>
										</>}

								</Grid>
								<Grid item xs={12}>
									<HeaderInput
										text="ผลการดำเนินงานตามตัวชี้วัด"
									/>
								</Grid>

								{IsApprove ?
									<>
										<Grid item xs={12} sx={{ paddingTop: 0 }}>
											<DataGrid
												isLoading={false}
												columns={dataColumnIndicator}
												rows={DataRowIndicator}
												isHiddenToolHead
												onLoadData={(e) => { }}
												isNotShowPagination
												isNotShowTotal
												isHideFooter
											/>
										</Grid>
									</>
									:
									<>
										{oIndicator.map((row, i) => (
											<>
												<Grid item xs={12}>
													{(i + 1) + ". "}{row.label}
												</Grid>
												<Grid item xs={12} container spacing={2}>
													<Grid item xs={6} sm={6} md={3} key={`keyDuration_${nYear}`} >
														<InputBasicNumberForm
															id={`sAreaIndicator_${row.value}`}
															name={`sAreaIndicator_${row.value}`}
															placeholder="ระบุจำนวนเงิน"
															decimalPoint={2}
															startAdornment={`ปี ${nYear + 543}`}
															endAdornment={"บาท/ราย/ปี"}
														/>
													</Grid>
													<Grid item xs={6} sm={6} md={3}>
														<InputBasicNumberForm
															disabled
															id={`sResultIndicator_${row.value}`}
															name={`sResultIndicator_${row.value}`}
															placeholder="จำนวนเงินทั้งหมด"
															decimalPoint={2}
															startAdornment={`รวม`}
															endAdornment={"บาท"}
														/>
													</Grid>
												</Grid></>
										))}
									</>
								}
								{IsApprove ?
									<>
										<Grid item xs={12}>
											<HeaderInput text="ข้อมูลการใช้งบประมาณจริง" />
										</Grid>
										<Grid item xs={12} sx={{ paddingTop: 0 }}>
											<DataGrid
												isLoading={false}
												columns={dataColumnBudget}
												rows={DataRowBudget}
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
												text={(oBudget ?? []).length > 0 ? oBudget[0].sDescription : null}
												IsFlex={false}
											/>
										</Grid>
									</> :
									<Grid item container spacing={2} display={"flex"} alignItems={"center"}>
										<Grid item xs={12} md={2}>
											<HeaderInput text="ข้อมูลการใช้งบประมาณจริง:" />
										</Grid>
										{nYear &&
											<Grid item xs={12} md={3}>
												<InputBasicNumberForm
													id={`sAreaBudget_${nYear}`}
													name={`sAreaBudget_${nYear}`}
													placeholder="จำนวนเงินงบประมาณ"
													decimalPoint={2}
													startAdornment={`ปี ${nYear + 543}`}
													endAdornment={"บาท"}
												/>
											</Grid>
										}
										<Grid item xs={12}>
											<TextBoxForm
												id="sDescription"
												name="sDescription"
												maxLength={5000}
												required={false}
												multiline
												rows={5}
												label="คำอธิบายเพิ่มเติม"
												placeholder="คำอธิบายเพิ่มเติม"
											/>
										</Grid>
									</Grid>
								}

								<Grid item container spacing={2} display={"flex"} alignItems={"center"}>

									<Grid item xs={12} md={2}>
										<HeaderInput text="ภาพประกอบ" />
									</Grid>
									<Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
										<UploadFile
											IsRequired={false}
											modeDisplay={"gallery"}
											id={"oFileResult"}
											name={"oFileResult"}
											keyID={5}
											arrFile={arrFile}
											setarrFile={setArrFile}
											Extension={Extension.ImageExport}
											IsFolder={true}
											onClearFile={onClearFile}
											sFolderTemp="AreaImage"
											IsMultiple={true}
											nLimitFile={15}
											sLimitFile="MB"
											sPositionText="right"
											IsCrop={true}
											cropShape={"retangle"}
											cropRatio={16 / 9}
											cropResize={true}
											cropMovable={true}
											IsHide={IsApprove}
											nCountLimitFile={5}
											IsAddDescription
											disabled={IsApprove}
											IsSumSizeAll={true}
											sRemark="อัปโหลดไฟล์ได้ไม่เกิน 5 ไฟล์เท่านั้น"
										/>
									</Grid>
								</Grid>
							</Grid>
						</AccordionCustom>
					</Grid>
				</Grid>
			</FormProvider >
		</React.Fragment >
	);
};

export default AreaResult;
