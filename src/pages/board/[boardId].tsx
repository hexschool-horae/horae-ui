import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useReducer } from 'react'
import { DndContext } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'

import { useBoardService } from '@/socketService'

import { MenuBar, List, AddListButton } from '@/components/board'
import Draggable from '@/components/board/Draggable'
import Droppable from '@/components/board/Droppable'
import ListContainer from '@/components/board/ListContainer'

import { boardReducer } from '@/contexts/reducers/boardReducer'

import { GET_BOARD_BY_ID } from '@/apis/axios-service'

export default function Board() {
  const [state, dispatch] = useReducer(boardReducer, { lists: [] })
  const { lists } = state
  const router = useRouter()
  const boardId = router.query.boardId as string

  const boardService = useBoardService()

  function handleDragEnd(event: any) {
    if (!event.over) return
    console.log(event.active.data.eventType)

    const tempArr = cloneDeep(lists)
    if (event.active.data.current.eventType === 'card') {
      const {
        current: { cardPosition: activeCardPosition, listPosition: activeListPosition },
      } = event.active.data
      const {
        current: { cardPosition: overCardPosition, listPosition: overListPosition },
      } = event.over.data

      const temp = tempArr[activeListPosition].cards[activeCardPosition]

      tempArr[activeListPosition].cards[activeCardPosition] = tempArr[overListPosition].cards[overCardPosition]
      tempArr[overListPosition].cards[overCardPosition] = temp
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

    // setIsList(tempArr)
  }

  // 看板新增列表
  const onCreateList = (title = '') => {
    const payload = {
      boardId,
      title,
    }
    boardService.createList(payload)
  }

  //取得單一看板資訊
  const handleGetSingleBoard = async () => {
    const result = await GET_BOARD_BY_ID(boardId)
    if (result === undefined) return
    const { lists } = result.data

    dispatch({ type: 'UPDATE_BOARD_LIST', payload: lists })
  }

  // 看板初始載入
  useEffect(() => {
    if (boardId === undefined) return
    handleGetSingleBoard()
  }, [])

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
          {lists.length ? (
            lists.map((item, index: number) => (
              <div className="row-span-full" key={index}>
                <Droppable
                  id={`${item._id}`}
                  data={{
                    listId: item._id,
                    listPosition: index,
                    eventType: 'list',
                  }}
                >
                  <Draggable
                    id={`${item._id}`}
                    data={{
                      listId: item._id,
                      listPosition: index,
                      eventType: 'list',
                    }}
                  >
                    <ListContainer>
                      <List data={item} />
                    </ListContainer>
                  </Draggable>
                </Droppable>
              </div>
            ))
          ) : (
            <div className="row-span-full text-2xl">尚未建立列表</div>
          )}
          <ListContainer>
            <AddListButton onCreateList={onCreateList} />
          </ListContainer>
        </div>
      </DndContext>
    </>
  )
}
