import { ResponsiveStyleValue, SxProps, SystemProps } from '@mui/system';
import DataGridMui from './index';
import { GridColumnGroupingModel } from '@mui/x-data-grid-pro';
export interface FilterFieldInterface {
    sFieldName: string;
    sLabel?: string;
    sInputMode?:
    | "text"
    | "numeric"
    | "none"
    | "search"
    | "email"
    | "decimal"
    | "tel"
    | "url";
    sTypeFilterMode: "input" | "select" | "multiselect" | "daterange";
    sType?: string;
    optionSelect?: OptionSelect[];
}

export interface OptionSelect {
    value: any;
    label: any;
    keyId: any;
}


export interface DataGridProp {
    columns: GridColumns;
    onLoadData: (dataPagination: any) => void;
    rows?: PaginationInterface;
    isHiddenToolHead?: boolean;
    modeFilter?:number;
    isLoading?: boolean;
    groupRowByField?: string;
    isShowCheckBox?: boolean;
    isDisableColumnMenu?: boolean;
    filterField?: FilterFieldInterface[];
    onDelete?: (value: any) => void;
    isNotShowTotal?: boolean;
    isNotShowPagination?: boolean;
    lstPageSize?: Array;
    backgroundHeaderCustom?: string;
    sxCustomHeader?: SxProps<Theme>;
    sxCustomTable?: SxProps<Theme>;
    maxRowNoScroll?: number;
    minHeightCustom?: number;
    onCickRow?: (event: any) => void;
    isCustomOnFilter?: boolean;
    onFilterCustom?: (data: any, event: any) => void;
    onExportExcel?: (event: any) => void;
    isExportExcel?: boolean;
    handleDataMode?: "server" | "client";
    contentExpand?: any;
    onExpand?: (event: any) => void;
    expandRowLength?: number;
    id?: string;
    getDetailPanelContent?: any;
    getDetailPanelHeight?: any;
    isRowReordering?: boolean;
    onRowOrderChange?: (event: any) => void;
    isHideFooter?: boolean;
    arrSelect?: Array;
    setArrSelect?: any;
    isDisableColumnReorder?: boolean;
    isExpan?: boolean;
    onExpandRowLength?: any;
    rowReordering?: any;
    sxCustomTable?: any;
    onRowSelectable?: (params: GridRowParams<any>) => boolean;
    nExpandRowLength?: number;
    customFilterPanel?: any;
    onClearFilter?: (event: any) => void;
    customNoRowsOverlay?: any;
    isShowGridLine?:boolean;
    isShowColomnTool?:boolean;
    renderActionSelectRow?:any;
    experimentalFeatures?: Partial<GridExperimentalProFeatures>;
    columnGroupingModel?: GridColumnGroupingModel;
    listFixL: PropTypes.object,
    listFixR: PropTypes.object,
}
