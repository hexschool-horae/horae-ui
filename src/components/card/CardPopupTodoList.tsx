import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import CardPopupWrapper from './CardPopupWrapper'

interface ICardPopupTodoListProps {
  label: string
}

export default function CardPopupTodoList({ label }: ICardPopupTodoListProps) {
  return (
    <CardPopupWrapper title="新增待辦清單" label={label}>
      <label htmlFor="todo-title">標題</label>
      <InputText
        placeholder="待辦清單標題"
        id="todo-title"
        aria-describedby="todo-title-help"
        className="w-full my-2"
      />
      <Button label="新建" severity="secondary" rounded className="w-full mt-5" />
    </CardPopupWrapper>
  )
}
