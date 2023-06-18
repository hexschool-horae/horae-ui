import router from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Checkbox } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { Divider } from 'primereact/divider'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'

import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'
import { ITodoList, ITodo } from '@/apis/interface/api'
import IconDelete from '@/assets/icons/icon_delete.svg'

export default function CardDetailTodoList() {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const socketTodoLists = useAppSelector(state => state.board.cardDetail?.todolists)

  const [todoLists, setTodoLists] = useState<ITodoList[]>([])

  const onDeleteTodoList = (listId: string) => {
    appDispatch(
      socketServiceActions.deleteTodo({
        boardId,
        cardId,
        titleId: listId,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.DELETE_CARD_TODO_RESULT))
  }

  const onUpdateTodoTitle = (listId: string, title: string) => {
    appDispatch(
      socketServiceActions.modifyTodoTitle({
        boardId,
        cardId,
        title,
        titleId: listId,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.MODIFY_CARD_TODO_TITLE_RESULT))
  }

  const onToggleComplete = (checked: boolean, listId: string, todoId: string) => {
    const lists = JSON.parse(JSON.stringify(todoLists))
    const listIndex = findListIndex(lists, listId)
    const todoIndex = findTodoIndex(lists[listIndex].contentList, todoId)
    lists[listIndex].contentList[todoIndex].completed = checked
    setTodoLists(lists)
  }

  const findListIndex = (lists: ITodoList[], listId: string) => {
    return lists.findIndex(todolist => todolist._id === listId)
  }

  const findTodoIndex = (todos: ITodo[], todoId: string) => {
    return todos.findIndex(todo => todo._id === todoId)
  }

  useEffect(() => {
    if (socketTodoLists == undefined) return
    setTodoLists(socketTodoLists)
  }, [socketTodoLists])

  return (
    <>
      {todoLists.map(todolist => (
        <TodoList
          key={todolist._id}
          boardId={boardId}
          cardId={cardId}
          listTitle={todolist.title}
          contentList={todolist.contentList}
          listId={todolist._id}
          onDeleteTodoList={onDeleteTodoList}
          onUpdateTodoTitle={onUpdateTodoTitle}
          onToggleComplete={onToggleComplete}
        />
      ))}
      <Divider />
    </>
  )
}

interface ITodoListProps {
  boardId: string
  cardId: string
  listTitle: string
  contentList: ITodo[]
  listId: string
  onDeleteTodoList: (listId: string) => void
  onUpdateTodoTitle: (listId: string, title: string) => void
  onToggleComplete: (checked: boolean, listId: string, todoId: string) => void
}

const TodoList = ({
  boardId,
  cardId,
  listTitle,
  contentList,
  listId,
  onDeleteTodoList,
  onUpdateTodoTitle,
  onToggleComplete,
}: ITodoListProps) => {
  const appDispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const [todoList, setTodoList] = useState<ITodo[]>([])
  const [todoTitle, setTodoTitle] = useState('')
  const [isEditTitle, setIsEditTitle] = useState(false)
  const [todoItem, setTodoItem] = useState('')
  const [editTodoItem, setEditTodoItem] = useState('')
  const [toggleCheck, setToggleCheck] = useState(false)
  const [isEditId, setIsEditId] = useState<null | string>(null)
  const [showCompleted, setShowCompleted] = useState(true)

  const confirmDeleteTodoList = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: '確定要刪除這個待辦清單嗎?',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      acceptLabel: '確定',
      rejectLabel: '取消',
      accept: handleDeleteTodoList,
    })
  }

  const handleDeleteTodoList = () => {
    onDeleteTodoList(listId)
  }

  const handleUpdateTodoListTitle = () => {
    onUpdateTodoTitle(listId, todoTitle)
  }

  const handleCreateTodoItem = () => {
    if (todoItem == '') return
    appDispatch(
      socketServiceActions.addTodoContent({
        cardId,
        boardId,
        titleId: listId,
        content: todoItem,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.ADD_CARD_TODO_CONTENT_RESULT))
    setTodoItem('')
  }

  const handleUpdateTodoItem = (todo: ITodo) => {
    if (editTodoItem == '') return
    // onUpdateTodoItem(listId, todoId, editTodoItem)
    appDispatch(
      socketServiceActions.modifyTodoContent({
        cardId,
        boardId,
        contentId: todo._id,
        content: editTodoItem,
        completed: todo.completed,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.MODIFY_CARD_TODO_CONTENT_RESULT))
  }

  const handleToggleComplete = (checked: boolean, todo: ITodo) => {
    onToggleComplete(checked, listId, todo._id)
    appDispatch(
      socketServiceActions.modifyTodoContent({
        cardId,
        boardId,
        contentId: todo._id,
        content: todo.content,
        completed: checked,
      })
    )
  }

  const handleDeleteTodoItem = (todoId: string) => {
    appDispatch(
      socketServiceActions.deleteTodoContent({
        cardId,
        boardId,
        contentId: todoId,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.DELETE_CARD_TODO_CONTENT_RESULT))
  }

  const calculateProgressWidth = () => {
    let wh = 0
    const total = todoList.length
    if (total !== 0) {
      const completedCount = todoList.filter(todo => todo.completed === true).length
      wh = Math.floor((completedCount / total) * 100)
    }
    return wh
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, type = 'create', todo?: ITodo) => {
    if (e.key !== 'Enter') return
    switch (type) {
      case 'create':
        handleCreateTodoItem()
        inputRef.current?.blur()
        break
      case 'edit':
        if (todo) {
          handleUpdateTodoItem(todo)
          setIsEditId(null)
        }
        break
      case 'editTitle':
        if (todoTitle) {
          handleUpdateTodoListTitle()
          setIsEditTitle(false)
        }
    }
  }

  const filteredTodos = useMemo(() => {
    return showCompleted ? todoList : todoList.filter(todo => !todo.completed)
  }, [showCompleted, toggleCheck, todoList])

  useEffect(() => {
    if (isEditId != null) {
      editInputRef.current?.focus()
      const index = todoList.findIndex(todo => todo._id === isEditId)
      if (index >= 0) {
        setEditTodoItem(todoList[index].content)
      }
    }
  }, [isEditId])

  useEffect(() => {
    if (isEditTitle) {
      titleRef.current?.focus()
    }
  }, [isEditTitle])

  useEffect(() => {
    calculateProgressWidth()
  }, [toggleCheck, todoList.length])

  useEffect(() => {
    setTodoList(contentList)
  }, [contentList])

  return (
    <div className="relative">
      <div className="flex justify-between">
        {isEditTitle ? (
          <div className="flex items-center grow mr-4">
            <InputText
              className="grow cursor-pointer"
              onChange={e => setTodoTitle(e.target.value)}
              value={todoTitle}
              ref={titleRef}
              onBlur={() => setIsEditTitle(false)}
              onKeyPress={e => handleKeyPress(e, 'editTitle')}
            />
          </div>
        ) : (
          <div className="flex items-center">
            <h5
              className="text-lg"
              onClick={() => {
                setTodoTitle(listTitle)
                setIsEditTitle(true)
              }}
            >
              {listTitle}
            </h5>
            <ConfirmPopup />
            <Button size="small" text className={`py-0 ${style.icon_btn_delete}`} onClick={confirmDeleteTodoList}>
              <IconDelete />
            </Button>
          </div>
        )}

        {calculateProgressWidth() !== 0 && (
          <Button
            label={showCompleted ? '隱藏完成項目' : '顯示完成項目'}
            rounded
            outlined
            size="small"
            className="border-gray-300 text-gray-400"
            onClick={() => {
              setShowCompleted(prev => !prev)
            }}
          />
        )}
      </div>
      <ProgressBar value={calculateProgressWidth()} showValue={false} className="h-[5px] my-5"></ProgressBar>
      <ul>
        {filteredTodos.map(todo => (
          <li className="flex items-center gap-4 mb-2" key={todo._id}>
            <Checkbox
              checked={todo.completed}
              onChange={e => {
                if (e.checked == undefined) return
                handleToggleComplete(e.checked, todo)
                setToggleCheck(prev => !prev)
              }}
            ></Checkbox>

            {todo._id === isEditId ? (
              <InputText
                className="grow cursor-pointer"
                onChange={e => setEditTodoItem(e.target.value)}
                value={editTodoItem}
                ref={editInputRef}
                onBlur={() => setIsEditId(null)}
                onKeyPress={e => handleKeyPress(e, 'edit', todo)}
              />
            ) : (
              <label
                className="grow cursor-pointer"
                onClick={() => {
                  setEditTodoItem(todo.content)
                  setIsEditId(todo._id)
                }}
              >
                {todo.content}
              </label>
            )}
            <Button
              size="small"
              text
              className={`hover:bg-transparent ${style.icon_btn_delete}`}
              onClick={() => handleDeleteTodoItem(todo._id)}
            >
              <IconDelete />
            </Button>
          </li>
        ))}
        {/* add new todo item */}
        <li className="flex items-center gap-4 my-6">
          <Checkbox checked={false}></Checkbox>
          <InputText
            placeholder="增加項目..."
            className="w-full"
            onChange={e => setTodoItem(e.target.value)}
            value={todoItem}
            ref={inputRef}
            onKeyPress={e => handleKeyPress(e)}
          />
        </li>
      </ul>
    </div>
  )
}
