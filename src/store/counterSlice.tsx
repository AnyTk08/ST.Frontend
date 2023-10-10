import { createSlice } from '@reduxjs/toolkit'
const initialState={
  open:false,
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
      openBlockUI(state) {
        state.open =true;
      },
      closeBlockUI(state) {
        state.open =false;
      }
    },
  })
export const { openBlockUI, closeBlockUI } = counterSlice.actions
export default counterSlice.reducer