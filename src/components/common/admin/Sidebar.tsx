import { useEffect, useState, FC } from 'react'
import classes from '@/components/common/admin/Sidebar.module.scss'
import WorkSpaceModel from '@/components/workSpace/WorkSpaceModel'
import { IUserBoardData } from '@/apis/interface/api'
import { GET_ALL_WORK_SPACE } from '@/apis/axios-service'
import Link from 'next/link'
import IconBoard from '@/assets/icons/icon_board.svg'
import IconWorkspace from '@/assets/icons/icon_workspace.svg'
import IconAdd from '@/assets/icons/icon_add.svg'
import IconArrowDown from '@/assets/icons/icon_arrow_down.svg'
import IconArrowLeft from '@/assets/icons/icon_left_arrow.svg'

interface ISidebarProps {
  className?: string
  boardId?: string
  alwaysHide?: boolean | null
}

interface IUserBoardMenuToggleStatus {
  id: string
  active: boolean
}

const Sidebar: FC<ISidebarProps> = ({ className, boardId }) => {
  const sidebarStyle = (() => {
    if (boardId) {
      return 'bg-gray-3'
    } else {
      return 'bg-white'
    }
  })()
  const [userBoardList, setUserBoardList] = useState<IUserBoardData[]>([])
  const [userBoardMenuToggleStatus, setUserBoardMenuToggleStatus] = useState<IUserBoardMenuToggleStatus[]>([])
  const [showWorkSpaceModal, setShowWorkSpaceModal] = useState(false)
  const [toggleSidebar, setToggleSidebar] = useState<boolean>(false)

  const onToggleSidebar = () => {
    setToggleSidebar(!toggleSidebar)
  }

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
      const initialMenuToggleStatus = result.data.map(item => ({
        id: item._id,
        active: true,
      }))
      setUserBoardMenuToggleStatus(initialMenuToggleStatus)
    } catch (e) {
      console.warn(e)
    }
  }

  const onToggleMenu = (titleId: string) => {
    setUserBoardMenuToggleStatus(prevState =>
      prevState.map(item => {
        if (item.id === titleId) {
          return {
            ...item,
            active: !item.active,
          }
        }
        return item
      })
    )
  }

  useEffect(() => {
    handleGetWorkSpaceTitleData()
  }, [])
  const getShortName = (name: string) => {
    return name.charAt(0)
  }

  return (
    <div className={`${classes.sidebar} ${className} ${sidebarStyle} ${toggleSidebar ? classes.close : ''}`}>
      <div className="px-5 pt-4">
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
      </div>
      <div className={`${classes['workspace-list']} px-5 pb-5 hide-scrollbar`}>
        {userBoardList.map((item, index) => {
          return (
            <div className={classes['workspace-list-item']} key={index}>
              <div className="flex items-center cursor-pointer select-none" onClick={() => onToggleMenu(item._id)}>
                <span className="bg-primary text-white rounded py-1.5 px-[10px] mr-3">{getShortName(item.title)}</span>
                <span>{item.title}</span>
                <IconArrowDown
                  className={`w-4 h-4 ml-auto ${classes['icon-arrow']} ${
                    userBoardMenuToggleStatus[index].active ? `${classes.active}` : ''
                  }`}
                />
              </div>
              <div
                className={`flex flex-col ml-[45px] mt-4 ${classes.menus} ${
                  userBoardMenuToggleStatus[index].active ? `${classes.active}` : ''
                }`}
              >
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
      <div className={`${classes['toggle-btn']}`} onClick={() => onToggleSidebar()}>
        <IconArrowLeft className={`w-4 h-4 text-white ${toggleSidebar ? classes.close : ''}`} />
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
