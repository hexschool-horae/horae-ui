import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { useAppSelector } from '@/hooks/useAppStore'
// import { useAppDispatch } from '@/hooks/useAppStore'

export default function BoardTitle() {
  const boardTitle = useAppSelector(state => state.boardSocket.title)

  const [isEdit, setIsEdit] = useState(false)
  return (
    <div onClick={() => setIsEdit(!isEdit)}>
      {isEdit ? <InputText value={boardTitle} /> : <h4 className="text-2xl">{boardTitle}</h4>}
    </div>
  )
}
