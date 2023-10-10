import React, { useState, useEffect } from "react";
import {
    LicenseInfo,
    DataGridPro,
    GridRowModel,
    useGridApiRef,
    GridToolbarFilterButton,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridRowId,
    GridRow,
    GridCell,
} from "@mui/x-data-grid-pro";
import {
    styled,
    Box,
    Pagination,
    Stack,
    Select,
    MenuItem,
    Typography,
    TextField,
    Autocomplete,
    Button,
    Checkbox,
    Tooltip,
    Divider,
    Fab,
    FormControl,
    InputLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,

} from "@mui/material";
import { ExpandMore, ExpandLess, UnfoldMore, SaveAlt, FilterAlt, Search, } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { DataGridProp } from './DataGridProps';
import { BtnDelete } from "components/Button";
import { useForm, Controller } from "react-hook-form";
import i18n from "i18n/i18nConfig";

LicenseInfo.setLicenseKey("5b31a40e910ea0c2a35371ae57c5b5beT1JERVI6MzYzMjEsRVhQSVJZPTE2NzQyOTE1NTAwMDAsS0VZVkVSU0lPTj0x");

const GridToolbarClearFilterButton = styled(Button)(({ theme }) => ({
    fontSize: "0.8125rem",
    padding: "4px 5px",
}));

export const DataGridMui = (props: DataGridProp) => {
    const apiRef = useGridApiRef();
    let lstPageData = [];
    let lstPage = [];
    const [lstSelectRowId, setLstSelectRowId] = useState(props.arrSelect ?? []);
    const [lstDefaultSorting] = useState(null);
    const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = React.useState<GridRowId[]>([]);
    const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>(props.arrSelect ?? []);
    const [isShowFilter, setShowFilter] = useState<boolean>((props.modeFilter ?? 0) == 1);
    const handleDetailPanelExpandedRowIdsChange = (newIds: GridRowId[]) => {
        let nLastIndex = newIds.length - 1;
        let nLastId = newIds[nLastIndex];

        setDetailPanelExpandedRowIds(nLastId ? [nLastId] : []);

        if (nLastId) {
            let arrData = props.rows.arrRows.find(f => f.sID + "" == nLastId);
            if(props.onExpand){
                props.onExpand(arrData ?? [])
            }
        }
        else {
            // props.onExpand && props.onExpand(null)
            if(props.onExpand){
                props.onExpand(null)
            }
        }
    }
    const GridToolbarFilterCustomButton = styled(Button)(({ theme }) => ({
        fontSize: "0.8125rem",
        padding: "4px 5px"
    }));

    useEffect(() => {
        setSelectionModel(props.arrSelect ?? [])
    }, [props.arrSelect])

    const QuickSearchToolbar = (isFilter: boolean) => {
        return (
            <Stack direction={"column"}>
                <Stack
                    className="head-container"
                    sx={{
                        px: 0.5,
                        pb: 0.5,
                        bgcolor: "white",
                    }}
                    direction="row"
                    justifyContent="start"
                >
                    <GridToolbarContainer>
                        {props.isShowColomnTool ? <Tooltip title={"Show columns"}>
                            <GridToolbarColumnsButton />
                        </Tooltip> : null}
                        {isFilter ?
                            (props.modeFilter ?? 0) == 0 ?
                                <GridToolbarFilterButton disableTouchListener={props.isLoading} />
                                : (
                                    <Tooltip title={i18n.t("filterTabel")} >
                                        <GridToolbarFilterCustomButton id="btn_filter_on_col" onClick={() => { setShowFilter((prev) => !prev) }}>
                                            <FilterAlt sx={{ marginRight: "0.2em" }} />{i18n.t("filterTabel")}
                                        </GridToolbarFilterCustomButton>
                                    </Tooltip>
                                ) : null}
                        {isFilter &&
                            props.filterField.some(
                                (item) =>
                                    props.rows[item.sFieldName] ||
                                    (props.rows[item.sFieldName] == 0 && item.sTypeFilterMode == "select")
                            ) ? (
                            <Tooltip title={"Clear filters"}>
                                <GridToolbarClearFilterButton
                                    disabled={props.isLoading}
                                    onClick={(e) => {
                                        let cloneData = {
                                            ...props.rows,
                                            nPageIndex: 1,
                                            rows: [],
                                        };
                                        props.filterField.forEach(f => delete cloneData[f.sFieldName]);
                                        if (props.onClearFilter != null) {
                                            props.onClearFilter(cloneData)
                                        }
                                        props.onLoadData(cloneData)
                                    }}
                                >
                                    <ClearIcon sx={{ marginRight: "0.2em" }} />
                                    Clear Filter
                                </GridToolbarClearFilterButton>
                            </Tooltip>
                        ) : null}
                        {props.isExportExcel ? (
                            <Tooltip title={"Export excel"}>
                                <GridToolbarClearFilterButton
                                    disabled={props.isLoading}
                                    onClick={(e) =>  props.onExportExcel && props.onExportExcel(e)}>
                                    <SaveAlt sx={{ marginRight: "0.2em" }} />
                                    Export excel
                                </GridToolbarClearFilterButton>
                            </Tooltip>
                        ) : null}
                    </GridToolbarContainer>
                </Stack>
                {isShowFilter && (props.modeFilter ?? 0) != 0 ? (
                    CustomFilterPanel(true)
                ) : null}
            </Stack>
        );
    };

    const CustomPagination = () => {
        const nPageSize = props.rows.nPageSize;
        const nPage = props.rows.nPageIndex + (props.handleDataMode == "client" ? 1 : 0);
        const maxRowSizePerPage = nPage * nPageSize;
        const rowTotalCount = props.rows.nDataLength;
        const minRowSizePerPage = nPage > 1 ? (nPage - 1) * nPageSize + 1 : 1;
        const pageCount = Math.ceil(rowTotalCount / nPageSize);
        const sumMaxRow = rowTotalCount > maxRowSizePerPage ? maxRowSizePerPage : rowTotalCount;
        lstPage = [];
        for (let i = 0; i < pageCount; i++) {
            lstPageData.push({ label: i + 1, value: i });
            lstPage.push(<MenuItem value={i}>{i + 1}</MenuItem>);
        }

        return rowTotalCount < 1 || props.isNotShowPagination ? (
            <Box sx={{ display: "block", width: "100%", }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignContent="center"
                    sx={{ px: 2 }}
                >
                    {lstSelectRowId.length > 0 && props.onDelete != undefined ? (
                        <BtnDelete
                            id={"BtnDelete_SelectRow"}
                            txt="ลบ"
                            isCircleWithOutText={false}
                            onClick={() => props.onDelete(lstSelectRowId)}
                        />
                    ) : (
                        null
                    )}
                    <Stack justifyContent="center" sx={props.isNotShowTotal === true ? { display: "none" } : {}}>
                        <Typography>{i18n.t(["all"])} : {rowTotalCount}</Typography>
                    </Stack>
                </Stack>
            </Box>
        ) : (
            !props.isNotShowPagination && (
                <Stack
                    direction="row"
                    sx={{ px: 2, minWidth: "550px" }}
                    alignItems="center"
                    flex={1}
                    spacing={1}
                >
                    <Stack flex={1} direction={"row"} spacing={1} alignItems={"center"}>
                        {lstSelectRowId.length > 0 && props.onDelete != undefined ? (
                            <BtnDelete
                                id={"BtnDelete_SelectRow"}
                                txt="ลบ"
                                isCircleWithOutText={false}
                                onClick={() => props.onDelete(lstSelectRowId)}
                            />
                        ) : (
                            null
                        )}
                        {lstSelectRowId.length > 0 && props.renderActionSelectRow != null ? props.renderActionSelectRow : null}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography sx={{ whiteSpace: "nowrap" }}>{`${i18n.t("Table.sPage")}`}</Typography> {/* Jump To Page : */}
                        <Select
                            size="small"
                            disabled={props.isLoading}
                            autoWidth
                            sx={{
                                height: 30,
                                ".MuiOutlinedInput-notchedOutline > legend": {
                                    width: 0,
                                },
                            }}
                            value={nPage}
                            onChange={(e) => {
                                if (!props.isLoading) {
                                    let cloneData = { ...props.rows, nPageIndex: e.target.value };
                                    props.onLoadData(cloneData);
                                }
                            }}
                            MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}
                        >
                            {lstPage.map((item, index) => (
                                <MenuItem key={`JumpPage_${item.idex}`} value={index + 1}>
                                    {index + 1}
                                </MenuItem>
                            ))}
                        </Select>
                        <Typography sx={{ whiteSpace: "nowrap" }}>{`${minRowSizePerPage > sumMaxRow ? sumMaxRow : minRowSizePerPage} - ${sumMaxRow} of ${rowTotalCount}`}</Typography>
                        <Pagination
                            color="primary"
                            sx={{
                                ".MuiPagination-ul": {
                                    flexWrap: "nowrap"
                                }
                            }}
                            count={pageCount}
                            siblingCount={0}
                            boundaryCount={1}
                            page={nPage}
                            variant="outlined"
                            shape="rounded"
                            showFirstButton={true}
                            showLastButton={true}
                            size={"small"}
                            onChange={(event, value) => {
                                if (!props.isLoading) {
                                    let cloneData = { ...props.rows, nPageIndex: value };
                                    if (props.handleDataMode == "client") {
                                        cloneData.nPageIndex -= 1;
                                    } else {
                                        cloneData.arrRows = []
                                    }
                                    props.onLoadData(cloneData);
                                }
                            }}
                        />
                        <Select
                            label=""
                            size="small"
                            disabled={props.isLoading}
                            autoWidth
                            sx={{
                                height: 30,
                                ".MuiOutlinedInput-notchedOutline > legend": {
                                    width: 0,
                                },
                            }}
                            value={props.lstPageSize.indexOf(props.rows.nPageSize)}
                            onChange={(e) => {
                                if (props.handleDataMode == "client") {
                                    let cloneData = { ...props.rows, nPageIndex: 0, nPageSize: props.lstPageSize[e.target.value] };
                                    props.onLoadData(cloneData);
                                } else {
                                    apiRef.current.setPageSize(props.lstPageSize[e.target.value]);
                                }
                            }}
                        >
                            {props.lstPageSize.map((item, index) => (
                                <MenuItem key={`selPageSize_${item.index}`} value={index}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>
                </Stack>
            )
        );
    };

    const CustomFilterPanel = (isRow = false) => {
        const { register, handleSubmit, setValue, control } = useForm();
        const offsets = document.getElementById('btn_filter_on_col')?.getBoundingClientRect() ?? null;
        useEffect(() => {
            if (!props.isLoading) {
                _setValue();
            }
        }, [])

        const _setValue = () => {
            props.filterField.forEach((item, index) => {
                switch (item.sTypeFilterMode) {
                    case "input": {
                        setValue(`inp_filter_${item.sFieldName}`, props.rows[item.sFieldName])
                        break;
                    }
                    case "select": {
                        setValue(`sel_filter_${item.sFieldName}`, props.rows[item.sFieldName])
                        break;
                    }
                    case "multiselect": {
                        setValue(`mts_filter_${item.sFieldName}`, props.rows[item.sFieldName])
                        break;
                    }
                }
            })
        }

        const _onSubmit = (e) => {
            let cloneData = {
                nPageSize: props.rows.nPageSize,
                nPageIndex: 1,
                sSortExpression: "",
                sSortDirection: "",
                rows: [],
            };
            props.filterField && props.filterField.forEach((item) => {
                switch (item.sTypeFilterMode) {
                    case "input": {
                        const data = e[`inp_filter_${item.sFieldName}`];
                        const typeData = typeof data
                        if (typeData.toString() != "undefined" && data.toString().length > 0) {
                            cloneData[item.sFieldName] = data;
                        }
                        break;
                    }
                    case "select": {
                        const data = e[`sel_filter_${item.sFieldName}`];
                        const typeData = typeof data
                        if (typeData.toString() != "undefined" && data.toString().length > 0) {
                            cloneData[item.sFieldName] = data;
                        }
                        break;
                    }
                    case "multiselect": {
                        const data = e[`mts_filter_${item.sFieldName}`];
                        const typeData = typeof data
                        if (typeData.toString() != "undefined" && data.toString().length > 0) {
                            cloneData[item.sFieldName] = data;
                        }
                        break;
                    }
                }
            });
            if (props.isCustomOnFilter) {
                props.onFilterCustom(cloneData, e);
            } else {
                if(props.onLoadData){
                    props.onLoadData(cloneData)
                }
            }
        };

        return (
            <div style={{ maxHeight: 200, overflow: "auto", width: "100%", marginBottom: isRow ? "1em" : "" }}>
                <form onSubmit={handleSubmit(_onSubmit)}>
                    <Stack style={{ padding: "10px" }} justifyContent={isRow ? "end" : "start"} direction={isRow ? "row" : "column"} spacing={1}
                        sx={isRow ? {
                            border: "1px #0168cc solid",
                            mx: "1em",
                            borderRadius: "10px",
                            // minWidth: "800px",
                            ":before": {
                                content: '""',
                                position: "absolute",
                                left: offsets != null ? `${offsets.left - 10}px` : "4em",
                                top: "2.5em",
                                borderLeft: "5px solid transparent",
                                borderRight: "5px solid transparent",
                                borderBottom: " 5px solid #0168cc",
                            }
                        } : null}
                    >
                        {props.filterField.map((item) => {
                            const labelFilter = item.sLabel
                                ? item.sLabel
                                : props.columns.find((f) => f.field === item.sFieldName).headerName;
                            switch (item.sTypeFilterMode) {
                                case "input": {
                                    return (
                                        <TextField
                                            id={`inp_filter_${item.sFieldName}`}
                                            key={`tf_${item.sFieldName}`}
                                            type={item.sType ?? "text"}
                                            disabled={props.isLoading}
                                            inputProps={{
                                                inputMode:
                                                    item.sInputMode ?? "text",
                                            }}
                                            size="small"
                                            autoComplete="off"
                                            label={labelFilter}
                                            name={`inp_filter_${item.sFieldName}`}
                                            {...register(`inp_filter_${item.sFieldName}`)}
                                        />
                                    );
                                }
                                case "select": {
                                    return (
                                        <Controller
                                            control={control}
                                            defaultValue={""}
                                            name={`sel_filter_${item.sFieldName}`}
                                            render={({ field }) => (
                                                <Box minWidth={140} >
                                                    <FormControl fullWidth disabled={props.isLoading} size="small" >
                                                        <InputLabel disabled={props.isLoading} size="small" id={`lbl_sel_filter_${item.sFieldName}`} >{labelFilter}</InputLabel>
                                                        <Select
                                                            fullWidth
                                                            label={labelFilter}
                                                            variant="outlined"
                                                            disabled={props.isLoading}
                                                            size="small"
                                                            key={`sel_${item.sFieldName}`}
                                                            id={`sel_filter_${item.sFieldName}`}
                                                            {...field}
                                                        >
                                                            {(item.optionSelect ?? []).map((op, indexOp) => {
                                                                return (
                                                                    <MenuItem value={op.value} key={`sel_op_${op.value}`}>
                                                                        {op.label}
                                                                    </MenuItem>
                                                                )
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            )}
                                        />
                                    );
                                }
                                case "multiselect": {
                                    return (
                                        <Controller
                                            control={control}
                                            defaultValue={[]}
                                            name={`mts_filter_${item.sFieldName}`}
                                            render={({ field }) => (
                                                <Tooltip placement="top" title={(field.value ?? []).map(m => m.label).join(", ")}>
                                                    <Box minWidth={140} >
                                                        <Autocomplete
                                                            fullWidth
                                                            disabled={props.isLoading}
                                                            size="small"
                                                            key={`mts_${item.sFieldName}`}
                                                            id={`mts_filter_${item.sFieldName}`}
                                                            options={(item.optionSelect ?? []).filter(f => !(field.value ?? []).map(m => m.value).includes(f.value))}
                                                            multiple
                                                            limitTags={2}
                                                            getOptionLabel={(option) => option.label}
                                                            renderInput={(param) => {
                                                                return (<TextField
                                                                    {...param}
                                                                    id={`mts_inp_filter_${item.sFieldName}`}
                                                                    key={`mts_tf_${item.sFieldName}`}
                                                                    disabled={props.isLoading}
                                                                    size="small"
                                                                    autoComplete="off"
                                                                    label={labelFilter}
                                                                />)
                                                            }}
                                                            {...field}
                                                            onChange={(e, value) => {
                                                                field.onChange([...value])
                                                            }}
                                                        />
                                                    </Box>
                                                </Tooltip>
                                            )}
                                        />
                                    );
                                }
                            }
                        })}
                        <Tooltip title={"Search"}>
                            <Fab
                                type="submit"
                                sx={{ width: 40, height: 40, zIndex: 1 }}
                                color="primary"
                                aria-label="search"
                            >
                                <Search />
                            </Fab>
                        </Tooltip>
                    </Stack>
                </form>
            </div>
        );
    };

    return (
        props.isExpan ?
            <DataGridPro
                sx={{
                    "minHeight": (props.rows.arrRows.length < props.maxRowNoScroll ? 0 : props.minHeightCustom),
                    " .MuiDataGrid-main": {
                        overflowX: "hidden",
                        overflowY: "auto",
                        ".MuiDataGrid-columnHeaders > .MuiDataGrid-columnHeadersInner > .MuiDataGrid-columnHeader--sortable > .MuiDataGrid-columnHeaderDraggableContainer > div ":
                        {
                            ".MuiDataGrid-iconButtonContainer": {
                                visibility: "initial",
                                width: "auto",
                            },
                            ".MuiDataGrid-columnHeaderTitle": {
                                overflow: "visible",
                            },
                        },
                    },
                    " .MuiDataGrid-columnHeaders": {
                        "background": props.backgroundHeaderCustom,
                    },
                    " .MuiDataGrid-cell": {
                        color: "#333333",
                        ".MuiDataGrid-detailPanelToggleCell.Mui-disabled": {
                            display: "none"
                        }
                    },
                    " .MuiDataGrid-footerContainer": {
                        overflowX: "auto",
                        overflowY: "hidden",
                        maxWidth: "100vw",
                        backgroundColor: "rgba(255,255,255,0.95)",
                    },
                    ".MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
                        borderRight: `1px solid rgba(224, 224, 224, 1)`,
                    },
                    " .MuiDataGrid-columnSeparator": {
                        opacity: "0!important",
                    },
                    " .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
                        borderBottom: `1px solid rgba(224, 224, 224, 1)`,
                    },
                    " .row-odd": {
                        bgcolor: "#F1F1F1",
                    },
                    ".MuiDataGrid-row": {
                        borderTop: "0.1px solid rgba(0,0,0,0.2) !important"
                    },
                    ".MuiDataGrid-detailPanel": {
                        zIndex: 1,
                    },
                    ".MuiDataGrid-columnHeaderTitleContainer": {
                        border: "none"
                    },
                    ...props.sxCustomTable,
                }}
                columns={props.columns}
                initialState={{ pinnedColumns: { left: props.listFixL, right: props.listFixR } }}
                rows={props.isLoading ? [] : props.rows?.arrRows}
                rowReordering={props.rowReordering}
                onRowOrderChange={props.onRowOrderChange}
                density="compact"
                localeText={{
                    columnsPanelHideAllButton: "ซ่อนทั้งหมด",
                    columnsPanelShowAllButton: "แสดงทั้งหมด",
                    columnsPanelTextFieldLabel: "ค้นหาคอลัมน์",
                    columnsPanelTextFieldPlaceholder: "คอลัมน์",
                    toolbarColumns: "คอลัมน์",
                    checkboxSelectionHeaderName: "เลือก",
                    toolbarFilters: "ตัวกรอง",
                }}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? "row-even" : "row-odd"
                }
                getRowId={(item) => item.sID}
                pagination
                disableSelectionOnClick
                apiRef={apiRef}
                checkboxSelection={props.isShowCheckBox}
                loading={props.isLoading}
                autoHeight={true}
                getRowHeight={() => 'auto'}
                onSelectionModelChange={(itm) => {
                    setLstSelectRowId(itm as any);
                    const selectedIDs = new Set(itm);
                    props.rows.arrRows.filter((row) =>
                        selectedIDs.has(row.sID)
                    );
                    //props.onSelect(selectedRows) //ปิดเพราะพอเรียก OnDelete แล้ว error
                }}
                experimentalFeatures={props.experimentalFeatures}
                columnGroupingModel={props.columnGroupingModel}
                hideFooterSelectedRowCount
                components={{
                    FilterPanel:
                        !props.isHiddenToolHead && props.filterField?.length > 0 && !props.isLoading
                            ? props.customFilterPanel
                            : () => null,
                    Toolbar: () =>
                        !props.isHiddenToolHead ? QuickSearchToolbar(props.filterField?.length > 0) : null,
                    Pagination: CustomPagination as any,
                    NoRowsOverlay: props.customNoRowsOverlay,
                    ColumnSortedDescendingIcon: () => <ExpandMore sx={{ color: "white" }} />,
                    ColumnSortedAscendingIcon: () => <ExpandLess sx={{ color: "white" }} />,
                    ColumnUnsortedIcon: () => <UnfoldMore sx={{ fontSize: "1em", color: "white" }} />,
                }}
                disableColumnMenu={props.isDisableColumnMenu}
                onPageSizeChange={(pageSize) => {
                    let cloneData = {
                        ...props.rows,
                        nPageSize: pageSize,
                        nPageIndex: 1,
                        rows: [],
                    };
                    props.onLoadData(cloneData);
                }}
                isRowSelectable={props.onRowSelectable}
                rowThreshold={0}
                getDetailPanelHeight={
                    props.contentExpand
                        ? () =>
                            props.nExpandRowLength > 0 ?
                                ((props.nExpandRowLength <= 2) ? 230 : props.nExpandRowLength * 65) :
                                props.nExpandRowLength === 0 ? 220 : 0
                        : null as any
                }
                getDetailPanelContent={(row) => props.contentExpand ? props.contentExpand(row) : null}
                detailPanelExpandedRowIds={detailPanelExpandedRowIds.length > 0 ? detailPanelExpandedRowIds : [] as any}
                onDetailPanelExpandedRowIdsChange={
                    handleDetailPanelExpandedRowIdsChange
                }
            />
            :
            <DataGridPro
                className={`${props.isShowGridLine ? "show-line" : "hide-line"}`}
                sx={{
                    ".MuiDataGrid-row": {
                        minHeight: props.minHeightCustom == 1 ? "" : "39px !important",
                    },
                    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': { //ปิด กรอบฟ้า ตอน Focus ช่องนั้นๆ
                        outline: 'none',
                    },
                    ...props.sxCustomTable,
                }}
                density="compact"
                localeText={{
                    columnsPanelHideAllButton: i18n.t("columnsPanelHideAllButton"),
                    columnsPanelShowAllButton: i18n.t("columnsPanelShowAllButton"),
                    columnsPanelTextFieldLabel: i18n.t("columnsPanelTextFieldLabel"),
                    columnsPanelTextFieldPlaceholder: i18n.t("columnsPanelTextFieldPlaceholder"),
                    toolbarColumns: i18n.t("toolbarColumns"),
                    checkboxSelectionHeaderName: i18n.t("checkboxSelectionHeaderName"),
                    noRowsLabel: i18n.t('noData'),
                    toolbarFilters: i18n.t("filterTabel"),
                }}
                rows={props.isLoading ? [] : props.rows?.arrRows || []}
                getRowId={(item) => {
                    return item.sID
                }}
                columns={props.columns}
                initialState={{ pinnedColumns: { left: props.listFixL, right: props.listFixR } }}
                pagination
                disableSelectionOnClick={true}
                apiRef={apiRef}
                checkboxSelection={props.isShowCheckBox}
                loading={props.isLoading}
                autoHeight={true}
                disableColumnReorder={props.isDisableColumnReorder}
                selectionModel={selectionModel}
                onSelectionModelChange={(itm, detail) => {
                    setLstSelectRowId(itm);
                    if(props.setArrSelect){
                        props.setArrSelect(itm);
                    }
                    setSelectionModel(itm);
                }}
                experimentalFeatures={props.experimentalFeatures}
                columnGroupingModel={props.columnGroupingModel}
                filterMode={props.handleDataMode}
                paginationMode={props.handleDataMode}
                onRowClick={props.onCickRow}
                sortingMode={props.handleDataMode}
                pageSize={props.rows.nPageSize}
                rowCount={props.rows.nDataLength}
                page={props.rows.nPageIndex}
                disableMultipleColumnsSorting
                hideFooter={props.isHideFooter ? true : false}
                onSortModelChange={(model, detail) => {
                    if (model.length > 0) {
                        let cloneData = {
                            ...props.rows,
                            sSortExpression: model[0].field,
                            sSortDirection: model[0].sort,
                            arrRows: [],
                        };
                        if(props.onLoadData){
                            props.onLoadData(cloneData)
                        }
                    } else {
                        let cloneData = {
                            ...props.rows,
                            sSortExpression: lstDefaultSorting?.sSortExpression || "",
                            sSortDirection: lstDefaultSorting?.sSortDirection || "",
                            arrRows: [],
                        };
                        if(props.onLoadData){
                            props.onLoadData(cloneData)
                        }
                    }
                }}
                hideFooterSelectedRowCount
                components={{
                    ColumnResizeIcon: (() => <Divider variant="middle" flexItem orientation="vertical" />),
                    DetailPanelExpandIcon: (() => <ExpandMoreIcon />),
                    DetailPanelCollapseIcon: (() => <ExpandLessIcon />),
                    FilterPanel:
                        !props.isHiddenToolHead && props.filterField?.length > 0
                            ? () => CustomFilterPanel((props.modeFilter ?? 0) == 1)
                            : () => null,
                    Toolbar: () =>
                        !props.isHiddenToolHead ? QuickSearchToolbar(props.filterField?.length > 0) : null,
                    Pagination: CustomPagination,
                    NoRowsOverlay: props.customNoRowsOverlay,
                    Row: (row) => {
                        if ((row.row["subData"] ?? []).length > 0) {
                            return (
                                <Accordion disableGutters elevation={0} square defaultExpanded={lstSelectRowId.some(s => (row.row["subData"] ?? []).map(m => m.sID).includes(s))} >
                                    <AccordionSummary
                                        sx={{
                                            flexDirection: 'row-reverse',
                                            ".MuiAccordionSummary-content": {
                                                alignItems: "center !important"
                                            }
                                        }}
                                        expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.9rem' }} />}
                                    >
                                        {props.isShowCheckBox ? <Checkbox size="small" sx={{ fontSize: '0.9rem' }}
                                            onChange={(e, checked) => {
                                                if (checked) {
                                                    (row.row["subData"] ?? []).forEach(f => {
                                                        lstSelectRowId.push(f.sID)
                                                    })
                                                    setLstSelectRowId([...lstSelectRowId])
                                                } else {
                                                    setLstSelectRowId(lstSelectRowId.filter(f => !(row.row["subData"] ?? []).map(m => m.sID).includes(f)))
                                                }
                                            }}
                                            defaultChecked={lstSelectRowId.some(s => s == row.row.sID)} /> : null}   {row.row[props.groupRowByField]}
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: 0 }} >
                                        {(row.row["subData"] ?? []).map((item, index) => {
                                            const dataRow = {
                                                ...row,
                                                index: index,
                                                row: item,
                                                rowId: item.sID,
                                            };
                                            return (
                                                <Stack {...row} direction="row" className="row-collapse" sx={{ border: "1px solid rgba(224, 224, 224, 1)", borderBottom: "none" }} >
                                                    {(dataRow.renderedColumns ?? []).map((ele, indexEle) => {
                                                        ele.value = item[ele.field];
                                                        if (ele.type === "checkboxSelection") {
                                                            return (
                                                                <Stack direction="column" alignItems={ele.align}
                                                                    key={`checkbox_${ele.value}`}
                                                                    sx={{
                                                                        display: ele.hide ? "none" : "flex",
                                                                        padding: "0",
                                                                        width: ele.computedWidth,
                                                                        flex: ele.flex,
                                                                        minWidth: ele.minWidth
                                                                    }}>
                                                                    <Checkbox
                                                                        key={`checkbox_${ele.value}`}
                                                                        size="small"
                                                                        sx={{ fontSize: '0.9rem' }}
                                                                        defaultChecked={lstSelectRowId.some(s => s == item.sID)}
                                                                        onChange={(e, checked) => {
                                                                            if (checked) {
                                                                                lstSelectRowId.push(item.sID)
                                                                                setLstSelectRowId([...lstSelectRowId])
                                                                            } else {
                                                                                setLstSelectRowId(lstSelectRowId.filter(f => f != item.sID))
                                                                            }
                                                                        }}
                                                                    /></Stack>);
                                                        } else {
                                                            return (<Stack
                                                                key={`checkbox_${ele.value}`}
                                                                direction="column"
                                                                alignItems={ele.align} sx={{
                                                                    display: ele.hide ? "none" : "flex",
                                                                    padding: "10px 0",
                                                                    width: ele.computedWidth,
                                                                    flex: ele.flex,
                                                                    minWidth: ele.minWidth
                                                                }}>{ele.value}</Stack>);
                                                        }
                                                    })}
                                                </Stack>
                                            );
                                        })}
                                    </AccordionDetails>
                                </Accordion>
                            );
                        } else {
                            return <GridRow {...row} />;
                        }
                    },
                    Cell: (cell) => {
                        let columnData = props.columns.find(f => f.field === cell.field)
                        let headColumn = props.columns.find(f => (f.isHeadMobile ?? false))
                        let nIndexOfActionColumn = 0;
                        if ((columnData?.headerName ?? null) == null && props.columns.some(s => (s.headerName ?? null) == null)) {
                            nIndexOfActionColumn = props.columns.filter(s => (s.headerName ?? null) == null).findIndex(f => f.field == cell.field);
                        }
                        return <GridCell  {...cell} 
                        className={`${headColumn != null && (headColumn?.field ?? "") === (columnData?.field ?? "") 
                        ? "head-cell" : ""} ${(columnData?.headerName ?? null) == null ? (cell.field === "__check__") 
                        ? "checkbox-actions" : `cell-actions-${nIndexOfActionColumn}` : ""}`} 
                        data-columnname={columnData?.headerName ?? null} />
                    },
                    ColumnSortedDescendingIcon: () => <ExpandMore style={{ fontSize: "1em", color: '#ffffff' }} />,
                    ColumnSortedAscendingIcon: () => <ExpandLess style={{ fontSize: "1em", color: '#ffffff' }} />,
                    ColumnUnsortedIcon: () => <UnfoldMore style={{ fontSize: "1em", color: '#ffffff' }} />,
                }}
                disableColumnMenu={props.isDisableColumnMenu}
                onPageSizeChange={(pageSize) => {
                    let cloneData = {
                        ...props.rows,
                        nPageSize: pageSize,
                        nPageIndex: 1,
                        rows: [],
                    };
                    if(props.onLoadData){
                        props.onLoadData(cloneData)
                    }
                }}
                isRowSelectable={props.onRowSelectable}
                rowThreshold={0}
                getDetailPanelHeight={(p) => {
                    return props.getDetailPanelHeight ?? "auto"
                }}
                getDetailPanelContent={props.getDetailPanelContent}
                disableVirtualization={true}
                rowReordering={props.rowReordering}
                onRowOrderChange={props.onRowOrderChange}
                getRowHeight={(p) => {
                    if ((props.rows.arrRows ?? []).some(s => s["subData"])) {
                        return props.isShowCheckBox ? 62 : 48
                    }
                    return "auto"
                }}
            />
    )
}

export const initRows: PaginationInterface = {
    nPageIndex: 1,
    nPageSize: 10,
    arrRows: [],
    nDataLength: 0,
    sSortExpression: "",
    sSortDirection: "",
    sID: "",
};
export interface PaginationInterface {
    nPageIndex: number;
    nPageSize: number;
    arrRows: GridRowModel[];
    nDataLength: number;
    sSortExpression: string;
    sSortDirection: string;
    sID: string;
}

const defaultProp: DataGridProp = {
    rows: initRows,
    isLoading: false,
    isNotShowPagination: false,
    isShowGridLine: true,
    isNotShowTotal: false,
    isShowCheckBox: false,
    filterField: [],
    isDisableColumnMenu: true,
    lstPageSize: [10, 25, 50, 100],
    backgroundHeaderCustom: "#5697fb",
    maxRowNoScroll: 10,
    minHeightCustom: 500,
    isCustomOnFilter: false,
    isHiddenToolHead: false,
    handleDataMode: "server",
    sxCustomHeader: { color: '#5697fb' },
    isDisableColumnReorder: true,
    isExpan: false,
    isShowColomnTool: true,
    expandRowLength: 0,
    columns: [],
    onLoadData: () => { },
    listFixL: [],
    listFixR: [],
}
DataGridMui.defaultProps = defaultProp;

export default DataGridMui;