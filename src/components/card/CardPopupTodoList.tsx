import router from 'next/router'
import { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import CardPopupWrapper from './CardPopupWrapper'

import { useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { useCardDetail } from '@/contexts/cardDetailContext'

import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'

interface ICardPopupTodoListProps {
  label: string
}

export default function CardPopupTodoList({ label }: ICardPopupTodoListProps) {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const { dispatch } = useCardDetail()
  const [todoListTitle, setTodoListTitle] = useState('')

  const cteateTodoList = () => {
    appDispatch(
      socketServiceActions.addNewTodoTitle({
        boardId,
        cardId,
        title: todoListTitle,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.ADD_CARD_TODO_TITLE_RESULT))

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
