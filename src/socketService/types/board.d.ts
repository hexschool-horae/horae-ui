export interface ICreateListPayload {
  title: string
  boardId: string
}

export interface IModifyBoardViewPermission {
  boardId: string
  viewSet: 'private' | 'public' | 'workspace'
}

export interface ICreateCardPayload {
  title: string
  boardId: string
  listId: string
}

// 修改單一卡片
export interface IModifySingleCard {
  boardId: string
  cardId: string
  title: string
  describe: string
  startDate: Date
  endDate: Date
  proiority: string
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
  _id: string
  title: string
  discribe: string
  coverPath: string
  viewSet: '' | 'workspace' | 'public' | 'private'
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

export interface IInitialBoardService {
  token: string
  boardId: string
}

// 新增卡片評論
export interface IAddCardComment {
  comment: string
  cardId: string
  boardId: string
}

// 修改卡片評論
export interface IModifyCardComment {
  comment: string
  commentId: string
  cardId: string
  boardId: string
}

// 刪除卡片評論
export interface IDeleteCardComment {
  commentId: string
  cardId: string
  boardId: string
}

export interface IBoardModifyListTitle {
  title: string
  listId: string
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
  addCardComment: (payload: IAddCardComment) => void
  modifyCardComment: (payload: IModifyCardComment) => void
  deleteCardComment: (payload: IDeleteCardComment) => void
  modifyListTitle: (payload: IBoardModifyListTitle) => void
  moveCard: () => undefined
  deleteCard: () => undefined
  moveList: () => undefined
  deleteList: () => undefined
  terminateService: (boardId: string) => void
}
