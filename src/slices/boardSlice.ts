import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { ISingleBoardResponse } from '@/apis/interface/api'
import { ISingleBoardInterface } from '@/socketService/types/board'
import { ICardDetail } from '@/apis/interface/api'

// ---重構中，之後補回來---

type TViewSet = '' | 'private' | 'workspace' | 'public'
// type TYourRole = '' | 'visitor' | 'admin'
// interface IMember {
//   userId: {
//     _id: string
//     name: string
//   }
//   role: string
//   _id: string
// }

// interface IUserInitialState {
//   boardId: string
//   title: string
//   discribe: string
//   lists: IBoardListItem[]
//   isErrorMessageVisible: boolean
//   errorMessageText: string
//   members: IMember[]
//   viewSet: TViewSet
//   yourRole: TYourRole
//   isClosed: boolean
// }

// const initialState: IUserInitialState = {
//   boardId: '',
//   title: '',
//   discribe: '',
//   lists: [],
//   isErrorMessageVisible: false,
//   errorMessageText: '',
//   members: [],
//   viewSet: '',
//   yourRole: '',
//   isClosed: false,
// }

// export const boardSlice = createSlice({
//   name: 'boardSocket',
//   initialState,
//   reducers: {
//     setBoardId: (state, action: PayloadAction<string>) => {
//       state.boardId = action.payload
//     },
//     setTitle: (state, action: PayloadAction<string>) => {
//       state.title = action.payload
//     },
//     setLists: (state, action: PayloadAction<IBoardListItem[]>) => {
//       state.lists = action.payload
//     },
//     setIsErrorMessageVisible: (state, action: PayloadAction<boolean>) => {
//       state.isErrorMessageVisible = action.payload
//     },
//     setErrorMessageText: (state, action: PayloadAction<string>) => {
//       state.errorMessageText = action.payload
//     },
//     setViewSet: (state, action: PayloadAction<TViewSet>) => {
//       state.viewSet = action.payload
//     },
//     setIsClosed: (state, action: PayloadAction<boolean>) => {
//       state.isClosed = action.payload
//     },
//     setYourRole: (state, action: PayloadAction<TYourRole>) => {
//       state.yourRole = action.payload
//     },
//     setMembers: (state, action: PayloadAction<IMember[]>) => {
//       state.members = action.payload
//     },
//     setDiscribe: (state, action: PayloadAction<string>) => {
//       state.discribe = action.payload
//     },
//   },
// })

// export const {
//   setBoardId,
//   setTitle,
//   setLists,
//   setIsErrorMessageVisible,
//   setErrorMessageText,
//   setViewSet,
//   setIsClosed,
//   setYourRole,
//   setMembers,
//   setDiscribe,
// } = boardSlice.actions //給React組件個別使用

// ---重構中，之後補回來---

interface IInitialState {
  singleBaord: ISingleBoardInterface | null
  boardId: string
  cardDetail: ICardDetail | null
}

const initialState: IInitialState = {
  singleBaord: null,
  boardId: '',
  cardDetail: null,
}

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSingleBoard(state, action: PayloadAction<ISingleBoardInterface>) {
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
    updateBoardList(
      state,
      action: PayloadAction<
        {
          _id: string
          title: string
          status: string
          position: number
          cards: {
            _id: string
            title: string
            startDate: number
            endDate: number
            tags: {
              _id: string
              title: string
              color: string
            }[]
            comments: {
              _id: string
              comment: string
              user: {
                _id: string
                name: string
                createdAt: string
              }
              card: string
            }[]
            proiority: string
            position: number
          }[]
        }[]
      >
    ) {
      if (state.singleBaord) {
        state.singleBaord.lists = action.payload
      }
    },
    updateBoardViewSet(state, action: PayloadAction<TViewSet>) {
      if (state.singleBaord) {
        state.singleBaord.viewSet = action.payload
      }
    },
    setCardDetail(state, action: PayloadAction<ICardDetail>) {
      state.cardDetail = action.payload
    },
    updateCardComments(state, action: PayloadAction<ICardDetail>) {
      if (state.cardDetail?._id === action.payload._id) {
        state.cardDetail.comments = action.payload.comments
      }
    },
    addNewTodoList(state, action: PayloadAction<ICardDetail>) {
      if (state.cardDetail?._id === action.payload._id) {
        state.cardDetail.todolists = action.payload.todolists
      }
    },
    updateTodoLists(state, action: PayloadAction<ICardDetail>) {
      if (state.cardDetail?._id === action.payload._id) {
        state.cardDetail.todolists = action.payload.todolists
      }
    },
    updateCardMembers(state, action: PayloadAction<ICardDetail>) {
      console.log('updateCardMembers', state)
      if (state.cardDetail && state.cardDetail._id === action.payload._id) {
        state.cardDetail.members = action.payload.members
      }
    },
    reset: () => initialState,
  },
})

export const boardSliceActions = boardSlice.actions
export default boardSlice.reducer //給store.js使用
