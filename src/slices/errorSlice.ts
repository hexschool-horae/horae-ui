import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IErrorMessage {
  code: number
  message: string
}

interface IErrorInitialState {
  errors: IErrorMessage[]
}

const initialState: IErrorInitialState = {
  errors: [],
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    pushNewErrorMessage(state, action: PayloadAction<IErrorMessage>) {
      state.errors.push(action.payload)
    },
    popErrorMessage(state) {
      state.errors.pop()
    },
  },
})

export const errorSliceActions = errorSlice.actions //給React組件個別使用

export default errorSlice.reducer //給store.js使用
