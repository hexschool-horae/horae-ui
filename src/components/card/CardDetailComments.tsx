import router from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import style from './cardDetail.module.scss'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'

import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'
import { IComment } from '@/apis/interface/api'
import IconDelete from '@/assets/icons/icon_delete.svg'

export default function CardDetailComments() {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const socketComments = useAppSelector(state => state.board.cardDetail?.comments)

  const inputRef = useRef<HTMLInputElement>(null)
  const [comments, setComments] = useState<IComment[]>([])
  const [comment, setComment] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  const [isEditId, setIsEditId] = useState<null | string>(null)
  const [editComment, setEditComment] = useState('')

  const createComment = () => {
    if (comment == '') return

    appDispatch(
      socketServiceActions.addCardComment({
        boardId,
        cardId,
        comment,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.ADD_NEW_CARD_COMMENT_RESULT))
  }

  const updateComment = (commentId: string) => {
    if (editComment == '') return
    appDispatch(
      socketServiceActions.modifyCardComment({
        comment: editComment,
        commentId,
        cardId,
        boardId,
      })
    )
    setIsEditId(null)
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.MODIFT_CARD_COMMENT_RESULT))
  }

  const deleteComment = (commentId: string) => {
    appDispatch(
      socketServiceActions.deleteCardComment({
        commentId,
        cardId,
        boardId,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.DELETE_CARD_COMMENT_RESULT))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, type = 'create', commentId?: string) => {
    if (e.key !== 'Enter') return
    switch (type) {
      case 'create':
        createComment()
        inputRef.current?.blur()
        break
      case 'edit':
        if (commentId) {
          updateComment(commentId)
        }
    }
  }

  function formatDate(dateString: string) {
    if (dateString == undefined) return 'YYYY/MM/DD HH:mm'
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  useEffect(() => {
    if (isEditId != null) {
      editInputRef.current?.focus()
      const index = comments.findIndex(comment => comment._id === isEditId)
      if (index >= 0) {
        setEditComment(comments[index].comment)
      }
    }
  }, [isEditId])

  const clearStatus = () => {
    setComment('')
  }

  // useEffect(() => {

  // }, [state.cardDetail.comments])

  //改成都先透過socket更新狀態
  useEffect(() => {
    if (socketComments == undefined) return

    const list = socketComments.map(comment => ({
      ...comment,
      createdAt: formatDate(comment.createdAt),
    }))
    setComments(list)
    clearStatus()
  }, [socketComments])

  return (
    <div>
      <div className="relative mb-2">
        <div className="w-[42px] h-[42px] rounded-full  bg-black absolute left-2 top-1/2 translate-y-[-50%]"></div>
        <div className="grow">
          <InputText
            placeholder="撰寫評論..."
            ref={inputRef}
            value={comment}
            className="w-full h-[58px] pl-[60px]"
            onChange={e => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
      <ul className="relative">
        {comments.length > 0 &&
          comments.map((item, i) => (
            <li
              key={i}
              className={`flex gap-4 items-center p-2 mb-2
                border-solid border-b-[1px] border-gray-200
                ${style.comment_item}
              `}
            >
              <div className="w-[42px] h-[42px] rounded-full  bg-black"></div>
              <div className="grow" onClick={() => setIsEditId(item._id)}>
                <div className="flex items-center mb-1">
                  {item.user.name}
                  <span className="ml-2 text-xs text-gray-500">{item.createdAt}</span>
                </div>
                {isEditId === item._id ? (
                  <InputText
                    ref={editInputRef}
                    className="w-full p-inputtext-sm"
                    value={editComment}
                    onChange={e => setEditComment(e.target.value)}
                    onBlur={() => setIsEditId(null)}
                    onKeyPress={e => handleKeyPress(e, 'edit', item._id)}
                  />
                ) : (
                  <div>{item.comment}</div>
                )}
              </div>
              <Button
                size="small"
                text
                className={`hover:bg-transparent ${style.icon_btn_delete} ${style.comment_delete_btn}`}
                onClick={() => deleteComment(item._id)}
              >
                <IconDelete />
              </Button>
            </li>
          ))}
      </ul>
    </div>
  )
}
