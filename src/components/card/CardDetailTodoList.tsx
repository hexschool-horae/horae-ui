import { useEffect, useMemo, useRef, useState } from 'react'
import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Checkbox } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { ITodoList, ITodo } from '@/apis/interface/api'
import IconDelete from '@/assets/icons/icon_delete.svg'

export default function CardDetailTodoList() {
  const { state } = useCardDetail()
  // const inputsRef = useRef<Array<HTMLDivElement | null>>([])
  const [todoLists, setTodoLists] = useState<ITodoList[]>([])

  const onCreateTodoItem = (listId: string, todoItem: string) => {
    const lists = [...todoLists]
    const listIndex = findListIndex(lists, listId)

    lists[listIndex].contentList.push({
      _id: new Date().getTime().toString(),
      content: todoItem,
      completed: false,
    })
    setTodoLists(lists)
  }

  const onUpdateTodoItem = (listId: string, todoId: string, todoItem: string) => {
    const lists = [...todoLists]
    const listIndex = findListIndex(lists, listId)
    const todoIndex = findTodoIndex(lists[listIndex].contentList, todoId)
    lists[listIndex].contentList[todoIndex].content = todoItem
    setTodoLists(lists)
  }

  const onDeleteTodoItem = (listId: string, todoId: string) => {
    const lists = [...todoLists]
    const listIndex = findListIndex(lists, listId)
    const todoIndex = findTodoIndex(lists[listIndex].contentList, todoId)
    lists[listIndex].contentList.splice(todoIndex, 1)
    setTodoLists(lists)
  }

  const onToggleComplete = (checked: boolean, listId: string, todoId: string) => {
    const lists = [...todoLists]
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
    setTodoLists(state.cardDetail.todolists)
    // inputsRef.current = inputsRef.current.slice(0, state.cardDetail.todolists.length)
  }, [state.cardDetail.todolists])

  return (
    <>
      {todoLists.map(todolist => (
        <TodoList
          key={todolist._id}
          listTitle={todolist.title}
          contentList={todolist.contentList}
          listId={todolist._id}
          onCreateTodoItem={onCreateTodoItem}
          onUpdateTodoItem={onUpdateTodoItem}
          onDeleteTodoItem={onDeleteTodoItem}
          onToggleComplete={onToggleComplete}
        />
      ))}

      {/* {todolist.contentList.map((todo, i2) => (
              <li className="flex items-center gap-4 mb-2" key={i2}>
                <Checkbox inputId="ingredient1" checked={todo.completed}></Checkbox>
                <label htmlFor="ingredient1" className="grow cursor-pointer">
                  {todo.content}
                </label>
                <Button icon="pi pi-times" rounded outlined aria-label="remove" className="!w-[30px] !h-[30px]" />
              </li>
            ))}
          
            <li className="flex items-center gap-4 my-6">
              <Checkbox checked={false}></Checkbox>
              <InputText
                placeholder="增加項目..."
                className="w-full"
                onChange={e => setNewTodoItem(e.target.value)}
                ref={el => (inputsRef.current[i] = el)}
                onKeyPress={e => handleKeyPress(e, i)}
              />
            </li> */}
    </>
  )
}

interface ITodoListProps {
  listTitle: string
  contentList: ITodo[]
  listId: string
  onCreateTodoItem: (listId: string, todoItem: string) => void
  onUpdateTodoItem: (listId: string, todoId: string, todoItem: string) => void
  onDeleteTodoItem: (listId: string, todoId: string) => void
  onToggleComplete: (checked: boolean, listId: string, todoId: string) => void
}

const TodoList = ({
  listTitle,
  contentList,
  listId,
  onCreateTodoItem,
  onUpdateTodoItem,
  onDeleteTodoItem,
  onToggleComplete,
}: ITodoListProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [todoItem, setTodoItem] = useState('')
  const [editTodoItem, setEditTodoItem] = useState('')
  const [toggleCheck, setToggleCheck] = useState(false)
  const [isEditId, setIsEditId] = useState<null | string>(null)
  const [progressWidth, setProgressWidth] = useState(0)
  const [showCompleted, setShowCompleted] = useState(true)

  const handleCreateTodoItem = () => {
    if (todoItem == '') return
    onCreateTodoItem(listId, todoItem)
    setTodoItem('')
  }

  const handleUpdateTodoItem = (todoId: string) => {
    if (editTodoItem == '') return
    onUpdateTodoItem(listId, todoId, editTodoItem)
  }

  const handleDeleteTdodItem = (todoId: string) => {
    onDeleteTodoItem(listId, todoId)
  }

  const handleToggleComplete = (checked: boolean, todoId: string) => {
    onToggleComplete(checked, listId, todoId)
  }

  const calculateProgressWidth = () => {
    let wh = 0
    const total = contentList.length
    if (total !== 0) {
      const completedCount = contentList.filter(todo => todo.completed === true).length
      wh = Math.floor((completedCount / total) * 100)
    }
    setProgressWidth(wh)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, type = 'create', todoId?: string) => {
    if (e.key !== 'Enter') return
    switch (type) {
      case 'create':
        handleCreateTodoItem()
        inputRef.current?.blur()
        break
      case 'edit':
        if (todoId) {
          handleUpdateTodoItem(todoId)
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

  return (
    <div>
      <div className="flex justify-between">
        <h5 className="text-lg">{listTitle}</h5>
        {progressWidth !== 0 && (
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
      <ProgressBar value={progressWidth} showValue={false} className="h-[5px] my-5"></ProgressBar>
      <ul>
        {filteredTodos.map(todo => (
          <li className="flex items-center gap-4 mb-2" key={todo._id}>
            <Checkbox
              checked={todo.completed}
              onChange={e => {
                if (e.checked == undefined) return
                handleToggleComplete(e.checked, todo._id)
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
                onKeyPress={e => handleKeyPress(e, 'edit', todo._id)}
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
    </div>
  )
}
