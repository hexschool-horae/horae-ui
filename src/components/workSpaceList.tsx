import { useEffect, useState } from 'react'
import WorkSpaceCard from './workSpaceCard'
import { IUserBoardDataRes } from '@/apis/models/res/i-user-board-data-res'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'

interface Props {
  userBoardItem: IUserBoardDataRes
  handleGetUserBoardsData: () => Promise<void>
}

// interface IBoardRes {
//   discribe: string
//   status: string
//   title: string
//   viewSet: string
//   yourPermission: string
//   yourRole: string
//   _id: string
// }

export default function WorkSpaceList({ userBoardItem, handleGetUserBoardsData }: Props) {
  const router = useRouter()
  const [workSpaceName, setWorkSpaceName] = useState('')
  const [settings] = useState([
    {
      name: '看版',
      value: 'board',
    },
    {
      name: '成員',
      value: 'account',
    },
    {
      name: '設定',
      value: 'members',
    },
  ])

  useEffect(() => {
    setWorkSpaceName(userBoardItem.title.charAt(0))
  }, [userBoardItem.title])

  const handleAddWorkSpaceSuccess = () => {
    handleGetUserBoardsData()
  }

  const handleGetBard = () => {
    // console.log(`bardData ${bardData} is clicked!`);
  }

  const handleSettings = (value: string) => {
    // console.log("value", value)
    if (value === 'board') {
      router.push(`/workspace/${userBoardItem._id}`)
    }
  }

  return (
    <div className="mb-[50px]">
      <div className="flex items-center justify-between mt-6 mb-[18px]">
        <div className="left flex items-center">
          <span className="bg-primary text-white rounded py-1.5 px-[11.5px] mr-3">{workSpaceName}</span>
          <p>{userBoardItem.title}</p>
        </div>
        <div className="right">
          {settings.map((item, index) => (
            <Button
              className="bg-secondary-2 text-secondary-3 ml-4"
              size="small"
              key={index}
              rounded
              outlined
              onClick={() => {
                handleSettings(item.value)
              }}
            >
              <span>{item.name}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* 看板卡片 */}
      <div key={userBoardItem._id}>
        <WorkSpaceCard
          workSpaceId={userBoardItem._id}
          handleAddWorkSpaceSuccess={handleAddWorkSpaceSuccess}
          handleGetBard={handleGetBard}
        ></WorkSpaceCard>
      </div>
    </div>
  )
}
