import { ReactNode } from 'react'
import BackHeader from '../common/BackHeader'
import BackSideBar from '../common/BackSideBar'
import AdminLayoutContextProvider from '@/contexts/adminLayoutContext'
import { useRouter } from 'next/router'

export default function Admin({ children }: { children?: ReactNode }) {
  const router = useRouter()
  const isShowSideBar = !router.query.hashData

  return (
    <AdminLayoutContextProvider>
      <div className="flex flex-col h-full">
        <BackHeader className="h-full overflow-y-auto" />
        <div className="flex flex-1 overflow-y-auto">
          {/* <BackSideBar className="h-full overflow-y-auto" /> */}
          {isShowSideBar && <BackSideBar className="h-full overflow-y-auto" />}
          <main
            className={`main bg-secondary-4 p-12 h-full overflow-y-auto ${
              isShowSideBar ? 'back-main' : 'back-main-w-full'
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </AdminLayoutContextProvider>
  )
}
