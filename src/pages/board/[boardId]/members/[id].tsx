import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'

import { Button } from 'primereact/button'
import { GET_BOARD_INVITATION_DATA_BY_ID } from '@/apis/axios-service'

const BoardInvitation = () => {
  const router = useRouter()
  const { boardId, id } = router.query
  const [boardData, setBoardData] = useState({ title: '', inviter: '' })
  const token = useAppSelector(state => state.user.token)
  const profile = useAppSelector(state => state.user.profile)
  const boardMembersList = useAppSelector(state => state.board.boardMembersList)
  const dispatch = useAppDispatch()

  const handleGetInvitationData = async () => {
    if (typeof boardId !== 'string' || typeof id !== 'string') return

    const result = await GET_BOARD_INVITATION_DATA_BY_ID(boardId, id)

    if (result === undefined) return

    const { data } = result
    setBoardData(data)
  }

  const handleInviteMembers = async () => {
    if (typeof boardId !== 'string' || typeof id !== 'string' || token === null) return

    dispatch(
      socketServiceActions.addBoardMember({
        hashData: id,
        boardId,
      })
    )
  }

  useEffect(() => {
    if (boardMembersList === null || !boardMembersList.length) return
    const isMember = boardMembersList.some(item => item.userId.email === profile.email)

    if (isMember) router.push(`/board/${boardId}`)
  }, [boardMembersList, profile])

  useEffect(() => {
    //進入此頁時，先加入socket服務
    if (typeof boardId !== 'string' || token === null) return
    dispatch(socketServiceActions.initialBoardService({ boardId, token }))

    return () => {
      dispatch(socketServiceActions.terminateBoardService())
    }
  }, [boardId, token])

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

      {token === null && (
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
