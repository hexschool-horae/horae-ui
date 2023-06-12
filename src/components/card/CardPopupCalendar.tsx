import router from 'next/router'
import { useEffect, useState } from 'react'
import style from './cardPopups.module.scss'
import { Calendar } from 'primereact/calendar'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { dialogSliceActions } from '@/slices/dialogSlice'

import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'
import CardPopupWrapper from './CardPopupWrapper'

interface ICardPopupCalendarProps {
  label: string
}
type TCalendar = null | string | Date | Date[]

/* eslint-disable */
export default function CardPopupCalendar({ label }: ICardPopupCalendarProps) {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const socketStartDate = useAppSelector(state => state.board.cardDetail?.startDate)
  const socketEndDate = useAppSelector(state => state.board.cardDetail?.endDate)
  const cardDetail = useAppSelector(state => state.board.cardDetail)
  const { dispatch } = useCardDetail()

  const [dates, setDates] = useState<Date[]>([])
  const [startTime, setStartTime] = useState<TCalendar>(new Date())
  const [endTime, setEndTime] = useState<TCalendar>(new Date())
  const [isEdit, setIsEdit] = useState(false)

  const getTomorrow = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    return tomorrow
  }

  const handleChangeDate = (e: any) => {
    setDates(e.value)
  }

  const dispatchDates = () => {
    const start = `${formatDate(dates[0])} ${formatTime(startTime)}`
    const end = `${formatDate(dates[1])} ${formatTime(endTime)}`
    if (cardDetail) {
      appDispatch(
        socketServiceActions.modifyCard({
          boardId,
          cardId,
          title: cardDetail.title,
          describe: cardDetail.describe,
          startDate: new Date(start).getTime(),
          endDate: new Date(end).getTime(),
          proiority: cardDetail.proiority,
        })
      )
      appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_MODIFY_RESULT))
      dispatch({
        type: 'TOTGGLE_POPUP',
        payload: label,
      })
    }
  }

  useEffect(() => {
    if (socketStartDate != null && socketEndDate != null) {
      setDates([new Date(socketStartDate), new Date(socketEndDate)])
      setStartTime(new Date(socketStartDate))
      setEndTime(new Date(socketEndDate))
      setIsEdit(true)
    } else {
      setDates([new Date(), getTomorrow()])
      setIsEdit(false)
    }
  }, [socketStartDate, socketEndDate])

  return (
    <CardPopupWrapper title="日期" label={label}>
      <div className="px-12">
        {/*   @ts-ignore  */}
        <Calendar
          onChange={e => handleChangeDate(e)}
          className="w-full"
          value={dates}
          inline
          selectionMode="range"
          readOnlyInput
        />
      </div>
      <Divider className="mb-6" />
      <div className="grid grid-cols-4 gap-3 items-end mb-3">
        <div className="col-span-3">
          <label htmlFor="startDate">開始日期</label>
          <div className={`${style.fake_input}`}>{formatDate(dates[0])}</div>
        </div>
        <div className="col-span-1">
          <Calendar
            className={`${style.center_input_text}`}
            value={startTime}
            onChange={e => {
              if (e.value !== undefined) {
                setStartTime(e.value)
              }
            }}
            timeOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 items-end mb-5">
        <div className="col-span-3">
          <label htmlFor="startDate">結束日期</label>
          <div className={`${style.fake_input}`}>{formatDate(dates[1])}</div>
        </div>
        <div className="col-span-1">
          <Calendar
            className={`${style.center_input_text}`}
            value={endTime}
            onChange={e => {
              if (e.value !== undefined) {
                setEndTime(e.value)
              }
            }}
            timeOnly
          />
        </div>
      </div>

      <Button
        label={isEdit ? '儲存' : '建立'}
        severity="secondary"
        rounded
        className="w-full mt-4"
        disabled={dates.length == 0 || dates[0] == null || dates[1] == null || startTime == null || endTime == null}
        onClick={dispatchDates}
      />
      <Button
        label="取消"
        severity="secondary"
        rounded
        outlined
        className="w-full mt-3"
        onClick={() => {
          dispatch({
            type: 'TOTGGLE_POPUP',
            payload: label,
          })
        }}
      />
    </CardPopupWrapper>
  )
}

function formatDate(date: Date): string {
  if (date == undefined) return ''

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

function formatTime(time: any): string {
  if (time == null) return ''

  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}
