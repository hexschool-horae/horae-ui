import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IBoardService } from '@/socketService/types/board'
import * as interfaces from '@/socketService/types/board.d'
import { useBoardService } from '@/socketService'

interface ISocketServiceInitialState {
  boardService: IBoardService | null
  boardId?: string | null
  value: number
}

const initialState: ISocketServiceInitialState | null = {
  boardService: null,
  boardId: '',
  value: 0,
}

export const socketServiceSlice = createSlice({
  name: 'socketService',
  initialState,
  reducers: {
    initialBoardService(state, action: PayloadAction<interfaces.IInitialBoardService>) {
      const { token, boardId } = action.payload
      if (!state.boardService) {
        state.boardService = useBoardService(boardId, token)
        state.boardId = boardId
      }
    },
    terminateBoardService: state => {
      if (state.boardService) {
        state.boardService.terminateService(state.boardId || '')
        state.boardService = null
      }
    },
    createList(state, action: PayloadAction<interfaces.ICreateListPayload>) {
      state.boardService?.createList(action.payload)
    },
    modifyBoardViewPermission(state, action: PayloadAction<interfaces.IModifyBoardViewPermission>) {
      state.boardService?.modifyBoardViewPermission(action.payload)
    },
    archiveBoard(state, action: PayloadAction<interfaces.IArchiveBoardPayload>) {
      state.boardService?.archiveBoard(action.payload)
    },
    modifyBoardTitle(state, action: PayloadAction<interfaces.IModifyBoardTitlePayload>) {
      state.boardService?.modifyBoardTitle(action.payload)
    },
    archiveList(state, action: PayloadAction<interfaces.IArchiveBoardListPayload>) {
      state.boardService?.archiveList(action.payload)
    },
    createNewBoardTag(state, action: PayloadAction<interfaces.ICreateNewBoardTagPayload>) {
      state.boardService?.createNewBoardTag(action.payload)
    },
    modifyBoardTag(state, action: PayloadAction<interfaces.IModifyBoardTagPayload>) {
      state.boardService?.modifyBoardTag(action.payload)
    },
    deleteBoardTag(state, action: PayloadAction<interfaces.IDeleteBoardTagPayload>) {
      state.boardService?.deleteBoardTag(action.payload)
    },
    createCard(state, action: PayloadAction<interfaces.ICreateCardPayload>) {
      state.boardService?.createCard(action.payload)
    },
    modifyCard(state, action: PayloadAction<interfaces.IModifyCardPayload>) {
      state.boardService?.modifyCard(action.payload)
    },
    attachTagToCard(state, action: PayloadAction<interfaces.IAttachTagToCard>) {
      state.boardService?.attachTagToCard(action.payload)
    },
    removeTagFromCard(state, action: PayloadAction<interfaces.IRemoveTagFromCard>) {
      state.boardService?.removeTagFromCard(action.payload)
    },
    setBoardId(state, action: PayloadAction<string>) {
      state.boardId = action.payload
    },
  },
})

export const { initialBoardService, createList, terminateBoardService } = socketServiceSlice.actions

export default socketServiceSlice.reducer //給store.js使用
