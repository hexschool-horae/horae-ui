import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { DndContext, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'

import { Toast } from 'primereact/toast'
import { MenuBar, List, AddListButton } from '@/components/board'
import Draggable from '@/components/board/Draggable'
import Droppable from '@/components/board/Droppable'

import CardDetail from '@/components/card/CardDetail'
import ListContainer from '@/components/board/ListContainer'

import { GET_BOARD_BY_ID } from '@/apis/axios-service'
import { useBoardService } from '@/socketService'

import { useAppSelector } from '@/hooks/useAppStore'
import { useAppDispatch } from '@/hooks/useAppStore'
import { setBoardId, setTitle, setLists, setIsErrorMessageVisible } from '@/slices/boardSocketSlice'

export default function Board() {
  const lists = useAppSelector(state => state.boardSocket.lists)
  const boardId = useAppSelector(state => state.boardSocket.boardId)
  const isErrorMessageVisible = useAppSelector(state => state.boardSocket.isErrorMessageVisible)
  const errorMessageText = useAppSelector(state => state.boardSocket.errorMessageText)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const boardService = useBoardService()

  const toastBL = useRef<Toast>(null)

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
    if (!event.over) return

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
  const onCreateCard = (listId = '', title = '') => {
    const payload = {
      listId,
      title,
      boardId,
    }
    boardService?.createCard(payload)
  }

  /** 取得單一看板資訊 */
  const handleGetSingleBoard = async () => {
    const result = await GET_BOARD_BY_ID(boardId)

    if (result === undefined) return

    const { lists, title } = result.data

    dispatch(setTitle(title))
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

  useEffect(() => {
    if (isErrorMessageVisible) {
      toastBL.current?.show({
        severity: 'error',
        summary: 'Error Message',
        detail: `${errorMessageText}`,
        life: 3000,
      })
    }

    return () => {
      dispatch(setIsErrorMessageVisible(false))
    }
  }, [isErrorMessageVisible])

  /** 看板初始化
   * B03-5 取得單一看板 */
  useEffect(() => {
    if (boardId === undefined || boardId === '') return
    handleGetSingleBoard()

    /** 看板銷毀，重置 store 裡的 board list */
    return () => {
      dispatch(setLists([]))
    }
  }, [boardId])

  return (
    <>
      <Head>
        <title>Horae - 看板</title>
      </Head>

      <div className="mb-6">
        <MenuBar />
      </div>

      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
            <></>
          )}
          <ListContainer>
            <AddListButton onCreateList={onCreateList} />
          </ListContainer>
        </div>
      </DndContext>
      {/* 卡片元件 */}
      {router.query.cardId && <CardDetail />}
      {/* 錯誤訊息提示 */}
      <Toast ref={toastBL} position="bottom-left" />
    </>
  )
}
