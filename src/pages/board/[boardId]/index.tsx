import Head from 'next/head'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AxiosError } from 'axios'
import { DndContext, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import { cloneDeep } from 'lodash-es'

import MenuBar from '@/components/board/MenuBar'
import AddListButton from '@/components/board/AddListButton'
// import Draggable from '@/components/board/Draggable'
// import Droppable from '@/components/board/Droppable'
// import List from '@/components/board/List'

import {
  // CollisionDetection,
  // pointerWithin,
  // closestCenter,
  // rectIntersection,
  // getFirstCollision,
  UniqueIdentifier,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
  DragOverlay,
  DropAnimation,
} from '@dnd-kit/core'
// import ListContainer from '@/components/board/ListContainer'

import {
  // AnimateLayoutChanges,
  SortableContext,
  // useSortable,
  // arrayMove,
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

import SortableCard from '@/components/board/SortableCard'
import SortableList from '@/components/board/SortableList'
import BoardCard from '@/components/board/BoardCard'
import { classNames } from 'primereact/utils'

import BoardGuard from '@/app/BoardGuard'
// import axiosFetcher from '@/apis/axios'

const Board: FC = () => {
  const router = useRouter()
  const token = useAppSelector(state => state.user.token) || ''
  const boardId = useAppSelector(state => state.board.boardId)
  const singleBaord = useAppSelector(state => state.board.singleBaord)
  const lists = singleBaord?.lists.map(item => ({ ...item, id: item._id }))

  const dispatch = useAppDispatch()

  const [activeListId, setActiveListId] = useState<UniqueIdentifier | null>(null)
  const [overListId, setOverListId] = useState<UniqueIdentifier | null>(null)
  // const [overLastListItem, setOverLastListItem] = useState<any>(null)
  const [activeCardId, setActiveCardId] = useState<UniqueIdentifier | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)
  // const lastOverId = useRef<UniqueIdentifier | null>(null)
  const [activeItemTop, setActiveItemTop] = useState(0)
  // const recentlyMovedToNewContainer = useRef(false)
  // const [lastOverId, setLastOverId] = useState<UniqueIdentifier | null>(null)
  // const isSortingContainer = activeId ? containers.includes(activeId) : false

  /** 讓 draggable、droppable 內的 pointer 事件不會被 prevent */
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })

  const sensors = useSensors(pointerSensor)
  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          // opacity: '0.5',
        },
      },
    }),
  }

  // const collisionDetectionStrategy: CollisionDetection = useCallback(
  //   (args: any) => {
  //     if (!lists) return
  //     if (activeListId && lists.some(item => item._id === activeListId)) {
  //       return closestCenter({
  //         ...args,
  //         droppableContainers: args.droppableContainers.filter(item => item.id),
  //       })
  //     }
  //     console.log(args.droppableContainers)

  //     // return
  //     // Start by finding any intersecting droppable
  //     const pointerIntersections = pointerWithin(args)

  //     const intersections =
  //       pointerIntersections.length > 0
  //         ? // If there are droppables intersecting with the pointer, return those
  //           pointerIntersections
  //         : rectIntersection(args)
  //     let overId = getFirstCollision(intersections, 'id')

  //     if (overId != null) {
  //       if (lists.some(item => item._id === overId)) {
  //         const containerItems = lists.filter(item => item._id === overId)

  //         // If a container is matched and it contains items (columns 'A', 'B', 'C')
  //         if (containerItems && containerItems?.length > 0) {
  //           // Return the closest droppable within that container
  //           overId = closestCenter({
  //             ...args,
  //             droppableContainers: args.droppableContainers.filter(
  //               container => container.id !== overId && containerItems.includes(container.id)
  //             ),
  //           })[0]?.id
  //         }
  //       }

  //       lastOverId.current = overId

  //       return [{ id: overId }]
  //     }

  //     // When a draggable item moves to a new container, the layout may shift
  //     // and the `overId` may become `null`. We manually set the cached `lastOverId`
  //     // to the id of the draggable item that was moved to the new container, otherwise
  //     // the previous `overId` will be returned which can cause items to incorrectly shift positions
  //     if (recentlyMovedToNewContainer.current) {
  //       lastOverId.current = activeListId
  //     }

  //     // If no droppable is matched, return the last match
  //     return lastOverId.current ? [{ id: lastOverId.current }] : []
  //   },
  //   [activeListId, lists]
  // )

  // const handleChange = (active, over) => {
  //   const clonedList = cloneDeep(lists)
  //   if (!clonedList || !clonedList.length) return

  //   let newLists = []
  //   let newIndex: number
  //   const otherListItems = clonedList.filter(item => item._id !== activeListId && item._id !== overListId)

  //   if (active.data.current?.type === 'list') {
  //     const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
  //     const [overListItem] = clonedList?.filter(item => item._id === overListId)
  //     const activeCards = activeListItem.cards
  //     const [activeCardItem] = activeListItem.cards.filter(item => item._id === activeCardId)

  //     const newActiveListItem = {
  //       ...activeListItem,
  //       cards: activeCards.filter(item => item._id !== activeCardId),
  //     }

  //     const newOverListItem = {
  //       ...overListItem,
  //       cards: [activeCardItem],
  //     }

  //     newLists = [...otherListItems, newActiveListItem, newOverListItem].sort((a, b) => a.position - b.position)
  //   } else {
  //     const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
  //     const [overListItem] = clonedList?.filter(item => item._id === overListId)
  //     const activeCards = activeListItem.cards
  //     const overCards = overListItem.cards
  //     const [activeCardItem] = activeListItem.cards.filter(item => item._id === activeCardId)
  //     const [overCardItem] = overListItem.cards.filter(item => item._id === overCardId)
  //     const activeIndex = activeCardItem?.position
  //     const overIndex = overCardItem?.position

  //     const isBelowOverItem =
  //       over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

  //     const modifier = isBelowOverItem ? 1 : 0

  //     if (overIndex === undefined || overIndex === 0) {
  //       newIndex = 0
  //     } else if (overIndex > 0) {
  //       newIndex = overIndex + modifier
  //     } else {
  //       newIndex = overListItem.cards.length
  //     }
  //     console.log(overIndex)
  //     let newOverListItem =
  //       overIndex === undefined || overIndex === 0
  //         ? {
  //             ...overListItem,
  //             cards: [{ ...activeCardItem, position: newIndex }, ...overCards],
  //           }
  //         : {
  //             ...overListItem,
  //             cards: [
  //               ...overCards.slice(0, newIndex),
  //               { ...activeCardItem, position: newIndex },
  //               ...overCards.slice(newIndex, overCards.length),
  //             ],
  //           }

  //     const newActiveListItem = {
  //       ...activeListItem,
  //       cards: activeCards.filter(item => item._id !== activeCardId),
  //     }

  //     newLists = [...otherListItems, newActiveListItem, newOverListItem].sort((a, b) => a.position - b.position)
  //   }

  //   return newLists
  // }

  /** 暫時的卡片拖拉邏輯 */
  /* eslint-disable */
  async function handleDragEnd(active: any, over: any) {
    if (!over || lists === undefined) return

    const {
      current: { cardId, cardPosition: activeCardPosition, listPosition: activeListPosition },
    } = active.data
    const {
      current: { cardPosition: overCardPosition, listPosition: overListPosition },
    } = over.data

    const overCardId = over?.data?.current?.cardId
    const activeCardId = active?.data?.current?.cardId

    const clonedList = cloneDeep(lists)

    if (!clonedList || !clonedList.length) return

    let newLists = []
    let newIndex: number
    const otherListItems = clonedList.filter(item => item._id !== activeListId && item._id !== overListId)

    if (active.data.current?.type === 'list') {
      if (overListId === activeListId) return
      const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
      const [overListItem] = clonedList?.filter(item => item._id === overListId)
      const activeCards = activeListItem.cards
      const overCards = overListItem.cards
      const [activeCardItem] = activeListItem.cards.filter(item => item._id === activeCardId)

      const newActiveListItem = {
        ...activeListItem,
        position: overListItem.position,
        cards: activeCards,
      }

      const newOverListItem = {
        ...overListItem,
        position: activeListItem.position,
        cards: overCards,
      }

      newLists = [...otherListItems, newActiveListItem, newOverListItem].sort((a, b) => a.position - b.position)

      dispatch(
        socketServiceActions.moveBoardList({
          boardId,
          listId: activeListId as string,
          finalPosition: overListPosition,
        })
      )
    } else {
      // if (!overCardId || !activeCardId) return
      const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
      const [overListItem] = clonedList?.filter(item => item._id === overListId)
      const activeCards = activeListItem.cards
      const overCards = overListItem.cards
      const [activeCardItem] = activeListItem.cards.filter(item => item._id === activeCardId)
      const [overCardItem] = overListItem.cards.filter(item => item._id === overCardId)
      const activeIndex = activeCardItem?.position
      const overIndex = overCardItem?.position

      // const isBelowOverItem =
      //   over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

      // console.log(a)
      const isBelowOverItem = activeItemTop && activeItemTop > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      // newIndex = overIndex >= 0 ? overIndex + modifier : overListItem.cards.length + 1

      if (overIndex === undefined || overIndex === 0) {
        newIndex = 0
      } else {
        newIndex = overIndex >= 0 ? overIndex + modifier : overListItem.cards.length + 1
      }

      // const isBelowOverItem =
      //   over &&
      //   active.rect.current.translated &&
      //   active.rect.current.translated.top > over.rect.top + over.rect.height / 3

      // const isAboveOverItem =
      //   over &&
      //   active.rect.current.translated &&
      //   active.rect.current.translated.bottom < over.rect.top + over.rect.height / 3

      // console.log('isBelowOverItem', isBelowOverItem)
      // console.log('isAboveOverItem', isAboveOverItem)
      // const modifier = isAboveOverItem ? -1 : isBelowOverItem ? 1 : 0

      // if (overIndex === undefined || overIndex === 0) {
      //   newIndex = 0
      // } else if (overIndex > 0) {
      //   newIndex = overIndex + modifier >= 0 ? overIndex + modifier : 0
      // } else {
      //   newIndex = overListItem.cards.length
      // }

      // if (!activeListItem || !activeCardItem) return
      // console.log(activeListItem, activeCardItem)
      let newOverListItem =
        overIndex === undefined || overIndex === 0
          ? {
              ...overListItem,
              cards: [{ ...activeCardItem, position: newIndex }, ...overCards],
            }
          : {
              ...overListItem,
              cards: [
                ...overCards.slice(0, newIndex),
                { ...activeCardItem, position: newIndex },
                ...overCards.slice(newIndex, overCards.length),
              ],
            }

      const newActiveListItem = {
        ...activeListItem,
        cards: activeCards.filter(item => item._id !== activeCardId),
      }

      newLists = [...otherListItems, newActiveListItem, newOverListItem].sort((a, b) => a.position - b.position)
      // console.log(overListId, newIndex)

      dispatch(
        socketServiceActions.moveCard({
          boardId,
          cardId,
          finalListId: overListId as string,
          finalPosition: newIndex,
        })
      )

      setOverListId(null)
    }
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

    const [listItem] = lists.filter(item => item._id === activeListId)

    return (
      <div className="w-[286px] row-span-full">
        <div className="bg-secondary-4 h-auto px-4 py-5">
          <div className="mb-4"> {listItem.title}</div>
          {listItem.cards.map(cardItem => {
            return <BoardCard id={cardItem._id} cardItem={cardItem} />
          })}
        </div>
      </div>
    )
  }

  function renderCardDragOverlay() {
    if (!lists?.length || !activeCardId) return <></>

    const [listItem] = lists.filter(item => item._id === activeListId)
    // console.log('listItem', listItem)
    if (!listItem) return <></>

    const [cardItem] = listItem.cards.filter(item => item._id === activeCardId)
    // console.log('cardItem', cardItem)
    if (!cardItem) return <></>
    return <BoardCard id={activeCardId} cardItem={cardItem} />
  }

  const handleRenderOverlay = () => {
    if (activeType === 'list') {
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
    <div className={classNames({ 'p-9': !token })}>
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
            // collisionDetection={args => {
            //   const result = collisionDetectionStrategy(args)

            //   return result
            // }}
            onDragStart={({ active }) => {
              if (!active.data.current) return
              setActiveType(active.data.current?.type)

              if (active.data.current.type === 'card') {
                setActiveCardId(active.data.current.cardId)
              }

              setActiveListId(active.data.current.listId)
            }}
            onDragOver={({ active, over }) => {
              const overAListId = over?.data?.current?.listId
              const overCardId = over?.data?.current?.cardId
              const activeCardId = active?.data?.current?.cardId

              const clonedList = cloneDeep(lists)
              if (active.data.current?.listId == over?.data.current?.listId) {
                if (over && over.rect) {
                  setActiveItemTop(over.rect.bottom)
                }
              }

              if (active.data.current?.listId !== over?.data.current?.listId) {
                if (over) {
                  setOverListId(over.data.current?.listId)
                }
              } else {
                setOverListId(active.data.current?.listId)
              }

              if (!clonedList || !clonedList.length || !overAListId || !activeListId) return
              if (overAListId === activeListId || overCardId === activeCardId) return

              let newLists = []
              let newIndex: number
              const otherListItems = clonedList.filter(item => item._id !== activeListId && item._id !== overAListId)

              if (active.data.current?.type === 'list') {
                if (overListId === activeListId) return

                const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
                const [overListItem] = clonedList?.filter(item => item._id === overAListId)
                const activeCards = activeListItem.cards
                const overCards = overListItem.cards
                // const [activeCardItem] = activeListItem.cards.filter(item => item._id === activeCardId)

                const newActiveListItem = {
                  ...activeListItem,
                  position: overListItem.position,
                  cards: activeCards,
                }

                const newOverListItem = {
                  ...overListItem,
                  position: activeListItem.position,
                  cards: overCards,
                }

                newLists = [...otherListItems, newActiveListItem, newOverListItem].sort(
                  (a, b) => a.position - b.position
                )
              } else {
                const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
                const [overListItem] = clonedList?.filter(item => item._id === overAListId)
                const activeCards = activeListItem.cards
                const overCards = overListItem.cards
                const [activeCardItem] = activeListItem.cards.filter(item => item._id === activeCardId)
                const [overCardItem] = overListItem.cards.filter(item => item._id === overCardId)
                const activeIndex = activeCardItem?.position
                let overIndex = overCardItem?.position

                // const isBelowOverItem =
                //   over &&
                //   active.rect.current.translated &&
                //   active.rect.current.translated.top > over.rect.top + over.rect.height / 3

                // const isAboveOverItem =
                //   over &&
                //   active.rect.current.translated &&
                //   active.rect.current.translated.bottom < over.rect.top + over.rect.height / 3

                // console.log('isBelowOverItem', isBelowOverItem, overIndex)
                // console.log('isAboveOverItem', isAboveOverItem)

                // const modifier = isAboveOverItem ? -1 : isBelowOverItem ? 1 : 0

                // if (overIndex === undefined || overIndex === 0) {
                //   newIndex = 0
                // } else if (overIndex > 0) {
                //   newIndex = overIndex + modifier >= 0 ? overIndex + modifier : 0
                // } else {
                //   newIndex = overListItem.cards.length
                // }

                // const isBelowOverItem =
                //   over &&
                //   active.rect.current.translated &&
                //   active.rect.current.translated.top > over.rect.top + over.rect.height

                const isBelowOverItem = activeItemTop && activeItemTop > over.rect.top + over.rect.height

                console.log(isBelowOverItem)
                if (!activeListItem || !activeCardItem) return
                const modifier = isBelowOverItem ? 1 : 0
                if (overIndex === undefined || overIndex === 0) {
                  newIndex = 0
                } else {
                  newIndex = overIndex >= 0 ? overIndex + modifier : overListItem.cards.length + 1
                }

                const newActiveListItem = {
                  ...activeListItem,
                  cards: activeCards.filter(item => item._id !== activeCardId),
                }

                let newOverListItem =
                  overIndex === undefined
                    ? {
                        ...overListItem,
                        cards: [{ ...activeCardItem, position: newIndex }, ...overCards],
                      }
                    : {
                        ...overListItem,
                        cards: [
                          ...overCards.slice(0, newIndex),
                          { ...activeCardItem, position: newIndex },
                          ...overCards.slice(newIndex, overCards.length),
                        ],
                      }

                newLists = [...otherListItems, newActiveListItem, newOverListItem].sort(
                  (a, b) => a.position - b.position
                )
              }

              console.log(newLists)

              dispatch(boardSliceActions.updateBoardList(newLists))
            }}
            onDragEnd={({ active, over }) => handleDragEnd(active, over)}
            onDragCancel={() => {
              console.log('onDragCancel')
            }}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <div className="w-auto grid gap-4 auto-cols-[286px] px-4">
              <SortableContext disabled={!token} items={lists || [{ id: 0 }]} strategy={horizontalListSortingStrategy}>
                {lists?.map((listsItem, key) => {
                  return (
                    <SortableList
                      id={listsItem._id}
                      listItems={lists}
                      listTitle={listsItem.title}
                      listPosition={listsItem.position}
                    >
                      {/* <div>{listsItem._id}</div> */}
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
                                  key={index}
                                  id={cardItem._id}
                                  listId={listsItem.id}
                                  cardItem={cardItem}
                                  listPosition={listsItem.position}
                                ></SortableCard>
                                {/* 拖曳中的卡片 */}
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
