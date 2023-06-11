import router from 'next/router'
import { Button } from 'primereact/button'
import priorityStyle from './priority.module.scss'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'

import CardPopupWrapper from './CardPopupWrapper'

interface ICardPopupPriorityProps {
  label: string
}

const list = [
  {
    label: '高',
    value: '1',
    color: 'high',
  },
  {
    label: '中',
    value: '2',
    color: 'medium',
  },
  {
    label: '低',
    value: '3',
    color: 'low',
  },
]

export default function CardPopupPriority({ label }: ICardPopupPriorityProps) {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const socketPriority = useAppSelector(state => state.board.cardDetail?.proiority)
  const cardDetail = useAppSelector(state => state.board.cardDetail)

  const handlePriority = (value: string) => {
    let priority = ''
    if (value !== socketPriority) {
      priority = value
    }
    if (cardDetail) {
      appDispatch(
        socketServiceActions.modifyCard({
          boardId,
          cardId,
          title: cardDetail.title,
          describe: cardDetail.describe,
          startDate: cardDetail.startDate,
          endDate: cardDetail.endDate,
          proiority: priority,
        })
      )
    }
  }

  return (
    <CardPopupWrapper title="設定優先權" label={label}>
      <div className="mt-1">
        {list.map(item => (
          <Button
            outlined
            key={item.value}
            className={`w-full mb-3 border-gray-300 text-black
              ${socketPriority === item.value ? 'bg-secondary-4 border-secondary-3' : ''}`}
            onClick={() => handlePriority(item.value)}
          >
            <div className="relative w-full flex items-center justify-center">
              <div className="absolute left-1">
                <i className={`pi pi-flag-fill ${priorityStyle[item.color]}`} style={{ fontSize: '18px' }}></i>
              </div>

              <p>{item.label}</p>
            </div>
          </Button>
        ))}
      </div>
    </CardPopupWrapper>
  )
}
