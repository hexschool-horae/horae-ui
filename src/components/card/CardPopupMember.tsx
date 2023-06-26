import { InputText } from 'primereact/inputtext'
import CardPopupWrapper from './CardPopupWrapper'
import { GET_BOARD_ALL_MEMBERS_BY_ID } from '@/apis/axios-service'
import { AxiosError } from 'axios'
import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { errorSliceActions } from '@/slices/errorSlice'
import cardPopupsStyle from './cardPopups.module.scss'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { IBoardMembers, IUserId } from '@/apis/interface/api'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'
import { dialogSliceActions } from '@/slices/dialogSlice'
interface ICardPopupMemberProps {
  label: string
  cardId: string
}

interface IMember {
  avatar: string
  email: string
  name: string
  _id: string
}

export default function CardPopupMember({ label, cardId }: ICardPopupMemberProps) {
  const boardId = useAppSelector(state => state.board.boardId)
  const appDispatch = useAppDispatch()
  const { state } = useCardDetail()
  const cardDetail = useAppSelector(state => state.board.cardDetail)
  const selectedMembers: IMember[] = cardDetail?.members as unknown as IMember[]

  const [memberList, setMemberList] = useState<IBoardMembers[]>([])

  const [filterMemberList, setFilterMemberList] = useState<IBoardMembers[]>([])
  /**
   * B03-6 取得單一看板的所有成員
   * */
  const handleGetBoardAllMembers = async () => {
    try {
      const response = await GET_BOARD_ALL_MEMBERS_BY_ID(boardId)
      if (!response) return
      const data = response.data.members ?? []
      setMemberList(data)
      setFilterMemberList(data)
    } catch (e) {
      let errorMessage = ''
      if (e instanceof AxiosError) {
        errorMessage = e.response?.data.message
      } else {
        errorMessage = '發生錯誤'
      }

      appDispatch(
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
    appDispatch(
      socketServiceActions.addCardMember({
        boardId,
        cardId,
        memberId,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_ADD_MEMBER_RESULT))
  }

  /**
   * B05-21 卡片成員刪除
   * */
  const handleDeleteCardMember = async (memberId: string) => {
    appDispatch(
      socketServiceActions.deleteCardMember({
        boardId,
        cardId,
        memberId,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_DELETE_MEMBER_RESULT))
  }

  const getShortName = (name: string) => {
    return name.charAt(0)
  }

  const isSelectMember = (memberId: string, member: IBoardMembers) => {
    member.userId.isSelected = selectedMembers.some((member: IMember) => member._id === memberId)
    return member.userId.isSelected ? <i className="pi pi-check" style={{ fontSize: '1rem' }}></i> : ''
  }

  /**
   *  模糊搜尋成員列表
   * @param e input value
   */
  const handleSearchMembers = (e?: ChangeEvent<HTMLInputElement>) => {
    const fuzzyValue = e?.target.value ?? ''
    const cloneDeepMemberList = JSON.parse(JSON.stringify(memberList))
    const filterList = cloneDeepMemberList.filter((member: IBoardMembers) => {
      const memberUserStr = member.userId.name + member.userId.email
      return memberUserStr.includes(fuzzyValue)
    })
    setFilterMemberList(filterList)
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
      <InputText placeholder="搜尋成員" className="w-full my-2" onChange={handleSearchMembers} />
      <ul className="member-list mt-4">
        {filterMemberList.map(member => (
          <Fragment key={member._id}>
            <li className="member-item">
              <div className={cardPopupsStyle.member_item_link} onClick={() => handleClickMember(member.userId)}>
                <div className={cardPopupsStyle.member_item_left}>
                  <span
                    className="member-icon text-white rounded-full w-[48px] h-[48px] p-3 text-center mr-3"
                    style={{ backgroundColor: member.userId.avatar }}
                  >
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
