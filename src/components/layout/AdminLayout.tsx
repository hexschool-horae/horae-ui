import { ReactNode } from 'react'
import BackHeader from '../common/BackHeader'
import BackSideBar from '../common/BackSideBar'
import AdminLayoutContextProvider from '@/contexts/adminLayoutContext'

export default function Admin({ children }: { children?: ReactNode }) {
  return (
    <AdminLayoutContextProvider>
      <div className="flex flex-col h-full">
        <BackHeader className="h-full overflow-y-auto" />
        <div className="flex flex-1 overflow-y-auto">
          <BackSideBar className="h-full overflow-y-auto" />
          <main className="main back-main bg-secondary-4 p-12 h-full overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminLayoutContextProvider>
  )
}