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
const workspaceRouters = [
  '/workspace/[workId]/home',
  '/workspace/[workId]/members',
  '/workspace/[workId]/setting',
  '/workspace/workspaceWithoutPermission',
]

const RouterGuard = ({ children }: { children?: ReactNode }) => {
  const router = useRouter()
  const { pathname } = router
  const isLogin = useAppSelector(state => state.user.isLogin)
  const workspaceData = useAppSelector(state => state.workspace.workspaceData)

  // 路由權限驗證
  useEffect(() => {
    // 看板不受登入的影響
    if (boardRouters.includes(pathname)) return
    // 工作區不受登入的影響
    if (workspaceRouters.includes(pathname)) return

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

  // 路由權限驗證
  useEffect(() => {
    if (workspaceRouters.includes(pathname) && pathname !== '/workspace/workspaceWithoutPermission') {
      document.title = `Horae - ${workspaceData.workspaceName}`
    }
  }, [workspaceData.workspaceName])

  return <>{children}</>
}

export default RouterGuard
