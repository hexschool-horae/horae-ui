import { FC, ReactNode, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import AdminLayoutContextProvider from '@/contexts/adminLayoutContext'
import Header from '@/components/common/admin/Header'
import Sidebar from '@/components/common/admin/Sidebar'
import { Toast } from 'primereact/toast'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { errorSliceActions } from '@/slices/errorSlice'

interface IAdminLayoutProps {
  children: ReactNode
}

const AdminLayout: FC<IAdminLayoutProps> = ({ children }) => {
  const router = useRouter()
  const [boardId, setBoardId] = useState('')

  const errorMessages = useAppSelector(state => state.error.errors)
  // const theme = useAppSelector(state => state.board.singleBaord?.covercolor) || ''
  const dispatch = useAppDispatch()
  const toastRef = useRef<Toast>(null)

  useEffect(() => {
    if (errorMessages.length > 0) {
      const latestErrorMessage = errorMessages.slice(-1)[0]
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error Message',
        detail: latestErrorMessage.message,
        life: 3000,
      })
      dispatch(errorSliceActions.popErrorMessage())
    }
  }, [errorMessages])

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
          <Sidebar boardId={boardId} />
          <div
            className={`w-full h-full overflow-x-auto overflow-y-auto
            ${boardId ? 'bg-white' : 'bg-secondary-4'} ${boardId ? '' : 'py-[50px] px-[64px]'}`}
          >
            {children}
          </div>
        </div>
      </div>
      <Toast ref={toastRef} position="bottom-left" />
    </AdminLayoutContextProvider>
  )
}

export default AdminLayout
