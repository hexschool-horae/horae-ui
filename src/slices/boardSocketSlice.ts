import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IUserInitialState {
  isConnected: boolean
}

const initialState: IUserInitialState = {
  isConnected: false,
}

export const boardSocketSlice = createSlice({
  name: 'boardSocket',
  initialState,
  reducers: {
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload
    },
  },
})

export const { setIsConnected } = boardSocketSlice.actions //給React組件個別使用

export default boardSocketSlice.reducer //給store.js使用
