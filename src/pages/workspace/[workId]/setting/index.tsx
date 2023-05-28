import { DELETE_WORKSPACE, GET_WORK_SPACE } from '@/apis/axios-service'
import { IBoardResponse } from '@/apis/interface/api'
import WorkSpaceTitle from '@/components/workSpace/WorkSpaceTitle'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ConfirmDialog } from 'primereact/confirmdialog'

export default function Setting() {
  const router = useRouter()
  const workId = router.query.workId as string
  // const [workspaceId, setworkspaceId] = useState('')
  const [boardData, setBoardData] = useState<IBoardResponse>({
    boards: [],
    discribe: '',
    status: '',
    title: '',
    viewSet: '',
    yourPermission: '',
    yourRole: '',
    _id: '',
  })

  const [showAddMembersConfirmation, setShowAddMembersConfirmation] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState({ message: '' })

  const handlerCallGetWorkPace = async (workId: string) => {
    const response = await GET_WORK_SPACE(workId)
    if (!response) return
    const data = response.data
    setBoardData(data)
    console.log('handlerCallGetWorkPace data', data)
  }

  const getWorkPace = async () => {
    handlerCallGetWorkPace(workId)
  }

  const handlerDeleteWorkSpace = () => {
    setConfirmConfig({ message: '確定要刪除此工作區嗎?' })
    setShowAddMembersConfirmation(true)
  }

  // 呼叫刪除單一工作區
  const handlerCallDeleteWorkSpace = async () => {
    const response = await DELETE_WORKSPACE(workId, {})
    if (!response) return
    // handlerCallGetWorkPace(workId)
    router.push('/board')
  }

  const accept = () => {
    handlerCallDeleteWorkSpace()
    setShowAddMembersConfirmation(false) // 隱藏確認對話框
    console.log('Accept')
  }

  const reject = () => {
    setShowAddMembersConfirmation(false) // 隱藏確認對話框
  }

  useEffect(() => {
    if (workId) {
      // setworkspaceId(urlValue)
      handlerCallGetWorkPace(workId)
    }
  }, [workId])

  return (
    <div>
      {/* 確認對話框 */}
      <ConfirmDialog
        visible={showAddMembersConfirmation}
        message={confirmConfig.message}
        header="訊息"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
      />
      {boardData.title ? (
        <WorkSpaceTitle boardData={boardData} isEdit={true} handleGetWorkSpaceData={getWorkPace}></WorkSpaceTitle>
      ) : (
        ''
      )}
      <span className="cursor-pointer" onClick={handlerDeleteWorkSpace}>
        刪除此工作區
      </span>
    </div>
  )
}
