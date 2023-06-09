import { useContext, useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import WorkSpaceModel from '@/components/workSpace/WorkSpaceModel'
import WorkSpaceList from '@/components/workSpace/WorkSpaceList'
import { AdminLayoutContext } from '@/contexts/adminLayoutContext'
import Head from 'next/head'

export default function Board() {
  const { userBoardsData, handleGetUserBoardsData } = useContext(AdminLayoutContext)
  const [visible, setVisible] = useState(false)

  const showDialog = () => {
    setVisible(true)
  }

  const hideDialog = () => {
    setVisible(false)
  }
  useEffect(() => {
    /** B01-9 取得使用者所有工作區看板 */
    handleGetUserBoardsData()
  }, [])

  return (
    <>
      <Head>
        <title>Horae - 個人工作區看板</title>
      </Head>
      <h2 className="text-2xl font-bold mb-6">歡迎！</h2>
      {userBoardsData.length === 0 ? (
        <p>
          您還不是任何工作區的成員。{' '}
          <Button className="text-primary p-0" label="建立一個工作區" onClick={showDialog} link />
          <WorkSpaceModel visible={visible} onHide={hideDialog} setVisible={setVisible} />
        </p>
      ) : (
        <>
          <p className="text-secondary-3 text-2xl">
            <i className="pi pi-user text-2xl mr-2"></i>你的工作區
          </p>
          {userBoardsData.map(item => (
            <WorkSpaceList
              userBoardItem={item}
              handleGetUserBoardsData={handleGetUserBoardsData}
              key={item._id}
            ></WorkSpaceList>
          ))}
        </>
      )}
    </>
  )
}
