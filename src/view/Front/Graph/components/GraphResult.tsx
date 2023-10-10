import { useEffect, useState } from 'react'
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { AxiosPost } from 'utilities/ST_Axios';
import { formatNumber } from 'utilities/ST_Function';
import CustomTablePagination from './CustomTablePagination';

const GraphResult = (props) => {

    const {
        arrOption
    } = props;

    const Layout555 = useMediaQuery('(min-width:555px)');
    const Layout700 = useMediaQuery('(min-width:700px)');


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setdataTable] = useState([] as any)
    const [IsSkelton, setIsSkelton] = useState(true)
    const [, setnAddHeight] = useState(500)

    //#region  Form
    let objSchema = {
        sIndicator: yupFormSchemas.string("ตัวชี้วัด", { required: true }),
        arrYear: yupFormSchemas.stringArray("ปี", { required: false }),
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
    }, [])

    const loadData = (nMode) => {
        let oParam = {
            sIndicator: form.getValues("sIndicator") ?? "",
            arrYear: form.getValues("arrYear") ?? [],
            arrProject: form.getValues("arrProject") ?? [],
        }
        AxiosPost(`Graph/SearchResult`, oParam, (result) => {
            if (nMode === 1) {
                form.setValue("sIndicator", result.sIndicator ?? [])
            }
            setdataTable(result.lstTable || [])

            let lstProject = result.lstProject || [];
            let sIndicatorName = result.sIndicatorName;
            let lstGraph = result.lstGraph || [];
            let sDisplay = form.getValues("sDisplay") ?? "1";

            if (sDisplay === "1") {
                if (lstGraph.length > 0) {
                    lstGraph.forEach(elm => {
                        let lstDataYear = elm.lstDataYear ?? [];
                        let nResult = 0;
                        if (lstDataYear.length > 0) {
                            lstDataYear.forEach(elmSub => {
                                nResult += elmSub.nResultIndicator;
                                elm[`nProjectID_${elmSub.nProjectID}`] = elmSub.nResultIndicator;
                            });
                        }
                        elm[`nTotal`] = nResult;
                    });
                }

                setnAddHeight(500)
                onRenderGraphResult(lstGraph, lstProject, sIndicatorName);
            }
            else {
                // let lstDataGraphCustom = [] as any;
                if (lstGraph.length > 0) {
                    lstGraph.forEach(elm => {
                        let lstDataYear = elm.lstDataYear ?? [];
                        let nResult = 0;
                        if (lstDataYear.length > 0) {
                            lstDataYear.forEach(elmSub => {
                                nResult += elmSub.nResultIndicator;
                                elm[`nProjectID_${elmSub.nProjectID}`] = elmSub.nResultIndicator;
                            });
                        }
                        elm[`nTotal`] = nResult;
                    });
                }
                onRenderGraphClusterBarProject(lstGraph, lstProject, sIndicatorName);
            }
            setIsSkelton(false)
        });
    }

    const onRenderGraphResult = (lstGraph, lstProject, sIndicatorName) => {
        let chart = am4core.create('chartResult', am4charts.XYChart)
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

        chart.exporting.filePrefix = "กราฟแสดงตัวชี้วัด: " + sIndicatorName;

        //#region Title
        let title = chart.titles.create();
        title.text = "ตัวชี้วัด: " + sIndicatorName;
        title.fontSize = 24;
        title.align = "center";
        title.fontWeight = '400';
        title.marginBottom = 15;
        //#endregion

        chart.data = lstGraph;
        chart.colors.step = 2;

        let styleGraph = "1";
        // let isIndicator = form.getValues("sIndicator")
        let isYear = form.getValues("arrYear") ?? []
        let isProject = form.getValues("arrProject") ?? []

        if (isYear.length > 0 && isProject.length > 0) {
            styleGraph = "3";
        }
        else if (isYear.length > 0 && isProject.length === 0) {
            styleGraph = "2";
        }

        if (styleGraph === "1") {

            let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
            xAxis.dataFields.category = 'sIndicatorName'
            xAxis.renderer.cellStartLocation = 0.1
            xAxis.renderer.cellEndLocation = 0.9
            xAxis.renderer.grid.template.opacity = 0;   //vertical line grid
            xAxis.renderer.grid.template.location = 0;
            xAxis.renderer.minGridDistance = 40;

            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.min = 0;
            yAxis.extraMax = 0.1;

            let series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = 'nTotal'
            series.dataFields.categoryX = 'sIndicatorName'
            series.name = "";
            series.stacked = true;
            series.columns.template.tooltipText = "{categoryX}: {valueY}";

            let bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            bullet.label.text = '{valueY}'
            bullet.label.fill = am4core.color('#000000')

        }
        else if (styleGraph === "2" || styleGraph === "3") {
            let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
            xAxis.dataFields.category = 'sYear'

            xAxis.renderer.cellStartLocation = 0.1
            xAxis.renderer.cellEndLocation = 0.9
            xAxis.renderer.grid.template.opacity = 0;   //vertical line grid
            xAxis.renderer.grid.template.location = 0;
            xAxis.renderer.minGridDistance = 40;

            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.min = 0;
            yAxis.extraMax = 0.1;

            createSeriesStyle('nTotal', 'รวม');
        }

        function createSeriesStyle(value, name) {
            let series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'sYear'
            series.dataFields.value = value
            series.name = name
            series.stacked = true;
            series.columns.template.tooltipText = name + " : {valueY}";

            let bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            bullet.label.text = '{valueY}'
            bullet.label.fill = am4core.color('#000000')

            return series;
        }
    }

    const onRenderGraphClusterBarProject = (lstGraph, lstProject, sIndicatorName) => {
        let chart = am4core.create('chartResult', am4charts.XYChart) as any
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

        chart.exporting.filePrefix = "กราฟแสดงตัวชี้วัด: " + sIndicatorName;

        //#region Title
        let title = chart.titles.create();
        title.text = "ตัวชี้วัด: " + sIndicatorName;
        title.fontSize = 24;
        title.align = "center";
        title.fontWeight = '400';
        title.marginBottom = 15;
        //#endregion

        chart.data = lstGraph;

        chart.colors.step = 2;

        let styleGraph = "1";
        // let isIndicator = form.getValues("sIndicator")
        let isYear = form.getValues("arrYear") ?? []
        let isProject = form.getValues("arrProject") ?? []

        if (isYear.length > 0 && isProject.length > 0) {
            styleGraph = "3";
        }
        else if (isYear.length > 0 && isProject.length === 0) {
            styleGraph = "2";
        }


        if (styleGraph === "1") {

            let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
            xAxis.dataFields.category = 'sIndicatorName'
            xAxis.renderer.cellStartLocation = 0.1
            xAxis.renderer.cellEndLocation = 0.9
            xAxis.renderer.grid.template.opacity = 0;   //vertical line grid
            xAxis.renderer.grid.template.location = 0;
            xAxis.renderer.minGridDistance = 40;

            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.min = 0;
            yAxis.extraMax = 0.1;

            if (lstProject != null) {
                lstProject.forEach(elm => {
                    createSeriesStyle('sIndicatorName', elm.value, elm.label);
                });
            }
        }
        else if (styleGraph === "2" || styleGraph === "3") {

            let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
            xAxis.dataFields.category = 'sYear'
            xAxis.numberFormatter.numberFormat = "#,###";
            xAxis.renderer.cellStartLocation = 0.1
            xAxis.renderer.cellEndLocation = 0.9
            xAxis.renderer.grid.template.opacity = 0;   //vertical line grid
            xAxis.renderer.grid.template.location = 0;
            xAxis.renderer.minGridDistance = 40;

            let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
            yAxis.min = 0;
            yAxis.extraMax = 0.1;
            if (lstProject != null) {
                lstProject.forEach(elm => {
                    createSeriesStyle('sYear', elm.value, elm.label);
                });
            }

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

        function createSeriesStyle(valueAxisX, valueAxisY, name) {
            let series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = valueAxisY
            series.dataFields.categoryX = valueAxisX
            series.dataFields.value = valueAxisY
            series.name = name
            series.stacked = true;
            series.columns.template.tooltipText = name + " : {valueY}";

            let bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.label.text = '{valueY}'
            bullet.locationY = 0.5;
            bullet.label.hideOversized = true;
            bullet.label.fill = am4core.color('#000000')

            return series;
        }
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
                <AccordionCustom header={"กราฟผลลัพธ์ตัวชี้วัด"}>
                    <Grid container spacing={2} justifyContent={"center"}>
                        <Grid item xs={12} >
                            <Grid container spacing={2} justifyContent={"start"}>
                                <Grid item xs={12} md={3}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={54} />
                                        :
                                        <SelectFormItem
                                            id={"sIndicator"}
                                            name={"sIndicator"}
                                            label={'ตัวชี้วัด'}
                                            required={true}
                                            options={arrOption.indicator}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={12} md={2.5}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={54} />
                                        :
                                        <SelectMultipleFormItem
                                            id={"arrYear"}
                                            name={"arrYear"}
                                            label={'ปี'}
                                            required={false}
                                            options={arrOption.arryearResult}

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
                                                <BtnSearch id='search-result' onClick={form.handleSubmit(() => { loadData(2) })} />
                                            }
                                        </Grid>
                                        <Grid item >
                                            {IsSkelton ?
                                                <Skeleton animation="wave" width={80} height={54} />
                                                :
                                                <BtnClear id='clear-result' onClick={onClearForm} />
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={12}>

                            <div
                                id={`chartResult`}
                                style={{
                                    width: "100%",
                                    height: "500px"
                                }}
                            >
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            {IsSkelton ?
                                <Skeleton animation="wave" height={300} />
                                :
                                <AccordionCustom header={"ตารางข้อมูลกราฟผลลัพธ์ตัวชี้วัด"}>
                                    <TableContainer id='table-graph' component={Paper}>
                                        <Table sx={{ minWidth: 500 }}>
                                            <TableHead>
                                                <TableRow style={{ background: "linear-gradient(135deg,#3a8ffe 0,#9658fe 100%)" }}>
                                                    <TableCell align="center" style={{ width: '35%', padding: '12px 16px' }}>ตัวชี้วัด</TableCell>
                                                    <TableCell align="center" style={{ width: '35%', padding: '12px 16px' }}>โครงการ</TableCell>
                                                    <TableCell align="center" style={{ width: '10%', padding: '12px 16px' }}>ปี</TableCell>
                                                    <TableCell align="center" style={{ width: '15%', padding: '12px 16px' }}>ผลลัพธ์</TableCell>
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
                                                                    <TableCell align="left" >
                                                                        {row.sIndicatorName}
                                                                    </TableCell>
                                                                    <TableCell align="left" >
                                                                        {row.sProjectName}
                                                                    </TableCell>
                                                                    <TableCell align="center" >
                                                                        {row.sYear}
                                                                    </TableCell>
                                                                    <TableCell align="right" >
                                                                        {formatNumber(row.nResultIndicator, 2)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                    :
                                                    <TableRow key={"r-no-data"} >
                                                        <TableCell align="center" colSpan={4}>ไม่พบข้อมูล</TableCell>
                                                    </TableRow>
                                            }
                                            <CustomTablePagination
                                                        dataTable={dataTable}
                                                        rowsPerPage={rowsPerPage}
                                                        setRowsPerPage={setRowsPerPage}
                                                        page={page}
                                                        setPage={setPage}
                                                        colSpan={4}
                                                    />
                                        </Table>
                                    </TableContainer>
                                </AccordionCustom>
                            }
                        </Grid>
                    </Grid>
                </AccordionCustom>
            </FormProvider>

        </>
    )
}

export default GraphResult
