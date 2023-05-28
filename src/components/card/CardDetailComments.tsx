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
        updateComment()
        inputRef.current.blur()
      }
    }
  }

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
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <ul>
        {state.cardDetail.comments.length > 0 &&
          state.cardDetail.comments.map((comment, i) => (
            <li
              key={i}
              className="flex gap-4 items-center p-2 mb-2
                border-solid border-b-[1px] border-gray-200"
            >
              <div className="w-[42px] h-[42px] rounded-full  bg-black"></div>
              <div className="grow">
                <div className="flex items-center mb-1">
                  UserName
                  <span className="ml-4 text-xs text-gray-500">2023/10/22 10:22</span>
                </div>
                <div>{comment.content}</div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}
