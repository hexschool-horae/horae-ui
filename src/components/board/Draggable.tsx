import { ReactNode } from 'react'
import { useDraggable } from '@dnd-kit/core'

export default function Draggable({ id, children }: { id: string | number; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-list-${id}`,
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  )
}
