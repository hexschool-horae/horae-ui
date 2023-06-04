import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { AxiosError } from 'axios'
import { DndContext, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'

import MenuBar from '@/components/board/MenuBar'
import AddListButton from '@/components/board/AddListButton'
import Draggable from '@/components/board/Draggable'
import Droppable from '@/components/board/Droppable'
import List from '@/components/board/List'
import ListContainer from '@/components/board/ListContainer'
import CardDetail from '@/components/card/CardDetail'

import { boardSliceActions } from '@/slices/boardSlice'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { errorSliceActions } from '@/slices/errorSlice'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { GET_BOARD_BY_ID } from '@/apis/axios-service'

const Board: FC = () => {
  const router = useRouter()
  const token = useAppSelector(state => state.user.token) || ''
  const boardId = useAppSelector(state => state.board.boardId)
  const singleBaord = useAppSelector(state => state.board.singleBaord)
  const lists = singleBaord?.lists
  const dispatch = useAppDispatch()

  /** 讓 draggable、droppable 內的 pointer 事件不會被 prevent */
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  })
  const sensors = useSensors(pointerSensor)

  /** 暫時的卡片拖拉邏輯 */
  /* eslint-disable */
  function handleDragEnd(event: any) {
    if (!event.over || lists === undefined) return

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

    dispatch(boardSliceActions.updateBoardList(tempArr))
  }

  /** 取得單一看板資訊 */
  const handleGetSingleBoard = async () => {
    try {
      const result = await GET_BOARD_BY_ID(boardId)

      dispatch(boardSliceActions.setSingleBoard(result?.data))
    } catch (e) {
      let errorMessage = ''
      if (e instanceof AxiosError) {
        errorMessage = e.response?.data.message
      } else {
        errorMessage = '發生錯誤'
      }

      dispatch(
        errorSliceActions.pushNewErrorMessage({
          code: -1,
          message: errorMessage,
        })
      )
      // toastRef.current?.show({
      //   severity: 'error',
      //   summary: 'Error Message',
      //   detail: errorMessage,
      //   life: 3000,
      // })
    }
  }

  /** 取得 url query boardID */
  useEffect(() => {
    const boardId = router.query?.boardId as string
    dispatch(boardSliceActions.setBoardId(boardId))
    dispatch(socketServiceActions.initialBoardService({ boardId, token }))

    return () => {
      dispatch(boardSliceActions.reset())
      dispatch(socketServiceActions.terminateBoardService())
    }
  }, [router.isReady])

  /** 看板初始化
   * B03-5 取得單一看板 */
  useEffect(() => {
    if (!boardId) return
    handleGetSingleBoard()
  }, [boardId])

  return (
    <>
      <Head>
        <title>Horae - 看板</title>
      </Head>
      <div className="flex flex-col h-full py-[50px] px-[64px]">
        <div className="mb-6">
          <MenuBar />
        </div>
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <div className="w-auto grid gap-4 auto-cols-[286px] px-4">
            {lists !== undefined ? (
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
              <></>
            )}

            <div className="row-span-full">
              <div className="h-auto">
                <AddListButton />
              </div>
            </div>
          </div>
        </DndContext>
        {/* 卡片元件 */}
        {router.query.cardId && <CardDetail />}
      </div>
    </>
  )
}

export default Board
