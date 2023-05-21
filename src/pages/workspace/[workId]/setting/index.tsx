import { GET_WORK_SPACE } from '@/apis/axios-service'
import WorkSpaceTitle from '@/components/workSpace/WorkSpaceTitle'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

interface IBoardRes {
  discribe: string
  status: string
  title: string
  viewSet: string
  yourPermission: string
  yourRole: string
  _id: string
}

export default function Setting() {
  const router = useRouter()
  // const [workspaceId, setworkspaceId] = useState('')
  const [boardData, setBoardData] = useState<IBoardRes>({
    discribe: '',
    status: '',
    title: '',
    viewSet: '',
    yourPermission: '',
    yourRole: '',
    _id: '',
  })

  const handlerCallGetWorkPace = async (workId: string) => {
    try {
      const response = await GET_WORK_SPACE(workId)
      if (!response) return
      const data = response.data
      setBoardData(data)
    } catch (error) {
      console.error('Error fetching user boards data:', error)
    }
  }

  useEffect(() => {
    const urlValue = router.query.workId as string
    if (urlValue) {
      // setworkspaceId(urlValue)
      handlerCallGetWorkPace(urlValue)
    }
  }, [])

  return (
    <div>
      {boardData.title ? <WorkSpaceTitle boardData={boardData}></WorkSpaceTitle> : ''}
      設定
    </div>
  )
}
