export interface BlockUIState {
    IsOpen: boolean,
}
export const BlockUIInitialState: BlockUIState = {
    IsOpen: false,
}
export const BlockUIActions = {
    BlockUI: `BLOCK_UI`,
    UnBlockUI: `UNBLOCK_UI`,
}
export const BlockUIActionCreators = {
    BlockUI: () => (dispatch) => {
        try {
            dispatch({
                type: BlockUIActions.BlockUI,
                payload: {
                    IsOpen: true,
                },
            });
        } catch (error) {
            dispatch({
                type: BlockUIActions.UnBlockUI,
                payload: {
                    IsOpen: false,
                },
            });
        }
    },
    UnBlockUI: () => (dispatch) => {
        try {
            dispatch({
                type: BlockUIActions.UnBlockUI,
                payload: {
                    IsOpen: false,
                },
            });

        } catch (error) {
            dispatch({
                type: BlockUIActions.UnBlockUI,
                payload: {
                    IsOpen: false,
                },
            });
        }
    }
}
export default BlockUIActionCreators;
export const BlockUIReducer = (state = BlockUIInitialState, { type, payload }) => { 
    if (state === undefined) {
        return BlockUIInitialState;
    }
    switch (type) {
        case BlockUIActions.BlockUI :
            return {
                ...state,
                IsOpen: payload.IsOpen,
            };
        case BlockUIActions.UnBlockUI:
            return {
                ...state,
                IsOpen: payload.IsOpen,
            };
        default:
            return {
                ...state,
            };
    }
}
