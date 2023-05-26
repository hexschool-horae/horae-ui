import Head from 'next/head'
import { useRouter } from 'next/router'
import { useReducer } from 'react'
import { DndContext } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'
import { useBoardService } from '@/socketService'

import { MenuBar, List, AddListButton } from '@/components/board'
import Draggable from '@/components/board/Draggable'
import Droppable from '@/components/board/Droppable'

import { boardReducer } from '@/contexts/reducers/boardReducer'
import { IListData } from '@/types/pages'

const listCardList = [
  {
    title: '家居',
    cardList: [
      { title: '洗衣服', labels: ['未執行'] },
      { title: '洗碗', labels: ['未執行'] },
    ],
  },
  { title: '學習語言', cardList: [{ title: '英文聽力 L1', labels: ['已完成', '優先'] }] },
  {
    title: '待辦清單',
    cardList: [
      { title: '整理行事曆', labels: ['未執行', '優先'] },
      { title: '匯款', labels: ['未執行', '優先'] },
      { title: '買水果', labels: ['未執行'] },
      { title: '整理舊衣服', labels: ['未執行', '中等'] },
    ],
  },
  { title: '讀書進度', cardList: [{ title: '原子習慣 ch1', labels: ['進行中', '優先'] }] },
  { title: '待整理資料', cardList: [{ title: 'React Hook', labels: ['未執行'] }] },
]

export default function Board() {
  const [state] = useReducer(boardReducer, { lists: listCardList })
  const { lists } = state
  const router = useRouter()
  const boardId = router.query.boardId as string
  const boardService = useBoardService()

  /** 拖拉事件處理 */
  /* eslint-disable */
  const onDragEnd = (event: any) => {
    if (event.over) {
      const activeId = parseInt(event.active.id.replace('draggable-list-', ''))
      const overId = parseInt(event.over.id.replace('droppable-list-', ''))

      const tempArr = cloneDeep(lists)
      const temp = tempArr[activeId]

      tempArr[activeId] = tempArr[overId]
      tempArr[overId] = temp
    }
  }

  const onCreateList = (title: string = '') => {
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

      <div className="mb-6">
        <MenuBar />
      </div>
      <div className="w-auto grid gap-4 auto-cols-[286px] px-4 h-full overflow-scroll">
        <DndContext onDragEnd={onDragEnd}>
          {lists.map((item: IListData, i: number) => (
            <div className="row-span-full" key={i}>
              <Droppable id={i}>
                <Draggable id={i}>
                  <List data={item} />
                </Draggable>
              </Droppable>
            </div>
          ))}
        </DndContext>
        <AddListButton onCreateList={onCreateList} />
      </div>
    </>
  )
}
