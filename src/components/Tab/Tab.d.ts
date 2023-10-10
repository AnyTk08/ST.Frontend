export interface TabItemProp{
    id:string;
    children?: React.ReactNode;
}
export interface TabsProp{
    children?: React.ReactNode;
    defaultTab?:string;
    onTabChange?: (TabID: any) => void;
}

export interface TabContentProp{
    children?: React.ReactNode;
}
export interface TabPanelProp{
    id:string;
    children?: React.ReactNode;
}