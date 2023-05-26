import { Button } from 'primereact/button'
// import { IListData } from '@/types/pages'
import ListSettingMenu from './ListSettingMenu'
import Card from './Card'
import Draggable from '@/components/board/Draggable'
import Droppable from '@/components/board/Droppable'

interface ICardData {
  id: string
  title: string
  labels: string[]
}

interface IListData {
  listPosition: number
  id: string
  title: string
  cardData: ICardData[]
}

export default function List({ data }: { data: IListData }) {
  /** 卡片陣列狀態 */
  // const [list, setIsList] = useState<ICardData[]>(data.cardData)

  return (
    <div className="w-[286px] row-span-full">
      <div className="bg-secondary-4 h-auto px-4 py-5">
        <div className="flex mb-3 ">
          <h6 className="text-lg !text-secondary-3 mr-auto ">{data.title}</h6>
          <ListSettingMenu />
        </div>

        {data.cardData?.length &&
          data.cardData.map((item, index) => {
            return (
              <div key={index}>
                <Droppable
                  id={`${item.id}`}
                  data={{
                    listId: data.id,
                    cardId: item.id,
                    cardPosition: index,
                    listPosition: data.listPosition,
                    eventType: 'card',
                  }}
                >
                  <Draggable
                    data={{
                      listId: data.id,
                      cardId: item.id,
                      cardPosition: index,
                      listPosition: data.listPosition,
                      eventType: 'card',
                    }}
                    id={`${item.id}`}
                  >
                    <Card key={index} title={item.title} labels={item.labels} />
                  </Draggable>
                </Droppable>
              </div>
            )
          })}

        <Button
          className="!w-full !tracking-[1px] !text-sm !text-secondary-3 !text-center p-0"
          label="+ 新增卡片"
          text
        />
      </div>
    </div>
  )
}
