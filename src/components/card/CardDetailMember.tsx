import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { Fragment } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'

interface ICardDetailMemberProps {
  label: string
  cardId: string
}

interface IMember {
  avatar: string
  email: string
  name: string
  _id: string
}

export default function CardDetailMember({ label, cardId }: ICardDetailMemberProps) {
  const { dispatch } = useCardDetail()
  const appDispatch = useAppDispatch()
  const boardId = useAppSelector(state => state.board.boardId)
  const cardDetail = useAppSelector(state => state.board.cardDetail)
  const selectedMembers: IMember[] = cardDetail?.members as unknown as IMember[]

  const getShortName = (name: string) => {
    return name.charAt(0)
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

  return (
    <div className={`${style.detail_list}`}>
      <div>成員</div>
      <Button
        icon="pi pi-plus"
        rounded
        aria-label="add"
        className={`${style.detail_list_add_btn}`}
        onClick={() => {
          dispatch({
            type: 'TOTGGLE_POPUP',
            payload: label,
          })
        }}
      />
      <ul>
        {selectedMembers
          ? selectedMembers.map(member => (
              <Fragment key={member._id}>
                <li className="flex items-center">
                  <div
                    className="member-icon text-white rounded-full w-[40px] h-[40px] p-2 text-center mr-3"
                    style={{ backgroundColor: member.avatar ? member.avatar : '#CC3A3A' }}
                  >
                    {getShortName(member.name)}
                  </div>
                  <div className="mr-3">{member.name}</div>
                  <Button
                    icon="pi pi-times"
                    rounded
                    outlined
                    aria-label="remove"
                    className="!w-[30px] !h-[30px]"
                    onClick={() => {
                      handleDeleteCardMember(member._id)
                    }}
                  />
                </li>
              </Fragment>
            ))
          : null}
      </ul>
    </div>
  )
}
