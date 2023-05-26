import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'
import { useBoardService } from '@/socketService'

import { MenuBar, List, AddListButton } from '@/components/board'
import Draggable from '@/components/board/Draggable'
import Droppable from '@/components/board/Droppable'

// import { boardReducer } from '@/contexts/reducers/boardReducer'
// import { IListData } from '@/types/pages'

const listCardList = [
  {
    id: '12248ce4',
    title: '家居',
    cardData: [
      { id: '12249496', title: '洗衣服', labels: ['未執行'] },
      { id: '12349998', title: '洗碗', labels: ['未執行'] },
    ],
  },
  { title: '學習語言', cardData: [{ id: '12279396', title: '英文聽力 L1', labels: ['已完成', '優先'] }] },
  {
    id: 'f1224919e',
    title: '學習語言',
    cardData: [{ id: '12249996', title: '英文聽力 L1', labels: ['已完成', '優先'] }],
  },
]

export default function Board() {
  const [list, setIsList] = useState(listCardList)
  // const [state] = useReducer(boardReducer, { lists: listCardList })
  // const { lists } = state
  const router = useRouter()
  const boardId = router.query.boardId as string
  const boardService = useBoardService()
  // function handleDragMove(event: any) {
  //   console.log('moving!')
  // }

  function handleDragEnd(event: any) {
    if (!event.over) return

    const tempArr = cloneDeep(list)
    console.log(event.active.data.eventType)
    if (event.active.data.current.eventType === 'card') {
      const {
        current: { cardPosition: activeCardPosition, listPosition: activeListPosition },
      } = event.active.data
      const {
        current: { cardPosition: overCardPosition, listPosition: overListPosition },
      } = event.over.data

      const temp = tempArr[activeListPosition].cardData[activeCardPosition]

      tempArr[activeListPosition].cardData[activeCardPosition] = tempArr[overListPosition].cardData[overCardPosition]
      tempArr[overListPosition].cardData[overCardPosition] = temp
    } else {
      const {
        current: { listPosition: activeListPosition },
      } = event.active.data
      const {
        current: { listPosition: overListPosition },
      } = event.over.data

      const temp = tempArr[activeListPosition]
      tempArr[activeListPosition] = tempArr[overListPosition]
      tempArr[overListPosition] = temp
    }
    setIsList(tempArr)
  }

  const onCreateList = (title = '') => {
    const payload = {
      boardId,
      title,
    }
    boardService.createList(payload)
  }
  return (
    <>
      <Head>
        <title>Horae - 看板</title>
      </Head>

      {/* <WebsocketWrpper> */}
      <div className="mb-6">
        <MenuBar />
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="w-auto grid gap-4 auto-cols-[286px] px-4 h-full overflow-scroll">
          {list.length &&
            list.map((item: any, index: number) => (
              <div className="row-span-full" key={index}>
                <Droppable
                  id={`${item.id}`}
                  data={{
                    listId: item.id,
                    listPosition: index,
                    eventType: 'list',
                  }}
                >
                  <Draggable
                    id={`${item.id}`}
                    data={{
                      listId: item.id,
                      listPosition: index,
                      eventType: 'list',
                    }}
                  >
                    <List data={{ ...item, listPosition: index }} />
                  </Draggable>
                </Droppable>
              </div>
            ))}
          <AddListButton onCreateList={onCreateList} />
        </div>
      </DndContext>
    </>
  )
}
