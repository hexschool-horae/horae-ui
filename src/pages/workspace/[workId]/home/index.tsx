import { GET_WORK_SPACE } from '@/apis/axios-service'
import { IBoardResponse } from '@/apis/interface/api'
import WorkSpaceCard from '@/components/workSpace/WorkSpaceCard'
import WorkSpaceTitle from '@/components/workSpace/WorkSpaceTitle'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { setWorkspaceData } from '@/slices/workspaceSlice'

export default function Home() {
  const dispatch = useAppDispatch()
  const isLogin = useAppSelector(state => state.user.isLogin)
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
    try {
      const result = await GET_WORK_SPACE(wId, isLogin ? true : false)
      if (!result) return
      setWorkSpaceDate(result.data)
      dispatch(
        setWorkspaceData({
          viewSet: result.data.viewSet,
          workspaceName: result.data.title,
        })
      )
    } catch (e: any) {
      // 403 msg	無工作區權限
      const { status } = e.response ?? null
      if (status === 401 || status === 403) {
        router.push('/workspace/workspaceWithoutPermission')
      }
    }
  }

  return (
    <>
      {workSpaceData ? (
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
      ) : null}
    </>
  )
}
