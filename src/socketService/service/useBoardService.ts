import manager from '@/hooks/useSocketIO'
let boardSocket = null
export const useBoardService = (namespace: string) => {
  boardSocket = manager.socket(namespace)
  boardSocket.on('connect', () => {
    console.log('board connect')
  })

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
const createList = () => undefined
const moveList = () => undefined
const deleteList = () => undefined

export default useBoardService
