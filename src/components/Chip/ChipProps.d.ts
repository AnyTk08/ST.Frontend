export interface ChipStatusProp {
    value?: string;
}

export interface InputChipProp {
    name: string;
    value?: string;
    label?: string;
    required?: boolean;
    type?: "text" | "email" | "password" | "url";
    disabled?: boolean;
    margin?: any;
    fullWidth?: boolean;
    variant?: "outlined" | "filled" | "standard";
    style?: React.CSSProperties;
    inputPropsStyle?: React.CSSProperties;
    placeholder?: string;
    onChange?: (value: any) => void;
    onBlur?: (event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onFocus?: (event: any) => void;
    startAdornment?: any;
    endAdornment?: any;
    isMessageError?: boolean;
    arrTags?: string[];
    setArrTags?: any;
    isEditTag?: boolean;
}

interface ChipData {
    key: string;
    label: string;
    icon?: any;
}