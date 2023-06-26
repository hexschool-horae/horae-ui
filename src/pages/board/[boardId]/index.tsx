import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC, useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AxiosError } from 'axios'
import { DndContext, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'
import MenuBar from '@/components/board/MenuBar'
import AddListButton from '@/components/board/AddListButton'

import {
  CollisionDetection,
  pointerWithin,
  closestCenter,
  // closestCorners,
  rectIntersection,
  getFirstCollision,
  DragOverEvent,
  UniqueIdentifier,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
  DragOverlay,
  DropAnimation,
} from '@dnd-kit/core'
import { getEventCoordinates } from '@dnd-kit/utilities'

import {
  // AnimateLayoutChanges,
  SortableContext,
  // useSortable,
  arrayMove,
  // defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  // SortingStrategy,
} from '@dnd-kit/sortable'

import CardDetail from '@/components/card/CardDetail'

import { boardSliceActions } from '@/slices/boardSlice'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { errorSliceActions } from '@/slices/errorSlice'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { GET_BOARD_BY_ID } from '@/apis/axios-service'
import { ICardList } from '@/types/pages'
import { ISingleBoardInterface } from '@/socketService/types/board'

import SortableCard from '@/components/board/SortableCard'
import SortableList from '@/components/board/SortableList'
import BoardCard, { ICardItem } from '@/components/board/BoardCard'
import { classNames } from 'primereact/utils'

import BoardGuard from '@/app/BoardGuard'
import AddCardButton from '@/components/board/AddCardButton'

const emptyCard = {
  _id: '',
  title: '',
  startDate: 0,
  endDate: 0,
  proiority: '',
  comments: [
    {
      _id: '',
      comment: '',
      user: {
        _id: '',
        name: '',
        createdAt: '',
      },
      card: '',
    },
  ],
  position: 0,
  tags: [
    {
      _id: '',
      title: '',
      color: '',
    },
  ],
}

const findContainer = (list: any[], id: string) => {
  if (!list.length) {
    console.warn('清單目前為空')
    return null
  }

  if (list.some((item: any) => item._id === id)) {
    const [matcheditem] = list.filter((item: any) => item._id === id)
    return matcheditem._id
  }

  const [matchedItem] = list.filter((item: any) => {
    return item.cards.find((item2: any) => item2._id == id)
  })

  if (matchedItem) {
    return matchedItem._id
  } else {
    return null
  }
}

const Board: FC = () => {
  const router = useRouter()
  const token = useAppSelector(state => state.user.token) || ''
  const boardId = useAppSelector(state => state.board.boardId)
  const singleBaord = useAppSelector(state => state.board.singleBaord)
  const boardLists = singleBaord?.lists
  const clonedBoardList = cloneDeep(boardLists)?.map(item => ({ id: item._id, ...item }))
  const dispatch = useAppDispatch()

  const [lists, setLists] = useState(clonedBoardList)

  // 卡片更新標題、優先權
  const listCard = useAppSelector(state => state.board.listCard)
  useEffect(() => {
    if (lists == undefined) return
    const temp: ICardList[] = JSON.parse(JSON.stringify(lists))
    const listIndex = temp.findIndex(list => list._id === listCard.listId)
    const cardIndex = temp[listIndex]?.cards.findIndex(card => card._id === listCard.cardId)

    if (
      cardIndex !== undefined &&
      cardIndex !== null &&
      cardIndex != -1 &&
      listIndex !== null &&
      listIndex !== undefined &&
      listIndex !== -1
    ) {
      temp[listIndex].cards[cardIndex].title = listCard.title
      temp[listIndex].cards[cardIndex].proiority = listCard.proiority
      setLists(temp.map(item => ({ id: item._id, ...item })))
    }
  }, [listCard])

  // 卡片新增、刪除標籤
  const listCardTag = useAppSelector(state => state.board.listCardTags)
  useEffect(() => {
    if (lists == undefined) return
    const temp: ICardList[] = JSON.parse(JSON.stringify(lists))
    const listIndex = temp.findIndex(list => list._id === listCardTag.listId)
    const cardIndex = temp[listIndex]?.cards.findIndex(card => card._id === listCardTag.cardId)

    if (
      cardIndex !== undefined &&
      cardIndex !== null &&
      cardIndex != -1 &&
      listIndex !== null &&
      listIndex !== undefined &&
      listIndex !== -1
    ) {
      temp[listIndex].cards[cardIndex].tags = listCardTag.tags
      setLists(temp.map(item => ({ id: item._id, ...item })))
    }
  }, [listCardTag])

  // 看板修改、刪除標籤連動卡片
  const boardTags = useAppSelector(state => state.board.boardTags)
  useEffect(() => {
    if (lists == undefined) return
    const temp: ICardList[] = JSON.parse(JSON.stringify(lists))
    temp.forEach(list => {
      list.cards.forEach(card => {
        if (card.tags.length > 0) {
          card.tags = card.tags.filter(tag => boardTags.some(boardTag => boardTag._id === tag._id))
          card.tags.forEach(tag => {
            boardTags.forEach(boardTag => {
              if (tag._id == boardTag._id) {
                tag._id = boardTag._id
                tag.color = boardTag.color
                tag.title = boardTag.title
              }
            })
          })
        }
      })
    })
    setLists(temp.map(item => ({ id: item._id, ...item })))
  }, [boardTags])

  useEffect(() => {
    if (boardLists == undefined) return
    const tempList = cloneDeep(boardLists)
    setLists(tempList.map(item => ({ id: item._id, ...item })))
  }, [boardLists])

  /** 讓 draggable、droppable 內的 pointer 事件不會被 prevent */
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  })

  const sensors = useSensors(pointerSensor)
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        // active: {
        //   opacity: '0.5',
        // },
        // dragOverlay: {
        //   opacity: '1',
        // },
      },
    }),
  }
  // 初始所在列表資訊
  const [activeListPosition, setActiveListPosition] = useState<number | null>(null)
  const [activeListId, setActiveListId] = useState<string | null>(null)
  // 當前拖曳中的卡片內容
  const [activeCardId, setActiveCardId] = useState<UniqueIdentifier | null>(null)
  const [activeCardItem, setActiveCardItem] = useState<ICardItem | null>(null)
  // 初始 id（active.id）
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  // 複製清單
  const [clonedLists, setClonedLists] = useState<any | null>(null)

  const lastOverId = useRef<UniqueIdentifier | null>(null)
  const recentlyMovedToNewContainer = useRef(false)

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args: any) => {
      // First, let's see if there are any collisions with the pointer
      if (activeId && lists?.some(item => item._id === activeId)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container: any) =>
            lists?.some(item => item._id === container.id)
          ),
        })
      }

      const pointerIntersections = pointerWithin(args)
      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args)
      let overId = getFirstCollision(intersections, 'id')

      if (overId !== null) {
        if (lists?.some(item => item._id === overId)) {
          const [listItems] = lists.filter(item => item._id === overId)

          if (listItems !== undefined && listItems.cards.length > 0) {
            // Return the closest droppable within that container
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container: any) => container.id !== overId && listItems.cards.find(item => item._id === container.id)
              ),
            })[0]?.id
          }
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeId, lists]
  )

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, activatorEvent, delta } = event
    const overId = over?.id

    if (over === null || active === null || !lists || lists?.some(item => item._id === active.id)) {
      return
    }

    if (overId == null || over.data.current === undefined) return

    const activeContainer = findContainer(clonedLists, active.id as string)
    const overContainer = findContainer(clonedLists, overId as string)

    // 取得當前 activeItem的座標資訊
    const activatorCoordinates = getEventCoordinates(activatorEvent)
    const intersectionY = (activatorCoordinates?.y || 0) + delta.y

    // 判斷是否在 over  之下
    const isBelowOverItem = intersectionY > over.rect.top + over.rect.height

    if (active.data.current?.type === 'card') {
      // 如果是同張卡片，忽略動作
      if (activeContainer === overContainer) return

      let newLists = cloneDeep(lists)

      // 重新產生新的佔位卡片前，清除前一個佔位卡片
      newLists = cloneDeep(
        newLists.map(item => {
          const newCards = item.cards.filter(item2 => item2.title !== '')
          return { ...item, cards: newCards }
        })
      )

      const newChildren = { ...emptyCard }

      newLists[over.data.current.listPosition].cards.splice(
        isBelowOverItem ? over.data.current.sortable.index + 1 : over.data.current.sortable.index,
        0,
        newChildren
      )

      dispatch(boardSliceActions.updateBoardList(newLists))
    }
  }

  /** 暫時的卡片拖拉邏輯 */
  /* eslint-disable */
  async function handleDragEnd(event: DragOverEvent) {
    const { active, over, activatorEvent, delta } = event
    if (over === null || active === null || !lists) return

    const overId = over?.id

    // 取得當前 activeItem的座標資訊
    const activatorCoordinates = getEventCoordinates(activatorEvent)
    const intersectionY = (activatorCoordinates?.y || 0) + delta.y

    // 判斷是否在 over  之下
    const isBelowOverItem = intersectionY > over.rect.top + over.rect.height

    if (active.data.current === undefined || over.data.current === undefined) return

    // 列表移動
    if (lists.some(item => item._id === active.id) && over?.id) {
      const activeIndex = active.data.current.listPosition
      const overIndex = over.data.current.listPosition

      const newLists = arrayMove(clonedLists, activeIndex, overIndex) as ISingleBoardInterface['lists']
      dispatch(boardSliceActions.updateBoardList(newLists))
      dispatch(
        socketServiceActions.moveBoardList({
          boardId,
          listId: activeListId as string,
          finalPosition: overIndex,
        })
      )
      return
    }

    if (overId == null) {
      setActiveId(null)
      return
    }

    // 注意！要拿原本的排序(sort)順位，而非 寫在 data 裡的 cardPosition
    const activeIndex = active.data.current.sortable.index
    const overIndex = over.data.current.sortable.index

    const activeContainer = activeListPosition
    const overContainer = over.data.current.listPosition

    if (activeCardItem === null || activeListPosition === null || over.data.current === undefined) return
    let newLists = cloneDeep(lists)
    //   放定卡片後，清除所有佔位卡片
    newLists = cloneDeep(
      newLists.map(item => {
        const newCards = item.cards.filter(item2 => {
          return item2.title !== ''
        })

        return { ...item, cards: newCards }
      })
    )

    let newChildren = cloneDeep(activeCardItem)
    let finalPosition = null
    // 看最後一次觸碰到的 droppable 容器是列表還是卡片
    if (over.data.current.type === 'list') {
      finalPosition = isBelowOverItem ? newLists[over.data.current.listPosition].cards.length : 0
      newLists[over.data.current.listPosition].cards.splice(finalPosition, 0, newChildren)

      newLists[activeListPosition].cards = newLists[activeListPosition].cards.filter(item => {
        return activeCardId !== item._id
      })
    } else {
      if (activeContainer === null || overContainer === null) return
      // 同張列表
      if (activeContainer == overContainer) {
        const temp = newLists[over.data.current.listPosition].cards[overIndex]

        newLists[over.data.current.listPosition].cards[overIndex] = newLists[activeContainer].cards[activeIndex]
        newLists[activeContainer].cards[activeIndex] = temp

        finalPosition = overIndex
      } else {
        finalPosition = isBelowOverItem ? over.data.current.sortable.index + 1 : over.data.current.sortable.index
        newLists[over.data.current.listPosition].cards.splice(finalPosition, 0, newChildren)

        newLists[activeListPosition].cards = newLists[activeListPosition].cards.filter(
          item => activeCardId !== item._id
        )
      }
    }

    dispatch(boardSliceActions.updateBoardList(newLists))
    dispatch(
      socketServiceActions.moveCard({
        boardId,
        cardId: activeCardId as string,
        finalListId: over.data.current.listId,
        finalPosition,
      })
    )

    if (finalPosition === null) return

    setActiveId(null)
  }

  /** 取得單一看板資訊 */
  const handleGetSingleBoard = async () => {
    try {
      const result = await GET_BOARD_BY_ID(boardId, Boolean(token))
      if (result !== undefined) {
        const { data } = result
        dispatch(boardSliceActions.setSingleBoard(data))
      }
    } catch (e) {
      let errorMessage = ''
      if (e instanceof AxiosError) {
        errorMessage = e.response?.data.message

        if (
          errorMessage === '此為私人看板，訪客請先登入' ||
          errorMessage === '此為私人看板，您不是看板成員，不可查看'
        ) {
          router.push('/board/boardWithoutPermission')
        }
      } else {
        errorMessage = '發生錯誤'
      }

      dispatch(
        errorSliceActions.pushNewErrorMessage({
          code: -1,
          message: errorMessage,
        })
      )
    }
  }

  function renderListDragOverlay() {
    if (!lists?.length) return

    const [listItem] = lists.filter(item => item._id === activeId)

    return (
      <div className="w-[286px] row-span-full">
        <div className="bg-secondary-4 h-auto px-4 py-5">
          <div className="mb-4"> {listItem.title}</div>
          {listItem.cards.map(cardItem => {
            return (
              <BoardCard
                key={cardItem._id}
                id={cardItem._id}
                title={cardItem.title}
                priority={''}
                tags={cardItem.tags}
              />
            )
          })}
        </div>
      </div>
    )
  }

  function renderCardDragOverlay() {
    if (
      activeCardId === null ||
      activeCardItem === null ||
      activeCardItem === undefined ||
      !Object.keys(activeCardItem).length
    )
      return <></>
    return <BoardCard id={activeCardId} title={activeCardItem.title} priority={''} tags={activeCardItem.tags} />
  }

  const handleRenderOverlay = () => {
    if (!lists) return
    if (lists.some(item => item._id === activeId)) {
      return renderListDragOverlay()
    } else {
      return renderCardDragOverlay()
    }
  }

  /** 取得 url query boardID */
  useEffect(() => {
    const boardId = router.query?.boardId as string
    dispatch(boardSliceActions.setBoardId(boardId))
    dispatch(socketServiceActions.initialBoardService({ boardId, token }))

    return () => {
      dispatch(boardSliceActions.reset())
      dispatch(boardSliceActions.setBoardId(''))
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
    <div
      className={classNames('w-full h-full py-[50px] px-[64px] overflow-x-auto', { 'p-9': !token })}
      style={{
        backgroundImage: `url(${singleBaord?.coverPath})`,
        backgroundSize: 'cover',
      }}
    >
      <Head>
        <title>Horae - 看板</title>
      </Head>
      <BoardGuard>
        <div className="flex flex-col">
          <div className="mb-6">
            <MenuBar />
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            onDragStart={({ active }) => {
              setActiveId(active.id)
              setClonedLists(cloneDeep(lists))

              if (active.data.current === undefined) return

              // 如果初始拖曳項目為卡片，紀錄卡片相關資訊
              if (active.data.current.type === 'card') {
                setActiveCardId(active.data.current.cardId)
                setActiveCardItem(active.data.current.children)
              }

              setActiveListPosition(active.data.current.listPosition)
              setActiveListId(active.data.current.listId)
            }}
            onDragOver={handleDragOver}
            onDragEnd={event => handleDragEnd(event)}
            onDragCancel={() => {
              console.log('onDragCancel')
            }}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <div className="w-auto grid gap-5 auto-cols-[286px] px-4">
              <SortableContext disabled={!token} items={lists || [{ id: 0 }]} strategy={horizontalListSortingStrategy}>
                {lists?.map((listsItem, index) => {
                  return (
                    <SortableList
                      key={index}
                      id={listsItem._id}
                      listItems={lists}
                      listTitle={listsItem.title}
                      listPosition={listsItem.position}
                    >
                      <SortableContext
                        disabled={!token}
                        items={listsItem.cards?.map(item => ({ id: item._id, ...item })) || []}
                        strategy={verticalListSortingStrategy}
                      >
                        {listsItem.cards?.length ? (
                          listsItem.cards.map((cardItem, index) => {
                            return (
                              <>
                                <SortableCard
                                  key={cardItem._id}
                                  id={cardItem._id}
                                  listId={listsItem.id}
                                  listPosition={listsItem.position}
                                  cardItem={cardItem}
                                ></SortableCard>

                                {createPortal(
                                  <DragOverlay dropAnimation={dropAnimation}>{handleRenderOverlay()}</DragOverlay>,
                                  document.body
                                )}
                              </>
                            )
                          })
                        ) : (
                          <></>
                        )}
                        <AddCardButton listId={listsItem._id} />
                      </SortableContext>
                    </SortableList>
                  )
                })}
              </SortableContext>

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
      </BoardGuard>
    </div>
  )
}

export default Board
