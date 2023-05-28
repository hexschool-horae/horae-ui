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
/**
 * B02-2 登入者所有工作區標題清單
 */
export interface IUserBoardDataRes {
  title: string
  _id: string
}
/** B01-9 取得使用者所有工作區看板 */
export interface IUserBoardDataResponse {
  data: IUserBoardResponse[]
}
/** B02-5 取得單一工作區 */
export interface IWorkSpaceByIdDataResponse {
  data: {
    boards: IUserBoardResponse[]
    discribe: string
    status: string
    title: string
    viewSet: string
    yourPermission: string
    yourRole: string
    _id: string
  }
}
/** B02-6 取得單一工作區成員 */
export interface IWorkSpaceMembersByIdDataResponse {
  data: IWorkSpaceMembersByIdResponse[]
}
/** B02-7 單一工作區產生邀請連結 */
export interface InvitationLinkDataResponse {
  data: {
    invitationLink: string
  }
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
