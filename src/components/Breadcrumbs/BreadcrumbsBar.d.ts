export interface BreadcrumbUIProp {
    Item: BreadcrumbItemData[];
    onClick?: (ItemKey: string) => void;
    Isfontend?: boolean;
    maxItems?: number;
}

export interface AutoBreadcrumbUIProp {
    Item?: BreadcrumbItemData[];
    onClick?: (ItemKey: string) => void;
    Isfontend?: boolean;
    maxItems?: number;
    isPreview?: boolean;
}

export interface BreadcrumbItemData {
    ItemName: any;
    Key?: string;
    sIcon?: string;
    IsOnClick?: boolean;
    Href?: string;
    Isfontend?: boolean;
}