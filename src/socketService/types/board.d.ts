export interface ICreateListPayload {
  title: string
  boardId: string
}

export interface IModifyBoardViewPermission {
  boardId: string
  viewSet: 'private' | 'public'
}

export interface ICreateCardPayload {
  title: string
  boardId: string
  listId: string
}

export interface IModifyCardPayload {
  title: string
  boardId: string
  cardId: string
  title: string
  describe: string
  startDate: Date
  endDate: Date
  proiority: number
}

export interface IAttachTagToCard {
  boardId: string
  cardId: string
  tagId: string
}

export interface IRemoveTagFromCard {
  boardId: string
  cardId: string
  tagId: string
}

// 修改看板標題 payload
export interface IModifyBoardTitlePayload {
  title: string
  boardId: string
}

export interface IArchiveBoardPayload {
  status: 'open' | 'close'
  boardId: string
}

export interface IArchiveBoardListPayload {
  status: 'open' | 'close'
  boardId: string
}

export interface ICreateNewBoardTagPayload {
  title: string
  color: string
  boardId: string
}

export interface IModifyBoardTagPayload {
  title: string
  color: string
  boardId: string
  tagId: string
}

export interface IDeleteBoardTagPayload {
  boardId: string
  tagId: string
}

export interface ISingleBoardInterface {
  success: string
  message: string
  data: {
    _id: string
    title: string
    discribe: string
    coverPath: string
    viewSet: string
    members: {
      userId: {
        _id: string
        name: string
      }
      role: string
      _id: string
    }[]
    lists: {
      _id: string
      title: string
      status: string
      position: number
      cards: {
        _id: string
        title: string
        startDate: number
        endDate: number
        tags: {
          _id: string
          title: string
          color: string
        }[]
        comments: {
          _id: string
          comment: string
          user: {
            _id: string
            name: string
            createdAt: string
          }
          card: string
        }[]
        proiority: string
        position: number
      }[]
    }[]
    yourRole: string
    yourPermission: string
  }
}

export interface IInitialBoardService {
  token: string
  boardId: string
}

export type IBoardService = {
  createList: (payload: ICreateListPayload) => void
  createCard: (payload: ICreateCardPayload) => void
  modifyBoardViewPermission: (payload: IModifyBoardViewPermission) => void
  archiveBoard: (payload: IArchiveBoardPayload) => void
  modifyBoardTitle: (payload: IModifyBoardTitlePayload) => void
  archiveList: (payload: IArchiveBoardListPayload) => void
  createNewBoardTag: (payload: ICreateNewBoardTagPayload) => void
  modifyBoardTag: (payload: IModifyBoardTagPayload) => void
  deleteBoardTag: (payload: IDeleteBoardTagPayload) => void
  modifyCard: (payload: IModifyCardPayload) => void
  attachTagToCard: (payload: IAttachTagToCard) => void
  removeTagFromCard: (payload: IRemoveTagFromCard) => void
  moveCard: () => undefined
  deleteCard: () => undefined
  moveList: () => undefined
  deleteList: () => undefined
  terminateService: (boardId: string) => void
}
