import { useRouter } from 'next/router'
import { useEffect, ReactNode } from 'react'
import { useAppSelector } from '@/hooks/useAppStore'

// 不需要權限驗證的路由
const nonAuthPaths = ['/login', '/sign-up', '/']

const RouterGuard = ({ children }: { children?: ReactNode }) => {
  const router = useRouter()
  const { pathname } = router
  const isLogin = useAppSelector(state => state.user.isLogin)

  // 路由權限驗證
  useEffect(() => {
    console.log(pathname)
    // 看板不受登入的影響
    if (pathname === '/board/[boardId]' || pathname === '/board/[boardId]/members/[id]') return

    if (isLogin) {
      if (nonAuthPaths.indexOf(pathname) !== -1) {
        router.push('/board')
      }
    } else {
      if (nonAuthPaths.indexOf(pathname) === -1) {
        router.push('/login')
      }
    }
  }, [router, pathname, isLogin])

  return <>{children}</>
}

export default RouterGuard
