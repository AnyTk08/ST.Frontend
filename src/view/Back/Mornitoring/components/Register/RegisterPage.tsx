import { useMemo } from 'react'
import { Grid } from '@mui/material';
import { BtnViewDataOnTable } from 'components/Button';
import DataGridMui, { PaginationInterface } from 'components/DataGrid';
import { GridColumns } from '@mui/x-data-grid-pro';
import { createColumn } from 'view/Front/Graph/PageGraph';
import { TypeModeBtn } from 'components/enum/enumSystem';
import { useNavigate } from 'react-router';

const RegisUpdatePage = (props) => {

    const { dataRow, loadData, LoadingTable,isRegister } = props;
    const navigate = useNavigate();

    const lstData: PaginationInterface = useMemo(() => {
        return dataRow;
    }, [dataRow])


    //#region dataColumn
    const dataColumnRegister: GridColumns = [
        createColumn("nRow", "ที่", false, "center", 1, 50, (item) => { return (<>{item.value}.</>) }, "center"),
        createColumn("sNameProject", "ชื่อโครงการ", true, "center", 5, 200),
        createColumn("sArea", "พื้นที่ดำเนินการ", true, "center", 3, 150),
        createColumn("sUnitname", "หน่วยงานรับผิดชอบ", true, "center", 2, 100, (item) => { return (<>{item.value}</>) }, "center"),
        createColumn("sDate", "ระยะเวลาดำเนินการ", true, "center", 2, 200, (item) => { return (<>{item.value}</>) }, "center"),
        createColumn("sBudget", "งบประมาณใช้จริงสะสม (บาท)", true, "center", 2, 100, (item) => { return (<>{item.value}</>) }, "center"),
        createColumn("sUpdateDate", "แก้ไขล่าสุด", true, "center", 2, 100, (item) => { return (<>{item.value}</>) }, "center"),
        createColumn("sStatus", "สถานะ", true, "center", 2, 100),
        createColumn("sAction", "ดำเนินการโดย", true, "center", 2, 100),
    ];

    const dataColumnUpdate: GridColumns = [
        createColumn("nRow1", "", false, "center", 2, 40, (item) => {
            return (
                <>
                    <BtnViewDataOnTable
                        id={"btnview-" + item.row.sID}
                        onClick={() => goToDetailProject(item.row.nProjectID, TypeModeBtn.ViewProject, item.row.nAreaID, 1)}
                    />
                </>
            )
        }, "center"),
        createColumn("nRow", "ที่", false, "center", 1, 50, (item) => { return (<>{item.value}.</>) }, "center"),
        createColumn("sNameProject", "ชื่อโครงการ", true, "center", 5, 200),
        createColumn("sArea", "พื้นที่ดำเนินการ", true, "center", 3, 150),
        createColumn("sUnitname", "หน่วยงานรับผิดชอบ", true, "center", 2, 100, (item) => { return (<>{item.value}</>) }, "center"),
        createColumn("sDate", "ระยะเวลาดำเนินการ", true, "center", 2, 200, (item) => { return (<>{item.value}</>) }, "center"),
        createColumn("sBudget", "งบประมาณใช้จริงสะสม (บาท)", true, "center", 2, 100, (item) => { return (<>{item.value}</>) }, "center"),
        createColumn("sUpdateDate", "แก้ไขล่าสุด", true, "center", 2, 100, (item) => { return (<>{item.value}</>) }, "center"),
        createColumn("sStatus", "สถานะ", true, "center", 2, 100),
        createColumn("sAction", "ดำเนินการโดย", true, "center", 2, 100),
    ];
    //#endregion

    const goToDetailProject = (nProjectID, sModeBtn, nAreaID, nRequestTypeID) => {
        navigate(`/project-report`,
            {
                state:
                {
                    nProjectID: nProjectID,
                    nAreaID: nAreaID,
                    sModeBtn: TypeModeBtn.ViewProject,
                    nRequestTypeID: nRequestTypeID,
                }
            }
        );
    };
    return (
        <Grid container spacing={1} >
            <Grid item xs={12}>
                <DataGridMui
                    isLoading={LoadingTable}
                    columns={ isRegister ? dataColumnRegister : dataColumnUpdate}
                    isHiddenToolHead={true}
                    isNotShowTotal
                    isHideFooter={lstData.arrRows.length === 0}
                    rows={lstData}
                    onLoadData={loadData}
                />
            </Grid>
        </Grid>
    )
}

export default RegisUpdatePage
