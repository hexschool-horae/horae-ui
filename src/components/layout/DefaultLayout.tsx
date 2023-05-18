import { ReactNode } from 'react'
import FrontHeader from '@/components/common/FrontHeader'
import FrontFooter from '../common/FrontFooter'
import { useRouter } from 'next/router'

export default function DefaultLayout({ children }: { children?: ReactNode }) {
  const router = useRouter()
  const showFrontHeader = router.pathname === '/'
  return (
    <>
      {showFrontHeader && <FrontHeader />}
      <main className="main">{children}</main>
      <FrontFooter />
    </>
  )
}
