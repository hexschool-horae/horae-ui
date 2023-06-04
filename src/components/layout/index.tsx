import { FC, PropsWithChildren, ReactNode } from 'react'

import { useAppSelector } from '@/hooks/useAppStore'
import DefaultLayout from '@/components/layout/DefaultLayout'
import AdminLayout from '@/components/layout/AdminLayout'

interface ILayout {
  children: ReactNode
}

const Layout: FC<PropsWithChildren<ILayout>> = ({ children }) => {
  const isLogin = useAppSelector(state => state.user.isLogin)
  if (!isLogin) {
    return <DefaultLayout>{children}</DefaultLayout>
  } else {
    return <AdminLayout>{children}</AdminLayout>
  }
}

export default Layout
