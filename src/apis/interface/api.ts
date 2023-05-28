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
