interface IPopups {
  [key: string]: boolean
}

export interface ITag {
  id: string
  title: string
  color: string
}

interface IComments {
  id?: string
  content: string
  date: string
}

interface ICardDetail {
  title: string
  describe: string
  tags: ITag[]
  comments: IComments[]
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
  },
  // from API
  cardDetail: {
    title: '',
    describe: '',
    tags: [],
    comments: [],
  },
}

type TReducerAction =
  | { type: 'INITIALIZE_CARD'; payload: any }
  | { type: 'TOTGGLE_POPUP'; payload: string }
  | { type: 'UPDATE_TITLE'; payload: { title: string } }
  | { type: 'UPDATE_DESCRIBE'; payload: { describe: string } }
  | { type: 'UPDATE_COMMENT'; payload: { comment: string } }
  | { type: 'ADD_TAG'; payload: { tag: ITag } }
  | { type: 'EDIT_TAG'; payload: { tag: ITag } }
  | { type: 'REMOVE_TAG'; payload: { tagId: string } }

export function cardDetailReducer(state: IInitialState, { type, payload }: TReducerAction) {
  console.log(state, type)
  console.log('payload:', payload)

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
          }
        })
      }

      return {
        ...state,
        popups: updatedPopups,
        popupKey: state.popupKey + 1,
      }
    }
    case 'UPDATE_TITLE': {
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          title: payload.title,
        },
      }
    }
    case 'UPDATE_DESCRIBE': {
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          describe: payload.describe,
        },
      }
    }
    case 'UPDATE_COMMENT': {
      //需要user name, date...
      const comments = [...state.cardDetail.comments, { content: payload.comment, date: '' }]
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          comments,
        },
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
      const i = tags.findIndex(tag => tag.id === payload.tag.id)
      // console.log(i)
      tags[i] = payload.tag
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          tags,
        },
      }
    }
    case 'REMOVE_TAG': {
      const tags = state.cardDetail.tags.filter(tag => tag.id !== payload.tagId)
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          tags,
        },
      }
    }

    default:
      return state
  }
}
