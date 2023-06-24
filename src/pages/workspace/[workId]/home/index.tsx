import { GET_WORK_SPACE } from '@/apis/axios-service'
import { IBoardResponse } from '@/apis/interface/api'
import WorkSpaceCard from '@/components/workSpace/WorkSpaceCard'
import WorkSpaceTitle from '@/components/workSpace/WorkSpaceTitle'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const wId = router.query.workId as string
  const [workId, setWorkId] = useState('')
  const [workSpaceData, setWorkSpaceDate] = useState<IBoardResponse>({
    boards: [],
    discribe: '',
    status: '',
    title: '',
    viewSet: '',
    yourPermission: '',
    yourRole: '',
    _id: '',
  })

  useEffect(() => {
    if (wId) {
      setWorkId(wId)
      handleGetWorkSpaceData()
    }
  }, [wId])

  const handleGetWorkSpaceData = async () => {
    const result = await GET_WORK_SPACE(wId)
    if (!result) return
    setWorkSpaceDate(result.data)
  }

  return (
    <div className="bg-secondary-4 min-h-full py-[50px] px-[64px]">
      {workSpaceData.title ? (
        <>
          <WorkSpaceTitle boardData={workSpaceData}></WorkSpaceTitle>
        </>
      ) : (
        ''
      )}

      <h3 className="text-secondary-3 text-xl">
        <i className="pi pi-user text-2xl mr-2 mb-6"></i>你的看板
      </h3>
      {/* 看板卡片 */}
      {workSpaceData.boards ? (
        <WorkSpaceCard
          key={workId}
          workSpaceId={workId}
          boardList={workSpaceData.boards}
          handleAddWorkSpaceSuccess={handleGetWorkSpaceData}
        ></WorkSpaceCard>
      ) : (
        ''
      )}
    </div>
  )
}
