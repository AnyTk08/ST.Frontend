export interface SwitchProps {
    name: string;
    label?: string;
    labelRight?: string;
    isNoLabel?: boolean;
    required?: boolean;
    value?: boolean;
    LeftText?: string;
    RightText?: string;
    width?: number;
    onChange?: (value: any) => void;
    onBlur?: (event: any) => void;
    disabled?: boolean;
    styleSwitch?: React.CSSProperties;
    externalErrorMessage?: string;
    offColor?: string;
    onColor?: string;
    IsClassName?: boolean;
}

export interface SwitchFromProps extends SwitchProps { required?: boolean; name: string; }
export interface SwitchNoFromProps extends SwitchProps { value?: any; name?: string; }