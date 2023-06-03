import { useRouter } from 'next/router'
import { useEffect, ReactNode } from 'react'
import { useAppSelector } from '@/hooks/useAppStore'

const BoardGuard = ({ children }: { children?: ReactNode }) => {
  const router = useRouter()
  // const { pathname } = router
  const isLogin = useAppSelector(state => state.user.isLogin)
  const viewSet = useAppSelector(state => state.board.viewSet)
  const isClosed = useAppSelector(state => state.board.isClosed)
  const yourRole = useAppSelector(state => state.board.yourRole)

  // 路由權限驗證
  useEffect(() => {
    if (viewSet === '') return

    if (isClosed) router.push('/board/boardClosed')

    if (viewSet === 'private' || viewSet === 'workspace') {
      if (yourRole !== 'admin') router.push('/board/boardWithoutPermission')
    }
  }, [isLogin, viewSet])

  return <>{children}</>
}

export default BoardGuard
