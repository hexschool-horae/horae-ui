import axios from 'axios'
import { httpErrorHandler } from './errorHandlers'
import { RootState } from '@/app/store'

import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import type { EnhancedStore } from '@reduxjs/toolkit'
import type { IBasicResponse } from '@/types/api'

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
      console.log(response)
      const { status, data } = response
      const { message } = data

      httpErrorHandler(status, message)
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
    const response = await instance.post<T>(clarifiedPath, data)

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
  }
}

async function patch<T>(url: string, data: unknown, isAuth = true) {
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
    const response = await instance.patch<T>(clarifiedPath, data)

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
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
    const response = await instance.get<T>(clarifiedPath)

    return response.data
  } catch (error) {
    console.warn(error)
    throw error
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
    const response = await instance.put<T>(clarifiedPath, data)

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
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
    const response = await instance.delete<T>(clarifiedPath, {
      data,
    })

    const { data: responseData } = response
    return responseData
  } catch (error) {
    console.warn(error)
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
  }
)
export default axiosFetcher
