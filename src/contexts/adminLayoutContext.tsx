import { GET_ALL_WORK_SPACE, GET_USER_BOARDS } from '@/apis/axios-service'
import { IUserBoardData, IUserBoardResponse } from '@/apis/interface/api'
import { createContext, ReactNode, useState } from 'react'

interface AdminLayoutContextType {
  handleGetUserBoardsData: () => Promise<void>
  handleGetWorkSpaceTitleData: () => Promise<void>
  userBoardsData: IUserBoardResponse[]
  userWorkSpaceList: IUserBoardData[]
  userWorkSpaceBoardMenuToggleStatus: IUserBoardMenuToggleStatus[]
}

interface IUserBoardMenuToggleStatus {
  id: string
  active: boolean
}

export const AdminLayoutContext = createContext<AdminLayoutContextType>({
  handleGetUserBoardsData: () => Promise.resolve(),
  handleGetWorkSpaceTitleData: () => Promise.resolve(),
  userBoardsData: [],
  userWorkSpaceList: [],
  userWorkSpaceBoardMenuToggleStatus: [],
})

interface AdminLayoutContextProviderProps {
  children?: ReactNode
}

const AdminLayoutContextProvider = ({ children }: AdminLayoutContextProviderProps) => {
  const [userBoardsData, setUserBoardsData] = useState<IUserBoardResponse[]>([]) // 使用者所有工作區看板
  const [userWorkSpaceList, setUserWorkSpaceList] = useState<IUserBoardData[]>([]) // 登入者所有工作區標題清單
  const [userWorkSpaceBoardMenuToggleStatus, setUserWorkSpaceBoardMenuToggleStatus] = useState<
    IUserBoardMenuToggleStatus[]
  >([])

  // B01-9 取得使用者所有工作區看板
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

  // B02-2 取得登入者所有工作區標題清單
  const handleGetWorkSpaceTitleData = async () => {
    try {
      const result = await GET_ALL_WORK_SPACE()
      setUserWorkSpaceList(result.data)
      const initialMenuToggleStatus = result.data.map(item => ({
        id: item._id,
        active: true,
      }))
      setUserWorkSpaceBoardMenuToggleStatus(initialMenuToggleStatus)
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <AdminLayoutContext.Provider
      value={{
        handleGetUserBoardsData,
        handleGetWorkSpaceTitleData,
        userBoardsData,
        userWorkSpaceList,
        userWorkSpaceBoardMenuToggleStatus,
      }}
    >
      {children}
    </AdminLayoutContext.Provider>
  )
}

export default AdminLayoutContextProvider
