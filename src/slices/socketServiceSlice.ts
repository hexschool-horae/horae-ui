import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { IBoardService } from '@/socketService/types/board'
import * as interfaces from '@/socketService/types/board.d'
import { useBoardService } from '@/socketService'

interface ISocketServiceInitialState {
  boardService: IBoardService | null
  boardId?: string | null
}

const initialState: ISocketServiceInitialState | null = {
  boardService: null,
  boardId: '',
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
        state.boardId = ''
      }
    },
    createList(state, action: PayloadAction<interfaces.ICreateListPayload>) {
      state.boardService?.createList(action.payload)
    },
    modifyBoardViewPermission(state, action: PayloadAction<interfaces.IModifyBoardViewPermission>) {
      console.log(action.payload)
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
    modifyCard(state, action: PayloadAction<interfaces.IModifySingleCard>) {
      state.boardService?.modifyCard(action.payload)
    },
    attachTagToCard(state, action: PayloadAction<interfaces.IAttachTagToCard>) {
      state.boardService?.attachTagToCard(action.payload)
    },
    removeTagFromCard(state, action: PayloadAction<interfaces.IRemoveTagFromCard>) {
      state.boardService?.removeTagFromCard(action.payload)
    },
    addCardComment(state, action: PayloadAction<interfaces.IAddCardComment>) {
      state.boardService?.addCardComment(action.payload)
    },
    modifyCardComment(state, action: PayloadAction<interfaces.IModifyCardComment>) {
      state.boardService?.modifyCardComment(action.payload)
    },
    deleteCardComment(state, action: PayloadAction<interfaces.IDeleteCardComment>) {
      state.boardService?.deleteCardComment(action.payload)
    },
    modifyListTitle(state, action: PayloadAction<interfaces.IBoardModifyListTitle>) {
      state.boardService?.modifyListTitle(action.payload)
    },
    archiveBoardList(state, action: PayloadAction<interfaces.IArchiveBoardListPayload>) {
      state.boardService?.archiveList(action.payload)
    },
    moveBoardList(state, action: PayloadAction<interfaces.IModifyBoardListPosition>) {
      state.boardService?.moveBoardList(action.payload)
    },
    addNewTodoTitle(state, action: PayloadAction<interfaces.IAddNewTodoTitle>) {
      state.boardService?.addNewTodoTitle(action.payload)
    },
    modifyTodoTitle(state, action: PayloadAction<interfaces.IModifyTodoTitle>) {
      state.boardService?.modifyTodoTitle(action.payload)
    },
    deleteTodo(state, action: PayloadAction<interfaces.IDeleteTodo>) {
      state.boardService?.deleteTodo(action.payload)
    },
    addTodoContent(state, action: PayloadAction<interfaces.IAddTodoContent>) {
      state.boardService?.addTodoContent(action.payload)
    },
    modifyTodoContent(state, action: PayloadAction<interfaces.IModifyTodoContent>) {
      state.boardService?.modifyTodoContent(action.payload)
    },
    deleteTodoContent(state, action: PayloadAction<interfaces.IDeleteTodoContent>) {
      state.boardService?.deleteTodoContent(action.payload)
    },
    modifyBoardMemberPermission(state, action: PayloadAction<interfaces.IModifyBoardMemberPermission>) {
      state.boardService?.modifyBoardMemberPermission(action.payload)
    },
    deleteBoardMember(state, action: PayloadAction<interfaces.IDeleteBoardMember>) {
      state.boardService?.deleteBoardMember(action.payload)
    },
    addBoardMember(state, action: PayloadAction<interfaces.IAddBoardMember>) {
      state.boardService?.addBoardMember(action.payload)
    },
    addCardMember(state, action: PayloadAction<interfaces.IAddCardMember>) {
      state.boardService?.addCardMember(action.payload)
    },
    deleteCardMember(state, action: PayloadAction<interfaces.IDeleteCardMember>) {
      state.boardService?.deleteCardMember(action.payload)
    },
    updateBoardCover(state, action: PayloadAction<interfaces.IBoardUpdateCover>) {
      state.boardService?.updateBoardCover(action.payload)
    },
    deleteBoardCover(state, action: PayloadAction<interfaces.IBoardDeleteCover>) {
      state.boardService?.deleteBoardCover(action.payload)
    },
    setBoardId(state, action: PayloadAction<string>) {
      state.boardId = action.payload
    },
  },
})

export const socketServiceActions = socketServiceSlice.actions

export default socketServiceSlice.reducer //給store.js使用
