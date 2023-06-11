import style from './cardDetail.module.scss'
import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'
import IconDelete from '@/assets/icons/icon_delete.svg'

interface ICardDetailCalendarProps {
  label: string
}

export default function CardDetailCalendar({ label }: ICardDetailCalendarProps) {
  const { state, dispatch } = useCardDetail()
  const [showDates, setShowDates] = useState('')

  function formatDate(dateString: string | number) {
    if (dateString == undefined) return 'YYYY/MM/DD HH:mm'
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}.${month}.${day} ${hours}:${minutes}`
  }

  useEffect(() => {
    if (state.cardDetail.startDate != null && state.cardDetail.endDate != null) {
      const startDate = formatDate(state.cardDetail.startDate)
      const endDate = formatDate(state.cardDetail.endDate)
      setShowDates(`${startDate} ~ ${endDate}`)
    }
  }, [state.cardDetail.startDate, state.cardDetail.endDate])
  return (
    <div className={style.detail_list}>
      <div>日期</div>
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
      <div className="flex items-center">
        <div>{showDates}</div>
        <Button
          size="small"
          text
          className={`hover:bg-transparent ${style.icon_btn_delete}`}
          onClick={() => {
            dispatch({
              type: 'DELETE_DATES',
            })
          }}
        >
          <IconDelete />
        </Button>
      </div>
    </div>
  )
}
