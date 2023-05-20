import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axiosFetcher from '@/apis/axios'

import { Button } from 'primereact/button'
import WorkSpaceModel from '@/components/workSpaceModel'
import WorkSpaceList from '@/components/workSpaceList'
import { IUserBoardDataRes } from '@/apis/models/res/i-user-board-data-res'

const { get } = axiosFetcher

interface dataRes {
  data: Array<IUserBoardDataRes>
}

export default function Board() {
  const router = useRouter()
  const [userBoardList, setUserBoardList] = useState<IUserBoardDataRes[]>([])
  const [visible, setVisible] = useState(false)

  const showDialog = () => {
    setVisible(true)
  }

  const hideDialog = () => {
    setVisible(false)
  }

  /** B01-9 取得使用者所有工作區看板 */
  const handleGetUserBoardsData = async () => {
    // const result = await get(
    //   "/user/boards",
    // );
    // if (!result) return;
    // console.log('result', result);
    // 因B01-9為做完先暫時從此呼叫
    handleGetWorkSpaceTitleData()
  }
  /** B02-2 取得登入者所有工作區標題清單 header sidebar 使用 --暫時取工作區使用--*/
  const handleGetWorkSpaceTitleData = async () => {
    const result = await get<dataRes>('/work-space')
    if (!result) return
    console.log('Board -- handleGetWorkSpaceTitleData', result)
    setUserBoardList(result.data)

    // setWorkspaceId(result.data["_id"]);
  }

  /** B02-5 取得單一工作區 --暫時用--*/
  /* eslint-disable */
  ;async () => {
    const result = await get<dataRes>('/work-space/:w-id')
    if (!result) return
    console.log('result', result)
    setUserBoardList(result.data)
  }

  useEffect(() => {
    handleGetUserBoardsData()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">歡迎！</h2>
      {userBoardList.length === 0 ? (
        <p>
          您還不是任何工作區的成員。{' '}
          <Button className="text-primary p-0" label="建立一個工作區" onClick={showDialog} link />
          <WorkSpaceModel
            visible={visible}
            onHide={hideDialog}
            setVisible={setVisible}
            handleGetWorkSpaceTitleData={handleGetWorkSpaceTitleData}
          />
        </p>
      ) : (
        <>
          <p className="text-secondary-3 text-2xl">
            <i className="pi pi-user text-2xl mr-2"></i>你的工作區
          </p>
          {userBoardList.map(item => (
            <WorkSpaceList
              userBoardItem={item}
              handleGetUserBoardsData={handleGetUserBoardsData}
              key={item._id}
            ></WorkSpaceList>
          ))}
        </>
      )}
      <Button className="p-0" label="前往個人頁面" onClick={() => router.push('/profile')} link />
    </div>
  )
}
