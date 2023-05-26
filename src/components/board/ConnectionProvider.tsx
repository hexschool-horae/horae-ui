import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { socket } from '@/apis/socket-service/board'
import { useDispatch } from 'react-redux'

import { setIsConnected } from '@/slices/boardSocketSlice'

export default function ConnectionProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const onConnect = () => {
      dispatch(setIsConnected(true))
    }

    const onDisconnect = () => {
      dispatch(setIsConnected(false))
    }

    // 設定 autoConnect: false，需手動連接
    socket.connect()
    // 監聽 connect 事件

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.disconnect()
    }
  }, [])

  return <> {children}</>
}
