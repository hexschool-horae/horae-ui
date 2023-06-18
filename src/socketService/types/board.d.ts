import { Timestamp, ITag } from '@/apis/interface/api'

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
  startDate: Timestamp
  endDate: Timestamp
  proiority: string
}

export interface IListCard {
  listId: string
  cardId: string
  title: string
  proiority: string
}

export interface IListCardTags {
  listId: string
  cardId: string
  tags: ITag[]
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
  members: [
    {
      userId: {
        _id: string
        name: string
      }
      role: string
      _id: string
    }
  ]
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

// 新增卡片 todo 標題
export interface IAddNewTodoTitle {
  cardId: string
  boardId: string
  title: string
}

// 修改卡片 todo 標題
export interface IModifyTodoTitle {
  cardId: string
  titleId: string
  boardId: string
  title: string
}

// 刪除卡片 todo 標題
export interface IDeleteTodo {
  cardId: string
  titleId: string
  boardId: string
}

// 新增卡片細項
export interface IAddTodoContent {
  cardId: string
  titleId: string
  boardId: string
  content: string
}

// 編輯卡片細項
export interface IModifyTodoContent {
  cardId: string
  boardId: string
  contentId: string
  content: string
  completed: boolean
}

// 編輯卡片細項
export interface IDeleteTodoContent {
  cardId: string
  boardId: string
  contentId: string
}

export interface IModifyBoardMemberPermission {
  role: string
  userId: string
  boardId: string
}

export interface IDeleteBoardMember {
  userId: string
  boardId: string
}

export interface IAddBoardMember {
  boardId: string
  hashData: string
}

// 移動列表位置
export interface IModifyBoardListPosition {
  boardId: string
  listId: string
  finalPosition: number
}

// 卡片成員新增
export interface IAddCardMember {
  cardId: string
  memberId: string
  boardId: string
}

// 卡片成員移除
export interface IDeleteCardMember {
  cardId: string
  memberId: string
  boardId: string
}

// 卡片新增附件
export interface IAddCardAttachment {
  cardId: string
  boardId: string
  file: File
}

// 卡片刪除附件
export interface IDeleteCardAttachment {
  cardId: string
  boardId: string
  fileId: string
}

// 看板新增封面
export interface IBoardUpdateCover {
  boardId: string
  fileURL: string
}

// 看板刪除封面
export interface IBoardDeleteCover {
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
  modifyCard: (payload: IModifySingleCard) => void
  attachTagToCard: (payload: IAttachTagToCard) => void
  removeTagFromCard: (payload: IRemoveTagFromCard) => void
  addCardComment: (payload: IAddCardComment) => void
  modifyCardComment: (payload: IModifyCardComment) => void
  deleteCardComment: (payload: IDeleteCardComment) => void
  modifyListTitle: (payload: IBoardModifyListTitle) => void
  addNewTodoTitle: (payload: IAddNewTodoTitle) => void
  modifyTodoTitle: (payload: IModifyTodoTitle) => void
  deleteTodo: (payload: IDeleteTodo) => void
  addTodoContent: (payload: IAddTodoContent) => void
  modifyTodoContent: (payload: IModifyTodoContent) => void
  deleteTodoContent: (payload: IDeleteTodoContent) => void
  moveBoardList: (payload: IModifyBoardListPosition) => void
  moveCard: () => undefined
  deleteCard: () => undefined
  deleteList: () => undefined
  modifyBoardMemberPermission: (payload: IModifyBoardMemberPermission) => void
  deleteBoardMember: (payload: IDeleteBoardMember) => void
  addBoardMember: (payload: IAddBoardMember) => void
  addCardMember: (payload: IAddCardMember) => void
  deleteCardMember: (payload: IDeleteCardMember) => void
  addCardAttachment: (payload: IAddCardAttachment) => void
  deleteCardAttachment: (payload: IDeleteCardAttachment) => void
  updateBoardCover: (payload: IBoardUpdateCover) => void
  deleteBoardCover: (payload: IBoardDeleteCover) => void
  terminateService: (boardId: string) => void
}
