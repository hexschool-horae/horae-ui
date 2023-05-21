import { useDroppable } from '@dnd-kit/core'
import { ReactNode } from 'react'

export default function Droppable({ id, children }: { id: string | number; children: ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-list-${id}`,
  })

  const style = {
    color: isOver ? '#CC3A3A' : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      {children}
    </div>
  )
}
