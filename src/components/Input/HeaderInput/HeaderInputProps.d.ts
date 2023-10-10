import { SxProps } from "@mui/material";

export interface HeaderInputProps {
    id: string;
    text: string;
    subtext?: string;
    required?: boolean;
    display? : 'flex' | 'inline-block';
    alignItems? : 'normal' | 'stretch' |  'center' | 'felx-start' | 'flex-end' | 'start' | 'end' | 'baseline'
    sxSubText? : SxProps<Theme>; 
    IsTooltip : boolean;
    tooltip : any ;
}