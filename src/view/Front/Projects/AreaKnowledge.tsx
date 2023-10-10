import { Grid } from "@mui/material";
import React, {  useRef, useState } from "react";
import { FormProvider } from "react-hook-form";
import AccordionCustom from "components/Accordion/AccordionCustom";
import HeaderInput from "components/Input/HeaderInput";
import { GridColumns } from "@mui/x-data-grid-pro";
import DataGrid, { PaginationInterface, initRows } from "components/DataGrid";
import { TextBoxForm, CheckboxFormItem } from "components/Input";
import UploadFile from "components/Input/UploadFile/UploadFile";
import { Extension } from "utilities/ST_Function";
import RenderText from "./RenderText";

function AreaKnowledge(props) {
	const { form, arrFile, setArrFile, IsApprove, sExplicitKnowledge, sPassOnKnowledge, setIsClosed } = props;

	const onClearFile = useRef(null);
	const [IsClose, setIsClose] = useState(false);

	const [DataRow] = useState<PaginationInterface>({
		...initRows,
		sSortExpression: "dUpdate",
		sSortDirection: "desc",
	});

	const data: GridColumns = [
		{
			field: "sPlan",
			headerName: "งบประมาณตามแผน",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			minWidth: 200,
		},
		{
			field: "sActual",
			headerName: "งบประมาณใช้จริง",
			headerAlign: "center",
			align: "left",
			sortable: false,
			resizable: false,
			flex: 2,
		},
		{
			field: "sResult",
			headerName: "ผลประเมินงบประมาณ",
			headerAlign: "center",
			align: "center",
			sortable: false,
			resizable: false,
			flex: 1,
		},
	];

	return (
		<>
			<FormProvider {...form}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<AccordionCustom header="องค์ความรู้" color="#7239ea" bgColor="#f8f5ff" borderColor="1px solid #7239ea">
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<CheckboxFormItem name="IsCloseArea" label={"แจ้งปิดพื้นที่"} disabled={IsApprove} onChange={(e) => { setIsClosed(e ?? false); setIsClose(e ?? false); form.clearErrors(); }} />
								</Grid>
								<Grid item xs={12}>
									<HeaderInput text="สรุปข้อมูลงบประมาณโครงการ/พื้นที่" />
									<DataGrid
										isLoading={false}
										columns={data}
										rows={DataRow}
										isHiddenToolHead
										onLoadData={(e) => { }}
										isNotShowPagination
										isNotShowTotal
										isHideFooter
									/>
								</Grid>
								<Grid item xs={12}>
									{IsApprove ?
										<Grid item xs={12}>
											<RenderText
												header={
													"การนำองค์ความรู้ที่มีมาประยุกต์ใช้"
												}
												text={sExplicitKnowledge}
												IsFlex={false}
											/>
										</Grid>
										:
										<TextBoxForm
											id="sExplicitKnowledge"
											name="sExplicitKnowledge"
											maxLength={5000}
											required={IsClose}
											multiline
											rows={5}
											label="การนำองค์ความรู้ที่มีมาประยุกต์ใช้"
											placeholder="การนำองค์ความรู้ที่มีมาประยุกต์ใช้"
										/>
									}

								</Grid>
								<Grid item xs={12}>
									{IsApprove ?
										<Grid item xs={12}>
											<RenderText
												header={
													"การถ่ายทอดองค์ความรู้ใหม่จากการดำเนินงาน"
												}
												text={sPassOnKnowledge}
												IsFlex={false}
											/>
										</Grid>
										:
										<TextBoxForm
											id="sPassOnKnowledge"
											name="sPassOnKnowledge"
											maxLength={5000}
											required={IsClose}
											multiline
											rows={5}
											label="การถ่ายทอดองค์ความรู้ใหม่จากการดำเนินงาน"
											placeholder="การถ่ายทอดองค์ความรู้ใหม่จากการดำเนินงาน"
										/>
									}
								</Grid>
								<Grid item xs={12}>
									<UploadFile
										IsRequired={false}
										modeDisplay={"gallery"}
										id={"oFileKnowledge"}
										name={"oFileKnowledge"}
										keyID={2}
										arrFile={arrFile}
										setarrFile={setArrFile}
										Extension={Extension.ImageDocument}
										IsFolder={false}
										onClearFile={onClearFile}
										sFolderTemp="AreaUpdateProgress"
										IsMultiple={true}
										nLimitFile={3}
										sLimitFile="MB"
										sPositionText="right"
										IsCrop={true}
										cropShape={"retangle"}
										cropRatio={16 / 9}
										cropResize={true}
										cropMovable={true}
										IsHide={IsApprove}
									/>
								</Grid>
							</Grid>
						</AccordionCustom>
					</Grid>
				</Grid>
			</FormProvider>
		</>
	);
}

export default AreaKnowledge;
