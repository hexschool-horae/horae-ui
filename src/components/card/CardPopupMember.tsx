import { InputText } from 'primereact/inputtext'
import CardPopupWrapper from './CardPopupWrapper'
import { DELETE_CARD_MEMBER, GET_BOARD_ALL_MEMBERS, POST_CARD_MEMBER } from '@/apis/axios-service'
import { AxiosError } from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { errorSliceActions } from '@/slices/errorSlice'
import cardPopupsStyle from './cardPopups.module.scss'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { IMembers, IBoardMembers, IUserId } from '@/apis/interface/api'
interface ICardPopupMemberProps {
  label: string
  cardId: string
  handleGetCardDetail: () => void
}

export default function CardPopupMember({ label, cardId, handleGetCardDetail }: ICardPopupMemberProps) {
  const boardId = useAppSelector(state => state.board.boardId)
  const dispatch = useAppDispatch()
  const { state } = useCardDetail()
  const selectedMembers: IMembers[] = state.cardDetail.members

  const [memberList, setMemberList] = useState<IBoardMembers[]>([])
  /**
   * B03-6 取得單一看板的所有成員
   * */
  const handleGetBoardAllMembers = async () => {
    try {
      const response = await GET_BOARD_ALL_MEMBERS(boardId)
      if (!response) return
      const data = response.data.members ?? []
      setMemberList(data)
    } catch (e) {
      let errorMessage = ''
      if (e instanceof AxiosError) {
        errorMessage = e.response?.data.message
      } else {
        errorMessage = '發生錯誤'
      }

      dispatch(
        errorSliceActions.pushNewErrorMessage({
          code: -1,
          message: errorMessage,
        })
      )
    }
  }

  const handleClickMember = (user: IUserId) => {
    if (user.isSelected) {
      handleDeleteCardMember(user._id)
    } else {
      handleCreateCardMember(user._id)
    }
  }

  /**
   * B05-20 卡片成員新增
   * */
  const handleCreateCardMember = async (memberId: string) => {
    try {
      const req = { memberId: memberId }
      const response = await POST_CARD_MEMBER(cardId, req)
      if (!response) return
      handleGetCardDetail()
    } catch (e) {
      let errorMessage = ''
      if (e instanceof AxiosError) {
        errorMessage = e.response?.data.message
      } else {
        errorMessage = '發生錯誤'
      }

      dispatch(
        errorSliceActions.pushNewErrorMessage({
          code: -1,
          message: errorMessage,
        })
      )
    }
  }

  /**
   * B05-21 卡片成員刪除
   * */
  const handleDeleteCardMember = async (memberId: string) => {
    try {
      const req = { memberId: memberId }
      const response = await DELETE_CARD_MEMBER(cardId, req)
      if (!response) return
      handleGetCardDetail()
    } catch (e) {
      let errorMessage = ''
      if (e instanceof AxiosError) {
        errorMessage = e.response?.data.message
      } else {
        errorMessage = '發生錯誤'
      }

      dispatch(
        errorSliceActions.pushNewErrorMessage({
          code: -1,
          message: errorMessage,
        })
      )
    }
  }

  const getShortName = (name: string) => {
    return name.charAt(0)
  }

  const isSelectMember = (memberId: string, member: IBoardMembers) => {
    member.userId.isSelected = selectedMembers.some((member: any) => member._id === memberId)
    return member.userId.isSelected ? <i className="pi pi-check" style={{ fontSize: '1rem' }}></i> : ''
  }

  /**
   * 初始化
   * */
  useEffect(() => {
    if (!boardId) return
    if (state.popups.memberPopup) {
      handleGetBoardAllMembers()
    }
  }, [boardId])

  return (
    <CardPopupWrapper title="成員" label={label}>
      <InputText placeholder="搜尋成員" className="w-full my-2" />
      <ul className="member-list mt-4">
        {memberList.map(member => (
          <Fragment key={member._id}>
            <li className="member-item">
              <div className={cardPopupsStyle.member_item_link} onClick={() => handleClickMember(member.userId)}>
                <div className={cardPopupsStyle.member_item_left}>
                  <span className="member-icon bg-secondary-3 text-white rounded-full w-[48px] h-[48px] p-3 text-center mr-3">
                    {getShortName(member.userId.name)}
                  </span>
                  <div className={cardPopupsStyle.member_profile}>
                    <div className="full-name text-sm">{member.userId.name}</div>
                    <div className="user-email text-xs">{member.userId.email}</div>
                  </div>
                </div>
                {isSelectMember(member.userId._id, member)}
              </div>
            </li>
          </Fragment>
        ))}
      </ul>
    </CardPopupWrapper>
  )
}
