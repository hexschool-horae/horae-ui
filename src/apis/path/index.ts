export default {
  POST_SIGN_UP: '/user/sign-up',
  POST_USER_LOGIN: '/user/login',
  PATCH_USER_EMAIL_VERIFY: '/user/email-verify',
  POST_USER_FORGOT_PWD: '/user/forgot-pwd',
  POST_USER_LOGIN_GOOGLE: '/user/login-google',
  POST_USER_LOGOUT: '/user/logout',
  PATCH_USER_PROFILE: '/user/profile',
  GET_USER_PROFILE: '/user/profile',
  GET_USER_BOARDS: '/user/boards',
  PUT_USER_RESET_PWD: '/user/reset-pwd',
  POST_WORK_SPACE: '/work-space',
  GET_WORK_SPACE: '/work-space',
  GET_WORK_SPACE_BY_ID: '/work-space/:w-id',
  DELETE_WORK_SPACE_BY_ID: '/work-space/:w-id',
  PATCH_WORK_SPACE_BY_ID: '/work-space/:w-id',
  GET_WORKSPACE_MEMBERS_BY_ID: '/work-space/:w-id/members',
  POST_WORKSPACE_INVITATION_LINK_BY_ID: '/work-space/:w-id/invitation-link',
  POST_WORKSPACE_INVITATION_SNED_MAIL_BY_ID: '/work-space/:w-id/invitation-sendMail',
  POST_WORKSPACE_MEMBERS_BY_ID_AND_HASH: '/work-space/:w-id/members/:hashData',
  DELETE_WORKSPACE_MEMBES_BY_ID: '/work-space/:w-id/members',
  PATCH_WORK_SPACE_MEMBERS_BY_ID: '/work-space/:w-id/members',
  POST_BOARD: '/board',
  GET_BOARD: '/board',
  PATCH_BOARD_BY_ID: '/board/:board-id',
  PATCH_BOARD_VISIBLE_BY_ID: '/board/:board-id/visible',
  DELETE_BOARD_BY_ID: '/board/:board-id/delete',
  GET_BOARD_BY_ID: '/board',
  GET_BOARDS_ALL_MEMBERS_BY_ID: '/board',
  POST_BOARD_MEMBERS_BY_ID: '/board',
  PATCH_BOARD_MEMBERS_BY_ID: '/board',
  DELETE_BOARD_MEMBERS_BY_ID: '/board',
  POST_BOARD_INVITATION_LINK_BY_ID: '/board',
  GET_BOARD_INVITATION_DATA_BY_ID: '/board',
  POST_BOARD_COVER_BY_ID: '/board/:board-id/cover',
  PUT_BOARD_COVER_BY_ID: '/board/:board-id/cover',
  DELETE_BOARD_COVER_BY_ID: '/board/:board-id/cover',
  POST_BOARD_LIST_BY_ID: '/board/:board-id/list',
  PATCH_BOARD_LIST_BY_ID: '/board/:board-id/list/:list-id',
  PATCH_BOARD_LIST_VISIBLE_BY_ID: '/board/:board-id/list/:list-id/visable',
  GET_BOARD_LIST_BY_ID: '/board/:board-id/list',
  POST_LIST_CARD_BY_ID: '/list/:list-id/card',
  PUT_CARD_BY_ID: '/card/:card-id',
  PATCH_CARD_VISIBLE_BY_ID: '/card/:card-id/visible',
  GET_CARD_BY_ID: '/card',
  POST_CARD_ATTACH_BY_ID: '/card/:card-id/attach',
}
