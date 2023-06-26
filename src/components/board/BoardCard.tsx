import { memo } from 'react'
import { useRouter } from 'next/router'

import { Chip } from 'primereact/chip'
import { classNames } from 'primereact/utils'
import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import type { Transform } from '@dnd-kit/utilities'
import Link from 'next/link'
import { UniqueIdentifier } from '@dnd-kit/core'
import priorityStyle from '@/components/card/priority.module.scss'
import tagStyle from '@/components/card/tags.module.scss'

export interface IBoardCardItem {
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
    BoardCard: string
  }[]
  proiority: string
  position: number
}

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
  title = '',
  priority = '',
  tags = [],
  // listeners,
  isDragging,
}: // isSorting,
// transform,
// transition,
// over,
// overIndex,
{
  title: string
  priority?: string
  tags: { title: string; color: string }[]
  id: UniqueIdentifier | string | number
  listeners?: DraggableSyntheticListeners
  isDragging?: boolean
  isSorting?: boolean
  transform?: Transform
  transition?: string | null
  // over
  // overIndex
}) => {
  const router = useRouter()
  // console.log(BoardCardItem)

  const getPriorityColor = (val: string) => {
    switch (val) {
      case '1':
        return 'high-bg'
      case '2':
        return 'medium-bg'
      case '3':
        return 'low-bg'
      default:
        return ''
    }
  }
  /* 卡片本體 */
  return (
    <Link className={classNames({ 'disabled-link': isDragging })} href={`/board/${router.query.boardId}/?cardId=${id}`}>
      <div
        className={classNames(
          { 'h-[152px]': tags.length > 0 || priority != '', 'opacity-50': title === '' },
          'w-[254px] flex flex-col justify-between rounded-md  bg-white p-4 mb-3'
        )}
      >
        <h6 className={classNames({ 'mb-10': tags.length > 0 }, 'text-start')}>{title}</h6>
        <div className="flex items-center flex-wrap gap-1">
          {priority && (
            <div
              className={`w-[32px] h-[32px] rounded-full text-center leading-[32px] ${
                priorityStyle[getPriorityColor(priority)]
              }`}
            >
              <i className="pi pi-flag text-white" style={{ fontSize: '18px' }}></i>
            </div>
          )}
          {/* 卡片標籤 */}
          {tags.map((tag, i) => (
            <Chip
              key={i}
              label={tag.title}
              style={{ backgroundColor: tag.color, color: '#CC3A3A' }}
              className={tagStyle.list_BoardCard_tag}
            ></Chip>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default memo(BoardCard)
