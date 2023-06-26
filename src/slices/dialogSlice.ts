import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IDialogInitialState {
  spinner: {
    queue: Array<string>
  }
}

const initialState: IDialogInitialState = {
  spinner: {
    queue: [],
  },
}

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    pushSpinnerQueue(state, action: PayloadAction<string>) {
      state.spinner.queue.push(action.payload)
    },
    popSpinnerQueue(state, action: PayloadAction<string>) {
      state.spinner.queue = state.spinner.queue.filter(item => item !== action.payload)
    },
    purgeSpinnerQueue(state) {
      state.spinner.queue = []
    },
  },
})

export const dialogSliceActions = dialogSlice.actions //給React組件個別使用
export default dialogSlice.reducer
