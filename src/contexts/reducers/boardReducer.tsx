import { IListData, ICardData } from '@/types/pages'

/** @name 看板初始狀態 */
interface IBoardState {
  lists: IListData[]
}
/** @name 列舉所有看板更新狀態的方法 */
// enum EBoardActionType {
//   ADD_BOARD_LIST = 'ADD_BOARD_LIST',
//   UPDATE_BOARD_LIST = 'UPDATE_BOARD_LIST',
//   UPDATE_BOARD_LIST_CARD = 'UPDATE_BOARD_LIST_CARD',
// }
/** @name 取得單一看板（含看板中的資訊） */
// interface IGetBoardList {
//   type: 'GET_BOARD_LIST'
//   payload: { id: string; title: string }
// }

/** @name 新增看板中列表 */
interface IAddBoardList {
  type: 'ADD_BOARD_LIST'
  payload: { id?: string; title: string; cardList: ICardData[] }
}

/** @name 新增列表中卡片 */
interface IUpdateBoardList {
  type: 'UPDATE_BOARD_LIST'
  payload: { boardId: string; title: string }
}

type IBoardAction = IAddBoardList | IUpdateBoardList

// 定義reducer函式
export const boardReducer = (state: IBoardState, { type, payload }: IBoardAction): IBoardState => {
  switch (type) {
    case 'ADD_BOARD_LIST':
      return {
        ...state,
        lists: [...state.lists, payload],
      }

    // case 'GET_BOARD_LIST':
    //   return state.lists

    default:
      throw new Error('Unknown action')
  }
}
