interface TextBoxProps {
    id: string;
    name: string;
    label?: string;
    placeholder?: string;
    isShowTextCont?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    startAdornment?: any;
    endAdornment?: any;
    maxLength: number;
    margin?: any;
    type?: "text" | "email" | "password" | "url";
    variant?: "outlined" | "filled" | "standard";
    lang?: "th" | "en" | undefined;
    multiline?: boolean;
    rows?: number;
    style?: React.CSSProperties;
    inputPropsStyle?: React.CSSProperties;
    IsShrink?: boolean;
    onChange?: (value: any) => void;
    onBlur?: (event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onFocus?: (event: any) => void;
}

interface TextBoxNumber {
    id: string;
    name: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    isMessageError?: boolean;
    margin?: any;
    style?: React.CSSProperties;    
    textAlign?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    variant?: "filled" | "standard" | "outlined" | undefined;
    startAdornment?: any;
    endAdornment?: any;
    suffix?: string; //End Adornment อีกแบบ
    maxInteger?: number,
    maxDigits?: number,
    isExponential?: boolean; //เลขคณิต 3.1017E+12
    ShowDigits?: number; //ถ้า ใช้ isExponential == True และ Show Digits จะได้ ค่า Digits ตาม maxDigits แต่แสดงตาม ShowDigits //// ถ้า ไม่ได้ใช้ isExponential == False และ ShowDigits จะกลายเป็น maxInteger
    IsShrink?: boolean;
    IsShowDigits?: boolean; //โชว์จำนวณ Digit กรณีที่ไม่ได้กรอก Digit มาจะ Set Format Digit (0.00)s
    onChange?: (value: any, event: any) => void;
    onBlur?: (value: any, event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onFocus?: (event: any) => void;
}

export interface TextBoxFormprop extends TextBoxProps {
    required: boolean;
    isMessageError?: boolean;
}

export interface TextBoxNoFormprop extends TextBoxProps {
    id: string;
    value?: string;
}

export interface TextBoxNumberFormprop extends TextBoxNumber {
    required?: boolean;
}

export interface TextBoxNumberNoFormprop extends TextBoxNumber {
    value?: string;
    mode?: "Table";
}

export interface TextBoxBasicNumberFormprop {
    name: string;
    id?: string;
    required?: boolean;
    type?: "text";
    isNumberOnly?: "number";
    label?: string;
    placeholder?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    sx?: any;
    prefix?: string;
    autoComplete?: string;
    startAdornment?: any;
    endAdornment?: any;
    maxRow?: number;
    maxLength?: number;
    multiline?: boolean;
    rows?: number;
    margin?: 'dense' | 'none';
    fullWidth?: boolean;
    hidden?: boolean;
    rounded?: boolean;
    sxLabel?: any;
    decimalPoint?: number;
    isMessageError?: boolean;
    isShowMaxLength?: boolean;
    IsShrink?: boolean;
    onChange?: (event: any) => void;
    onBlur?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onPaste?: (event: any) => void;
}

export interface TextBoxPasswordFormprop {
    id: string;
    name: string;
    required?: boolean;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    maxLength: number;
    type?: "text" | "email" | "password" | "url";
    variant?: "outlined" | "filled" | "standard";
    startAdornment?: any;
    endAdornment?: any;
    margin?: any;
    fullWidth?: boolean;
    style?: React.CSSProperties;
    inputPropsStyle?: React.CSSProperties;
    isMessageError?: boolean;
    IsShrink?: boolean;
    onChange?: (value: any) => void;
    onBlur?: (event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onFocus?: (event: any) => void;
}