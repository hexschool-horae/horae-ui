import { FC, ReactNode, useEffect, useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import AdminLayoutContextProvider from '@/contexts/adminLayoutContext'
import Header from '@/components/common/admin/Header'
import Sidebar from '@/components/common/admin/Sidebar'
import { Toast } from 'primereact/toast'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { errorSliceActions } from '@/slices/errorSlice'
import classes from '@/components/layout/AdminLayout.module.scss'

interface IAdminLayoutProps {
  children: ReactNode
}

const AdminLayout: FC<IAdminLayoutProps> = ({ children }) => {
  const router = useRouter()
  const [boardId, setBoardId] = useState('')
  const errorMessages = useAppSelector(state => state.error.errors)
  const theme = useAppSelector(state => state.board.singleBaord?.covercolor) || ''
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
    console.log('boardId = ', boardId, theme)
  }, [router.isReady, router.pathname])
  const themeMapping: { [key: string]: string } = useMemo(() => {
    return {
      ['theme1']: 'bg-theme1-content',
      ['theme2']: 'bg-theme2-content',
      ['theme3']: 'bg-theme3-content',
    }
  }, [])
  return (
    <AdminLayoutContextProvider>
      <div className={`flex flex-col h-full ${classes.theme1}`}>
        <Header boardId={boardId} theme={theme} />
        <div className="flex flex-1 overflow-y-auto">
          <Sidebar boardId={boardId} theme={theme} />
          <div
            className={`w-full h-full overflow-y-auto py-[50px] px-[64px] ${boardId ? 'bg-white' : 'bg-secondary-4'} ${
              theme && boardId ? themeMapping[theme] : ''
            }`}
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
