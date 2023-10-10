import { useEffect } from 'react'
import { Grid } from '@mui/material';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Themes begin
am4core.addLicense("CH208466903");
am4core.useTheme(am4themes_animated);
// Themes end

const GraphProject = (props) => {

    const { lstData, setsImgChart } = props;

    useEffect(() => {
        onRenderGraphProject();
    }, [lstData])

    const onRenderGraphProject = () => {
        let chart = am4core.create('chart-project', am4charts.XYChart)
        chart.zoomOutButton.disabled = true;

        let title = chart.titles.create();
        title.text = "ข้อมูลการใช้งบประมาณรายปี";
        title.fontSize = 24;
        title.align = "center";
        title.fontWeight = '400';
        title.marginBottom = 15;

        chart.colors.list = [
            am4core.color("#9370DB"),
            am4core.color("#FFB6C1"),
        ];

        chart.data = lstData ?? []

        chart.colors.step = 2;

        chart.legend = new am4charts.Legend()
        chart.legend.position = 'bottom'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.maxWidth = 95

        let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'year'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.opacity = 0;   //vertical line grid
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.minGridDistance = 40;

        let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;

        function createSeries(value, name) {
            let series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'year'
            series.name = name
            series.columns.template.tooltipText = name + ": {valueY}";

            return series;
        }

        createSeries('budgetPlan', 'งบประมาณตามแผน');
        createSeries('budgetResource', 'งบประมาณที่ใช้จริง');

        setTimeout(() => {
            chart.exporting.getImage("png").then((data) => {
                setsImgChart(data)
            });
        }, 2000);
    }


    return (
        <>
            <Grid container spacing={2} justifyContent={"center"}>
                <Grid item xs={12} >

                    <div
                        id={`chart-project`}
                        style={{
                            width: "100%",
                            height: "500px"
                        }}
                    >
                    </div>
                </Grid>
            </Grid>

        </>
    )
}

export default GraphProject

