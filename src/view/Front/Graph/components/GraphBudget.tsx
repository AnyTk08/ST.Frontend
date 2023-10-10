import { useEffect, useMemo, useState } from 'react'
import { Grid, Skeleton, useMediaQuery } from '@mui/material';
//component
import AccordionCustom from 'components/Accordion/AccordionCustom';
// yup
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
//input
import { SelectFormItem, SelectMultipleFormItem } from 'components/Input';
//button
import { BtnClear, BtnSearch } from 'components/Button';
//table mui
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { formatNumber } from 'utilities/ST_Function';
import { AxiosPost } from 'utilities/ST_Axios';
import CustomTablePagination from './CustomTablePagination';

// Themes begin
am4core.addLicense("CH208466903");
am4core.useTheme(am4themes_animated);
// Themes end

const GraphBudget = (props) => {

    const {
        arrOption
    } = props;

    const Layout555 = useMediaQuery('(min-width:555px)');
    const Layout700 = useMediaQuery('(min-width:700px)');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setdataTable] = useState([] as any)
    const [IsSkelton, setIsSkelton] = useState(true)
    const [nAddHeight, setnAddHeight] = useState(500)

    const optionYear = useMemo(() => {
        let arr = [] as any
        if (arrOption.yearBudget) {
            arr = arrOption.yearBudget;
        }
        return arr;
    }
        , [arrOption.yearBudget])
    //#region  Form
    let objSchema = {
        arrAgency: yupFormSchemas.stringArray("หน่วยงานหลักที่รับผิดชอบโครงการ", { required: true }),
        arrYearBudget: yupFormSchemas.stringArray("ปีงบประมาณ", { required: true }),
        arrProject: yupFormSchemas.stringArray("โครงการ", { required: false }),
        sDisplay: yupFormSchemas.string("รูปแบบการแสดง", { required: true }),
    }

    const schema = yup.object().shape(objSchema);
    const form = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        shouldFocusError: true,
    })
    //#endregion

    useEffect(() => {

        form.setValue("sDisplay", "1");
        loadData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    const loadData = (nMode) => {
        let oParam = {
            arrAgency: form.getValues("arrAgency") ?? [],
            arrYearBudget: form.getValues("arrYearBudget") ?? [],
            arrProject: form.getValues("arrProject") ?? [],
        }
        AxiosPost(`Graph/SearchBudget`, oParam, (result) => {
            let arrResultYear = result.arrResultYear ?? [];
            let arrResultProjectLabel = result.arrResultProjectLabel ?? [];
            let arrResultAgency = result.arrResultAgency ?? [];
            let arrResultProject = result.arrResultProject ?? [];
            if (nMode === 1) {
                form.setValue("arrYearBudget", arrResultYear)
                form.setValue("arrAgency", arrResultAgency)
            }

            let lstTable = result.lstTable || [];
            setdataTable(lstTable)

            let lstCustomLabel = [] as any;
            let lstDataGraph = result.lstDataGraph || [];
            let sDisplay = form.getValues("sDisplay") ?? "1";
            if (sDisplay === "1") {
                lstDataGraph.forEach(elm => {
                    if (elm.lstData != null && elm.lstData.length > 0) {
                        let nBudget = 0;
                        let nBudgetResult = 0;
                        elm.lstData.forEach(elmSub => {
                            nBudget += elmSub.nBudget;
                            nBudgetResult += elmSub.nResultBudget;
                            elm[`nBudgetTotal`] = nBudget;
                            elm[`nResultBudgetTotal`] = nBudgetResult;
                            elm[`${elmSub.sProjectName}`] = elmSub.nResultBudget;
                        });
                    }
                });
                setnAddHeight(500)
                onRenderGraphClusterBarArea(lstDataGraph);
            }
            else {
                let lstDataGraphCustom = [] as any;
                lstDataGraph.forEach(elm => {
                    lstCustomLabel.push({
                        "start": "sBudget_" + elm.sYear,
                        "end": "sResult_" + elm.sYear,
                        "label": elm.sYear + ""
                    })
                    if (elm.lstData != null && elm.lstData.length > 0) {
                        for (let index = 0; index < 2; index++) {
                            if (index === 0) {
                                //budget
                                let oData = {
                                    sYear: elm.sYear,
                                    name: "sBudget_" + elm.sYear,
                                } as any
                                arrResultProject.forEach(elmID => {
                                    let findValueBudget = elm.lstData.find(f => f.nProjectID + "" === elmID)
                                    oData[`nProjectID_${elmID}`] = findValueBudget ? findValueBudget.nBudget : 0;

                                });
                                lstDataGraphCustom.push(oData);
                            }
                            else {
                                // result
                                let oData = {
                                    sYear: elm.sYear,
                                    name: "sResult_" + elm.sYear,
                                } as any
                                arrResultProject.forEach(elmID => {
                                    let findValueBudget = elm.lstData.find(f => f.nProjectID + "" === elmID)
                                    oData[`nProjectID_${elmID}`] = findValueBudget ? findValueBudget.nBudget : 0;
                                });
                                lstDataGraphCustom.push(oData);
                            }

                        }

                    }
                });
                onRenderGraphClusterBarProject(lstDataGraphCustom, lstCustomLabel, arrResultProjectLabel);
            }
            setIsSkelton(false)
        });
    }

    const onRenderGraphClusterBarArea = (lstGraph) => {

        let chart = am4core.create('chartBubget', am4charts.XYChart) as any;
        chart.zoomOutButton.disabled = true;
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

        chart.exporting.menu.items = [{
            "label": "...",
            "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
            ]
        }];

        chart.exporting.filePrefix = "กราฟแสดงงบประมาณตั้งต้นและงบประมาณที่ใช้จริง";

        let title = chart.titles.create();
        title.text = "กราฟแสดงงบประมาณตั้งต้น และงบประมาณที่ใช้จริง";
        title.fontSize = 24;
        title.align = "center";
        title.fontWeight = '400';
        title.marginBottom = 15;
        chart.data = lstGraph;// dataGraph;

        chart.colors.step = 2;

        let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'sYear'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.opacity = 0;   //vertical line grid
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.minGridDistance = 40;

        let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;
        let label = xAxis.renderer.labels.template;
        label.wrap = true;

        xAxis.events.on("sizechanged", function (ev) {
            let axis = ev.target;
            let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
            axis.renderer.labels.template.maxWidth = cellWidth;
        });

        function createSeries(value, name) {
            let series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'sYear'
            series.name = name
            series.columns.template.tooltipText = name + ": {valueY}";

            let bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            bullet.label.text = '{valueY}'
            bullet.label.fill = am4core.color('#000000')

            return series;
        }

        createSeries('nBudgetTotal', 'งบประมาณตั้งต้น');
        createSeries('nResultBudgetTotal', 'งบประมาณใช้จริง');

        chart.legend = new am4charts.Legend() as any;
        chart.legend.position = 'bottom'
        chart.legend.paddingBottom = 20
        // chart.legend.labels.template.maxWidth = 95
        chart.legend.labels.template.maxWidth = 200;
        chart.legend.labels.template.truncate = true;
        chart.legend.labels.template.text = "{name}[/]";
        chart.legend.itemContainers.template.tooltipText = "{name}"

        // After the chart is ready
        chart.events.on("ready", function () {
            // Loop through legend items and update labels
            chart.legend.itemContainers.each(function (itemContainer) {
                let legendText = itemContainer.dataItem.dataContext.name;
                if (legendText.length > 25) {
                    let shortenedText = legendText.substring(0, 25) + "...";
                    itemContainer.dataItem.label.text = shortenedText;
                }
            });
        });

    }

    const onRenderGraphClusterBarProject = (lstGraph, lstLabel, arrResultProjectLabel) => {

        let chart = am4core.create('chartBubget', am4charts.XYChart) as any
        chart.zoomOutButton.disabled = true;
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "right";
        chart.exporting.menu.verticalAlign = "top";

        chart.exporting.menu.items = [{
            "label": "...",
            "menu": [
                { "type": "png", "label": "PNG" },
                { "type": "jpg", "label": "JPG" },
            ]
        }];

        chart.exporting.filePrefix = "กราฟแสดงงบประมาณตั้งต้นและงบประมาณที่ใช้จริง";

        let title = chart.titles.create();
        title.text = "กราฟแสดงงบประมาณตั้งต้น และงบประมาณที่ใช้จริง";
        title.fontSize = 24;
        title.align = "center";
        title.fontWeight = '400';
        title.marginBottom = 15;

        chart.data = lstGraph; // lstGraph;// dataGraph;

        chart.colors.step = 2;


        let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'name'
        xAxis.renderer.labels.template.disabled = true;
        xAxis.renderer.minGridDistance = 20;

        let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;
        yAxis.extraMax = 0.1;

        function createSeriesStack(field, name) {
            let series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = field
            series.dataFields.categoryX = 'name'
            series.name = name
            series.stacked = true;
            series.columns.template.tooltipText = name + ": {valueY}";

            // Add label
            let labelBullet = series.bullets.push(new am4charts.LabelBullet());
            labelBullet.label.text = "{valueY}";
            labelBullet.locationY = 0.5;
            labelBullet.label.hideOversized = true;
            labelBullet.label.fill = am4core.color('#000000')

            return series;
        }


        arrResultProjectLabel.forEach(elmProject => {
            createSeriesStack(elmProject.value, elmProject.label)

        });


        lstLabel.forEach(item => {
            let range = xAxis.axisRanges.create();
            range.category = item.start;
            range.endCategory = item.end;
            range.label.text = item.label;
            range.label.fill = am4core.color("#000000");
            range.label.location = 0;
            range.label.dy = 5;
            range.label.fontWeight = "400";
            range.label.fontSize = 20;
            range.label.horizontalCenter = "middle"
            range.label.inside = false;

            range.grid.stroke = am4core.color("#ffffff");
            range.grid.strokeOpacity = 1;
            range.tick.length = 200;
            range.tick.disabled = true;
            range.tick.strokeOpacity = 0.6;
            range.tick.stroke = am4core.color("#ffffff");
            range.tick.location = 0;
            range.locations.category = 1;
        });

        chart.legend = new am4charts.Legend() as any;
        chart.legend.position = 'bottom'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.text = "{name}[/]";
        chart.legend.itemContainers.template.tooltipText = "{name}"

        // After the chart is ready
        chart.events.on("ready", function () {
            // Loop through legend items and update labels
            let nCount = 0;
            chart.legend.itemContainers.each(function (itemContainer) {
                let legendText = itemContainer.dataItem.dataContext.name;
                if (legendText.length > 25) {
                    let shortenedText = legendText.substring(0, 25) + "...";
                    itemContainer.dataItem.label.text = shortenedText;
                }
                nCount++;
            });

            let nRowPerPage = 4;
            if (!Layout555) {
                nRowPerPage = 1;
            }
            else if (!Layout700) {
                nRowPerPage = 2;
            }
            let calNewHeight = 500 + (nCount / nRowPerPage) * 40;
            setnAddHeight(calNewHeight)
        });

    }

    const onClearForm = () => {
        Object.keys(form.getValues()).forEach((key => {
            if (key !== "sDisplay") {
                form.setValue(key, null);
                form.clearErrors(key);
            }

        }))
        loadData(1);
    }

    return (
        <>
            <FormProvider {...form}>
                <AccordionCustom header={"กราฟแสดงงบประมาณตั้งต้น และงบประมาณที่ใช้จริง"}>
                    <Grid container spacing={2} justifyContent={"center"}>
                        <Grid item xs={12} >
                            <Grid container spacing={2} justifyContent={"start"}>
                                <Grid item xs={12} md={3}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={54} />
                                        : <SelectMultipleFormItem
                                            id={"arrAgency"}
                                            name={"arrAgency"}
                                            label={'หน่วยงานหลักที่รับผิดชอบโครงการ'}
                                            required={true}
                                            options={arrOption.agengy}
                                        />}
                                </Grid>
                                <Grid item xs={12} md={2.5}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={54} />
                                        :
                                        <SelectMultipleFormItem
                                            id={"arrYearBudget"}
                                            name={"arrYearBudget"}
                                            label={'ปีงบประมาณ'}
                                            required={true}
                                            options={optionYear}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={12} md={3.5}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={54} />
                                        :
                                        <SelectMultipleFormItem
                                            id={"arrProject"}
                                            name={"arrProject"}
                                            label={'โครงการ'}
                                            required={false}
                                            options={arrOption.project}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={54} />
                                        :
                                        <SelectFormItem
                                            id={"sDisplay"}
                                            name={"sDisplay"}
                                            label={'รูปแบบการแสดง'}
                                            isClearable={true}
                                            required={true}
                                            options={[
                                                { value: "1", label: "แบบรวมโครงการ" },
                                                { value: "2", label: "แบบแยกตามโครงการ" },
                                            ]}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1} justifyContent={"center"}>
                                        <Grid item >
                                            {IsSkelton ?
                                                <Skeleton animation="wave" width={80} height={54} />
                                                :
                                                <BtnSearch id='search-budget' onClick={form.handleSubmit(() => { loadData(2) })} />
                                            }
                                        </Grid>
                                        <Grid item >
                                            {IsSkelton ?
                                                <Skeleton animation="wave" width={80} height={54} />
                                                :
                                                <BtnClear id='clear-budget' onClick={onClearForm} />
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} >
                            <Grid container spacing={2} justifyContent={"center"}>
                                <Grid item xs={12} md={12}>
                                    <div
                                        id={`chartBubget`}
                                        style={{
                                            width: "100%",
                                            height: nAddHeight + "px"
                                        }}
                                    >
                                    </div>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={300} />
                                        :
                                        <AccordionCustom header={"ตารางข้อมูลกราฟแสดงงบประมาณตั้งต้น และงบประมาณที่ใช้จริง"}>
                                            <TableContainer id='table-graph' component={Paper}>
                                                <Table sx={{ minWidth: 500 }}>
                                                    <TableHead>
                                                        <TableRow style={{ background: "linear-gradient(135deg,#3a8ffe 0,#9658fe 100%)" }}>
                                                            <TableCell align="center" style={{ width: '15%', padding: '12px 16px' }}>หน่วยงานรับผิดชอบ</TableCell>
                                                            <TableCell align="center" style={{ width: '30%', padding: '12px 16px' }}>โครงการ</TableCell>
                                                            <TableCell align="center" style={{ width: '15%', padding: '12px 16px' }}>ปีงบประมาณ</TableCell>
                                                            <TableCell align="center" style={{ width: '20%', padding: '12px 16px' }}>งบประมาณตั้งต้น</TableCell>
                                                            <TableCell align="center" style={{ width: '20%', padding: '12px 16px' }}>งบประมาณใช้จริง</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    {
                                                        dataTable.length > 0 ?
                                                            <TableBody>
                                                                {(rowsPerPage > 0
                                                                    ? dataTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    : dataTable
                                                                ).map((row, index) => {
                                                                    let nNo = (page * rowsPerPage) + (index + 1);
                                                                    return (
                                                                        <TableRow key={nNo}>
                                                                            <TableCell align="center" >
                                                                                {row.sAgency}
                                                                            </TableCell>
                                                                            <TableCell align="left" >
                                                                                {row.sProjectName}
                                                                            </TableCell>
                                                                            <TableCell align="center" >
                                                                                {row.nYear}
                                                                            </TableCell>
                                                                            <TableCell align="right" >
                                                                                {formatNumber(row.nBudget, 2)}
                                                                            </TableCell>
                                                                            <TableCell align="right" >
                                                                                {formatNumber(row.nResultBudget, 2)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })}
                                                            </TableBody>
                                                            :
                                                            <TableRow key={"r-no-data"} >
                                                                <TableCell align="center" colSpan={5}>ไม่พบข้อมูล</TableCell>
                                                            </TableRow>
                                                    }
                                                    <CustomTablePagination
                                                        dataTable={dataTable}
                                                        rowsPerPage={rowsPerPage}
                                                        setRowsPerPage={setRowsPerPage}
                                                        page={page}
                                                        setPage={setPage}
                                                        colSpan={5}
                                                    />
                                                </Table>
                                            </TableContainer>
                                        </AccordionCustom>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </AccordionCustom>
            </FormProvider>

        </>
    )
}

export default GraphBudget