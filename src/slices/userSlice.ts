import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IUserInitialState {
  isLogin: boolean
  token: string | null
}

const initialState: IUserInitialState = {
  isLogin: false,
  token: null,
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
  },
})

export const { setIsLogin, setToken } = userSlice.actions //給React組件個別使用

export default userSlice.reducer //給store.js使用
