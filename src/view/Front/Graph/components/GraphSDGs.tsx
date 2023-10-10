import { useEffect, useState } from 'react'
import { Grid, Skeleton } from '@mui/material';
//component
import AccordionCustom from 'components/Accordion/AccordionCustom';
// yup
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import yupFormSchemas from 'components/FormItem/yupFormSchemas';
//input
import { SelectMultipleFormItem } from 'components/Input';
//button
import { BtnClear, BtnSearch } from 'components/Button';
//table mui
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import { AxiosPost } from 'utilities/ST_Axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CustomTablePagination from './CustomTablePagination';

const GraphSDGs = (props) => {

    const {
        arrOption
    } = props;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dataTable, setdataTable] = useState([] as any)
    const [IsSkelton, setIsSkelton] = useState(true)

    //#region  Form
    let objSchema = {
        arrSDGs: yupFormSchemas.stringArray("ประเภท SDGs", { required: true }),
        arrAgency: yupFormSchemas.stringArray("หน่วยงานหลักที่รับผิดชอบโครงการ", { required: true }),
    }

    const schema = yup.object().shape(objSchema);
    const form = useForm({
        resolver: yupResolver(schema),
        mode: 'all',
        shouldFocusError: true,
    })
    //#endregion

    useEffect(() => {
        loadData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loadData = (nMode) => {
        let oParam = {
            arrSDGs: form.getValues("arrSDGs") ?? [],
            arrAgency: form.getValues("arrAgency") ?? [],
        }
        AxiosPost(`Graph/SearchSDGs`, oParam, (result) => {
            if (nMode === 1) {
                form.setValue("arrSDGs", result.arrResultSDGs ?? [])
                form.setValue("arrAgency", result.arrResultAgency ?? [])
            }
            setdataTable(result.lstDataTable || [])
            let lstGraph = result.lstDataGraph || [];
            let lstGroupAgency = result.lstGroupAgency || [];
            if (lstGraph.length > 0) {
                lstGraph.forEach(elm => {
                    if (elm.lstData != null && elm.lstData.length > 0) {
                        lstGroupAgency.forEach(elmSub => {
                            let oFindAgency = elm.lstData.find(f => f.sAgency === elmSub)
                            elm[`${elmSub}`] = oFindAgency ? oFindAgency.nProject : 0;
                        });
                    }
                });
            }
            onRenderGraphClusterBar(lstGraph, lstGroupAgency);
            setIsSkelton(false)
        });
    }
    const onRenderGraphClusterBar = (lstGraph, lstGroupAgency) => {
        let chart = am4core.create('chartSDG', am4charts.XYChart)
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
        chart.exporting.filePrefix = "กราฟแสดงจำนวนประเภท SDGs";

        let title = chart.titles.create();
        title.text = "กราฟแสดงจำนวนประเภท SDGs หลัก";
        title.fontSize = 24;
        title.align = "center";
        title.fontWeight = '400';
        title.marginBottom = 15;

        chart.data = lstGraph;

        chart.colors.step = 2;

        chart.legend = new am4charts.Legend()
        chart.legend.position = 'bottom'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.maxWidth = 95

        let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'sSDGs'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.opacity = 0;   //vertical line grid
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.minGridDistance = 40;

        let label = xAxis.renderer.labels.template;
        label.wrap = true;

        xAxis.events.on("sizechanged", function (ev) {
            let axis = ev.target;
            let cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
            axis.renderer.labels.template.maxWidth = cellWidth;
        });


        let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.maxPrecision = 0;
        yAxis.numberFormatter.numberFormat = "#";
        yAxis.min = 0;
        yAxis.extraMax = 0.1;
        function createSeries(value: string, name: string, isShowSum: boolean) {
            let series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'sSDGs'
            series.name = name
            series.stacked = true;
            series.columns.template.tooltipText = name + " : {valueY}";

            let bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 10;
            bullet.label.text = '{valueY}'
            bullet.label.fill = am4core.color('#000000')
            bullet.label.adapter.add("text", function (text, target) { //ตัวปิดค่า 0 ไม่ให้แสดง
                if (target.dataItem && target.dataItem['valueY'] === 0) {
                    return "";
                }
                return text;
            });

            if (isShowSum) {
                let sumBullet = series.bullets.push(new am4charts.LabelBullet());
                sumBullet.label.text = "{nTotal}";
                sumBullet.verticalCenter = "bottom";
                sumBullet.dy = -15;
            }

            return series;
        }

        lstGroupAgency.forEach((itmAgency, index) => {
            let isLast = index === (lstGroupAgency.length - 1)
            createSeries(itmAgency, itmAgency, isLast);
        });

    }

    const onClearForm = () => {
        Object.keys(form.getValues()).forEach((key => {
            form.setValue(key, null);
            form.clearErrors(key);
        }))
        loadData(1);
    }

    return (
        <>
            <FormProvider {...form}>
                <AccordionCustom header={"กราฟแสดงจำนวนประเภท SDGs หลัก"}>
                    <Grid container spacing={2} justifyContent={"center"}>
                        <Grid item xs={12} >
                            <Grid container spacing={2} justifyContent={"start"}>
                                <Grid item xs={12} md={4}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={54} />
                                        :
                                        <SelectMultipleFormItem
                                            id={"arrSDGs"}
                                            name={"arrSDGs"}
                                            label={'ประเภท SDGs'}
                                            required={true}
                                            options={arrOption.sdg}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    {IsSkelton ?
                                        <Skeleton animation="wave" height={54} />
                                        :
                                        <SelectMultipleFormItem
                                            id={"arrAgency"}
                                            name={"arrAgency"}
                                            label={'หน่วยงานหลักที่รับผิดชอบโครงการ'}
                                            required={true}
                                            options={arrOption.agengy}
                                        />
                                    }
                                </Grid>
                                <Grid item >
                                    <Grid container spacing={1} justifyContent={"center"}>
                                        <Grid item >
                                            {IsSkelton ?
                                                <Skeleton animation="wave" width={80} height={54} />
                                                :
                                                <BtnSearch id='search-sdg' onClick={form.handleSubmit(() => { loadData(2) })} />
                                            }
                                        </Grid>
                                        <Grid item >
                                            {IsSkelton ?
                                                <Skeleton animation="wave" width={80} height={54} />
                                                :
                                                <BtnClear id='clear-sdg' onClick={onClearForm} />
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <div
                                id={`chartSDG`}
                                style={{
                                    width: "100%",
                                    height: "500px"
                                }}
                            >
                            </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {IsSkelton ?
                                <Skeleton animation="wave" height={300} />
                                :
                                <AccordionCustom header={"ตารางข้อมูลกราฟแสดงจำนวนประเภท SDGs หลัก"}>
                                    <TableContainer id='table-graph' component={Paper}>
                                        <Table sx={{ minWidth: 500 }}>
                                            <TableHead>
                                                <TableRow style={{ background: "linear-gradient(135deg,#3a8ffe 0,#9658fe 100%)" }}>
                                                    <TableCell align="center" style={{ width: '30%', padding: '12px 16px' }}>หน่วยงานรับผิดชอบ</TableCell>
                                                    <TableCell align="center" style={{ width: '45%', padding: '12px 16px' }}>SDGs</TableCell>
                                                    <TableCell align="center" style={{ width: '25%', padding: '12px 16px' }}>จำนวนโครงการ</TableCell>
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
                                                                        {row.sSDGs}
                                                                    </TableCell>
                                                                    <TableCell align="center" >
                                                                        {row.nProject}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                    :
                                                    <TableRow key={"r-no-data"} >
                                                        <TableCell align="center" colSpan={3}>ไม่พบข้อมูล</TableCell>
                                                    </TableRow>
                                            }
                                            <CustomTablePagination
                                                dataTable={dataTable}
                                                rowsPerPage={rowsPerPage}
                                                setRowsPerPage={setRowsPerPage}
                                                page={page}
                                                setPage={setPage}
                                                colSpan={3}
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

export default GraphSDGs
