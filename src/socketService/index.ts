import namespace from '@/socketService/sockets.namespace'
import socketService from '@/socketService/service'

export const useBoardService = (boardId: string) => socketService.useBoardService(namespace.BOARD, boardId)
export const useCardService = () => socketService.useCardService(namespace.CARD)
