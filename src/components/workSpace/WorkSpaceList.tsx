import { useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import IconBoard from '@/assets/icons/icon_layout.svg'
import IconMembers from '@/assets/icons/icon_users.svg'
import IconSetting from '@/assets/icons/icon_settings.svg'
import WorkSpaceCard from './WorkSpaceCard'
import { IUserBoardDataRes } from '@/apis/interface/api'

interface Props {
  userBoardItem: IUserBoardDataRes
  handleGetUserBoardsData: () => Promise<void>
}

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
      value: 'members',
    },
    {
      name: '設定',
      value: 'setting',
    },
  ])

  const getIconComponent = (value: string) => {
    switch (value) {
      case 'board':
        return <IconBoard />
      case 'members':
        return <IconMembers />
      case 'setting':
        return <IconSetting />
      default:
        return null
    }
  }

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
      router.push(`/workspace/${userBoardItem._id}/home`)
    } else if (value === 'members') {
      router.push(`/workspace/${userBoardItem._id}/member/home`)
    } else if (value === 'setting') {
      router.push(`/workspace/${userBoardItem._id}/setting`)
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
              className="bg-secondary-4 text-secondary-3 border-secondary-2 ml-4"
              size="small"
              key={index}
              rounded
              outlined
              onClick={() => {
                handleSettings(item.value)
              }}
            >
              {getIconComponent(item.value)}
              <span className="pl-1 text-secondary-3">{item.name}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* 看板卡片 */}
      <WorkSpaceCard
        workSpaceId={userBoardItem._id}
        key={userBoardItem._id}
        handleAddWorkSpaceSuccess={handleAddWorkSpaceSuccess}
        handleGetBard={handleGetBard}
      ></WorkSpaceCard>
    </div>
  )
}
