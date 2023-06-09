import router from 'next/router'
import { useEffect, useState } from 'react'
import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { dialogSliceActions } from '@/slices/dialogSlice'

import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'
import IconDelete from '@/assets/icons/icon_delete.svg'

interface ICardDetailCalendarProps {
  label: string
}

export default function CardDetailCalendar({ label }: ICardDetailCalendarProps) {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const token = useAppSelector(state => state.user.token) || ''
  const socketStartDate = useAppSelector(state => state.board.cardDetail?.startDate)
  const socketEndDate = useAppSelector(state => state.board.cardDetail?.endDate)
  const cardDetail = useAppSelector(state => state.board.cardDetail)
  const { dispatch } = useCardDetail()
  const [showDates, setShowDates] = useState('')

  function formatDate(dateString: string | number) {
    if (dateString == undefined) return 'YYYY/MM/DD HH:mm'
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  const deleteDate = () => {
    if (cardDetail) {
      appDispatch(
        socketServiceActions.modifyCard({
          boardId,
          cardId,
          title: cardDetail.title,
          describe: cardDetail.describe,
          startDate: null,
          endDate: null,
          proiority: cardDetail.proiority,
        })
      )
      appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_MODIFY_RESULT))
    }
  }

  useEffect(() => {
    if (socketStartDate != null && socketEndDate != null) {
      const startDate = formatDate(socketStartDate)
      const endDate = formatDate(socketEndDate)
      setShowDates(`${startDate} ~ ${endDate}`)
    } else {
      setShowDates('')
    }
  }, [socketStartDate, socketEndDate])

  return (
    <>
      {showDates != '' && (
        <div className={style.detail_list}>
          <div className={style.detail_list_title}>日期</div>
          {token && (
            <Button
              icon="pi pi-calendar"
              rounded
              aria-label="calendar"
              className={style.detail_list_add_btn}
              onClick={() => {
                dispatch({
                  type: 'TOTGGLE_POPUP',
                  payload: label,
                })
              }}
            />
          )}
          <div className="flex items-center">
            <div>{showDates}</div>
            {token && (
              <Button
                size="small"
                text
                className={`hover:bg-transparent ${style.icon_btn_delete}`}
                onClick={deleteDate}
              >
                <IconDelete />
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
