import React, { cloneElement, memo } from 'react'
import { ICardItem } from './BoardCard'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { UniqueIdentifier } from '@dnd-kit/core'
import BoardCard from './BoardCard'

function SortableCard({
  id,
  listId,
  cardItem,
  listPosition,
}: {
  id: UniqueIdentifier | string | number
  listId: string
  cardItem: ICardItem
  listPosition: number
}) {
  const {
    setNodeRef,
    attributes,
    // setActivatorNodeRef,
    listeners,
    isDragging,
    isSorting,
    // over,
    // overIndex,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      type: 'card',
      listId,
      cardId: id,
      listPosition,
      cardPosition: cardItem.position,
      children: cardItem,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    // transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div {...listeners} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {cloneElement(<BoardCard id={id} cardItem={cardItem} />, {
        // setActivatorNodeRef,
        listeners,
        isDragging,
        isSorting,
        // over,
        // overIndex,
        transform,
        transition,
        id,
        listId,
        cardItem,
      })}
    </div>
  )
}

export default memo(SortableCard)
