import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IBoardListItem } from '@/types'
interface IUserInitialState {
  boardId: string
  lists: IBoardListItem[]
  isErrorMessageVisible: boolean
  errorMessageText: string
}

const initialState: IUserInitialState = {
  boardId: '',
  lists: [],
  isErrorMessageVisible: false,
  errorMessageText: '',
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
    setIsErrorMessageVisible: (state, action: PayloadAction<boolean>) => {
      state.isErrorMessageVisible = action.payload
    },
    setErrorMessageText: (state, action: PayloadAction<string>) => {
      state.errorMessageText = action.payload
    },
  },
})

export const { setBoardId, setLists, setIsErrorMessageVisible, setErrorMessageText } = boardSocketSlice.actions //給React組件個別使用

export default boardSocketSlice.reducer //給store.js使用
