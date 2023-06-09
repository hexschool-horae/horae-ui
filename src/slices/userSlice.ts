import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
interface IUserProfile {
  email: string
  avatar: string
  name: string
}
interface IUserInitialState {
  isLogin: boolean
  token: string | null
  profile: IUserProfile
}

const initialState: IUserInitialState = {
  isLogin: false,
  token: null,
  profile: {
    email: '',
    avatar: '',
    name: '',
  },
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
    setProfile(state, action: PayloadAction<IUserProfile>) {
      state.profile = action.payload
    },
  },
})

export const { setIsLogin, setToken, setProfile } = userSlice.actions //給React組件個別使用

export default userSlice.reducer
