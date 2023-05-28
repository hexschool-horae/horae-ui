import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IBoardListItem } from '@/types'
interface IUserInitialState {
  boardId: string
  title: string
  lists: IBoardListItem[]
  isErrorMessageVisible: boolean
  errorMessageText: string
}

const initialState: IUserInitialState = {
  boardId: '',
  title: '',
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
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
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

export const { setBoardId, setTitle, setLists, setIsErrorMessageVisible, setErrorMessageText } =
  boardSocketSlice.actions //給React組件個別使用

export default boardSocketSlice.reducer //給store.js使用
