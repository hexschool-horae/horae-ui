import React, { useEffect, useState, useRef } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'

import MemberInfoGroup from './MemberInfoGroup'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { GET_BOARD_ALL_MEMBERS_BY_ID } from '@/apis/axios-service'
import { boardSliceActions } from '@/slices/boardSlice'

import { classNames } from 'primereact/utils'
import Style from './MemberInfoGroup.module.scss'

import { POST_BOARD_INVITATION_LINK_BY_ID } from '@/apis/axios-service'

export default function InviteBoard() {
  const [visible, setVisible] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const token = useAppSelector(state => state.user.token) || ''
  const boardId = useAppSelector(state => state.board.boardId)
  const boardMembersList = useAppSelector(state => state.board.boardMembersList)
  const [invitationLink, setInvitationLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const linkInputRef = useRef<HTMLInputElement>(null)

  const handleGetBoardMembersList = async () => {
    const { data } = await GET_BOARD_ALL_MEMBERS_BY_ID(boardId)

    dispatch(boardSliceActions.updateBoardMembersList(data.members))
  }

  const handleGetInvitationLink = async () => {
    const result = await POST_BOARD_INVITATION_LINK_BY_ID(boardId)
    if (result === undefined) return
    const {
      data: { invitationLink },
    } = result

    invitationLink && setInvitationLink(invitationLink)
  }

  const handleCopyIvitationLink = async () => {
    if (linkInputRef.current) {
      try {
        await navigator.clipboard.writeText(linkInputRef.current.value)
        setIsCopied(true)
      } catch (error) {
        console.log(error)
        setIsCopied(false)
      }
    }
  }

  useEffect(() => {
    if (boardId) {
      if (token) {
        handleGetBoardMembersList()
        handleGetInvitationLink()
      }
    }
  }, [boardId])

  return (
    <>
      <Button
        disabled={!token}
        label="邀請成員"
        severity="secondary"
        size="small"
        rounded
        onClick={() => setVisible(true)}
      ></Button>

      <div className="card flex justify-content-center">
        <Dialog
          header={<div className="text-2xl text-secondary-1 mb-6">邀請成員加入看板</div>}
          visible={visible}
          style={{ width: '62vw' }}
          onHide={() => setVisible(false)}
        >
          <div className="px-[36px]">
            {/* <div className="mb-6">
              <div className="flex">
                <InputText
                  className="w-3/4"
                  placeholder="請輸入郵件地址或名稱"
                  onChange={e => handleSendMail(e.target.value)}
                />
                <Button label="成員" className="bg-secondary-4 text-secondary-1 ml-auto" rounded></Button>
                <Button label="邀請" className="bg-secondary-1 ml-3" rounded></Button>
              </div>
            </div> */}

            <div
              className="flex items-center cursor-pointer"
              onClick={handleCopyIvitationLink}
              onBlur={() => setIsCopied(false)}
            >
              <div className="w-[48px] h-[48px] flex justify-center items-center bg-secondary-4 rounded-full mr-4">
                <i className="pi pi-link text-secondary-1" style={{ fontSize: '1.25rem' }}></i>
              </div>
              <div>
                <div>透過連結分享此看板</div>
                <div className={classNames(Style.member_info_subtitle, 'text-gray-2')}>建立連結</div>
              </div>

              <InputText
                type="hidden"
                ref={linkInputRef}
                placeholder="分享連結"
                value={invitationLink}
                style={{ width: '100%', marginBottom: '0.25rem' }}
              />

              {isCopied && <Message className="my-4 ml-auto" severity="success" text={'連結已複製到剪貼簿'} />}
            </div>
            {/* 只有一人時（此人一定為管理員權限），不可操作權限選單 */}
            <div className="mt-4">
              {boardMembersList !== null ? (
                boardMembersList.map((item, i) => (
                  <MemberInfoGroup model={item} key={i} disabled={boardMembersList.length < 2}></MemberInfoGroup>
                ))
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
