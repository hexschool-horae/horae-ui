import { ReactNode, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'

export default function Draggable({
  data = {},
  id,
  children,
  onIsDragging,
}: {
  /**要讓Dragg End時帶出的資料 */
  data?: { [key: string]: string | number }
  id: string | number
  children: ReactNode
  onIsDragging?: (isDragging: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data,
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  useEffect(() => {
    if (onIsDragging) onIsDragging(isDragging)
  }, [isDragging])

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  )
}
