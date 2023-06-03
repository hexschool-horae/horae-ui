import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IBoardListItem } from '@/types'

type TViewSet = '' | 'private' | 'workspace' | 'public'
type TYourRole = '' | 'visitor' | 'admin'
interface IMember {
  userId: {
    _id: string
    name: string
  }
  role: string
  _id: string
}

interface IUserInitialState {
  boardId: string
  title: string
  discribe: string
  lists: IBoardListItem[]
  isErrorMessageVisible: boolean
  errorMessageText: string
  members: IMember[]
  viewSet: TViewSet
  yourRole: TYourRole
  isClosed: boolean
}

const initialState: IUserInitialState = {
  boardId: '',
  title: '',
  discribe: '',
  lists: [],
  isErrorMessageVisible: false,
  errorMessageText: '',
  members: [],
  viewSet: '',
  yourRole: '',
  isClosed: false,
}

export const boardSlice = createSlice({
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
    setViewSet: (state, action: PayloadAction<TViewSet>) => {
      state.viewSet = action.payload
    },
    setIsClosed: (state, action: PayloadAction<boolean>) => {
      state.isClosed = action.payload
    },
    setYourRole: (state, action: PayloadAction<TYourRole>) => {
      state.yourRole = action.payload
    },
    setMembers: (state, action: PayloadAction<IMember[]>) => {
      state.members = action.payload
    },
    setDiscribe: (state, action: PayloadAction<string>) => {
      state.discribe = action.payload
    },
  },
})

export const {
  setBoardId,
  setTitle,
  setLists,
  setIsErrorMessageVisible,
  setErrorMessageText,
  setViewSet,
  setIsClosed,
  setYourRole,
  setMembers,
  setDiscribe,
} = boardSlice.actions //給React組件個別使用

export default boardSlice.reducer //給store.js使用
