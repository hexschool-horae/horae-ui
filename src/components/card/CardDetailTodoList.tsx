import router from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Checkbox } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { Divider } from 'primereact/divider'
import { ProgressSpinner } from 'primereact/progressspinner'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { useCardDetail } from '@/contexts/cardDetailContext'

import { ITodoList, ITodo } from '@/apis/interface/api'
import IconDelete from '@/assets/icons/icon_delete.svg'

export default function CardDetailTodoList() {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const socketTodoLists = useAppSelector(state => state.board.cardDetail?.todolists)
  const { state } = useCardDetail()

  const [todoLists, setTodoLists] = useState<ITodoList[]>([])
  const [addTodoLoading, setAddTodoLoading] = useState(false)
  const [updateKey, setUpdateKey] = useState(0)

  const onDeleteTodoList = (listId: string) => {
    appDispatch(
      socketServiceActions.deleteTodo({
        boardId,
        cardId,
        titleId: listId,
      })
    )
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
    setAddTodoLoading(false)
    setUpdateKey(prev => prev + 1)
  }, [socketTodoLists])

  useEffect(() => {
    const listLength = socketTodoLists?.length
    const updateListLength = state.cardDetail.todolists.length
    if (updateListLength == 0 || listLength == updateListLength) return
    setAddTodoLoading(true)
  }, [state.cardDetail.todolists])

  return (
    <>
      {todoLists.map(todolist => (
        <TodoList
          key={todolist._id + updateKey}
          boardId={boardId}
          cardId={cardId}
          listTitle={todolist.title}
          contentList={todolist.contentList}
          listId={todolist._id}
          onDeleteTodoList={onDeleteTodoList}
          onToggleComplete={onToggleComplete}
        />
      ))}
      {addTodoLoading && (
        <div className="flex items-center justify-center">
          <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
        </div>
      )}
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
  onToggleComplete: (checked: boolean, listId: string, todoId: string) => void
}

const TodoList = ({
  boardId,
  cardId,
  listTitle,
  contentList,
  listId,
  onDeleteTodoList,
  onToggleComplete,
}: ITodoListProps) => {
  const appDispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [todoItem, setTodoItem] = useState('')
  const [editTodoItem, setEditTodoItem] = useState('')
  const [toggleCheck, setToggleCheck] = useState(false)
  const [isEditId, setIsEditId] = useState<null | string>(null)
  const [showCompleted, setShowCompleted] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
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
    setTodoItem('')
    setIsLoading(true)
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
    setIsLoading(true)
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

  const handleDeleteTdodItem = (todoId: string) => {
    appDispatch(
      socketServiceActions.deleteTodoContent({
        cardId,
        boardId,
        contentId: todoId,
      })
    )
    setIsLoading(true)
  }

  const calculateProgressWidth = () => {
    let wh = 0
    const total = contentList.length
    if (total !== 0) {
      const completedCount = contentList.filter(todo => todo.completed === true).length
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
    }
  }

  const filteredTodos = useMemo(() => {
    return showCompleted ? contentList : contentList.filter(todo => !todo.completed)
  }, [showCompleted, toggleCheck, contentList.length])

  useEffect(() => {
    if (isEditId != null) {
      editInputRef.current?.focus()
      const index = contentList.findIndex(todo => todo._id === isEditId)
      if (index >= 0) {
        setEditTodoItem(contentList[index].content)
      }
    }
  }, [isEditId])

  useEffect(() => {
    calculateProgressWidth()
  }, [toggleCheck, contentList.length])

  useEffect(() => {
    setIsLoading(false)
    console.log(showCompleted)
    /*
     待優化：
     目前無法判斷是哪個list update，
     因此同時編輯多個先回來的會取消後面的loading狀態
     之後應該將listId也從socket回傳來做分辨
    */
  }, [contentList])

  return (
    <div className="relative">
      <div className="flex justify-between">
        <div className="flex items-center">
          <h5 className="text-lg">{listTitle}</h5>
          <ConfirmPopup />
          <Button size="small" text className={`py-0 ${style.icon_btn_delete}`} onClick={confirmDeleteTodoList}>
            <IconDelete />
          </Button>
        </div>

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
              onClick={() => handleDeleteTdodItem(todo._id)}
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

      {isLoading && (
        <div className={style.loading_overlay}>
          <ProgressSpinner style={{ width: '40px', height: '40px' }} strokeWidth="4" />
        </div>
      )}
    </div>
  )
}
