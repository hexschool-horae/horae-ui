import { Button } from 'primereact/button'

import ListSettingMenu from './ListSettingMenu'
import Card from './Card'
import Draggable from './Draggable'
import Droppable from './Droppable'

import { IBoardListItem } from '@/types/pages'

export default function List({ data }: { data: IBoardListItem }) {
  /** 卡片陣列狀態 */
  const { cards } = data

  return (
    <>
      {/* 列表標題 */}
      <div className="flex mb-3 ">
        <h6 className="text-lg !text-secondary-3 mr-auto ">{data.title}</h6>
        <ListSettingMenu />
      </div>

      {/* 卡片 */}
      {cards?.length ? (
        cards.map((item, index) => {
          return (
            <div key={index}>
              <Droppable
                id={`${item.id}`}
                data={{
                  cardId: item.id,
                  cardPosition: index,
                  listPosition: data.position,
                  eventType: 'card',
                }}
              >
                <Draggable
                  data={{
                    cardId: item.id,
                    cardPosition: index,
                    listPosition: data.position,
                    eventType: 'card',
                  }}
                  id={`${item.id}`}
                >
                  <Card key={index} title={item.title} labels={item.labels} />
                </Draggable>
              </Droppable>
            </div>
          )
        })
      ) : (
        <></>
      )}

      <Button className="!w-full !tracking-[1px] !text-sm !text-secondary-3 !text-center p-0" label="+ 新增卡片" text />
    </>
  )
}
