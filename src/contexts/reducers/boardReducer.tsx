import { IBoardListItem } from '@/types/pages'

/** @name 看板初始狀態 */
interface IBoardState {
  lists: IBoardListItem[]
}

/** @name 新增看板中列表 */
interface IAddBoardList {
  type: 'UPDATE_BOARD_LIST'
  payload: IBoardListItem[]
}

/** @name 新增列表中卡片 */
// interface IAddBoardCard {
//   type: 'ADD_BOARD_CARD'
//   payload: IBoardCardItem
// }

type IBoardAction = IAddBoardList

// 定義reducer函式
export const boardReducer = (state: IBoardState, { type, payload }: IBoardAction): IBoardState => {
  // console.log(type, payload)
  switch (type) {
    case 'UPDATE_BOARD_LIST':
      return {
        ...state,
        lists: [...state.lists, ...payload],
      }

    // case 'GET_BOARD_LIST':
    //   return state.lists

    default:
      throw new Error('Unknown action')
  }
}
