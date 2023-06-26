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
  DragOverEvent,
  UniqueIdentifier,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
  DragOverlay,
  DropAnimation,
} from '@dnd-kit/core'
import { getEventCoordinates } from '@dnd-kit/utilities'
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
import { ICardList } from '@/types/pages'

import SortableCard from '@/components/board/SortableCard'
import SortableList from '@/components/board/SortableList'
import BoardCard from '@/components/board/BoardCard'
import { classNames } from 'primereact/utils'

import BoardGuard from '@/app/BoardGuard'
import AddCardButton from '@/components/board/AddCardButton'

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

    if (Boolean(cardIndex) && cardIndex != -1 && Boolean(listIndex) && listIndex !== -1) {
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

    if (Boolean(cardIndex) && cardIndex != -1 && Boolean(listIndex) && listIndex !== -1) {
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
  // const lists = singleBaord?.lists.map(item => ({ ...item, id: item._id }))

  // const dispatch = useAppDispatch()

  const [activeListId, setActiveListId] = useState<UniqueIdentifier | null>(null)
  const [overListId, setOverListId] = useState<UniqueIdentifier | null>(null)
  const [overListPosition, setOverListPosition] = useState<number | null>(null)
  const [activeCardId, setActiveCardId] = useState<UniqueIdentifier | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)

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
  async function handleDragEnd(event: DragOverEvent) {
    const { active, over, activatorEvent, delta } = event
    const activatorCoordinates = getEventCoordinates(activatorEvent)
    const intersectionY = (activatorCoordinates?.y || 0) + delta.y + 80

    if (!over || lists === undefined) return

    const {
      current: { cardId },
    } = active.data as any

    const overCardId = over?.data?.current?.cardId
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

      if (overListPosition === null || overListPosition === undefined) return

      dispatch(
        socketServiceActions.moveBoardList({
          boardId,
          listId: activeListId as string,
          finalPosition: overListPosition,
        })
      )
    } else {
      const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
      const [overListItem] = clonedList?.filter(item => item._id === overListId)
      const activeCards = activeListItem.cards
      const overCards = overListItem.cards
      const [activeCardItem] = activeListItem.cards.filter(item => item._id === activeCardId)
      const [overCardItem] = overListItem.cards.filter(item => item._id === overCardId)
      const overIndex = overCardItem?.position

      const isBelowOverItem = intersectionY > over.rect.top + over.rect.height
      console.log(isBelowOverItem, intersectionY, over.rect.top + over.rect.height)
      const modifier = isBelowOverItem ? 1 : 0
      console.log(active, over)
      newIndex = overIndex >= 0 ? overIndex + modifier : overListItem.cards.length
      // if (overIndex >= 0 && newIndex >= overCards.length) newIndex = overCards.length - 1

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

      const newActiveListItem = {
        ...activeListItem,
        cards: activeCards.filter(item => item._id !== activeCardId),
      }
      newLists =
        overListId === activeListId
          ? [...otherListItems, newOverListItem]
          : [...otherListItems, newActiveListItem, newOverListItem]
      newLists = newLists.sort((a, b) => a.position - b.position)

      if (overListPosition === null) return

      dispatch(
        socketServiceActions.moveCard({
          boardId,
          cardId,
          finalListId: overListId as string,
          finalPosition: overCards.length && newIndex >= overCards.length ? newIndex - 1 : newIndex,
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
            return (
              <BoardCard
                key={cardItem._id}
                id={cardItem._id}
                title={cardItem.title}
                priority={cardItem.proiority}
                tags={cardItem.tags}
              />
            )
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
    return <BoardCard id={activeCardId} title={cardItem.title} priority={cardItem.proiority} tags={cardItem.tags} />
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
            onDragOver={event => {
              const { active, over, activatorEvent, delta } = event
              const activatorCoordinates = getEventCoordinates(activatorEvent)
              const intersectionY = (activatorCoordinates?.y || 0) + delta.y + 80

              const overAListId = over?.data?.current?.listId
              const overCardId = over?.data?.current?.cardId

              const clonedList = cloneDeep(lists)

              // 碰撞列表
              if (active.data.current?.listId !== over?.data.current?.listId) {
                if (over) {
                  setOverListId(over.data.current?.listId)
                  setOverListPosition(over.data.current?.listPosition)
                }
              } else {
                setOverListId(active.data.current?.listId)
                setOverListPosition(active.data.current?.listPosition)
              }

              if (!clonedList || !clonedList.length || !overAListId || !activeListId) return
              if (overListId === activeListId && overCardId === activeCardId) return

              let newLists = []
              let newIndex: number
              const otherListItems = clonedList.filter(item => item._id !== activeListId && item._id !== overListId)

              if (active.data.current?.type === 'list') {
                if (overListId === activeListId) return

                const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
                const [overListItem] = clonedList?.filter(item => item._id === overAListId)
                const activeCards = activeListItem.cards
                const overCards = overListItem.cards

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
                console.log(overCardId === activeCardId, overListId === activeListId)
                if (overCardId === activeCardId) return
                const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
                const [overListItem] = clonedList?.filter(item => item._id === overListId)
                const activeCards = activeListItem.cards
                const overCards = overListItem.cards
                const [activeCardItem] = activeListItem.cards.filter(item => item._id === activeCardId)
                const [overCardItem] = overListItem.cards.filter(item => item._id === overCardId)
                let overIndex = overCardItem?.position

                const isBelowOverItem = intersectionY > over.rect.top + over.rect.height

                if (!activeListItem || !activeCardItem) return

                const modifier = isBelowOverItem ? 1 : 0

                newIndex = overIndex >= 0 ? overIndex + modifier : overListItem.cards.length
                console.log(newIndex, overIndex)
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
                          activeCardItem,
                          ...overCards.slice(newIndex, overCards.length),
                        ],
                      }
                console.log(newActiveListItem, newOverListItem, otherListItems)
                newLists =
                  overListId === activeListId
                    ? [...otherListItems, newOverListItem]
                    : [...otherListItems, newActiveListItem, newOverListItem]
                newLists = newLists.sort((a, b) => a.position - b.position)
                console.log(newLists)
                // dispatch(boardSliceActions.updateBoardList(newLists))
              }
            }}
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
            <div className="w-auto grid gap-4 auto-cols-[286px] px-4">
              <SortableContext disabled={!token} items={lists || [{ id: 0 }]} strategy={horizontalListSortingStrategy}>
                {lists?.map((listsItem, index) => {
                  return (
                    <SortableList
                      key={listsItem._id}
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
