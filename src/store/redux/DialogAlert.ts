
export interface DialogState {
    SuccessOpen: boolean,
    SuccessMsg: string
    WarningOpen: boolean,
    WarningMsg: string,
    ErrorOpen: boolean,
    ErrorMsg: string,
    SubmitOpen: boolean,
    SubmitFn: Function,
    SubmitMsg: string,
    SubmitIsload: boolean,

}

export const DialogInitialState: DialogState = {
    SuccessOpen: false,
    SuccessMsg: "",
    WarningOpen: false,
    WarningMsg: "",
    ErrorOpen: false,
    ErrorMsg: "",
    SubmitOpen: false,
    SubmitFn: s => { },
    SubmitMsg: "",
    SubmitIsload: false,

}

const prefix = 'DIALOG';
export const DialogActions = {
    DIALOG_SUCCESS_OPEN: `${prefix}_SUCCESS_OPEN`,
    DIALOG_SUCCESS_CLOSE: `${prefix}_SUCCESS_CLOSE`,
    DIALOG_WARNNING_OPEN: `${prefix}_WARNNING_OPEN`,
    DIALOG_WARNNING_CLOSE: `${prefix}_WARNNING_CLOSE`,
    DIALOG_ERROR_OPEN: `${prefix}_ERROR_OPEN`,
    DIALOG_ERROR_CLOSE: `${prefix}_ERROR_CLOSE`,
    DIALOG_SUBMIT_OPEN: `${prefix}_SUBMIT_OPEN`,
    DIALOG_SUBMIT_CLOSE: `${prefix}_SUBMIT_CLOSE`,
    DIALOG_SUBMIT_ISLOAD: `${prefix}_SUBMIT_ISLOAD`,
    DIALOG_SUBMIT_WARNNING_OPEN: `${prefix}_SUBMIT_WARNNING_OPEN`,
    DIALOG_SUBMIT_WARNNING_CLOSE: `${prefix}_SUBMIT_WARNNING_CLOSE`,
    DIALOG_SUBMIT_WARNNING_ISLOAD: `${prefix}_SUBMIT_WARNNING_ISLOAD`,

}

export const DialogActionCreators = {
    OpenDialogSuccess: (msg, fn = () => { return }) => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_SUCCESS_OPEN,
                payload: {
                    IsOpen: true,
                    msg: msg,
                    Fn: fn
                },
            });

        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_SUCCESS_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: ""
                },
            });
        }
    },
    CloseDialogSuccess: () => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_SUCCESS_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: "",
                },
            });

        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_SUCCESS_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: ""
                },
            });
        }
    },
    OpenDialogWarning: (msg: string, fnClose = () => { }) => (dispatch: any) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_WARNNING_OPEN,
                payload: {
                    IsOpen: true,
                    msg: msg,
                    Fn: fnClose
                },
            });

        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_WARNNING_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: ""
                },
            });
        }
    },
    CloseDialogWarning: () => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_WARNNING_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: "",
                },
            });

        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_WARNNING_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: ""
                },
            });
        }
    },
    OpenDialogError: (msg: string) => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_ERROR_OPEN,
                payload: {
                    IsOpen: true,
                    msg: msg
                },
            });

        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_ERROR_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: ""
                },
            });
        }
    },
    CloseDialogError: () => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_ERROR_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: "",
                },
            });

        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_ERROR_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: ""
                },
            });
        }
    },
    OpenDialogSubmit: (msg, Fn, Fncancel = () => { }) => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_OPEN,
                payload: {
                    IsOpen: true,
                    msg: msg,
                    Fn: Fn,
                    FnCancel: Fncancel
                },
            });
        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_OPEN,
                payload: {
                    IsOpen: false,
                    msg: "",
                    Fn: s => { }
                },
            });
        }
    },
    CloseDialogSubmit: () => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: "",
                    Fn: s => { }

                },
            });
        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: "",
                    Fn: s => { }

                },
            });
        }
    },
    LoadSubmit: (Isload) => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_ISLOAD,
                payload: {
                    SubmitIsload: Isload,
                },
            });

        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_ISLOAD,
                payload: {
                    SubmitIsload: false,
                },
            });
        }
    },
    OpenDialogSubmitWarning: (msg, Fn, FnCancel) => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_WARNNING_OPEN,
                payload: {
                    IsOpen: true,
                    msg: msg,
                    Fn: Fn,
                    FnCancel: FnCancel
                },
            });
        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_WARNNING_OPEN,
                payload: {
                    IsOpen: false,
                    msg: "",
                    Fn: s => { },
                    FnCancel: s => { }
                },
            });
        }
    },
    CloseDialogSubmitWarning: () => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_WARNNING_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: "",
                    Fn: s => { }

                },
            });
        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_WARNNING_CLOSE,
                payload: {
                    IsOpen: false,
                    msg: "",
                    Fn: s => { }

                },
            });
        }
    },
    LoadSubmitWarning: (Isload) => (dispatch) => {
        try {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_WARNNING_ISLOAD,
                payload: {
                    SubmitIsload: Isload,
                },
            });

        } catch (error) {
            dispatch({
                type: DialogActions.DIALOG_SUBMIT_WARNNING_ISLOAD,
                payload: {
                    SubmitIsload: false,
                },
            });
        }
    },
}

export default DialogActionCreators;


export const DialogReducer = (state = DialogInitialState, { type, payload }) => {
    if (state === undefined) {
        return DialogInitialState;
    }
    switch (type) {
        case DialogActions.DIALOG_SUCCESS_OPEN:
            return {
                ...state,
                SuccessOpen: payload.IsOpen,
                SuccessMsg: payload.msg,
                SubmitIsload: false,
                SubmitOpen: false,
                Submit_SUCCESS_Fn: payload.Fn
            };
        case DialogActions.DIALOG_SUCCESS_CLOSE:
            return {
                ...state,
                SuccessOpen: payload.IsOpen,
                SuccessMsg: " ",
                SubmitIsload: false,
                SubmitOpen: false


            };
        case DialogActions.DIALOG_WARNNING_OPEN:
            return {
                ...state,
                WarningOpen: payload.IsOpen,
                WarningMsg: payload.msg,
                SubmitIsload: false,
                SubmitOpen: false,
                Submit_SUCCESS_Fn: payload.Fn
            };
        case DialogActions.DIALOG_WARNNING_CLOSE:
            return {
                ...state,
                WarningOpen: payload.IsOpen,
                WarningMsg: " ",
                SubmitIsload: false,
                SubmitOpen: false


            };
        case DialogActions.DIALOG_ERROR_OPEN:
            return {
                ...state,
                ErrorOpen: payload.IsOpen,
                ErrorMsg: payload.msg,
                SubmitIsload: false,
                SubmitOpen: false


            };
        case DialogActions.DIALOG_ERROR_CLOSE:
            return {
                ...state,
                ErrorOpen: payload.IsOpen,
                ErrorMsg: " ",
                SubmitIsload: false,
                SubmitOpen: false


            };
        case DialogActions.DIALOG_SUBMIT_OPEN:
            return {
                ...state,
                SubmitOpen: payload.IsOpen,
                SubmitFn: payload.Fn,
                SubmitCancelFn: payload.FnCancel,
                SubmitMsg: payload.msg,
                SubmitIsload: false,


            };
        case DialogActions.DIALOG_SUBMIT_CLOSE:
            return {
                ...state,
                SubmitOpen: payload.IsOpen,
                SubmitFn: payload.Fn,
                SubmitMsg: " ",
                SubmitIsload: false
            };
        case DialogActions.DIALOG_SUBMIT_ISLOAD:
            return {
                ...state,
                SubmitIsload: payload.SubmitIsload,
            };
        case DialogActions.DIALOG_SUBMIT_WARNNING_OPEN:
            return {
                ...state,
                Submit_WARNNING_Open: payload.IsOpen,
                Submit_WARNNING_Fn: payload.Fn,
                Submit_WARNNING_FnCancel: payload.FnCancel,
                Submit_WARNNING_Msg: payload.msg,
                Submit_WARNNING_Isload: false
            };
        case DialogActions.DIALOG_SUBMIT_WARNNING_CLOSE:
            return {
                ...state,
                Submit_WARNNING_Open: payload.IsOpen,
                Submit_WARNNING_Fn: payload.Fn,
                Submit_WARNNING_Msg: " ",
                Submit_WARNNING_Isload: false
            };
        case DialogActions.DIALOG_SUBMIT_WARNNING_ISLOAD:
            return {
                ...state,
                Submit_WARNNING_Isload: payload.SubmitIsload,
            };
        default:
            return {
                ...state,
            };
    }
}
