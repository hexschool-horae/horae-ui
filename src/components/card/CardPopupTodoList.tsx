import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import CardPopupWrapper from './CardPopupWrapper'

import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardPopupTodoListProps {
  label: string
}

export default function CardPopupTodoList({ label }: ICardPopupTodoListProps) {
  const { dispatch } = useCardDetail()
  const [todoListTitle, setTodoListTitle] = useState('')

  const cteateTodoList = () => {
    dispatch({
      type: 'ADD_TODO_LIST',
      payload: {
        listTitle: todoListTitle,
      },
    })
    dispatch({
      type: 'TOTGGLE_POPUP',
      payload: label,
    })
  }

  return (
    <CardPopupWrapper title="新增待辦清單" label={label}>
      <label htmlFor="todo-title">標題</label>
      <InputText
        placeholder="待辦清單標題"
        value={todoListTitle}
        id="todo-title"
        aria-describedby="todo-title-help"
        className="w-full my-2"
        onChange={e => setTodoListTitle(e.target.value)}
      />
      <Button
        label="新建"
        severity="secondary"
        rounded
        className="w-full mt-5"
        disabled={todoListTitle == ''}
        onClick={cteateTodoList}
      />
    </CardPopupWrapper>
  )
}
