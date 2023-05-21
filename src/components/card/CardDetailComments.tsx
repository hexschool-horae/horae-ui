import { useRef, useState } from 'react'
import { InputText } from 'primereact/inputtext'

import { useCardDetail } from '@/contexts/cardDetailContext'

export default function CardDetailComments() {
  const { state, dispatch } = useCardDetail()
  const inputRef = useRef<HTMLInputElement>(null)
  const [comment, setComment] = useState('')

  const updateComment = () => {
    if (comment == '') return
    dispatch({
      type: 'UPDATE_COMMENT',
      payload: {
        comment: comment,
      },
    })
    setComment('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }

  return (
    <div>
      <ul>
        {state.cardDetail.comments.length > 0 &&
          state.cardDetail.comments.map((comment, i) => (
            <li
              key={i}
              className="flex gap-4 items-center p-2 mb-2
                border-solid border-[1px] border-gray-200"
            >
              <div className="w-[42px] h-[42px] rounded-full  bg-black"></div>
              <div className="grow">{comment.content}</div>
            </li>
          ))}
      </ul>
      <div className="border-solid border-[1px] border-gray-200 p-3 flex gap-4 items-center rounded">
        <div className="w-[42px] h-[42px] rounded-full  bg-black"></div>
        <div className="grow">
          <InputText
            placeholder="撰寫評論..."
            ref={inputRef}
            value={comment}
            className="w-full border-0"
            onBlur={updateComment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  )
}
