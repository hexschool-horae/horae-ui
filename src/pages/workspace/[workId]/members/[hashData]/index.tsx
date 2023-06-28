import { GET_INVITATION_DATA, POST_WORKSPACE_NEW_MEMBERS } from '@/apis/axios-service'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { setMembersHashData } from '@/slices/workspaceSlice'
import { InvitationData } from '@/apis/interface/api'
import Head from 'next/head'
interface IWorkspaceMember {
  workId: string
  hashData: string
}

export default function NewMember() {
  const router = useRouter()
  const workId = router.query.workId as string
  const query = router.query as unknown as IWorkspaceMember
  const dispatch = useAppDispatch()
  const membersHashData = useAppSelector(state => state.workspace.membersHashData)
  const [workspaceId, setWorkspaceId] = useState('')
  const [invitationData, setInvitationData] = useState<InvitationData>({ title: '', inviter: '' })
  const isLogin = useAppSelector(state => state.user.isLogin)

  /** B02-12 取得工作區邀請資料 */
  const handleGetWorkSpaceData = async (workId: string) => {
    const result = await GET_INVITATION_DATA(workId)
    if (!result) return
    const { data } = result
    setInvitationData(data)
  }
  /** B02-9 單一工作區新增成員 */
  const handleNewMember = async () => {
    const result = await POST_WORKSPACE_NEW_MEMBERS(workspaceId, membersHashData)
    if (!result) return
    router.push(`/workspace/${workspaceId}/home`)
  }
  useEffect(() => {
    if (workId) {
      handleGetWorkSpaceData(workId)
      setWorkspaceId(workId)
      dispatch(setMembersHashData(query.hashData))
    }
  }, [workId])
  return (
    <>
      <Head>
        <title>Horae - 邀請成員</title>
      </Head>
      {isLogin && (
        <div className="text-center">
          <div className="invitation-link-description mt-20 text-2xl">
            <strong>{invitationData.inviter}</strong> 已邀請您加入 <strong>{invitationData.title}</strong>
          </div>
          <div className="btn-box mt-20">
            <Button severity="secondary" rounded onClick={handleNewMember}>
              加入工作區
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
