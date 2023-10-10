export interface PermissionButtonProps {
    IsBtnApproved: boolean;
    IsBtnBack: boolean;
    IsBtnCancel: boolean;
    IsBtnReject: boolean;
    IsBtnSaveDraft: boolean;
    IsBtnSubmit: boolean;
    IsInputMode: boolean;
    IsCCSendEmail: boolean;
    nRequestType?: int;
    nStepID?: int;
    lstDataStep?: StepProps[];
}

export interface StepProps {
    nRequestType?: int;
    nStepID?: int;
    sRequestTypeName?: String;
}

export interface PermissionProps {
    children: React.ReactNode,
    onBack?: () => void;
    onApproved?: () => void;
    onReject?: () => void;
    onSubmit?: () => void;
    onDraft?: () => void;
    onCancel?: () => void;
    nProjectID?: any;
    nAreaID?: any;
    IsDisabledSubmit?: boolean;
    IsRequestEdit?: boolean;
}