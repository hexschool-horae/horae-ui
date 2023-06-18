import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/useAppStore'

import { Button } from 'primereact/button'
import { GET_BOARD_INVITATION_DATA_BY_ID, POST_BOARD_MEMBERS_BY_ID } from '@/apis/axios-service'

const BoardInvitation = () => {
  const router = useRouter()
  const { boardId, id } = router.query
  const [boardData, setBoardData] = useState({ title: '', inviter: '' })
  const [isShowLogin, setIsShowLogin] = useState(false)
  const token = useAppSelector(state => state.user.token)

  const handleGetInvitationData = async () => {
    if (typeof boardId !== 'string' || typeof id !== 'string') return

    const result = await GET_BOARD_INVITATION_DATA_BY_ID(boardId, id)

    if (result === undefined) return

    const { data } = result
    setBoardData(data)
  }

  const handleInviteMembers = async () => {
    if (typeof boardId !== 'string' || typeof id !== 'string') return

    try {
      const result = await POST_BOARD_MEMBERS_BY_ID(boardId, id, Boolean(token))

      if (result === undefined) return
      const { success } = result

      if (success) {
        router.push(`/board/${boardId}`)
        setIsShowLogin(false)
      }
    } catch (error: any) {
      if (error?.data?.message == '您尚未登入') {
        setIsShowLogin(true)
      }

      if (error?.data?.message == '成員已經存在此看板，不可新增') {
        router.push(`/board/${boardId}`)
      }
    }
  }

  useEffect(() => {
    setIsShowLogin(false)
  }, [token])

  useEffect(() => {
    if (boardId) {
      handleGetInvitationData()
    }
  }, [boardId])

  return (
    <div className="w-full h-full p-16 flex flex-col justify-center items-center">
      <h4 className="mb-6">
        {boardData.inviter}已邀請您加入{boardData.title}！
      </h4>
      <Button rounded onClick={handleInviteMembers}>
        加入看板
      </Button>

      {isShowLogin && (
        <Link href="/login" legacyBehavior passHref>
          <a className="text-secondary-1 mt-4" target="_blank" rel="noopener noreferrer">
            您尚未登入，請先 <u>登入</u>
          </a>
        </Link>
      )}
    </div>
  )
}

export default memo(BoardInvitation)
