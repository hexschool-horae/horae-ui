// import Link from 'next/link'
// import { useRouter } from 'next/router'
// import { memo } from 'react'

// import { InputText } from 'primereact/inputtext'
// import AddCardButton from './AddCardButton'
// import ListSettingMenu from './ListSettingMenu'
// import Card from './Card'
// import Draggable from './Draggable'
// import {
// AnimateLayoutChanges,
// SortableContext,
// useSortable,
// arrayMove,
// defaultAnimateLayoutChanges,
// verticalListSortingStrategy,
// SortingStrategy,
// horizontalListSortingStrategy,
// } from '@dnd-kit/sortable'
// import {SortableContext,strategy} from '@dnd-kit/sortable'
// import Droppable from './Droppable'
// import SortableCard from './SortableCard'

// import { IBoardListItem } from '@/types/pages'

// import { classNames } from 'primereact/utils'

// const List = ({ data }: { data: IBoardListItem; onCreateCard?: (listId: string, title: string) => void }) => {
//   /** 卡片陣列狀態 */
//   const { cards } = data
//   // const router = useRouter()
//   // const dispatch = useAppDispatch()
//   // const [isDisabledLink, setIsDisabledLink] = useState(false)
//   // const [isEdit, setIsEdit] = useState(false)
//   // const listTitle = data?.title
//   // const [localListTitle, setLocalListTitle] = useState(data.title || '')
//   // const inputRef = useRef<HTMLInputElement>(null)

//   // const onIsDragging = (isDragging: boolean) => {
//   //   /** 當拖曳事件發生時，禁止 Link 被觸發(透過 class disabled-link) */
//   //   setIsDisabledLink(isDragging)
//   // }

//   // useEffect(() => {
//   //   if (isEdit) {
//   //     if (inputRef) {
//   //       inputRef.current?.focus()
//   //     }
//   //   } else {
//   //     if (localListTitle !== listTitle) {
//   //       // dispatch(
//   //       //   socketServiceActions.modifyBoardTitle({
//   //       //     boardId,
//   //       //     title: listTitle,
//   //       //   })
//   //       // )
//   //       // dispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TITLE_RESULT))
//   //     }
//   //   }
//   // }, [isEdit])

//   return (
//     <>
//       {/* <h6 className="text-lg !text-secondary-3 mr-auto ">{listTitle}</h6> */}
//       {/* 列表標題 */}
//       {/* <Droppable
//         id={`${data._id}`}
//         data={{
//           eventType: 'list-top',
//         }}
//       > */}
//       {/* <div
//           className="flex mb-3"
//           onClick={() => {
//             setIsEdit(true)
//           }}
//           onBlur={() => setIsEdit(false)}
//         >
//           {isEdit ? (
//             <InputText
//               className="w-full"
//               ref={inputRef}
//               value={localListTitle}
//               onChange={e => setLocalListTitle(e.target.value)}
//             />
//           ) : (
//             <h6 className="text-lg !text-secondary-3 mr-auto ">{listTitle}</h6>
//           )}
//         </div> */}
//       {/* </Droppable> */}

//       {/* 卡片 */}

//       {/* <SortableContext items={data} strategy={verticalListSortingStrategy}>
//         {cards?.length ? (
//           cards.map((item, index) => {
//             return (
//               <></>
//               // <SortableCard key={index} id={item._id} listId={data._id} cardItem={item}></SortableCard>
//             )
//           })
//         ) : (
//           <></>
//         )} */}
//       {/* </SortableContext> */}
//       {/* <Droppable
//         id={`${data._id}`}
//         data={{
//           eventType: 'list-bottom',
//         }}
//       > */}
//       <AddCardButton listId={data._id} />
//       {/* </Droppable> */}
//     </>
//   )
// }
// export default memo(List)
