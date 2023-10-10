export interface TimePickerProps {
    id: string;
    name: string;
    label?: any;
    disabled?: boolean;
    fullWidth?: boolean;
    showIcon?: boolean;
    iconPosition?: 'left' | 'right' | undefined;
    icon?: string;
    hourFormat?: '12' | '24' | undefined;
    IsShrink?: boolean;
    onChange?: (value: any) => void;
    onBlur?: (event: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    onFocus?: (event: any) => void;
}

export interface TimePickerFormprop extends TimePickerProps {
    required: boolean;
    isMessageError?: boolean;
}

export interface TimePickerNoFormprop extends TimePickerProps {
    id: string;
    value?: string;
}