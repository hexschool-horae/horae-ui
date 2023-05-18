import { useState } from 'react'
import { InputText } from 'primereact/inputtext'

export default function BoardTitle() {
  const [boardTitle] = useState('看板一')
  const [isEdit, setIsEdit] = useState(false)
  return (
    <div onClick={() => setIsEdit(!isEdit)}>
      {isEdit ? <InputText value={boardTitle} /> : <h4 className="text-2xl">{boardTitle}</h4>}
    </div>
  )
}
