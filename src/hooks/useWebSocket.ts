import { useEffect } from 'react'
import { socket } from '@/apis/socket-service/board'

export const useWebSocket = () => {
  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('board is connecting!')
    })

    socket.on('disconnect', () => {
      console.log('board disconnect')
    })

    return () => {
      socket.disconnect()
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return
}
