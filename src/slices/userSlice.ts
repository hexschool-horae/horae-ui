import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface IthemeColor {
  themeColor: string
  textColor: string
}
const hexToRgb = (hex: string) => {
  if (hex === '') return
  // 移除可能的前缀，并保留六位十六进制数
  hex = hex.replace(/^#/, '')

  // 将Hex分量拆分为R、G和B
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 返回包含RGB分量的对象或字符串
  return { r: r, g: g, b: b }
}
interface IUserProfile {
  email: string
  avatar: string
  name: string
}
interface IUserInitialState {
  isLogin: boolean
  token: string | null
  themeColor: IthemeColor
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
  themeColor: { themeColor: '', textColor: '' },
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
    updateUserTheme(state, action: PayloadAction<IthemeColor>) {
      if (action.payload.themeColor !== '') {
        const hexColor = hexToRgb(action.payload.themeColor)

        if (hexColor && hexColor.b) {
          state.themeColor = {
            themeColor: action.payload.themeColor,
            textColor: hexColor.b < 125 ? '#ffffff' : '#000000',
          }
        }
      } else {
        state.themeColor = { themeColor: '', textColor: '' }
      }
    },
  },
})

export const { setIsLogin, setToken, setProfile, updateUserTheme } = userSlice.actions //給React組件個別使用

export default userSlice.reducer
