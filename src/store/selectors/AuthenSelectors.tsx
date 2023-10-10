import { createSelector } from 'reselect';

const selectRaw = (state) => state.dialogReducer;

const selectSuccessOpen = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.SuccessOpen,
);

const selectSuccessMsg = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.SuccessMsg,
);
const selectWarningOpen = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.WarningOpen,
);

const selectWarningMsg = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.WarningMsg,
);
const selectErrorOpen = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.ErrorOpen,
);

const selectErrorMsg = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.ErrorMsg,
);
const selectSubmitOpen = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.SubmitOpen,
);

const selectSubmitMsg = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.SubmitMsg,
);
const selectSubmitFn = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.SubmitFn,
);
const selectSubmitCancelFn = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.SubmitCancelFn,
);
const selectSubmitIsload = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.SubmitIsload,
);

const selectSubmit_WARNNING_Open = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.Submit_WARNNING_Open,
);

const selectSubmit_WARNNING_Msg = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.Submit_WARNNING_Msg,
);
const selectSubmit_WARNNING_Fn = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.Submit_WARNNING_Fn,
);

const selectSubmit_WARNNING_FnCancel = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.Submit_WARNNING_FnCancel,
);


const selectSubmit_SUCCESS_Fn = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.Submit_SUCCESS_Fn,
);
const selectSubmit_WARNNING_Isload = createSelector(
    [selectRaw],
    (dialogReducer) => dialogReducer.Submit_WARNNING_Isload,
);
const AuthenSelectors = {
    selectRaw,
    selectSuccessOpen,
    selectSuccessMsg,
    selectWarningOpen,
    selectWarningMsg,
    selectErrorOpen,
    selectErrorMsg,
    selectSubmitOpen,
    selectSubmitFn,
    selectSubmitCancelFn,
    selectSubmitMsg,
    selectSubmitIsload,
    selectSubmit_WARNNING_Open,
    selectSubmit_SUCCESS_Fn,
    selectSubmit_WARNNING_Fn,
    selectSubmit_WARNNING_FnCancel,
    selectSubmit_WARNNING_Msg,
    selectSubmit_WARNNING_Isload,
}
export default AuthenSelectors;