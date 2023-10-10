interface optionsProps { 
    value: any, 
    label: any, 
    color?: any,
    Isnew?: boolean 
}
export interface SelectProps {
    id: string;
    name: string;
    label?: any;
    placeholder?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    notOptionsText?: any;
    options: optionsProps[];
    isClearable?: boolean;
    nlimitTags?: number;
    nLimits?: number;
    isSelectAll?: boolean;
    startAdornment?: any;
    style?: React.CSSProperties;
    inputPropsStyle?: React.CSSProperties;
    isPopperCustom?: boolean;
    onChange?: (value: any,event: any) => void;
    onBlur?: (event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onFocus?: (event: any) => void;
}

export interface SelectFromProps extends SelectProps {
    required: boolean;
    isMessageError?: boolean;
}

export interface SelectNoFromProps extends SelectProps {
    value?: any;
}

export interface FilmOptionType {
    label?: string;
    value: string;
    newVaue?: string;
}


interface optionsGroupProps { 
    isParent: boolean,
    sParentID?: string,
    value: string,
    label?: string,
    label_th?: string,
    label_en?: string,
}
export interface SelectGroupProps {
    id: string;
    name: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    notOptionsText?: any;
    options: optionsGroupProps[];
    nlimitTags?: number;
    startAdornment?: any;
    style?: React.CSSProperties;
    inputPropsStyle?: React.CSSProperties;
    isPopperCustom?: boolean;
    hint?: string;
    subLabel?: string;
    autoSelect?: boolean;
    IsShrink?: boolean;
    defaultSelectAll?: boolean;
    onClearOptions?: any;
    selectAllLabel?: string;
    sxCustomLabelChip?: any;
    isOptionTwoLanguage?: boolean;
    isBorderRadius?: boolean;
    onChange?: (value: any) => void;
    onBlur?: (event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onFocus?: (event: any) => void;
}

export interface SelectGroupFromProps extends SelectGroupProps {
    required: boolean;
    isMessageError?: boolean;
}

export interface SelectGroupNoFromProps extends SelectGroupProps {
    value?: any;
}