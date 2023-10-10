interface DatePickerProps {
    label?: string; /**ชื่อข้อความ */
    disabled?: boolean;
    id?: any;
    name: string;
    fullWidth?: boolean; /**ขนาดเต็ม */
    variant?: "outlined" | "filled" | "standard";
    styles?: React.CSSProperties;
    format?:string; /**รูปแบบ */
    minDate?:any; /**กำหนวดวันน้อยสุด */
    maxDate?:any; /**กำหนดวันมากสุด */
    shouldDisableDate?:boolean;
    shouldDisableYear?:boolean;
    isShowIcon?:boolean;
    isMessageError?:boolean;
    view?:any; /** รูปแบบ ["year", "month", "day"] */ 
    IsShrink?:boolean;
    onChange?: (value: any) => void;
    onBlur?: (event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onFocus?: (event: any) => void;
    onDisableDay?: (day: any) => boolean;
}

export interface DatePickerFromProps extends DatePickerProps {
    required: boolean;
}
export interface DatePickerNoFromProps extends DatePickerProps {
    value?: any;
}

export interface DateRangePickerFromProp {
    required: boolean;
    labelStart?: string;
    labelEnd?: string;
    nameStart: string;
    nameEnd: string;
    disabled?: boolean;
    view?: any; /** รูปแบบ ["year", "month", "day"] */ 
    format?: string;
    minDateStart?:any; /**กำหนวดวันน้อยสุด */
    maxDateEnd?:any; /**กำหนดวันมากสุด */
    IsShrink?:boolean;
    onChange?: (value: any) => void;
} 

export interface DateRangePickerProFromProps {
    name: string;
    required: boolean;
    disabled?:boolean;
    view?: any; /** รูปแบบ ["year", "month", "day"] */ 
    format?:string; /** "DD/MM/YYYY" */ 
    labelStart?: string;
    labelEnd?:string;
    calendarsCount?: 1 | 2 | 3;
    minDate?:any;  /** กำหนวดวันน้อยสุด */
    maxDate?:any;  /** กำหนดวันมากสุด */
    defaultCalendarMonth?: any;  
    disablePast?:boolean;
    isAllPopup?:boolean;
    IsShrink?:boolean;
    onChange?: (value: any) => void;
} 