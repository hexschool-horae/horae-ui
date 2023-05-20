import { Button } from 'primereact/button'
/** 新增看板按鈕 */
export default function AddListButton() {
  return (
    <Button className="w-[286px] border-secondary-2 row-span-full text-secondary-3 flex h-16" outlined>
      新增其他列表
      <span className="ml-auto">+</span>
    </Button>
  )
}
