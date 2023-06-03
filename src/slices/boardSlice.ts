import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISingleBoardInterface } from '@/socketService/types/board'

interface IInitialState {
  singleBaord?: ISingleBoardInterface | object
}

const initialState: IInitialState = {
  singleBaord: {},
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSingleBoard(state, action: PayloadAction<ISingleBoardInterface>) {
      state.singleBaord = action.payload
    },
  },
})

export const { setSingleBoard } = boardSlice.actions
export default boardSlice.reducer //給store.js使用
