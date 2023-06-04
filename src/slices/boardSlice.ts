import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISingleBoardResponse } from '@/apis/interface/api'

interface IInitialState {
  singleBaord?: ISingleBoardResponse | null
  boardId: string
}

const initialState: IInitialState = {
  singleBaord: null,
  boardId: '',
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSingleBoard(state, action: PayloadAction<ISingleBoardResponse>) {
      state.singleBaord = action.payload
    },
    setBoardId(state, action: PayloadAction<string>) {
      state.boardId = action.payload
    },
    updateBoardTitle(state, action: PayloadAction<string>) {
      if (state.singleBaord) {
        state.singleBaord.title = action.payload
      }
    },
    reset: () => initialState,
  },
})

export const boardSliceActions = boardSlice.actions
export default boardSlice.reducer //給store.js使用
