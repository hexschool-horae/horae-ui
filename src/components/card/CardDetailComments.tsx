import router from 'next/router'
import { useEffect, useRef, useState } from 'react'
import style from './cardDetail.module.scss'
import { InputText } from 'primereact/inputtext'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { IComment } from '@/apis/interface/api'
import {
  DELETE_CARD_COMMENT_BY_ID,
  GET_USER_PROFILE,
  POST_CARD_COMMENT_BY_ID,
  PUT_CARD_COMMENT_BY_ID,
} from '@/apis/axios-service'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Button } from 'primereact/button'
import IconDelete from '@/assets/icons/icon_delete.svg'

export default function CardDetailComments() {
  const { state } = useCardDetail()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [comments, setComments] = useState<IComment[]>([])
  const [comment, setComment] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  const [isEditId, setIsEditId] = useState<null | string>(null)
  const [editComment, setEditComment] = useState('')

  const cardId = router.query.cardId as string

  const getUserData = async () => {
    try {
      const response = await GET_USER_PROFILE()
      if (response == undefined) return
      setUsername(response.data.name)
    } catch (error) {
      console.log('Error get user profile', error)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  const createComment = async () => {
    if (comment == '') return
    try {
      setIsLoading(true)
      const data = {
        comment: comment,
      }
      const response = await POST_CARD_COMMENT_BY_ID(cardId, data)
      if (response == undefined) return
      // console.log(response)
      const obj = {
        _id: response.data,
        comment: comment,
        createdAt: '剛剛',
        user: {
          _id: '',
          name: username,
        },
      }
      setComments(prev => [obj, ...prev])
      // dispatch({
      //   type: 'CREATE_COMMENT',
      //   payload: {
      //     comment: comment,
      //   },
      // })
      setComment('')
      setIsLoading(false)
    } catch (error) {
      console.log('Error create comment', error)
      setIsLoading(false)
    }
  }

  const updateComment = async (commentId: string) => {
    if (editComment == '') return
    try {
      const data = {
        commentId: commentId,
        comment: editComment,
      }

      const response = await PUT_CARD_COMMENT_BY_ID(cardId, data)
      if (response == undefined) return
      const list = [...comments]
      const index = comments.findIndex(comment => comment._id === commentId)
      list[index].comment = editComment
      setComments(list)
      setIsEditId(null)
    } catch (error) {
      console.log('Error update comment:', error)
    }
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

  const deleteComment = async (id: string) => {
    try {
      const data = {
        commentId: id,
      }
      const response = await DELETE_CARD_COMMENT_BY_ID(cardId, data)
      if (response == undefined) return
      setComments(prev => prev.filter(comment => comment._id !== id))
    } catch (error) {
      console.log('Error delete comment:', error)
    }
  }

  useEffect(() => {
    const list = state.cardDetail.comments.map(comment => ({
      ...comment,
      createdAt: formatDate(comment.createdAt),
    }))
    setComments(list)
  }, [state.cardDetail.comments])

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
            disabled={isLoading}
            onChange={e => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {isLoading && (
            <ProgressSpinner
              style={{ width: '40px', height: '40px' }}
              strokeWidth="4"
              className="absolute left-[66px] top-1/2 translate-y-[-50%]"
            />
          )}
        </div>
      </div>
      <ul>
        {comments.length > 0 &&
          comments.map((item, i) => (
            <li
              key={i}
              className="flex gap-4 items-center p-2 mb-2
                border-solid border-b-[1px] border-gray-200"
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
                className={`hover:bg-transparent ${style.icon_btn_delete}`}
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
