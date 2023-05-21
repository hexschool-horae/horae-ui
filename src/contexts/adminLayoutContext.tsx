import { GET_USER_BOARDS } from '@/apis/axios-service'
import { IUserBoardResponse } from '@/apis/interface/api'
import { createContext, ReactNode, useState } from 'react'

interface AdminLayoutContextType {
  handleGetUserBoardsData: () => Promise<void>
  userBoardsData: IUserBoardResponse[]
}

export const AdminLayoutContext = createContext<AdminLayoutContextType>({
  handleGetUserBoardsData: () => Promise.resolve(),
  userBoardsData: [],
})

interface AdminLayoutContextProviderProps {
  children?: ReactNode
}

const AdminLayoutContextProvider = ({ children }: AdminLayoutContextProviderProps) => {
  const [userBoardsData, setUserBoardsData] = useState<IUserBoardResponse[]>([])

  // 取得個人所有工作區看板資料
  const handleGetUserBoardsData = async () => {
    try {
      const response = await GET_USER_BOARDS()
      if (!response) return
      const data = response.data
      setUserBoardsData(data)
    } catch (error) {
      console.error('Error fetching user boards data:', error)
    }
  }

  return (
    <AdminLayoutContext.Provider value={{ handleGetUserBoardsData, userBoardsData }}>
      {children}
    </AdminLayoutContext.Provider>
  )
}

export default AdminLayoutContextProvider
