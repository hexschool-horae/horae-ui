import { useEffect, useState, FC } from 'react'
import classes from '@/components/common/admin/Sidebar.module.scss'
import WorkSpaceModel from '@/components/workSpace/WorkSpaceModel'
import { IUserBoardDataRes } from '@/apis/interface/api'
import { GET_ALL_WORK_SPACE } from '@/apis/axios-service'
import Link from 'next/link'
import IconLeftArrow from '@/assets/icons/icon_left_arrow.svg'
import IconBoard from '@/assets/icons/icon_board.svg'
import IconWorkspace from '@/assets/icons/icon_workspace.svg'
import IconAdd from '@/assets/icons/icon_add.svg'
interface ISidebarProps {
  className?: string
  boardId?: string
  alwaysHide?: boolean | null
}

const Sidebar: FC<ISidebarProps> = ({ className, boardId }) => {
  const sidebarStyle = (() => {
    if (boardId) {
      return 'bg-gray-3'
    } else {
      return 'bg-white'
    }
  })()
  const [userBoardList, setUserBoardList] = useState<IUserBoardDataRes[]>([])
  const [showWorkSpaceModal, setShowWorkSpaceModal] = useState(false)
  const showDialog = () => {
    setShowWorkSpaceModal(true)
  }

  const hideDialog = () => {
    setShowWorkSpaceModal(false)
  }

  /** B02-2 取得登入者所有工作區標題清單  */
  const handleGetWorkSpaceTitleData = async () => {
    try {
      const result = await GET_ALL_WORK_SPACE()
      setUserBoardList(result.data)
    } catch (e) {
      console.warn(e)
    }
  }

  useEffect(() => {
    handleGetWorkSpaceTitleData()
  }, [])
  const getShortName = (name: string) => {
    return name.charAt(0)
  }

  return (
    <div
      className={`w-[332px] relative p-5 inline-flex flex-col text-base leading-none text-black ${className} ${sidebarStyle}`}
    >
      <Link href="/board" className="cursor-pointer">
        <div className="flex items-center">
          <IconBoard />
          <span className="ml-1">看板</span>
        </div>
      </Link>
      <div className="flex items-center mt-6 mb-6 cursor-pointer" onClick={showDialog}>
        <IconWorkspace />
        <span className="ml-1">工作區</span>
        <IconAdd className="ml-auto w-6 h-6" />
      </div>
      <div className={classes['workspace-list']}>
        {userBoardList.map((item, index) => {
          return (
            <div className={classes['workspace-list-item']} key={index}>
              <div className="flex items-center">
                <span className="bg-primary text-white rounded py-1.5 px-[10px] mr-3">{getShortName(item.title)}</span>
                <span>{item.title}</span>
              </div>
              <div className="flex flex-col ml-[45px] mt-4">
                <Link href={`/workspace/${item._id}/home`}>看板</Link>
                <Link href={`/workspace/${item._id}/members`} className="mt-3">
                  成員
                </Link>
                <Link href={`/workspace/${item._id}/setting`} className="mt-3">
                  設定
                </Link>
              </div>
            </div>
          )
        })}
      </div>
      <div className="absolute right-0 top-[30px] transform translate-x-1/2">
        <div className={classes['toggle-btn']}>
          <IconLeftArrow />
        </div>
      </div>
      <WorkSpaceModel
        visible={showWorkSpaceModal}
        onHide={hideDialog}
        setVisible={setShowWorkSpaceModal}
        handleGetWorkSpaceTitleData={handleGetWorkSpaceTitleData}
      />
    </div>
  )
}

export default Sidebar
