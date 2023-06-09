import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { Fragment } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'
import IconDelete from '@/assets/icons/icon_delete.svg'

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
  const token = useAppSelector(state => state.user.token) || ''
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
      <div className="flex w-[17%] mt-[5px]">
        <div className={style.detail_list_title}>成員</div>
        {token && (
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
        )}
      </div>
      <ul className="flex flex-wrap w-[83%]">
        {selectedMembers
          ? selectedMembers.map(member => (
              <Fragment key={member._id}>
                <li className="flex items-center pr-2 pb-2">
                  <div
                    className="member-icon text-black rounded-full w-[40px] h-[40px] p-2 text-center mr-3"
                    style={{ backgroundColor: member.avatar ? member.avatar : '#CC3A3A' }}
                  >
                    {getShortName(member.name)}
                  </div>
                  <div className="mr-3">{member.name}</div>
                  {token && (
                    <Button
                      size="small"
                      text
                      className={`hover:bg-transparent px-0 ${style.icon_btn_delete}`}
                      onClick={() => {
                        handleDeleteCardMember(member._id)
                      }}
                    >
                      <IconDelete />
                    </Button>
                  )}
                </li>
              </Fragment>
            ))
          : null}
      </ul>
    </div>
  )
}
