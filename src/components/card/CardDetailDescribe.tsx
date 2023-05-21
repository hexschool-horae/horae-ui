import { useEffect, useRef, useState } from 'react'
import { InputTextarea } from 'primereact/inputtextarea'

import { useCardDetail } from '@/contexts/cardDetailContext'

export default function CardDetailDescribe() {
  const { state, dispatch } = useCardDetail()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [description, setDescription] = useState('')

  const dispatchDescribe = () => {
    dispatch({
      type: 'SAVE_DESCRIPTION',
      payload: {
        describe: description,
      },
    })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }

  useEffect(() => {
    setDescription(state.cardDetail.describe)
  }, [state.cardDetail.describe])

  return (
    <InputTextarea
      placeholder="描述"
      ref={inputRef}
      value={description}
      className="w-full my-5"
      rows={5}
      onChange={handleDescriptionChange}
      onBlur={dispatchDescribe}
      onKeyDown={handleKeyDown}
    />
  )
}
