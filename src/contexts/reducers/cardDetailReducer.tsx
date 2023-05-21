interface IPopups {
  [key: string]: boolean
}

interface IComments {
  id?: string
  content: string
  date: string
}

interface ICardDetail {
  title: string
  describe: string
  comments: IComments[]
}

export interface IInitialState {
  initialized: boolean
  popups: IPopups
  cardDetail: ICardDetail
}

export const initialState = {
  initialized: false,
  popups: {
    memberPopup: false,
    todoListPopup: false,
    tagsPopup: false,
  },
  // from API
  cardDetail: {
    title: '',
    describe: '',
    comments: [],
  },
}

type TReducerAction =
  | { type: 'INITIALIZE_CARD'; payload: any }
  | { type: 'TOTGGLE_POPUP'; payload: string }
  | { type: 'UPDATE_TITLE'; payload: { title: string } }
  | { type: 'UPDATE_DESCRIBE'; payload: { describe: string } }
  | { type: 'UPDATE_COMMENT'; payload: { comment: string } }

export function cardDetailReducer(state: IInitialState, { type, payload }: TReducerAction) {
  // console.log(state, type);
  // console.log("payload:", payload);

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
      const comments = [...state.cardDetail.comments, { content: payload.comment, date: '' }]
      return {
        ...state,
        cardDetail: {
          ...state.cardDetail,
          comments,
        },
      }
    }

    default:
      return state
  }
}
