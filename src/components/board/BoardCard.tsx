import { memo } from 'react'
import { useRouter } from 'next/router'

import { Chip } from 'primereact/chip'
import { classNames } from 'primereact/utils'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'
import Link from 'next/link'
import { UniqueIdentifier } from '@dnd-kit/core'
// import priorityStyle from './priority.module.scss'

// const list = [
//   {
//     label: '高',
//     value: '1',
//     color: 'high',
//   },
//   {
//     label: '中',
//     value: '2',
//     color: 'medium',
//   },
//   {
//     label: '低',
//     value: '3',
//     color: 'low',
//   },
// ]

export interface ICardItem {
  _id: string
  title: string
  startDate: number
  endDate: number
  tags: {
    _id: string
    title: string
    color: string
  }[]
  comments: {
    _id: string
    comment: string
    user: {
      _id: string
      name: string
      createdAt: string
    }
    card: string
  }[]
  proiority: string
  position: number
}

const BoardCard = ({
  id = '',
  // title = '',
  // priority = '',
  // tags = [],
  cardItem,
  // listeners,
  isDragging,
}: // isSorting,
// transform,
// transition,
// over,
// overIndex,
{
  id: UniqueIdentifier | string | number
  cardItem: ICardItem
  listeners?: DraggableSyntheticListeners
  isDragging?: boolean
  isSorting?: boolean
  transform?: Transform
  transition?: string | null
  // over
  // overIndex
}) => {
  const router = useRouter()
  // console.log(cardItem)
  /* 卡片本體 */
  return (
    <Link className={classNames({ 'disabled-link': isDragging })} href={`/board/${router.query.boardId}/?cardId=${id}`}>
      <div
        className={classNames(
          { 'h-[152px]': cardItem.tags?.length > 0 },
          'w-[254px] flex flex-col justify-between rounded-md  bg-white p-4 mb-3'
        )}
      >
        <h6 className={classNames({ 'mb-10': cardItem.tags?.length > 0 }, 'text-start')}>{cardItem.title}</h6>
        {/* 卡片標籤 */}
        <div className="flex">
          <div className="">
            <i className={`pi pi-flag-fill ${cardItem.proiority}`} style={{ fontSize: '18px' }}></i>
          </div>
          {cardItem.tags?.length ? (
            cardItem.tags.map((tag, i) => (
              <Chip key={i} label={tag.title} style={{ backgroundColor: tag.color, color: '#CC3A3A' }}></Chip>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </Link>
  )
}

export default memo(BoardCard)
