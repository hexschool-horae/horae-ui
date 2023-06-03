export interface IRegisterForm {
  email: string
  password: string
}

export interface IRegisterResponse {
  user: {
    token: string
  }
}

/** 所有工作區標題清單 */
export interface IUserBoardResponse {
  title: string
  _id: string
  boards: Boards[]
}
/** 看板 */
export interface Boards {
  coverPath: string
  title: string
  _id: string
}

/** 單一工作區成員*/
export interface IWorkSpaceMembersByIdResponse {
  userId: {
    _id: string
    name: string
    email: string
  }
  role: string
  _id: string
}
export interface PatchMembersDataRequest {
  userId: string
  role: string
}
export interface DeleteMembersDataRequest {
  userId: string
}
export interface IProfileData {
  data: {
    name: string
    email: string
    _id: string
  }
}
/** B01-9 取得使用者所有工作區看板 */
export interface IUserBoardDataResponse {
  data: IUserBoardResponse[]
}
/**
 * B02-2 登入者所有工作區標題清單
 */
export interface IUserBoardDataRes {
  title: string
  _id: string
}
/**
 * B02-3 修改單一工作區(含權限)
 */
export interface IWorkSpaceEditDataRequest {
  title: string
  discribe: string
  viewSet: string
  status: string
}
/** B02-5 取得單一工作區 */
export interface IWorkSpaceByIdDataResponse {
  data: IBoardResponse
}
export interface IBoardResponse {
  boards: IUserBoardResponse[]
  discribe: string
  status: string
  title: string
  viewSet: string
  yourPermission: string
  yourRole: string
  _id: string
}
/** B02-6 取得單一工作區成員 */
export interface IWorkSpaceMembersByIdDataResponse {
  data: {
    members: IWorkSpaceMembersByIdResponse[]
    title: string
    viewSet: string
  }
}
/** B02-7 單一工作區產生邀請連結 */
export interface InvitationLinkDataResponse {
  message: string
  data: {
    invitationLink: string
  }
}

/** B02-12 取得工作區邀請資料 */
export interface InvitationDataResponse {
  message: string
  data: InvitationData
}

/** 工作區邀請資料 */
export interface InvitationData {
  title: string
  inviter: string
}

/** B05-4 取得單一卡片 */
type Timestamp = number

export interface ITag {
  _id: string
  title: string
  color: string
}

export interface IComment {
  _id?: string
  content: string
  date: string
}

export interface ITodoList {
  _id: string
  title: string
  contentList: ITodo[]
}
export interface ITodo {
  _id: string
  content: string
  completed: boolean
}

export interface ICardDetail {
  _id: string
  title: string
  describe: string
  startDate: Timestamp
  endDate: Timestamp
  // members: []
  comments: IComment[]
  tags: ITag[]
  todolists: ITodoList[]
  // attachments: []
  proiority: string
  coverPath: string
  position: number
}

export interface ICardDetailResponse {
  data: ICardDetail
}

/** B03-13 取得單一看板的所有標籤 */
type IBoardTags = {
  boardId: string
} & ITag

export interface IBoardTagsResponse {
  data: IBoardTags[]
}

/** B03-14 單一看板新增標籤 */
export interface IPostBoardTagsRequest {
  title: string
  color: string
}

export interface IPostBoardTagsResponse {
  data: string
}

/** B03-15 單一看板設定單一標籤 */
export interface IPutBoardTagsRequest {
  tagId: string
  title: string
  color: string
}

/** B03-16 單一看板刪除標籤 */
export interface IDeleteBoardTagsRequest {
  tagId: string
}

/** B03-5 取得單一看板 */
export interface ISingleBoardResponse {
  [key: string]: {
    _id: string
    title: string
    discribe?: string
    coverPath?: string
    viewSet?: string
    members?: [
      {
        userId: {
          _id: string
          name: string
        }
        role: string
        _id: string
      }
    ]
    lists: Array<{
      _id: string
      title: string
      status?: string
      position: number
      cards: Array<{
        _id: string
        title: string
        startDate?: string
        endDate?: string
        tags?: any[]
        proiority?: string
        position: number
      }>
    }>
  }
}

/** B05-9 在卡片新增標籤 */
export interface IPostCardTagRequest {
  tagId: string
}

/** B05-10 在卡片移除標籤 */
export interface IDeleteCardTagRequest {
  tagId: string
}
