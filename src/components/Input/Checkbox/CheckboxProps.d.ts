export interface CheckboxProps {
    label?: any;
    onChange?: (value: any) => void,
    disabled?: boolean;
    widthLabel?: string;
    required?: boolean;
    externalErrorMessage?: any;
    styleCheckBox?: any;
    styleText?: any;
    name: string;
}
export interface CheckboxFromProps extends CheckboxProps { required?: boolean; name: string; }
export interface CheckboxNoFromProps extends CheckboxProps { value?: any; name: string; }

export interface CheckboxGroupProps {
    id: string;
    name: string;
    label?: string;
    labelFront?: string;
    onChange?: any;
    disabled?: boolean;
    widthLabel?: string;
    options?: any[];
    AllowCheckAll?: boolean;
    labelCheckAll?: string;
    span?: string | number,
    flex?: any,
    nCol?: any,
    row?: boolean,
    style?: any;
    styleCheckbox?: any;
    styleLabel?: any;
    isTooltip?: boolean;
}
export interface CheckboxGroupFromProps extends CheckboxGroupProps { required?: boolean; name: string; }
export interface CheckboxGroupNoFromProps extends CheckboxGroupProps { value?: any; name: string; }