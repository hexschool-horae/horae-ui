import manager from '@/hooks/useSocketIO'
let cardSocket = null
export const useCardService = (namespace: string) => {
  cardSocket = manager.socket(namespace)
  cardSocket.on('connect', () => {
    console.log('board connect')
  })
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
