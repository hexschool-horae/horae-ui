import axiosFetcher from '@/apis/axios'
import apiPath from '@/apis/path'
import * as interfaces from '@/apis/interface/api'

export const POST_SIGN_UP = (payload: interfaces.IRegisterForm) => {
  return axiosFetcher.post<interfaces.IRegisterResponse>(apiPath.POST_SIGN_UP, payload)
}

export const POST_USER_LOGIN = (payload: interfaces.IRegisterForm) => {
  return axiosFetcher.post<interfaces.IRegisterResponse>(apiPath.POST_USER_LOGIN, payload)
}

/**
 * B01-9 取得使用者所有工作區看板
 */
export const GET_USER_BOARDS = () => {
  return axiosFetcher.get<interfaces.IUserBoardDataResponse>(apiPath.GET_USER_BOARDS)
}

/** B02-5 取得單一工作區 */
export const GET_WORK_SPACE = (workId: string) => {
  return axiosFetcher.get<interfaces.IWorkSpaceByIdDataResponse>(`${apiPath.GET_WORK_SPACE}/${workId}`)
}

/** B02-6 取得單一工作區成員 */
export const GET_WORKSPACE_MEMBERS_BY_ID = (workId: string) => {
  return axiosFetcher.get<interfaces.IWorkSpaceMembersByIdDataResponse>(`${apiPath.GET_WORK_SPACE}/${workId}/members`)
}

/** B02-7 單一工作區產生邀請連結 */
export const POST_WORKSPACE_INVITATION_LINK_BY_ID = (workId: string) => {
  return axiosFetcher.post<interfaces.InvitationLinkDataResponse>(`${apiPath.GET_WORK_SPACE}/${workId}/invitation-link`)
}

/** B02-8 單一工作區寄email給被邀請人 */
export const POST_WORKSPACE_INVITATION_SEND_MAIL = (workId: string) => {
  return axiosFetcher.post(`${apiPath.GET_WORK_SPACE}/${workId}/invitation-sendMail`)
}

/** B02-10 單一工作區設定單一成員權限 */
export const PATCH_WORK_SPACE_MEMBER = (workId: string, date: interfaces.PatchMembersDataRequest) => {
  return axiosFetcher.patch(`${apiPath.GET_WORK_SPACE}/${workId}/members`, date)
}

/** B03-5 取得單一看板 */
export const GET_BOARD_BY_ID = (boardId: string) => {
  return axiosFetcher.get<interfaces.ISingleBoardResponse>(`${apiPath.GET_BOARD_BY_ID}/${boardId}`)
}
