import React, { useEffect, useState } from 'react'

interface Props {
  boardData: IBoardRes
}

interface IBoardRes {
  discribe: string
  status: string
  title: string
  viewSet: string
  yourPermission: string
  yourRole: string
  _id: string
}

export default function WorkSpaceTitle({ boardData }: Props) {
  const [workSpaceName, setWorkSpaceName] = useState('')

  const handleGetBard = () => {
    setWorkSpaceName(boardData.title.charAt(0))
  }

  useEffect(() => {
    handleGetBard()
  }, [boardData])

  return (
    <div className="header border-b mb-5 border-secondary-2">
      <div className="flex pb-5">
        <span className="bg-primary text-white rounded py-3.5 px-[18px] mr-3">{workSpaceName}</span>
        <div className="title">
          <div className="edit-title flex items-center">
            <h2 className="text-2xl">{boardData.title}</h2>
            {/* <i className="pi pi-pencil ml-5"></i> */}
          </div>
          <p className="text-sm">{boardData.viewSet === 'private' ? '私人' : '公開'}</p>
        </div>
      </div>
    </div>
  )
}
