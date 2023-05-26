import { ReactNode, memo, useEffect } from 'react'
import { socket } from '@/apis/socket-service/board'

// import { io } from 'socket.io-client'

// // "undefined" means the URL will be computed from the `window.location` object
// const url = 'http://localhost:3050'

// export const socket = io(url, {
//   // autoConnect: false,
// })

// export const emitBoardPermisson = (event: 0 | 1 | 2 | null = null) => {
//   socket.emit('patchBoardPermisson', event)
// }
// export const emitListOrder = async (event: { source: number; destination: number } | null = null) => {
//   socket.emit('patchListOrder', event)
// }
// // type TEvevt = (value: any) => void
// export const onBoardPermisson = (event: any) => {
//   socket.on('onBoardPermisson', value => event(value))
// }

// export const onListOrder = (event: any) => {
//   socket.on('onListOrder', value => event(value))
// }

const WebSocketWrapper = ({ children }: { children?: ReactNode }) => {
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

  return <div>{children}</div>
}

export default memo(WebSocketWrapper)
