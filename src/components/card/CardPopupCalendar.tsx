import { useEffect, useState } from 'react'
import style from './cardPopups.module.scss'
import { Calendar } from 'primereact/calendar'
import { Divider } from 'primereact/divider'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'
import CardPopupWrapper from './CardPopupWrapper'

interface ICardPopupCalendarProps {
  label: string
}
type TCalendar = null | string | Date | Date[]

/* eslint-disable */
export default function CardPopupCalendar({ label }: ICardPopupCalendarProps) {
  const { state, dispatch } = useCardDetail()
  const [dates, setDates] = useState<Date[]>([])
  const [startTime, setStartTime] = useState<TCalendar>(new Date())
  const [endTime, setEndTime] = useState<TCalendar>(new Date())

  const getTomorrow = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    return tomorrow
  }

  useEffect(() => {
    if (state.cardDetail.startDate != null && state.cardDetail.endDate != null) {
      setDates([new Date(state.cardDetail.startDate), new Date(state.cardDetail.endDate)])
      setStartTime(new Date(state.cardDetail.startDate))
      setEndTime(new Date(state.cardDetail.endDate))
    } else {
      setDates([new Date(), getTomorrow()])
    }
  }, [state.cardDetail.startDate, state.cardDetail.endDate])

  const handleChangeDate = (e: any) => {
    setDates(e.value)
  }

  const dispatchDates = () => {
    const start = `${formatDate(dates[0])} ${formatTime(startTime)}`
    const end = `${formatDate(dates[1])} ${formatTime(endTime)}`
    console.log(dates[0], formatDate(dates[0]))
    console.log(startTime, formatTime(startTime))
    dispatch({
      type: 'ADD_DATES',
      payload: {
        startDate: new Date(start).getTime(),
        endDate: new Date(end).getTime(),
      },
    })
  }

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
        label="建立"
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
