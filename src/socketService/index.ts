import namespace from '@/socketService/sockets.namespace'
import socketService from '@/socketService/service'
import { IBoardService } from './types/board'

export const useBoardService = (boardId: string, token: string): IBoardService =>
  socketService.useBoardService(namespace.BOARD, boardId, token)
