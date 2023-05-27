import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IBoardListItem } from '@/types'
interface IUserInitialState {
  boardId: string
  lists: IBoardListItem[]
}

const initialState: IUserInitialState = {
  boardId: '',
  lists: [],
}

export const boardSocketSlice = createSlice({
  name: 'boardSocket',
  initialState,
  reducers: {
    setBoardId: (state, action: PayloadAction<string>) => {
      state.boardId = action.payload
    },
    setLists: (state, action: PayloadAction<IBoardListItem[]>) => {
      state.lists = action.payload
    },
  },
})

export const { setBoardId, setLists } = boardSocketSlice.actions //給React組件個別使用

export default boardSocketSlice.reducer //給store.js使用
