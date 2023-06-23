import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { ISingleBoardResponse } from '@/apis/interface/api'
import { ISingleBoardInterface, IListCard, IListCardTags } from '@/socketService/types/board'
import { ICardDetail, IBoardMember, ITag } from '@/apis/interface/api'

type TViewSet = '' | 'private' | 'workspace' | 'public'
interface IthemeColor {
  themeColor: string
  textColor: string
}

const hexToRgb = (hex: string) => {
  if (hex === '') return
  // 移除可能的前缀，並保留六位十六進制数
  hex = hex.replace(/^#/, '')

  // 將 Hex 拆分為 R、G和B
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 返回包含RGB分量的物件或字符串
  return { r: r, g: g, b: b }
}

interface IInitialState {
  singleBaord: ISingleBoardInterface | null
  boardId: string
  cardDetail: ICardDetail | null
  boardMembersList: IBoardMember[] | null
  listCard: IListCard
  listCardTags: IListCardTags
  boardTags: ITag[]
  themeColor: IthemeColor
}

const initialState: IInitialState = {
  singleBaord: null,
  boardId: '',
  cardDetail: null,
  boardMembersList: null,
  listCard: {
    listId: '',
    cardId: '',
    title: '',
    proiority: '',
  },
  listCardTags: {
    listId: '',
    cardId: '',
    tags: [],
  },
  boardTags: [],
  themeColor: { themeColor: '', textColor: '' },
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
    updateBoardCover(state, action: PayloadAction<string>) {
      if (state.singleBaord) {
        state.singleBaord.coverPath = action.payload
      }
    },
    updateBoardTheme(state, action: PayloadAction<IthemeColor>) {
      if (action.payload.themeColor !== '') {
        const hexColor = hexToRgb(action.payload.themeColor)

        if (hexColor && hexColor.b) {
          state.themeColor = {
            themeColor: action.payload.themeColor,
            textColor: hexColor.b < 125 ? '#ffffff' : '#000000',
          }
        }
      } else {
        state.themeColor = { themeColor: '', textColor: '' }
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
    updateBoardMembersList(state, action: PayloadAction<IBoardMember[]>) {
      state.boardMembersList = action.payload
    },
    updateBoardViewSet(state, action: PayloadAction<TViewSet>) {
      if (state.singleBaord) {
        state.singleBaord.viewSet = action.payload
      }
    },
    setCardDetail(state, action: PayloadAction<ICardDetail>) {
      state.cardDetail = action.payload
    },
    updateCard(state, action: PayloadAction<ICardDetail>) {
      if (state.cardDetail?._id === action.payload._id) {
        state.cardDetail = {
          ...action.payload,
          title: action.payload.title,
          describe: action.payload.describe,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          proiority: action.payload.proiority,
        }
      }
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
    updateListCard(state, action: PayloadAction<ICardDetail>) {
      if (state.listCard) {
        state.listCard.listId = action.payload.listId
        state.listCard.cardId = action.payload._id
        state.listCard.title = action.payload.title
        state.listCard.proiority = action.payload.proiority
        // console.log(state.listCard)
      }
    },
    updateListCardTags(state, action: PayloadAction<ICardDetail>) {
      if (state.listCardTags) {
        state.listCardTags.listId = action.payload.listId
        state.listCardTags.cardId = action.payload._id
        state.listCardTags.tags = action.payload.tags
      }
    },
    updateBoardTags(state, action: PayloadAction<ITag[]>) {
      if (state.boardTags) {
        state.boardTags = action.payload
      }
    },
    updateCardTags(state, action: PayloadAction<ICardDetail>) {
      if (state.cardDetail?._id === action.payload._id) {
        state.cardDetail.tags = action.payload.tags
      }
    },
    updateBoardCoverColor(state, action: PayloadAction<ISingleBoardInterface>) {
      if (state.singleBaord?._id === action.payload._id) {
        state.singleBaord.covercolor = action.payload.covercolor
      }
    },
    reset: () => initialState,
  },
})

export const boardSliceActions = boardSlice.actions
export default boardSlice.reducer //給store.js使用
