import React, { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'

import MemberInfoGroup from './MemberInfoGroup'
import { useAppSelector } from '@/hooks/useAppStore'
import { GET_BOARD_ALL_MEMBERS_BY_ID, POST_BOARD_MEMBERS_BY_ID } from '@/apis/axios-service'

interface IBoardMember {
  userId: {
    _id: string
    name: string
    email: string
  }
  role: string
  inviteHashData: string
  _id: string
}

export default function InviteBoard() {
  const [visible, setVisible] = useState<boolean>(false)
  const [boardMembersList, setBoardMembersList] = useState<IBoardMember[]>([])
  const boardId = useAppSelector(state => state.board.boardId)

  const handleInviteMembers = (value: string) => {
    POST_BOARD_MEMBERS_BY_ID(boardId, value)
  }

  useEffect(() => {
    const loadFn = async () => {
      const { data } = await GET_BOARD_ALL_MEMBERS_BY_ID(boardId)
      setBoardMembersList(data.members)
    }

    Boolean(boardId) && loadFn()
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
                  className="w-4/5"
                  placeholder="請輸入郵件地址或名稱"
                  onChange={e => handleInviteMembers(e.target.value)}
                />
                {/* <Button label="成員" className="bg-secondary-4 text-secondary-1 ml-auto" rounded></Button> */}
                <Button label="邀請" className="bg-secondary-1 w-1/5 ml-3" rounded></Button>
              </div>
            </div>

            <div className="mt-4">
              {boardMembersList.map((item, i) => (
                <MemberInfoGroup model={item} key={i}></MemberInfoGroup>
              ))}
            </div>
          </div>
        </Dialog>
      </div>
    </>
  )
}
