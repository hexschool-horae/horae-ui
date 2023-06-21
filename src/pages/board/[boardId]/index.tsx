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
  pointerWithin,
  // closestCenter,
  // closestCorners,
  rectIntersection,
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
import BoardCard, { ICardItem } from '@/components/board/BoardCard'
import { classNames } from 'primereact/utils'

import BoardGuard from '@/app/BoardGuard'
import AddCardButton from '@/components/board/AddCardButton'

const emptyCard = {
  _id: '',
  title: '',
  startDate: 0,
  endDate: 0,
  tags: [
    {
      _id: '',
      title: '',
      color: '',
    },
  ],
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

  const [activeListId, setActiveListId] = useState<UniqueIdentifier | null>(null)
  // const [overListId, setOverListId] = useState<UniqueIdentifier | null>(null)
  const [activeListPosition, setActiveListPosition] = useState<number | null>(null)
  const [activeCardPosition, setActiveCardPosition] = useState<number | null>(null)
  const [activeCardId, setActiveCardId] = useState<UniqueIdentifier | null>(null)
  const [activeCardItem, setActiveCardItem] = useState<ICardItem | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)
  console.log(activeListPosition, activeCardPosition)
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
        active: {
          // opacity: '0.5',
        },
      },
    }),
  }

  /** 暫時的卡片拖拉邏輯 */
  /* eslint-disable */
  async function handleDragEnd(event: DragOverEvent) {
    const { active, over, activatorEvent, delta } = event
    const activatorCoordinates = getEventCoordinates(activatorEvent)
    const intersectionY = (activatorCoordinates?.y || 0) + delta.y + 80

    // console.clear()
    console.log('------End_______--')
    console.log(active, over, activeType, activeListId, activeCardId)
    const isBelowOverItem = intersectionY > over.rect.top + over.rect.height
    console.log(isBelowOverItem, intersectionY, over.rect.top + over.rect.height)
    if (!over || lists === undefined) return

    const clonedList = cloneDeep(lists)

    if (!clonedList || !clonedList.length) return

    if (active.data.current?.type === 'list') {
      // if (overListId === activeListId) return
      // const [activeListItem] = clonedList?.filter(item => item._id === activeListId)
      // const [overListItem] = clonedList?.filter(item => item._id === overListId)
      // const activeCards = activeListItem.cards
      // const overCards = overListItem.cards
      // const newActiveListItem = {
      //   ...activeListItem,
      //   position: overListItem.position,
      //   cards: activeCards,
      // }
      // const newOverListItem = {
      //   ...overListItem,
      //   position: activeListItem.position,
      //   cards: overCards,
      // }
      // newLists = [...otherListItems, newActiveListItem, newOverListItem].sort((a, b) => a.position - b.position)
      // if (overListPosition === null || overListPosition === undefined) return
      // dispatch(
      //   socketServiceActions.moveBoardList({
      //     boardId,
      //     listId: activeListId as string,
      //     finalPosition: overListPosition,
      //   })
      // )
    } else {
      if (active.id === over.id) return

      let newLists = cloneDeep(lists)

      newLists = cloneDeep(
        newLists.map(item => {
          const newCards = item.cards.filter(item2 => {
            return item2.title !== ''
          })

          return { ...item, cards: newCards }
        })
      )

      if (activeCardItem === null) return
      let newChildren = cloneDeep(activeCardItem)
      newChildren = { ...newChildren, position: over.data.current.cardPosition }

      newLists[over.data.current.listPosition].cards.splice(
        isBelowOverItem ? over.data.current.sortable.index + 1 : over.data.current.sortable.index,
        0,
        newChildren
      )

      dispatch(boardSliceActions.updateBoardList(newLists))
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
    if (
      activeCardId === null ||
      activeCardItem === null ||
      activeCardItem === undefined ||
      !Object.keys(activeCardItem).length
    )
      return <></>
    return (
      <BoardCard
        id={activeCardId}
        title={activeCardItem.title}
        priority={activeCardItem.proiority}
        tags={[...activeCardItem.tags]}
      />
    )
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
            collisionDetection={args => {
              // First, let's see if there are any collisions with the pointer
              const pointerCollisions = pointerWithin(args)
              // console.log(pointerCollisions)
              // Collision detection algorithms return an array of collisions
              if (pointerCollisions.length > 0) {
                return pointerCollisions
              }

              // If there are no collisions with the pointer, return rectangle intersections
              return rectIntersection(args)
            }}
            onDragStart={({ active }) => {
              if (!active.data.current) return
              setActiveType(active.data.current?.type)

              if (active.data.current.type === 'card') {
                setActiveListPosition(active.data.current.listPosition)
                setActiveCardPosition(active.data.current.cardPosition)
                setActiveCardId(active.data.current.cardId)
                setActiveCardItem(active.data.current.children)

                let newLists = cloneDeep(lists)
                if (newLists === undefined) return

                newLists[active.data.current.listPosition].cards = newLists[
                  active.data.current.listPosition
                ].cards.filter(item => {
                  return active.data.current.cardId !== item._id
                })
                console.log(newLists[active.data.current.listPosition].cards)
                // newLists[active.data.current.listPosition].cards.splice(active.data.current.cardPosition, 1, emptyCard)
                // console.log(newCard)
                // newLists[active.data.current.listPosition].cards = newCard

                dispatch(boardSliceActions.updateBoardList(newLists))
              }

              setActiveListId(active.data.current.listId)
            }}
            onDragOver={event => {
              const { active, over, activatorEvent, delta } = event
              const activatorCoordinates = getEventCoordinates(activatorEvent)
              const intersectionY = (activatorCoordinates?.y || 0) + delta.y

              // console.clear()
              console.log(active, over, activeType, activeListId, activeCardId)
              const isBelowOverItem = intersectionY > over.rect.top + over.rect.height

              if (!over || lists === undefined) return

              const clonedList = cloneDeep(lists)

              if (!clonedList || !clonedList.length) return

              if (active.data.current?.type === 'list') {
              } else {
                // console.log(over.data.current.cardPosition)
                if (active.id === over.id || over.data.current.cardPosition === undefined) return
                let newLists = cloneDeep(lists)

                newLists = cloneDeep(
                  newLists.map(item => {
                    const newCards = item.cards.filter(item2 => {
                      return item2.title !== ''
                    })

                    return { ...item, cards: newCards }
                  })
                )
                console.log(newLists)

                let newChildren = { ...emptyCard, cardPosition: over.data.current.cardPosition }

                newLists[over.data.current.listPosition].cards.splice(
                  isBelowOverItem ? over.data.current.cardPosition + 1 : over.data.current.cardPosition,
                  0,
                  newChildren
                )

                // if (!Object.keys(active.data.current).length) return
                // let cardItem = cloneDeep(
                //   newLists[active.data.current.listPosition].cards[active.data.current.cardPosition]
                // )

                // setActiveCardItem(cardItem)

                // if (!newLists[active.data.current.listPosition].cards) return
                // newLists[activeListPosition].cards.splice(activeCardPosition, 1)
                // newLists = newLists[active.data.current.listPosition].cards.filter(
                //   item => active.data.current.cardId !== item._id
                // )
                dispatch(boardSliceActions.updateBoardList(newLists))
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
                      <div>{listsItem._id}</div>
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
