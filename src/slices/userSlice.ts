import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

interface IUserInitialState {
  isLogin: boolean
  token: string | null
  profile: {
    email: string
  }
}

const initialState: IUserInitialState = {
  isLogin: false,
  token: null,

  profile: {
    email: '',
  },
}

const userPersistConfig = {
  key: 'user',
  storage: storage,
  whitelist: ['token'], // 只保存 'token' 字段到本地存储
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setProfile(state, action: PayloadAction<string>) {
      console.log('setProfile = ', action.payload, state.profile)
      state.profile.email = action.payload
    },
  },
})

export const { setIsLogin, setToken, setProfile } = userSlice.actions //給React組件個別使用

export default persistReducer(userPersistConfig, userSlice.reducer) //給store.js使用
