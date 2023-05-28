import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import AddCardButton from './AddCardButton'
import ListSettingMenu from './ListSettingMenu'
import Card from './Card'
import Draggable from './Draggable'
import Droppable from './Droppable'

import { IBoardListItem } from '@/types/pages'

import { classNames } from 'primereact/utils'

export default function List({
  data,
  onCreateCard,
}: {
  data: IBoardListItem
  onCreateCard: (listId: string, title: string) => void
}) {
  /** 卡片陣列狀態 */
  const { cards } = data
  const router = useRouter()
  const [isDisabledLink, setIsDisabledLink] = useState(false)

  const onIsDragging = (isDragging: boolean) => {
    /** 當拖曳事件發生時，禁止 Link 被觸發(透過 class disabled-link) */
    setIsDisabledLink(isDragging)
  }

  return (
    <>
      {/* 列表標題 */}
      <div className="flex mb-3 ">
        <h6 className="text-lg !text-secondary-3 mr-auto ">{data.title}</h6>
        <ListSettingMenu />
      </div>

      {/* 卡片 */}
      {cards?.length ? (
        cards.map((item, index) => {
          return (
            <div key={index}>
              <Droppable
                id={`${item._id}`}
                data={{
                  cardId: item._id,
                  cardPosition: index,
                  listPosition: data.position,
                  eventType: 'card',
                }}
              >
                <Draggable
                  id={`${item._id}`}
                  data={{
                    cardId: item._id,
                    cardPosition: index,
                    listPosition: data.position,
                    eventType: 'card',
                  }}
                  onIsDragging={onIsDragging}
                >
                  <Link
                    className={classNames({ 'disabled-link': isDisabledLink })}
                    href={`/board/${router.query.boardId}/?cardId=${item._id}`}
                  >
                    <Card key={index} title={item.title} labels={item.labels} />
                  </Link>
                </Draggable>
              </Droppable>
            </div>
          )
        })
      ) : (
        <></>
      )}

      <AddCardButton listId={data._id} onCreateCard={onCreateCard} />
    </>
  )
}
