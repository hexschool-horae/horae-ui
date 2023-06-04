import { Socket } from 'socket.io-client'
import * as interfaces from '@/socketService/types/board.d'
import events from '@/socketService/sockets.events'

import { Manager } from 'socket.io-client'
const URL = process.env.NEXT_PUBLIC_SOCKET_SERVER || ''
import store from '@/app/store'

import { boardSliceActions } from '@/slices/boardSlice'
import { errorSliceActions } from '@/slices/errorSlice'

let boardSocket: Socket

// 會需要 board id 是要讓 socket 加入房間
export const useBoardService = (namespace: string, boardId: string, token: string) => {
  const manager = new Manager(URL, {
    extraHeaders: {
      token: `Bearer ${token}`,
    },
  })

  // 跟看板命名空間建立連線
  boardSocket = manager.socket(namespace)

  // 監聽連線
  boardSocket.on('connect', () => {
    // 加入看板 room
    boardSocket.emit(events.BOARD_JOIN, {
      boardId,
    })
  })

  // 監聽是否建立看板成功
  boardSocket.on(events.BOARD_CREATE_LIST_RESULT, data => {
    store.dispatch(boardSliceActions.setSingleBoard(data))
  })

  // 監聽修改看板標題是否成功
  boardSocket.on(events.BOARD_MODIFY_TITLE_RESULT, data => {
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardTitle(data.title))
    } else {
      const message: string = data.data.message
      store.dispatch(
        errorSliceActions.pushNewErrorMessage({
          code: -1,
          message,
        })
      )
    }
  })

  return {
    createList,
    modifyBoardViewPermission,
    archiveBoard,
    modifyBoardTitle,
    archiveList,
    createNewBoardTag,
    modifyBoardTag,
    deleteBoardTag,
    createCard,
    modifyCard,
    attachTagToCard,
    removeTagFromCard,
    moveCard,
    deleteCard,
    moveList,
    deleteList,
    terminateService,
  }
}

const terminateService = (boardId: string) => {
  boardSocket.emit(events.BOARD_LEAVE, {
    boardId,
  })
  boardSocket?.off()
  boardSocket?.disconnect()
}

// 修改看板權限
const modifyBoardViewPermission = (payload: interfaces.IModifyBoardViewPermission) => {
  boardSocket.emit(events.BOARD_MODIFY_VIEW_SET, payload)
}

// 看板封存設定
const archiveBoard = (payload: interfaces.IArchiveBoardPayload) => {
  boardSocket.emit(events.BOARD_ARCHIVE, payload)
}

// 新增列表
const createList = (payload: interfaces.ICreateListPayload) => {
  boardSocket.emit(events.BOARD_CREATE_LIST, payload)
}

// 修改看板標題
const modifyBoardTitle = (payload: interfaces.IModifyBoardTitlePayload) => {
  boardSocket.emit(events.BOARD_MODIFY_TITLE, payload)
}

// 開啟/關閉單一列表
const archiveList = (payload: interfaces.IArchiveBoardListPayload) => {
  boardSocket.emit(events.BOARD_LIST_ARCHIVE, payload)
}

// 看板新增標籤
const createNewBoardTag = (payload: interfaces.ICreateNewBoardTagPayload) => {
  boardSocket.emit(events.BOARD_CREATE_NEW_TAG, payload)
}

// 看板修改標籤
const modifyBoardTag = (payload: interfaces.IModifyBoardTagPayload) => {
  boardSocket.emit(events.BOARD_MODIFY_TAG, payload)
}

// 看板刪除標籤
const deleteBoardTag = (payload: interfaces.IDeleteBoardTagPayload) => {
  boardSocket.emit(events.BOARD_DELETE_TAG, payload)
}

// 看板新增卡片
const createCard = (payload: interfaces.ICreateCardPayload) => {
  boardSocket.emit(events.BOARD_CARD_CREATE, payload)
}

// 看板修改卡片
const modifyCard = (payload: interfaces.IModifyCardPayload) => {
  boardSocket.emit(events.BOARD_CARD_MODIFY, payload)
}

// 在卡片新增標籤
const attachTagToCard = (payload: interfaces.IAttachTagToCard) => {
  boardSocket.emit(events.ATTACH_TAG_TO_CARD, payload)
}

// 在卡片移除標籤
const removeTagFromCard = (payload: interfaces.IRemoveTagFromCard) => {
  boardSocket.emit(events.REMOVE_TAG_FROM_CARD, payload)
}
const moveCard = () => undefined
const deleteCard = () => undefined
const moveList = () => undefined
const deleteList = () => undefined
export default useBoardService
