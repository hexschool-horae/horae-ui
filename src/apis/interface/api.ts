export interface IBasicResponse {
  success: boolean
  message: string
}

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
  userId: IUserId
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
  data: IUserId
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
export interface ISingleBoardResponse extends IBasicResponse {
  data: {
    _id: string
    title: string
    discribe: string
    coverPath: string
    viewSet: '' | 'public' | 'private' | 'workspace'
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
}

/** B03-6 取得單一看板的所有成員 */
export interface IBoardAllMembersDataResponse {
  data: IBoardAllMembersData
}
export interface IBoardAllMembersData {
  title: string
  viewSet: string
  members: IBoardMembers[]
}
export interface IBoardMembers {
  userId: IUserId
  role: string
  inviteHashData: string
  _id: string
}
export interface IUserId {
  _id: string
  name: string
  email: string
  isSelected: boolean
}

/** B03-8 單一看板設定成員權限 */
export interface IBoardMembersPermissionResponse extends IBasicResponse {
  data: {
    userId: {
      _id: string
      name: string
      email: string
    }
    role: string
    inviteHashData: string
    _id: string
  }[]
}

export interface IBoardInvitationLinkResponse extends IBasicResponse {
  data: {
    invitationLink: string
  }
}

/** B03-12 取得看板邀請資料 */
export interface IBoardInvitationDataResponse extends IBasicResponse {
  data: {
    title: string
    inviter: string
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

/** B05-4 取得單一卡片 */
export type Timestamp = number | null

export interface ITag {
  _id: string
  title: string
  color: string
}

export interface IComment {
  _id: string
  comment: string
  createdAt: string
  user: {
    _id: string
    name: string
  }
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

export interface IBoardMember {
  userId: {
    _id: string
    name: string
    email: string
  }
  inviteHashData: string
  role: string
  _id: string
}
export interface IMembers {
  userId: {
    _id: string
    name: string
  }
  role: string
  _id: string
}

export interface IAttachment {
  id: string
  createdAt: string
  title: string
  url: string
}

export interface ICardDetail {
  _id: string
  title: string
  describe: string
  startDate: null | Timestamp
  endDate: null | Timestamp
  members: IMembers[]
  comments: IComment[]
  tags: ITag[]
  todolists: ITodoList[]
  attachments: IAttachment[]
  proiority: string
  coverPath: string
  position: number
  updateUser: string
  createdAt: string
  updateAt: string
}

export interface ICardDetailResponse {
  data: ICardDetail
}

/** B05-2 修改單一卡片(基本資訊) */
export interface IPatchCardBasicInfoRequest {
  title: string
  describe: string
  startDate: null | Timestamp
  endDate: null | Timestamp
  proiority: string
}

/** B05-11 卡片評論新增 */
export interface IPostCardCommentRequest {
  comment: string
}
export interface IPostCardCommentResponse {
  data: string
}
/** B05-12 卡片評論修改 */
export interface IPutCardCommentRequest {
  commentId: string
  comment: string
}

/** B05-13 卡片評論刪除 */
export interface IDeleteCardCommentRequest {
  commentId: string
}

/** B05-20 卡片成員新增 */
export interface IPostCardMemberRequest {
  memberId: string
}
/** B05-21 卡片成員刪除 */
export interface IDeleteCardMemberRequest {
  memberId: string
}
