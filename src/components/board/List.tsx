import { Button } from 'primereact/button'
import ListSettingMenu from './ListSettingMenu'
import Card from './Card'

export default function List({ title }: { title: string }) {
  const cardDataList = [
    { title: '洗衣服', labels: ['待辦', '優先'] },
    { title: '洗衣服', labels: ['待辦', '優先'] },
    { title: '洗衣服', labels: ['待辦', '優先'] },
  ]

  return (
    <div className="w-[286px] row-span-full">
      <div className="bg-secondary-4 h-auto px-4 py-5">
        <div className="flex mb-3 ">
          <h6 className="text-lg !text-secondary-3 mr-auto ">{title}</h6>
          <ListSettingMenu />
        </div>

        {cardDataList.map((item, i) => (
          <Card key={i} title={item.title} labels={item.labels} />
        ))}
        <Button
          className="!w-full !tracking-[1px] !text-sm !text-secondary-3 !text-center p-0"
          label="+ 新增卡片"
          text
        />
      </div>
    </div>
  )
}
