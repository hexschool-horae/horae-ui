import { useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Checkbox } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'
import { useCardDetail } from '@/contexts/cardDetailContext'
// import { ITodoList } from '@/apis/interface/api'

export default function CardDetailTodoList() {
  const { state } = useCardDetail()
  const inputsRef = useRef<Array<HTMLDivElement | null>>([])
  // const [todoList, setTodoList] = useState<ITodoList[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Enter') {
      inputsRef.current[i]?.blur()
    }
  }

  useEffect(() => {
    // setTodoList(state.cardDetail.todolists);
    inputsRef.current = inputsRef.current.slice(0, state.cardDetail.todolists.length)
  }, [state.cardDetail.todolists])

  return (
    <>
      {state.cardDetail.todolists.map((todolist, i) => (
        <div key={i}>
          <div className="flex justify-between">
            <h5 className="text-lg">{todolist.title}</h5>
            <Button label="隱藏完成項目" rounded outlined size="small" className="border-gray-300 text-gray-400" />
          </div>
          <ProgressBar value={50} showValue={false} className="h-[5px] my-5"></ProgressBar>
          <ul>
            {todolist.contentList.map(todo => (
              <li className="flex items-center gap-4 mb-2" key={i2}>
                <Checkbox inputId="ingredient1" checked={todo.completed}></Checkbox>
                <label htmlFor="ingredient1" className="grow cursor-pointer">
                  {todo.content}
                </label>
                <Button icon="pi pi-times" rounded outlined aria-label="remove" className="!w-[30px] !h-[30px]" />
              </li>
            ))}
            {/* add new todo item */}
            <li className="flex items-center gap-4 my-6">
              <Checkbox checked={false}></Checkbox>
              <InputText
                placeholder="增加項目..."
                className="w-full"
                ref={el => (inputsRef.current[i] = el)}
                onKeyDown={e => handleKeyDown(e, i)}
              />
            </li>
          </ul>
        </div>
      ))}
    </>
  )
}
