import { ReactNode, memo } from 'react'
import {
  AnimateLayoutChanges,
  // SortableContext,
  // arrayMove,
  useSortable,
  defaultAnimateLayoutChanges,
  // verticalListSortingStrategy,
  // SortingStrategy,
  // horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
// import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { classNames } from 'primereact/utils'
import SortableListTitle from './SortableListTitle'

const animateLayoutChanges: AnimateLayoutChanges = args => defaultAnimateLayoutChanges({ ...args, wasDragging: true })

const SortableList = ({
  id,
  children,
  listItems,
  listTitle,
  listPosition,
}: {
  id: string
  children: ReactNode
  listItems: any
  listTitle: string
  listPosition: number
}) => {
  const {
    setNodeRef,
    attributes,
    // setActivatorNodeRef,
    listeners,
    isDragging,
    // isSorting,
    active,
    over,
    // overIndex,
    transform,
    transition,
  } = useSortable({
    id,
    data: {
      listId: id,
      listPosition,
      type: 'list',
      children: listItems,
    },
    animateLayoutChanges: animateLayoutChanges,
  })

  const isOverContainer = over
    ? (id === over.id && active?.data.current?.type !== 'list') || listItems.some((item: any) => item.id === over.id)
    : false

  const style = {
    transform: CSS.Translate.toString(transform),
    // transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  // console.log('isDragging', isDragging)

  return (
    <div
      className={classNames('w-[286px] p-[-20px] row-span-full')}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      {...listeners}
    >
      <div className={classNames('bg-secondary-4 px-4 py-5', { 'bg-secondary-2': isOverContainer })}>
        <SortableListTitle title={listTitle} listId={id} isDragging={isDragging}></SortableListTitle>
        {children}
      </div>
    </div>
  )
}
export default memo(SortableList)
