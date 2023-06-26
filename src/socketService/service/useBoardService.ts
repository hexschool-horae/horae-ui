import { Socket } from 'socket.io-client'
import * as interfaces from '@/socketService/types/board.d'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'

import { Manager } from 'socket.io-client'
const URL = process.env.NEXT_PUBLIC_SOCKET_SERVER || ''
import store from '@/app/store'

import { boardSliceActions } from '@/slices/boardSlice'
import { errorSliceActions } from '@/slices/errorSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { updateUserTheme } from '@/slices/userSlice'

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
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CARD_MODIFY_RESULT, data => {
    console.log('監聽修改單一卡片是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_MODIFY_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateCard(data.result))
      store.dispatch(boardSliceActions.updateListCard(data.result))
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

  // 監聽新增看板標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CREATE_NEW_TAG_RESULT, data => {
    console.log('監聽新增看板標籤是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CREATE_NEW_TAG_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardTags(data.result))
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

  // 監聽修改看板標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TAG_RESULT, data => {
    console.log('監聽修改看板標籤是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TAG_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardTags(data.result))
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

  // 監聽刪除看板標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_DELETE_TAG_RESULT, data => {
    console.log('監聽刪除看板標籤是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_DELETE_TAG_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardTags(data.result))
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

  // 監聽看板卡片加入標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.ATTACH_TAG_TO_CARD_RESULT, data => {
    console.log('監聽看板卡片加入標籤是否成功:', data)
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateCardTags(data.result))
      store.dispatch(boardSliceActions.updateListCardTags(data.result))
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

  // 監聽看板卡片刪除標籤是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.REMOVE_TAG_FROM_CARD_RESULT, data => {
    console.log('監聽看板卡片刪除標籤是否成功:', data)
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateCardTags(data.result))
      store.dispatch(boardSliceActions.updateListCardTags(data.result))
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

  // // 監聽看板更新封面成功
  // boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_UPDATE_COVER, () => undefined)

  // 監聽卡片新增評論是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.ADD_NEW_CARD_COMMENT_RESULT, data => {
    console.log('監聽卡片新增評論是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.ADD_NEW_CARD_COMMENT_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateCardComments(data.result))
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

  // 監聽卡片修改評論是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.MODIFT_CARD_COMMENT_RESULT, data => {
    console.log('監聽卡片修改評論是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.MODIFT_CARD_COMMENT_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateCardComments(data.result))
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

  // 監聽卡片刪除評論是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.DELETE_CARD_COMMENT_RESULT, data => {
    console.log('監聽卡片刪除評論是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.DELETE_CARD_COMMENT_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateCardComments(data.result))
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

  // 監聽封存列表是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_ARCHIVE_LIST_RESULT, () => undefined)

  // 監聽 新增卡片 todo 標題是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.ADD_CARD_TODO_TITLE_RESULT, data => {
    console.log('監聽 新增卡片 todo 標題是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.ADD_CARD_TODO_TITLE_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.addNewTodoList(data.result))
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

  // 監聽 修改卡片 todo 標題是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.MODIFY_CARD_TODO_TITLE_RESULT, data => {
    console.log('監聽 修改卡片 todo 標題是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.MODIFY_CARD_TODO_TITLE_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateTodoLists(data.result))
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

  // 監聽 刪除卡片 todo 標題是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.DELETE_CARD_TODO_RESULT, data => {
    console.log('監聽 刪除卡片 todo 標題是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.DELETE_CARD_TODO_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateTodoLists(data.result))
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

  // 監聽 新增卡片細項是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.ADD_CARD_TODO_CONTENT_RESULT, data => {
    console.log('監聽 新增卡片細項是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.ADD_CARD_TODO_CONTENT_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateTodoLists(data.result))
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

  // 監聽 修改卡片細項是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.MODIFY_CARD_TODO_CONTENT_RESULT, data => {
    console.log('監聽 修改卡片細項是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.MODIFY_CARD_TODO_CONTENT_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateTodoLists(data.result))
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

  // 監聽 刪除卡片細項是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.DELETE_CARD_TODO_CONTENT_RESULT, data => {
    console.log('監聽 刪除卡片細項是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.DELETE_CARD_TODO_CONTENT_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateTodoLists(data.result))
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

  // 監聽 修改列表標題是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MODIFY_LIST_TITLE_RESULT, data => {
    console.log('監聽 修改列表標題是否成功:', data)
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

  // 監聽 移動看板列表是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MOVE_LIST_POSITION_RESULT, data => {
    console.log('監聽 移動看板列表是否成功:', data)
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

  // 監聽 移動看板卡片是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MOVE_CARD_POSITION_RESULT, data => {
    console.log('監聽 移動看板卡片是否成功:', data)
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

  // 監聽 修改看板成員權限是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MODIFY_MEMBER_PERMISSION_RESULT, data => {
    console.log('監聽 修改看板成員權限是否成功:', data)
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardMembersList(data.result))
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

  // 監聽 刪除看板成員是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_DELETE_MEMBER_RESULT, () => undefined)

  // 監聽 看板新增成員是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_ADD_MEMBER_RESULT, () => undefined)

  // 監聽 新增卡片成員是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CARD_ADD_MEMBER_RESULT, data => {
    console.log('監聽 卡片新增成員是否成功:', data)
    if (data.code !== -1) {
      store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_ADD_MEMBER_RESULT))
      store.dispatch(boardSliceActions.updateCardMembers(data.result))
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

  // 監聽 刪除卡片成員是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CARD_DELETE_MEMBER_RESULT, data => {
    console.log('監聽 刪除卡片成員是否成功:', data)
    if (data.code !== -1) {
      store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_DELETE_MEMBER_RESULT))
      store.dispatch(boardSliceActions.updateCardMembers(data.result))
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

  // 監聽 修改看板標題是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TITLE_RESULT, data => {
    console.log('監看修改看板標題是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TITLE_RESULT))
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

  // 監聽 修改看板封面是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_UPDATE_COVER_RESULT, data => {
    console.log('監看修改看板封面是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_UPDATE_COVER_RESULT))

    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateBoardCover(data.result.coverPath))
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

  // 監聽看板刪除封面成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_DELETE_COVER_RESULT, data => {
    console.log('監看刪除看板封面是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_DELETE_COVER_RESULT))

    if (data.code !== -1) {
      //  清空封面、清空主題背景
      store.dispatch(boardSliceActions.updateBoardCover(''))
      store.dispatch(updateUserTheme({ themeColor: '', textColor: '' }))
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

  // 監聽卡片上傳附件是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CARD_UPLOAD_ATTACHMENT_RESULT, data => {
    console.log('監聽 卡片上傳附件是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_UPLOAD_ATTACHMENT_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateCardAttachment(data.result))
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

  // 監聽卡片刪除附件是否成功
  boardSocket.on(SOCKET_EVENTS_ENUM.BOARD_CARD_DELETE_ATTACHMENT_RESULT, data => {
    console.log('監聽卡片刪除附件是否成功:', data)
    store.dispatch(dialogSliceActions.popSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_DELETE_ATTACHMENT_RESULT))
    if (data.code !== -1) {
      store.dispatch(boardSliceActions.updateCardAttachment(data.result))
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
    modifyListTitle,
    archiveBoardList,
    moveCard,
    deleteCard,
    moveBoardList,
    deleteList,
    addNewTodoTitle,
    modifyTodoTitle,
    deleteTodo,
    addTodoContent,
    modifyTodoContent,
    deleteTodoContent,
    modifyBoardMemberPermission,
    deleteBoardMember,
    addBoardMember,
    addCardMember,
    deleteCardMember,
    addCardAttachment,
    deleteCardAttachment,
    updateBoardCover,
    deleteBoardCover,
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

// 新增卡片評論
const addCardComment = (payload: interfaces.IAddCardComment) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.ADD_NEW_CARD_COMMENT, payload)
}

// 修改卡片評論
const modifyCardComment = (payload: interfaces.IModifyCardComment) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.MODIFT_CARD_COMMENT, payload)
}

// 刪除卡片評論
const deleteCardComment = (payload: interfaces.IDeleteCardComment) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.DELETE_CARD_COMMENT, payload)
}

// 修改列表標題
const modifyListTitle = (payload: interfaces.IBoardModifyListTitle) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_MODIFY_LIST_TITLE, payload)
}

// 封存看板列表
const archiveBoardList = (payload: interfaces.IArchiveBoardListPayload) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_ARCHIVE_LIST, payload)
}

// 新增卡片 todo 標題
const addNewTodoTitle = (payload: interfaces.IAddNewTodoTitle) => {
  console.log(payload)
  boardSocket.emit(SOCKET_EVENTS_ENUM.ADD_CARD_TODO_TITLE, payload)
}

// 修改卡片 todo 標題
const modifyTodoTitle = (payload: interfaces.IModifyTodoTitle) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.MODIFY_CARD_TODO_TITLE, payload)
}

// 刪除卡片 todo 標題
const deleteTodo = (payload: interfaces.IDeleteTodo) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.DELETE_CARD_TODO, payload)
}

// 新增卡片 todo 內容
const addTodoContent = (payload: interfaces.IAddTodoContent) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.ADD_CARD_TODO_CONTENT, payload)
}

// 修改 todo 內容
const modifyTodoContent = (payload: interfaces.IModifyTodoContent) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.MODIFY_CARD_TODO_CONTENT, payload)
}

// 刪除 todo 內容
const deleteTodoContent = (payload: interfaces.IDeleteTodoContent) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.DELETE_CARD_TODO_CONTENT, payload)
}

// 移動看板列表
const moveBoardList = (payload: interfaces.IModifyBoardListPosition) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_MOVE_LIST_POSITION, payload)
}

// 移動卡片位置
const moveCard = (payload: interfaces.IModifyBoardCardPosition) => {
  boardSocket.emit(SOCKET_EVENTS_ENUM.BOARD_MOVE_CARD_POSITION, payload)
}

// 修改看板成員權限
const modifyBoardMemberPermission = (payload: interfaces.IModifyBoardMemberPermission) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_MODIFY_MEMBER_PERMISSION, payload)
}

// 刪除看板成員
const deleteBoardMember = (payload: interfaces.IDeleteBoardMember) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_DELETE_MEMBER, payload)
}

// 新增看板成員
const addBoardMember = (payload: interfaces.IAddBoardMember) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_ADD_MEMBER, payload)
}

// 新增卡片成員
const addCardMember = (payload: interfaces.IAddCardMember) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_CARD_ADD_MEMBER, payload)
}

// 刪除卡片成員
const deleteCardMember = (payload: interfaces.IDeleteCardMember) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_CARD_DELETE_MEMBER, payload)
}

// 增加卡片附件
const addCardAttachment = (payload: interfaces.IAddCardAttachment) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_CARD_UPLOAD_ATTACHMENT, payload)
}

// 增加卡片附件
const deleteCardAttachment = (payload: interfaces.IDeleteCardAttachment) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_CARD_DELETE_ATTACHMENT, payload)
}

// 更新看板封面
const updateBoardCover = (payload: interfaces.IBoardUpdateCover) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_UPDATE_COVER, payload)
}

// 刪除看板封面
const deleteBoardCover = (payload: interfaces.IBoardDeleteCover) => {
  boardSocket?.emit(SOCKET_EVENTS_ENUM.BOARD_DELETE_COVER, payload)
}

const deleteCard = () => undefined
const deleteList = () => undefined
export default useBoardService
