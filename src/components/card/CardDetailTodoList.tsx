import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Checkbox } from 'primereact/checkbox'
import { InputText } from 'primereact/inputtext'

export default function CardDetailTodoList() {
  return (
    <>
      <div>
        <div className="flex justify-between">
          <h5 className="text-lg">待辦清單標題</h5>
          <Button label="隱藏完成項目" rounded outlined size="small" className="border-gray-300 text-gray-400" />
        </div>
        <ProgressBar value={50} showValue={false} className="h-[5px] my-5"></ProgressBar>
        <ul>
          <li className="flex items-center gap-4 mb-2">
            <Checkbox inputId="ingredient1" checked={false}></Checkbox>
            <label htmlFor="ingredient1" className="grow cursor-pointer">
              待辦清單事項
            </label>
            <Button icon="pi pi-times" rounded outlined aria-label="remove" className="!w-[30px] !h-[30px]" />
          </li>

          {/* add new todo item */}
          <li className="flex items-center gap-4 my-6">
            <Checkbox checked={false}></Checkbox>
            <InputText placeholder="增加項目..." className="w-full" />
          </li>
        </ul>
      </div>
    </>
  )
}
