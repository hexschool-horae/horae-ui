import { MenuBar, List, AddListButton } from '@/components/board'
import Head from 'next/head'
import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'

import Draggable from '@/components/board/Draggable'
import Droppable from '@/components/board/Droppable'

const listCardList = [
  {
    title: '家居',
    cardData: [
      { title: '洗衣服', labels: ['未執行'] },
      { title: '洗碗', labels: ['未執行'] },
    ],
  },
  { title: '學習語言', cardData: [{ title: '英文聽力 L1', labels: ['已完成', '優先'] }] },
  {
    title: '待辦清單',
    cardData: [
      { title: '整理行事曆', labels: ['未執行', '優先'] },
      { title: '匯款', labels: ['未執行', '優先'] },
      { title: '買水果', labels: ['未執行'] },
      { title: '整理舊衣服', labels: ['未執行', '中等'] },
    ],
  },
  { title: '讀書進度', cardData: [{ title: '原子習慣 ch1', labels: ['進行中', '優先'] }] },
  { title: '待整理資料', cardData: [{ title: 'React Hook', labels: ['未執行'] }] },
]

export default function Board() {
  const [list, setIsList] = useState(listCardList)
  /* eslint-disable */
  function handleDragEnd(event: any) {
    console.log(event)
    if (event.over) {
      const activeId = parseInt(event.active.id.replace('draggable-list-', ''))
      const overId = parseInt(event.over.id.replace('droppable-list-', ''))

      const tempArr = cloneDeep(list)
      const temp = tempArr[activeId]

      tempArr[activeId] = tempArr[overId]
      tempArr[overId] = temp

      setIsList(tempArr)
    }
  }

  return (
    <>
      <Head>
        <title>Horae - 看板</title>
      </Head>

      <div className="mb-6">
        <MenuBar />
      </div>
      <div className="w-auto grid gap-4 auto-cols-[286px] px-4 h-full overflow-scroll">
        <DndContext onDragEnd={handleDragEnd}>
          {list.map((item, i) => (
            <div className="row-span-full" key={i}>
              <Droppable id={i}>
                <Draggable id={i}>
                  <List data={item} />
                </Draggable>
              </Droppable>
            </div>
          ))}
        </DndContext>
        <AddListButton />
      </div>
    </>
  )
}
