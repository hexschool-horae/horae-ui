import { ICardDetail, ITag, ITodoList } from '@/apis/interface/api'

interface IPopups {
  [key: string]: boolean
}

export interface IInitialState {
  initialized: boolean
  popupKey: number
  popups: IPopups
  cardDetail: ICardDetail
}

export const initialState = {
  initialized: false,
  popupKey: 0,
  popups: {
    memberPopup: false,
    todoListPopup: false,
    tagsPopup: false,
    calenderPopup: false,
    filesPopup: false,
    movePopup: false,
    copyPopup: false,
    sharePopup: false,
    pripriorityPopup: false,
    pompomodoroPopup: false,
  },
  // from API
  cardDetail: {
    _id: '',
    listId: '',
    title: '',
    describe: '',
    startDate: null,
    endDate: null,
    members: [
      {
        userId: {
          _id: '',
          name: '',
        },
        role: '',
        _id: '',
      },
    ],
    comments: [
      {
        _id: '',
        comment: '',
        createdAt: '',
        user: {
          _id: '',
          name: '',
        },
      },
    ],
    tags: [
      {
        _id: '',
        title: '',
        color: '',
      },
    ],
    todolists: [
      {
        _id: '',
        title: '',
        contentList: [
          {
            _id: '',
            content: '',
            completed: false,
          },
        ],
      },
    ],
    attachments: [
      {
        _id: '',
        createdAt: '',
        title: '',
        fileUrl: '',
        fileName: '',
      },
    ],
    proiority: '',
    coverPath: '',
    position: 0,
    updateUser: '',
    createdAt: '',
    updateAt: '',
  },
}

type TReducerAction =
  | { type: 'INITIALIZE_CARD'; payload: any }
  | { type: 'TOTGGLE_POPUP'; payload: string }
  | { type: 'ADD_TAG'; payload: { tag: ITag } }
  | { type: 'EDIT_TAG'; payload: { tag: ITag } }
  | { type: 'REMOVE_TAG'; payload: { tagId: string } }
  | { type: 'ADD_TODO_LIST'; payload: { listTitle: string } }
  | { type: 'DELETE_TODO_LIST'; payload: { todolists: ITodoList[] } }

export function cardDetailReducer(state: IInitialState, { type, payload }: TReducerAction) {
  // console.log(state, type)
  // console.log('payload:', payload)

  switch (type) {
    case 'INITIALIZE_CARD': {
      return {
        ...state,
        cardDetail: payload.cardDetail,
        initialized: true,
      }
    }
    case 'TOTGGLE_POPUP': {
      const updatedPopups = {
        ...state.popups,
        [payload]: !state.popups[payload],
      }

      // 檢查是否需要關閉其他已打開的彈出式視窗
      if (updatedPopups[payload]) {
        Object.keys(updatedPopups).forEach(popupId => {
          if (popupId !== payload) {
            updatedPopups[popupId] = false
          } else {
            updatedPopups[popupId] = true
          }
        })
      }

      return {
        ...state,
        popups: updatedPopups,
        popupKey: state.popupKey + 1,
      }
    }
    case 'ADD_TAG': {
      const tags = [...state.cardDetail.tags, payload.tag]
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          tags,
        },
      }
    }
    case 'EDIT_TAG': {
      const tags = [...state.cardDetail.tags]
      const i = tags.findIndex(tag => tag._id === payload.tag._id)
      if (i >= 0) {
        tags[i] = payload.tag
      }
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          tags,
        },
      }
    }
    case 'REMOVE_TAG': {
      const tags = state.cardDetail.tags.filter(tag => tag._id !== payload.tagId)
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          tags,
        },
      }
    }
    case 'ADD_TODO_LIST': {
      const todolists = [
        ...state.cardDetail.todolists,
        {
          _id: '',
          title: payload.listTitle,
          contentList: [],
        },
      ]
      return {
        ...state,
        popups: {
          todoListPopup: false,
        },
        cardDetail: {
          ...state.cardDetail,
          todolists,
        },
      }
    }
    case 'DELETE_TODO_LIST': {
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          todolists: payload.todolists,
        },
      }
    }

    default:
      return state
  }
}
