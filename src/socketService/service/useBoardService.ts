import { Socket } from 'socket.io-client'
import * as interfaces from '@/socketService/types/board.d'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'

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
    boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_JOIN, {
      boardId,
    })
  })

  // 監聽看板新增列表是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CREATE_LIST_RESULT, data => {
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardList(data.result.lists))
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

  // 監聽修改單一卡片是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CARD_MODIFY_RESULT, () => undefined)

  // 監聽新增看板標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CREATE_NEW_TAG_RESULT, () => undefined)

  // 監聽修改看板標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TAG_RESULT, () => undefined)

  // 監聽刪除看板標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_DELETE_TAG_RESULT, () => undefined)

  // 監聽看板卡片加入標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.ATTACH_TAG_TO_CARD_RESULT, () => undefined)

  // 監聽看板卡片刪除標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.REMOVE_TAG_FROM_CARD_RESULT, () => undefined)

  // 監聽卡片新增評論是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.ADD_NEW_CARD_COMMENT_RESULT, () => undefined)

  // 監聽卡片修改評論是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.MODIFT_CARD_COMMENT_RESULT, () => undefined)

  // 監聽卡片刪除評論是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.DELETE_CARD_COMMENT_RESULT, () => undefined)

  // 監聽看板新增卡片是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CARD_CREATE_RESULT, data => {
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardList(data.result.lists))
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

  // 監聽修改看板標題是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TITLE_RESULT, data => {
    console.log('監看修改看板標題是否成功:', data)
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

  // 監聽修改看板權限是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MODIFY_VIEW_SET_RESULT, data => {
    console.log('監看修改看板權限是否成功:', data)
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardViewSet(data.result.viewSet))
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

  // 監聽關閉看板是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_ARCHIVE_RESULT, data => {
    console.log('監看關閉看板是否成功:', data)
    if (data.code !== -1) {
      // store.dispatch(boardSliceActions.updateBoardViewSet(data.result))
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
    addCardComment,
    modifyCardComment,
    deleteCardComment,
    moveCard,
    deleteCard,
    moveList,
    deleteList,
    terminateService,
  }
}

const terminateService = (boardId: string) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_LEAVE, {
    boardId,
  })
  boardSocket?.off()
  boardSocket?.disconnect()
}

// 修改看板權限
const modifyBoardViewPermission = (payload: interfaces.IModifyBoardViewPermission) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_MODIFY_VIEW_SET, payload)
}

// 看板封存設定
const archiveBoard = (payload: interfaces.IArchiveBoardPayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_ARCHIVE, payload)
}

// 新增列表
const createList = (payload: interfaces.ICreateListPayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_CREATE_LIST, payload)
}

// 修改看板標題
const modifyBoardTitle = (payload: interfaces.IModifyBoardTitlePayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TITLE, payload)
}

// 開啟/關閉單一列表
const archiveList = (payload: interfaces.IArchiveBoardListPayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_LIST_ARCHIVE, payload)
}

// 看板新增標籤
const createNewBoardTag = (payload: interfaces.ICreateNewBoardTagPayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_CREATE_NEW_TAG, payload)
}

// 看板修改標籤
const modifyBoardTag = (payload: interfaces.IModifyBoardTagPayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TAG, payload)
}

// 看板刪除標籤
const deleteBoardTag = (payload: interfaces.IDeleteBoardTagPayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_DELETE_TAG, payload)
}

// 看板新增卡片
const createCard = (payload: interfaces.ICreateCardPayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_CARD_CREATE, payload)
}

// 看板修改卡片
const modifyCard = (payload: interfaces.IModifySingleCard) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_CARD_MODIFY, payload)
}

// 在卡片新增標籤
const attachTagToCard = (payload: interfaces.IAttachTagToCard) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.ATTACH_TAG_TO_CARD, payload)
}

// 在卡片移除標籤
const removeTagFromCard = (payload: interfaces.IRemoveTagFromCard) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.REMOVE_TAG_FROM_CARD, payload)
}

const addCardComment = (payload: interfaces.IAddCardComment) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.ADD_NEW_CARD_COMMENT, payload)
}

const modifyCardComment = (payload: interfaces.IModifyCardComment) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.MODIFT_CARD_COMMENT, payload)
}

const deleteCardComment = (payload: interfaces.IDeleteCardComment) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.DELETE_CARD_COMMENT, payload)
}

const moveCard = () => undefined
const deleteCard = () => undefined
const moveList = () => undefined
const deleteList = () => undefined
export default useBoardService
