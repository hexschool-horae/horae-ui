import axios from 'axios'
import { httpErrorHandler } from './errorHandlers'
import { RootState } from '@/app/store'

import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import type { EnhancedStore } from '@reduxjs/toolkit'
import type { IBasicResponse } from '@/types/api'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { IUploadFileRequest } from './interface/api'
import { UploadFileType } from './enum/api'

// app.js建立時，會注入store
let store: EnhancedStore | null = null

export const injectStore = (_store: EnhancedStore) => {
  store = _store
}

const baseURL = 'https://horae-api-5x0d.onrender.com/'

const instance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// axios instance request/response基本設定
instance.interceptors.response.use(
  (response: AxiosResponse<IBasicResponse>) => {
    return Promise.resolve(response)
  },
  error => {
    if (<AxiosError>error) {
      const { response }: { response: AxiosResponse } = error
      const { status, data } = response
      const { message } = data

      if (store !== null) httpErrorHandler(status, message, store)

      // return Promise.resolve(response)
    }

    return Promise.reject(error)
  }
)

// api回傳的data，可以透過泛型傳入格式
async function post<T>(url: string, data?: unknown | null, isAuth = true) {
  try {
    if (store === null) throw new Error('data from redux-toolkit store is null!')

    // 取得store中的state
    const rootState: RootState = store.getState()

    // 取得 store 裡的 token
    const { user } = rootState
    const { token } = user

    // 是否帶入驗證
    if (isAuth) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }

    // 檢核傳送 data 是否為 null，改變 request content-type
    if (data === null) {
      instance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      instance.defaults.headers['Content-Type'] = 'application/json'
    }

    const clarifiedPath = url.replace(/[^ -~]/g, '')
    store.dispatch(dialogSliceActions.pushSpinnerQueue(url))
    const response = await instance.post<T>(clarifiedPath, data)

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
  } finally {
    if (store) {
      store.dispatch(dialogSliceActions.popSpinnerQueue(url))
    }
  }
}

async function patch<T>(url: string, data?: unknown, isAuth = true) {
  try {
    if (store === null) throw new Error('data from redux-toolkit store is null!')

    // 取得store中的state
    const rootState: RootState = store.getState()

    // 取得 store 裡的 token
    const { user } = rootState
    const { token } = user

    if (isAuth) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }

    const clarifiedPath = url.replace(/[^ -~]/g, '')
    store.dispatch(dialogSliceActions.pushSpinnerQueue(url))
    const response = await instance.patch<T>(clarifiedPath, data)

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
  } finally {
    if (store) {
      store.dispatch(dialogSliceActions.popSpinnerQueue(url))
    }
  }
}

async function get<T>(url: string, isAuth = true) {
  try {
    if (store === null) throw new Error('data from redux-toolkit store is null!')

    // 取得store中的state
    const rootState: RootState = store.getState()

    // 取得 store 裡的 token
    const { user } = rootState
    const { token } = user

    if (isAuth) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }

    const clarifiedPath = url.replace(/[^ -~]/g, '')
    store.dispatch(dialogSliceActions.pushSpinnerQueue(url))
    const response = await instance.get<T>(clarifiedPath)

    return response.data
  } catch (error) {
    console.warn(error)
    throw error
  } finally {
    if (store) {
      store.dispatch(dialogSliceActions.popSpinnerQueue(url))
    }
  }
}

async function put<T>(url: string, data: unknown, isAuth = true) {
  try {
    if (store === null) throw new Error('data from redux-toolkit store is null!')

    // 取得store中的state
    const rootState: RootState = store.getState()

    // 取得 store 裡的 token
    const { user } = rootState
    const { token } = user

    if (isAuth) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }

    const clarifiedPath = url.replace(/[^ -~]/g, '')
    store.dispatch(dialogSliceActions.pushSpinnerQueue(url))
    const response = await instance.put<T>(clarifiedPath, data)

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
  } finally {
    if (store) {
      store.dispatch(dialogSliceActions.popSpinnerQueue(url))
    }
  }
}

async function DELETE<T>(url: string, data: unknown, isAuth = true) {
  try {
    if (store === null) throw new Error('data from redux-toolkit store is null!')

    // 取得store中的state
    const rootState: RootState = store.getState()

    // 取得 store 裡的 token
    const { user } = rootState
    const { token } = user

    if (isAuth) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }

    const clarifiedPath = url.replace(/[^ -~]/g, '')
    store.dispatch(dialogSliceActions.pushSpinnerQueue(url))
    const response = await instance.delete<T>(clarifiedPath, {
      data,
    })

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
  } finally {
    if (store) {
      store.dispatch(dialogSliceActions.popSpinnerQueue(url))
    }
  }
}

async function uploadFile<T>(url: string, data: unknown, isAuth = true) {
  try {
    if (store === null) throw new Error('data from redux-toolkit store is null!')

    // 取得store中的state
    const rootState: RootState = store.getState()

    // 取得 store 裡的 token
    const { user } = rootState
    const { token } = user

    // 是否帶入驗證
    if (isAuth) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete instance.defaults.headers.common['Authorization']
    }

    // 檢核傳送 data 是否為 null，改變 request content-type
    if (data === null) {
      instance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      instance.defaults.headers['Content-Type'] = 'multipart/form-data'
    }

    const { dto, fileData } = data as IUploadFileRequest
    const formData = new FormData()

    if (dto.type === UploadFileType.FILE) {
      formData.append(UploadFileType.FILE, fileData)
    }

    const clarifiedPath = url.replace(/[^ -~]/g, '')
    store.dispatch(dialogSliceActions.pushSpinnerQueue(url))
    const response = await instance.post<T>(clarifiedPath, formData)

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
  } finally {
    if (store) {
      store.dispatch(dialogSliceActions.popSpinnerQueue(url))
    }
  }
}

const axiosFetcher = Object.assign(
  {},
  {
    instance,
    post,
    patch,
    get,
    put,
    DELETE,
    uploadFile,
  }
)
export default axiosFetcher
