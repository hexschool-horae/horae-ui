import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'

import MemberInfoGroup from './MemberInfoGroup'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { GET_BOARD_ALL_MEMBERS_BY_ID } from '@/apis/axios-service'
import { boardSliceActions } from '@/slices/boardSlice'

// interface IBoardMember {
//   userId: {
//     _id: string
//     name: string
//     email: string
//   }
//   role: string
//   inviteHashData: string
//   _id: string
// }

export default function InviteBoard() {
  const [visible, setVisible] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const boardId = useAppSelector(state => state.board.boardId)
  const boardMembersList = useAppSelector(state => state.board.boardMembersList)

  const handleSendMail = (mail: string) => {
    console.log(mail)
  }

  const handleGetBoardMembersList = async () => {
    const { data } = await GET_BOARD_ALL_MEMBERS_BY_ID(boardId)

    dispatch(boardSliceActions.updateBoardMembersList(data.members))
  }

  useEffect(() => {
    if (boardId) {
      handleGetBoardMembersList()
    }
  }, [boardId])

  return (
    <>
      <Button label="邀請成員" severity="secondary" size="small" rounded onClick={() => setVisible(true)}></Button>

      <div className="card flex justify-content-center">
        <Dialog visible={visible} style={{ width: '62vw' }} onHide={() => setVisible(false)}>
          <div className="px-[36px]">
            <div className="text-2xl text-secondary-1 mb-6">邀請成員加入看板</div>
            <div className="mb-6">
              <div className="flex">
                <InputText
                  className="w-3/4"
                  placeholder="請輸入郵件地址或名稱"
                  onChange={e => handleSendMail(e.target.value)}
                />
                <Button label="成員" className="bg-secondary-4 text-secondary-1 ml-auto" rounded></Button>
                <Button label="邀請" className="bg-secondary-1 ml-3" rounded></Button>
              </div>
            </div>

            <div className="mt-4">
              {boardMembersList !== null ? (
                boardMembersList.map((item, i) => <MemberInfoGroup model={item} key={i}></MemberInfoGroup>)
              ) : (
                <></>
              )}
            </div>
          </div>
        </Dialog>
      </div>
    </>
  )
}
