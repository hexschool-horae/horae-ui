import { useEffect } from 'react'
import manager from '@/hooks/useSocketIO'
import { Socket } from 'socket.io-client'
import * as interfaces from '@/socketService/types/board.d'
import events from '@/socketService/sockets.events'
let boardSocket: Socket
export const useBoardService = (namespace: string) => {
  useEffect(() => {
    boardSocket = manager.socket(namespace)
    boardSocket.on('connect', () => {
      console.log('board connect')
    })
    boardSocket.on(events.BOARD_CREATE_LIST_SUCCESS, data => {
      console.log('events.BOARD_CREATE_LIST_SUCCESS = ', data)
    })
    return () => {
      boardSocket?.disconnect()
    }
  }, [])
  return {
    createCard,
    moveCard,
    deleteCard,
    createList,
    moveList,
    deleteList,
  }
}

const createCard = () => undefined
const moveCard = () => undefined
const deleteCard = () => undefined
const createList = (payload: interfaces.ICreateListPayload) => {
  boardSocket.emit(events.BOARD_CREATE_LIST, payload)
}
const moveList = () => undefined
const deleteList = () => undefined

export default useBoardService
