import { FC } from 'react'
import { Button } from 'primereact/button'

interface IAddListButtonProps {
  onCreateList: () => void
}

/** 新增看板按鈕 */
const AddListButton: FC<IAddListButtonProps> = ({ onCreateList }) => {
  return (
    <Button
      className="w-[286px] border-secondary-2 row-span-full text-secondary-3 flex h-16"
      outlined
      onClick={() => onCreateList()}
    >
      新增其他列表
      <span className="ml-auto">+</span>
    </Button>
  )
}

export default AddListButton
