import axiosFetcher from '@/apis/axios'

import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { useEffect, useState, FC } from 'react'
import WorkSpaceModel from '../workSpace/WorkSpaceModel'
import { IUserBoardDataRes } from '@/apis/interface/api'

const { get } = axiosFetcher

interface dataRes {
  data: Array<IUserBoardDataRes>
}

interface IBackSidebarProps {
  className: string
}

const BackSideBar: FC<IBackSidebarProps> = ({ className }) => {
  const router = useRouter()
  const [userBoardList, setUserBoardList] = useState<IUserBoardDataRes[]>([])
  const [visible, setVisible] = useState(false)

  const showDialog = () => {
    setVisible(true)
  }

  const hideDialog = () => {
    setVisible(false)
  }

  /** B02-2 取得登入者所有工作區標題清單  */
  const handleGetWorkSpaceTitleData = async () => {
    console.log('--側邊攔--')
    const result = await get<dataRes>('/work-space')
    if (!result) return
    setUserBoardList(result.data)
  }

  const getShortName = (name: string) => {
    return name.charAt(0)
  }

  useEffect(() => {
    handleGetWorkSpaceTitleData()
  }, [])

  return (
    <div className={`sideBar w-[332px] ${className}`}>
      <nav>
        <ul>
          <li>
            <Button
              className="text-gray-500 px-5 sm:text-base text-sm focus:border-transparent"
              label="看板"
              onClick={() => router.push('/board')}
              link
              severity="info"
            />
          </li>
          <li>
            <div className="flex items-center justify-between">
              <Button
                className="text-black px-5 sm:text-base text-sm focus:border-transparent"
                label="工作區"
                link
                severity="info"
                disabled
              />
              <div className="mr-5 text-secondary-3 cursor-pointer text-lg" onClick={showDialog}>
                +
              </div>
            </div>

            <ul className="ml-0">
              {userBoardList.map((item, index) => (
                <li key={index}>
                  <Button link disabled>
                    <span className="bg-primary text-white rounded py-1.5 px-[10px] mr-3">
                      {getShortName(item.title)}
                    </span>
                    {item.title}
                  </Button>
                  <ul className="ml-14">
                    <li>
                      <Button
                        label="看板"
                        onClick={() => router.push(`/workspace/${item._id}/home`)}
                        size="small"
                        link
                      />
                    </li>
                    <li>
                      <Button
                        label="成員"
                        onClick={() => router.push(`/workspace/${item._id}/members`)}
                        size="small"
                        link
                      />
                    </li>
                    <li>
                      <Button
                        label="設定"
                        onClick={() => router.push(`/workspace/${item._id}/setting`)}
                        size="small"
                        link
                      />
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
      <WorkSpaceModel
        visible={visible}
        onHide={hideDialog}
        setVisible={setVisible}
        handleGetWorkSpaceTitleData={handleGetWorkSpaceTitleData}
      />
    </div>
  )
}

export default BackSideBar
