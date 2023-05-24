import { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import manager from '@/hooks/useSocketIO'
let cardSocket: Socket
export const useCardService = (namespace: string) => {
  useEffect(() => {
    cardSocket = manager.socket(namespace)
    cardSocket.on('connect', () => {
      console.log('board connect')
    })
    return () => {
      cardSocket?.off()
      cardSocket?.disconnect()
    }
  }, [])
  return {
    createComment,
    updateComment,
    deleteComment,
    createLabel,
    updateLabel,
    deleteLabel,
  }
}

const createComment = () => undefined
const updateComment = () => undefined
const deleteComment = () => undefined
const createLabel = () => undefined
const updateLabel = () => undefined
const deleteLabel = () => undefined

export default useCardService
