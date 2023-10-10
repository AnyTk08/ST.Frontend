export interface HeaderProp{
    id?:string;
    key?:any;
    children?: React.ReactNode;
    style?:React.CSSProperties;
}

export interface TableProp{
    id?:string;
    key?:any;
    children?: React.ReactNode;
    renderheader?: React.ReactNode;
    renderfooter?: React.ReactNode;
    style?:React.CSSProperties;
    isShowPagination?: boolean;
    nPageIndex?: number;
    nPageSize?: number; 
    onChangePage?: any;
    nDataLength?: number;
}
export interface ColHeaderProp{
    id?:string;
    key?:any;
    children?: React.ReactNode;
    rowSpan?:number;
    colSpan?:number;
    className?:string;
    style?:React.CSSProperties;
    width?:any;
    isSticky?:boolean;
}

export interface ColBodyProp{
    key?:any;
    children?: React.ReactNode;
    rowSpan?:number;
    colSpan?:number;
    className?:string;
    style?:React.CSSProperties;
    isSticky?:boolean;
    id?:string;
}
export interface RowBodyProp{
    id?:string;
    key?:any;
    children?: React.ReactNode;
    className?:string;
    style?:React.CSSProperties;
    isExpand?:boolean;
    parentID?:string;
    level?:number;
}

