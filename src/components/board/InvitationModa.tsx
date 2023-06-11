import { memo } from 'react'
import { Button } from 'primereact/button'
const InvitationModal = () => {
  return (
    <>
      使用者已邀請您加入看板6！
      <Button rounded>加入看板</Button>
    </>
  )
}

export default memo(InvitationModal)
