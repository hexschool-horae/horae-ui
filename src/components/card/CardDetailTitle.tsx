import { useEffect, useRef, useState } from 'react'
import style from './cardDetail.module.scss'
import { InputText } from 'primereact/inputtext'

import { useCardDetail } from '@/contexts/cardDetailContext'

export default function CardDetailTitle() {
  const { state, dispatch } = useCardDetail()
  const inputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [isFocus, setIsFoucs] = useState(false)

  const dispatchTitle = () => {
    dispatch({
      type: 'UPDATE_TITLE',
      payload: {
        title: title,
      },
    })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }

  const updateTitle = () => {
    setIsFoucs(false)
    dispatchTitle()
  }

  useEffect(() => {
    setTitle(state.cardDetail.title)
  }, [state.cardDetail.title])

  return (
    <InputText
      placeholder="卡片標題"
      ref={inputRef}
      value={title}
      className={`w-full mb-8 text-3xl ${isFocus ? '' : style.card_title_view}`}
      onFocus={() => setIsFoucs(true)}
      onBlur={updateTitle}
      onChange={handleTitleChange}
      onKeyDown={handleKeyDown}
    />
  )
}
