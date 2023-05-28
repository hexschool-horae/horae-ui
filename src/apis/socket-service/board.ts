import { io } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const url = 'http://localhost:3050'

export const socket = io(url, {
  //讓socket.io不會自動連線，而是透過.connect方法呼叫時才建立連線
  autoConnect: false,
})

export const emitBoardPermisson = (event: 0 | 1 | 2 | null = null) => {
  socket.emit('patchBoardPermisson', event)
}
export const emitListOrder = async (event: { source: number; destination: number } | null = null) => {
  socket.emit('patchListOrder', event)
}
// type TEvevt = (value: any) => void
export const onBoardPermisson = (event: any) => {
  socket.on('onBoardPermisson', value => event(value))
}

export const onListOrder = (event: any) => {
  socket.on('onListOrder', value => event(value))
}
