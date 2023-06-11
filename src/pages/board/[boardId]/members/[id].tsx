import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { Button } from 'primereact/button'

import { useAppSelector } from '@/hooks/useAppStore'

import { GET_BOARD_INVITATION_DATA_BY_ID, POST_BOARD_MEMBERS_BY_ID } from '@/apis/axios-service'

const BoardInvitation = () => {
  const router = useRouter()
  const token = useAppSelector(state => state.user.token)
  const { boardId } = router.query
  const [boardData, setBoardData] = useState({ title: '', inviter: '' })

  const handleGetInvitationData = async () => {
    if (typeof boardId !== 'string' || token === null) return

    const result = await GET_BOARD_INVITATION_DATA_BY_ID(boardId, token)

    if (result === undefined) return

    const { data } = result
    setBoardData(data)
  }

  const handleInviteMembers = () => {
    if (typeof boardId !== 'string' || token === null) return

    POST_BOARD_MEMBERS_BY_ID(boardId, token)
  }

  useEffect(() => {
    if (boardId) {
      handleGetInvitationData()
    }
  }, [boardId])

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h4 className="mb-6">
        {boardData.inviter}已邀請您加入{boardData.title}！
      </h4>
      <Button rounded onClick={handleInviteMembers}>
        加入看板
      </Button>
    </div>
  )
}

export default memo(BoardInvitation)
