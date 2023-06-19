import { POST_WORKSPACE_INVITATION_LINK_BY_ID } from '@/apis/axios-service'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { useState } from 'react'

interface Props {
  workspaceId: string
  iconBgColor?: string
}
// 邀請成員連結 元件
export default function InvitationLink({ workspaceId, iconBgColor = 'bg-white' }: Props) {
  const [isShowLoading, setIsShowLoading] = useState(false)
  const [message, setMessage] = useState('')
  const handleInvitationLikeWorkspace = async () => {
    if (!isShowLoading) {
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
  }
  return (
    <>
      <div
        className={`flex items-center cursor-pointer mb-4 ${isShowLoading ? 'text-gray-400' : 'text-secondary'}`}
        onClick={handleInvitationLikeWorkspace}
      >
        <div className={`w-[48px] h-[48px] flex justify-center items-center ${iconBgColor} rounded-full mr-4`}>
          <i className="pi pi-link text-secondary-1" style={{ fontSize: '1.25rem' }}></i>
        </div>
        <span className="flex items-center">
          <span>透過連結邀請加入此工作</span>
          {isShowLoading && (
            <ProgressSpinner className="sm-loading w-[20px] h-[20px] ml-4" strokeWidth="8" animationDuration=".5s" />
          )}
          {message && <Message className="ml-4" severity="success" text={message} />}
        </span>
      </div>
    </>
  )
}
