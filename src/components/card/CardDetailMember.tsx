import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { Fragment } from 'react'
import { DELETE_CARD_MEMBER } from '@/apis/axios-service'
import { errorSliceActions } from '@/slices/errorSlice'
import { AxiosError } from 'axios'

interface ICardDetailMemberProps {
  label: string
  cardId: string
  handleGetCardDetail: () => void
}

interface IMember {
  avatar: string
  email: string
  name: string
  _id: string
}

export default function CardDetailMember({ label, cardId, handleGetCardDetail }: ICardDetailMemberProps) {
  const { dispatch, state } = useCardDetail()
  const selectedMembers: IMember[] = state.cardDetail.members as unknown as IMember[]

  const getShortName = (name: string) => {
    return name.charAt(0)
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
                  <div className="member-icon bg-secondary-3 text-white rounded-full w-[40px] h-[40px] p-2 text-center mr-3">
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
