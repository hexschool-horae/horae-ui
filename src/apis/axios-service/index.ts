import axiosFetcher from '@/apis/axios'
import apiPath from '@/apis/path'
import * as interfaces from '@/apis/interface/api'

export const POST_SIGN_UP = (payload: interfaces.IRegisterForm) => {
  return axiosFetcher.post<interfaces.IRegisterResponse>(apiPath.POST_SIGN_UP, payload)
}

export const POST_USER_LOGIN = (payload: interfaces.IRegisterForm) => {
  return axiosFetcher.post<interfaces.IRegisterResponse>(apiPath.POST_USER_LOGIN, payload)
}

export const POST_USER_LOGOUT = () => {
  return axiosFetcher.post(apiPath.POST_USER_LOGOUT)
}

/**
 * B01-8 取得使用者個人資訊
 */
export const GET_USER_PROFILE = () => {
  return axiosFetcher.get<interfaces.IProfileData>(apiPath.GET_USER_PROFILE)
}

/**
 * B01-9 取得使用者所有工作區看板
 */
export const GET_USER_BOARDS = () => {
  return axiosFetcher.get<interfaces.IUserBoardDataResponse>(apiPath.GET_USER_BOARDS)
}

/** B02-3 修改單一工作區(含權限) */
export const PATCH_WORK_SPACE = (workId: string, data: interfaces.IWorkSpaceEditDataRequest) => {
  return axiosFetcher.patch(`${apiPath.GET_WORK_SPACE}/${workId}`, data)
}

/** B02-4 刪除單一工作區 */
export const DELETE_WORKSPACE = (workId: string, date: object) => {
  return axiosFetcher.DELETE(`${apiPath.GET_WORK_SPACE}/${workId}`, date)
}

export const GET_ALL_WORK_SPACE = () => {
  return axiosFetcher.get<interfaces.IUserBoardDataRes[]>(`${apiPath.GET_WORK_SPACE}`)
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

/** B02-9 單一工作區新增成員 */
export const POST_WORKSPACE_NEW_MEMBERS = (workId: string, hashData: string) => {
  return axiosFetcher.post(`${apiPath.GET_WORK_SPACE}/${workId}/members/${hashData}`)
}

/** B02-10 單一工作區設定單一成員權限 */
export const PATCH_WORK_SPACE_MEMBER = (workId: string, date: interfaces.PatchMembersDataRequest) => {
  return axiosFetcher.patch(`${apiPath.GET_WORK_SPACE}/${workId}/members`, date)
}

/** B02-11 單一工作區刪除單一成員 */
export const DELETE_WORKSPACE_MEMBER = (workId: string, date: interfaces.DeleteMembersDataRequest) => {
  return axiosFetcher.DELETE(`${apiPath.GET_WORK_SPACE}/${workId}/members`, date)
}

/** B02-12 取得工作區邀請資料 */
export const GET_INVITATION_DATA = (workId: string) => {
  return axiosFetcher.get<interfaces.InvitationDataResponse>(`${apiPath.GET_WORK_SPACE}/${workId}/invitation-data`)
}

/** B03-5 取得單一看板 */
export const GET_BOARD_BY_ID = (boardId: string) => {
  return axiosFetcher.get<interfaces.ISingleBoardResponse>(`${apiPath.GET_BOARD_BY_ID}/${boardId}`)
}

/** B03-6 取得單一看板的所有成員 */
export const GET_BOARD_ALL_MEMBERS = (boardId: string) => {
  return axiosFetcher.get<interfaces.IBoardAllMembersDataResponse>(`${apiPath.GET_BOARD_BY_ID}/${boardId}/members`)
}

/** B03-13 取得單一看板的所有標籤 */
export const GET_BOARD_TAGS_BY_ID = (boardId: string) => {
  return axiosFetcher.get<interfaces.IBoardTagsResponse>(`${apiPath.GET_BOARD}/${boardId}/tags`)
}

/** B03-14 單一看板新增標籤 */
export const POST_BOARD_TAGS_BY_ID = (boardId: string, data: interfaces.IPostBoardTagsRequest) => {
  return axiosFetcher.post<interfaces.IPostBoardTagsResponse>(`${apiPath.GET_BOARD}/${boardId}/tags`, data)
}

/** B03-15 單一看板設定單一標籤 */
export const PUT_BOARD_TAGS_BY_ID = (boardId: string, data: interfaces.IPutBoardTagsRequest) => {
  return axiosFetcher.put(`${apiPath.GET_BOARD}/${boardId}/tags`, data)
}

/** B03-16 單一看板刪除標籤 */
export const DELETE_BOARD_TAGS_BY_ID = (boardId: string, data: interfaces.IDeleteBoardTagsRequest) => {
  return axiosFetcher.DELETE(`${apiPath.GET_BOARD}/${boardId}/tags`, data)
}

/** B05-9 在卡片新增標籤 */
export const POST_CARD_TAG_BY_ID = (cardId: string, data: interfaces.IPostCardTagRequest) => {
  return axiosFetcher.post(`${apiPath.GET_CARD_BY_ID}/${cardId}/tag`, data)
}

/** B05-10 在卡片移除標籤 */
export const DELETE_CARD_TAG_BY_ID = (cardId: string, data: interfaces.IDeleteCardTagRequest) => {
  return axiosFetcher.DELETE(`${apiPath.GET_CARD_BY_ID}/${cardId}/tag`, data)
}

/** B05-4 取得單一卡片 */
export const GET_CARD_BY_ID = (cardId: string) => {
  return axiosFetcher.get<interfaces.ICardDetailResponse>(`${apiPath.GET_CARD_BY_ID}/${cardId}`)
}

/** B05-2 修改單一卡片(基本資訊) */
export const PATCH_CARD_BASIC_INFO_BY_ID = (cardId: string, data: interfaces.IPatchCardBasicInfoRequest) => {
  return axiosFetcher.patch(`${apiPath.GET_CARD_BY_ID}/${cardId}`, data)
}

/** B05-11 卡片評論新增 */
export const POST_CARD_COMMENT_BY_ID = (cardId: string, data: interfaces.IPostCardCommentRequest) => {
  return axiosFetcher.post<interfaces.IPostCardCommentResponse>(`${apiPath.GET_CARD_BY_ID}/${cardId}/comment`, data)
}

/** B05-12 卡片評論修改  */
export const PUT_CARD_COMMENT_BY_ID = (cardId: string, data: interfaces.IPutCardCommentRequest) => {
  return axiosFetcher.put(`${apiPath.GET_CARD_BY_ID}/${cardId}/comment`, data)
}

/** B05-20 卡片成員新增 */
export const POST_CARD_MEMBER = (cardId: string, data: interfaces.IPostCardMemberRequest) => {
  return axiosFetcher.post(`${apiPath.GET_CARD_BY_ID}/${cardId}/member`, data)
}

/** B05-21 卡片成員刪除 */
export const DELETE_CARD_MEMBER = (cardId: string, data: interfaces.IDeleteCardMemberRequest) => {
  return axiosFetcher.DELETE(`${apiPath.GET_CARD_BY_ID}/${cardId}/member`, data)
}
