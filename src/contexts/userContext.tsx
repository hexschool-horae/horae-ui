import { createContext, useState, FC, ReactNode } from 'react'

// 定義default state
interface IStateType {
  isLogin: boolean
  token: string
}

// 定義 context type
interface IUserContextType {
  state: IStateType
  setUserIsLogin: (isLogin: boolean) => void
  setUserToken: (token: string) => void
}

type UserProviderProps = {
  children?: ReactNode
}

export const UserContext = createContext({} as IUserContextType)

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false)
  const [token, setToken] = useState('')

  // 設置是否登入
  const setUserIsLogin = (isLogin: boolean) => {
    setIsLogin(isLogin)
  }

  // 設置token
  const setUserToken = (token: string) => {
    setToken(token)
  }

  const value = {
    state: { isLogin, token },
    setUserIsLogin,
    setUserToken,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
