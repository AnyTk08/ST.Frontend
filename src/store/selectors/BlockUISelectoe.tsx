import { createSelector } from 'reselect';
const selectRaw = (state) => state.blockuiReducer;

const HandleClose = createSelector(
    [selectRaw],
    (blockuiReducer) => blockuiReducer.HandleClose,
);

const IsOpen = createSelector(
    [selectRaw],
    (blockuiReducer) => blockuiReducer.IsOpen,
);

const BlockUISelectors = {
    selectRaw,
    IsOpen,
    HandleClose
}
export default BlockUISelectors;