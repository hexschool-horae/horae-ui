import type { EnhancedStore } from '@reduxjs/toolkit'
import { AppDispatch } from '@/app/store'
import { setIsLogin } from '@/slices/userSlice'

const httpErrorHandler = (status: number, message: string, store: EnhancedStore) => {
  switch (status) {
    case 400:
      response400(message)
      break

    case 401:
      response401(message, store)
      break

    case 404:
      response404()
      break

    case 405:
      response405()
      break

    case 451:
      response451()
      break

    case 500:
      response500()
      break

    default:
      responseSpecial()
      break
  }
}

const response400 = (message: string) => {
  console.warn(message)
}

const response401 = (message: string, store: EnhancedStore) => {
  // 新增登出機制
  alert(message)
  const dispatch: AppDispatch = store.dispatch
  dispatch(setIsLogin(false))
}

const response404 = () => {
  console.warn('404，訪問的頁面不存在')
}

const response405 = () => {
  console.warn('405，方法錯誤，請求拒絕')
}

const response451 = () => {
  console.warn('451，憑證過期')
}

const response500 = () => {
  console.warn('500+，伺服器錯誤，請通知系統人員')
}

const responseSpecial = () => {
  console.warn('請通知系統人員')
}

export { httpErrorHandler, response401, response404, response405, response451, response500, responseSpecial }
