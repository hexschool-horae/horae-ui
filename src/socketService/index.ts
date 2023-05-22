import namespace from '@/socketService/namespace'
import socketService from '@/socketService/service'

export const useBoardService = () => socketService.useBoardService(namespace.BOARD)
export const useCardService = () => socketService.useCardService(namespace.CARD)
