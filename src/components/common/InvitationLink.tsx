import { POST_WORKSPACE_INVITATION_LINK_BY_ID } from '@/apis/axios-service'
import IconLink from '@/assets/icons/icon_link.svg'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { useState } from 'react'

interface Props {
  workspaceId: string
}
// 邀請成員連結 元件
export default function InvitationLink({ workspaceId }: Props) {
  const [isShowLoading, setIsShowLoading] = useState(false)
  const [message, setMessage] = useState('')
  const handleInvitationLikeWorkspace = async () => {
    setIsShowLoading(true)
    const response = await POST_WORKSPACE_INVITATION_LINK_BY_ID(workspaceId)
    if (!response) return
    await navigator.clipboard.writeText(response.data.invitationLink) // 複製連結
    setIsShowLoading(false)
    setMessage('連結已複製到剪貼簿')
    setTimeout(() => {
      setMessage('')
    }, 2000)
  }
  return (
    <>
      <span className="text-secondary flex items-center cursor-pointer" onClick={handleInvitationLikeWorkspace}>
        {isShowLoading && (
          <ProgressSpinner className="sm-loading w-[20px] h-[20px]" strokeWidth="8" animationDuration=".5s" />
        )}
        {message && <Message severity="success" text={message} />}
        <IconLink className="ml-2" />
        以連結邀請
      </span>
    </>
  )
}
