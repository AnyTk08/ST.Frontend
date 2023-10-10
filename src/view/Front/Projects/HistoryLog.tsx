import { Grid } from "@mui/material";
import AccordionCustom from "components/Accordion/AccordionCustom";
import React, { useEffect, useState } from "react";
import { GridColumns } from "@mui/x-data-grid-pro";
import DataGrid, { PaginationInterface, initRows } from "components/DataGrid";
import { AxiosGet } from "utilities/ST_Axios";

const HistoryLog = (props) => {

    const { nAreaID } = props;
    const [IsLoadingHistory, setLoadingHistory] = useState(false);

    const [DataRowHistory, setDataRowHistory] =
        useState<PaginationInterface>({
            ...initRows,
            sSortExpression: "sDateAction",
            sSortDirection: "desc",
        });

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
        GetHistoryLog(DataRowHistory);
    }, [nAreaID]);

    const GetHistoryLog = (dataPagination) => {
        setLoadingHistory(true);
        let param =
        {
            nAreaID: nAreaID,
            nPageSize: dataPagination.nPageSize,
            nPageIndex: dataPagination.nPageIndex,
            sSortExpression: dataPagination.sSortExpression,
            IsASC: dataPagination.sSortDirection === "asc",
            IsDESC: dataPagination.sSortDirection === "desc"
        }
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


    return (
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
    );
}

export default HistoryLog;