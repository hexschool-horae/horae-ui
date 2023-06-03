import { FC, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayoutContextProvider from '@/contexts/adminLayoutContext'
import Header from '@/components/common/admin/Header'
import Sidebar from '@/components/common/admin/Sidebar'
interface IAdminLayoutProps {
  children: ReactNode
}

const AdminLayout: FC<IAdminLayoutProps> = ({ children }) => {
  const router = useRouter()
  const [boardId, setBoardId] = useState('')

  useEffect(() => {
    const boardId: string = router.query.boardId as string
    if (router.isReady) {
      setBoardId(boardId)
    }
  }, [router.isReady, router.pathname])
  return (
    <AdminLayoutContextProvider>
      <div className="flex flex-col h-full">
        <Header boardId={boardId} />
        <div className="flex flex-1 overflow-y-auto">
          <Sidebar className="h-full overflow-y-auto" boardId={boardId} />
          <div className="w-full h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </AdminLayoutContextProvider>
  )
}

export default AdminLayout
