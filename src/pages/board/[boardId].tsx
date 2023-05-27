import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { DndContext } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'

import { MenuBar, List, AddListButton } from '@/components/board'
import Draggable from '@/components/board/Draggable'
import Droppable from '@/components/board/Droppable'
import ListContainer from '@/components/board/ListContainer'

import { GET_BOARD_BY_ID } from '@/apis/axios-service'
import { useBoardService } from '@/socketService'

import { useAppSelector } from '@/hooks/useAppStore'
import { useAppDispatch } from '@/hooks/useAppStore'
import { setBoardId, setLists } from '@/slices/boardSocketSlice'

export default function Board() {
  const lists = useAppSelector(state => state.boardSocket.lists)
  const boardId = useAppSelector(state => state.boardSocket.boardId)
  const dispatch = useAppDispatch()

  const router = useRouter()
  // const [boardId, setBoardId] = useState('')
  const boardService = useBoardService()

  /* eslint-disable */
  function handleDragEnd(event: any) {
    if (!event.over) return
    // console.log(event.active.data.eventType)

    const tempArr = cloneDeep(lists)
    if (!Boolean(tempArr.length)) return
    if (event.active.data.current.eventType === 'card') {
      const {
        current: { cardPosition: activeCardPosition, listPosition: activeListPosition },
      } = event.active.data as { current: { cardPosition: number; listPosition: number } }
      const {
        current: { cardPosition: overCardPosition, listPosition: overListPosition },
      } = event.over.data as { current: { cardPosition: number; listPosition: number } }
      /* @ts-ignore */
      const temp = tempArr[activeListPosition].cards[activeCardPosition]
      /* @ts-ignore */
      tempArr[activeListPosition].cards[activeCardPosition] = tempArr[overListPosition].cards[overCardPosition]
      /* @ts-ignore */
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

    dispatch(setLists(tempArr))
  }

  /** 看板新增列表 */
  const onCreateList = (title = '') => {
    const payload = {
      title,
      boardId,
    }
    boardService?.createList(payload)
  }

  /** 看板新增卡片 */
  const onCreateCard = (title = '') => {
    const payload = {
      title,
      boardId,
    }
    boardService?.createCard(payload)
  }

  /** 取得單一看板資訊 */
  const handleGetSingleBoard = async () => {
    const result = await GET_BOARD_BY_ID(boardId)
    if (result === undefined) return
    const { lists } = result.data

    dispatch(setLists(lists))
  }

  /** 取得 url query boardID */
  useEffect(() => {
    if (router.isReady) {
      const boardId = router.query?.boardId as string
      dispatch(setBoardId(boardId))
    }

    return () => {
      dispatch(setBoardId(''))
    }
  }, [router.isReady])

  /** 看板初始化
   * B03-5 取得單一看板 */
  useEffect(() => {
    if (boardId === undefined || boardId === '') return
    handleGetSingleBoard()

    return () => {
      console.log('get')

      dispatch(setLists([]))
    }
  }, [boardId])

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
                      <List data={item} onCreateCard={onCreateCard} />
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
