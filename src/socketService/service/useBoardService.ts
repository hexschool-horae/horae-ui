import { useEffect } from 'react'
import manager from '@/hooks/useSocketIO'
import { Socket } from 'socket.io-client'
import * as interfaces from '@/socketService/types/board.d'
import events from '@/socketService/sockets.events'
import { useRouter } from 'next/router'

import { useAppDispatch } from '@/hooks/useAppStore'
import { setLists } from '@/slices/boardSocketSlice'

import { ISingleBoardResponse } from '@/apis/interface/api'

let boardSocket: Socket

// 會需要 board id 是要讓 socket 加入房間
export const useBoardService = (namespace: string) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (router.isReady) {
      const boardId = router.query?.boardId as string
      // 跟看板命名空間建立連線
      boardSocket = manager.socket(namespace)

      // 監聽連線
      boardSocket.on('connect', () => {
        console.log('boardSocket connect')
        // 加入看板 room
        boardSocket.emit(events.BOARD_JOIN, {
          boardId,
        })
      })

      // 監聽是否建立看板成功
      boardSocket.on(events.BOARD_CREATE_LIST_SUCCESS, data => {
        console.log('events.BOARD_CREATE_LIST_SUCCESS = ', data)
        const {
          result: { lists },
        } = data as ISingleBoardResponse

        dispatch(setLists(lists))
      })

      // 監聽是否建立看板失敗
      boardSocket.on(events.BOARD_CREATE_LIST_FAILED, data => {
        console.log('events.BOARD_CREATE_LIST_FAILED = ', data)
      })

      // 監聽是否建立卡片成功
      boardSocket.on(events.BOARD_CARD_CREATE_SUCCESS, data => {
        console.log('events.BOARD_CARD_CREATE_SUCCESS = ', data)
      })
      // 監聽是否建立卡片失敗
      boardSocket.on(events.BOARD_CARD_CREATE_FAILED, data => {
        console.log('events.BOARD_CARD_CREATE_FAILED = ', data)
      })
      // component 被 destroy 的時候，要離開房間並且斷掉連線
      return () => {
        boardSocket.emit(events.BOARD_LEAVE, {
          boardId,
        })
        boardSocket?.off()
        boardSocket?.disconnect()
      }
    }
  }, [router.isReady])
  return {
    createCard,
    moveCard,
    deleteCard,
    createList,
    moveList,
    deleteList,
  }
}

const createCard = (payload: interfaces.ICreateCardPayload) => {
  boardSocket.emit(events.BOARD_CARD_CREATE, payload)
}
const moveCard = () => undefined
const deleteCard = () => undefined
const createList = (payload: interfaces.ICreateListPayload) => {
  boardSocket.emit(events.BOARD_CREATE_LIST, payload)
}
const moveList = () => undefined
const deleteList = () => undefined

export default useBoardService
