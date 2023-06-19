import { useRouter } from 'next/router'
import { useEffect, ReactNode } from 'react'
import { useAppSelector } from '@/hooks/useAppStore'

// 不需要權限驗證的路由
const nonAuthPaths = ['/login', '/sign-up', '/']
const boardRouters = [
  '/board/[boardId]',
  '/board/[boardId]/members/[id]',
  '/board/boardClosed',
  '/board/boardWithoutPermission',
]

const RouterGuard = ({ children }: { children?: ReactNode }) => {
  const router = useRouter()
  const { pathname } = router
  const isLogin = useAppSelector(state => state.user.isLogin)

  // 路由權限驗證
  useEffect(() => {
    // 看板不受登入的影響
    if (boardRouters.includes(pathname)) return

    if (isLogin) {
      if (nonAuthPaths.indexOf(pathname) !== -1) {
        router.push('/board')
      }
    } else {
      if (nonAuthPaths.indexOf(pathname) === -1) {
        router.push('/login')
      }

      // 清空 localstorage
      if (localStorage.getItem('persist:app')) {
        localStorage.removeItem('persist:app')
      }

      if (localStorage.getItem('persist:user')) {
        localStorage.removeItem('persist:user')
      }

      if (localStorage.getItem('persist:board')) {
        localStorage.removeItem('persist:board')
      }
    }
  }, [router, pathname, isLogin])

  return <>{children}</>
}

export default RouterGuard
