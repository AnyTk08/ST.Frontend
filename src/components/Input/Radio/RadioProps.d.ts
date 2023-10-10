interface OptionsRadioProps { value: any, label: any, color?: any, Isnew?: boolean, disabled?: boolean, }

export interface RadioProps {
    id: string;
    name: string;
    options: OptionsRadioProps[];
    label?: string;
    required?: boolean;
    value?: string;
    onChange?: (value: any) => void;
    onBlur?: (event: any) => void;
    disabled?: boolean;
    row?: boolean;
    isNoLabel?: boolean;
    styleRadio?: React.CSSProperties;
    isshowTextCont?: boolean;
}

export interface RadioFromProps extends RadioProps { required?: boolean; name: string; }
export interface RadioNoFromProps extends RadioProps { value?: any; name?: string; }
export interface RadioSingleNoFromProps extends RadioProps { defaultValue?: any; name?: string; id: string; }
