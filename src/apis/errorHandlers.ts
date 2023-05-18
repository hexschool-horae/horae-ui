const httpErrorHandler = (status: number, message: string) => {
  switch (status) {
    case 400:
      response400(message)
      break

    case 401:
      response401(message)
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
  alert(message)
}

const response401 = (message: string) => {
  alert(message)
}

const response404 = () => {
  alert('404，訪問的頁面不存在')
}

const response405 = () => {
  alert('405，方法錯誤，請求拒絕')
}

const response451 = () => {
  alert('451，憑證過期')
}

const response500 = () => {
  alert('500+，伺服器錯誤，請通知系統人員')
}

const responseSpecial = () => {
  alert('請通知系統人員')
}

export { httpErrorHandler, response401, response404, response405, response451, response500, responseSpecial }
