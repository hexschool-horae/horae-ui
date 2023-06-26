import router from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import style from './cardDetail.module.scss'
import priorityStyle from './priority.module.scss'
import { InputText } from 'primereact/inputtext'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'

export default function CardDetailTitle() {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const token = useAppSelector(state => state.user.token) || ''
  const socketCardTitle = useAppSelector(state => state.board.cardDetail?.title)
  const socketPriority = useAppSelector(state => state.board.cardDetail?.proiority)
  const cardDetail = useAppSelector(state => state.board.cardDetail)

  const inputRef = useRef<HTMLInputElement>(null)
  const [cardTitle, setCardTitle] = useState('')
  const [priorityColor, setPriorityColor] = useState('')

  const [isFocus, setIsFoucs] = useState(false)

  const schema = Yup.object().shape({
    title: Yup.string().required(),
  })

  interface ITitle {
    title: string
  }
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<ITitle>({
    mode: 'onChange',
    defaultValues: {
      title: '',
    },
    resolver: yupResolver(schema),
  })

  const updateTitle = (title: string) => {
    if (cardDetail) {
      appDispatch(
        socketServiceActions.modifyCard({
          boardId,
          cardId,
          title,
          describe: cardDetail.describe,
          startDate: cardDetail.startDate,
          endDate: cardDetail.endDate,
          proiority: cardDetail.proiority,
        })
      )
    }
  }

  const onSubmit = () => {
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleBlur = () => {
    setIsFoucs(false)
    const submitData = getValues()
    if (submitData.title == cardTitle) return
    updateTitle(submitData.title)
  }

  useEffect(() => {
    if (socketCardTitle == undefined) return
    setValue('title', socketCardTitle)
    setCardTitle(socketCardTitle)
  }, [socketCardTitle])

  useEffect(() => {
    if (socketPriority == undefined) return
    setPriorityColor(getPriorityColor(socketPriority))
  }, [socketPriority])

  const getPriorityColor = (val: string) => {
    switch (val) {
      case '1':
        return 'high-bg'
      case '2':
        return 'medium-bg'
      case '3':
        return 'low-bg'
      default:
        return ''
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2 mb-8 relative">
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <InputText
              id={field.name}
              placeholder="卡片標題"
              ref={inputRef}
              disabled={!token}
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              onFocus={() => setIsFoucs(true)}
              onBlur={() => handleBlur()}
              className={`w-full text-3xl disabled:opacity-100
                ${isFocus || fieldState.error ? '' : style.card_title_view} 
                ${fieldState.error ? 'p-invalid' : ''}
                ${socketPriority != '' && 'pl-[54px]'}
              `}
            />
          </>
        )}
      />
      {errors.title && <small className="p-error">{errors.title.message}</small>}

      {socketPriority != '' && (
        <div
          className={`w-[40px] h-[40px] rounded-full text-center leading-[40px] 
          absolute left-2 top-1/2 -translate-y-1/2 ${priorityStyle[priorityColor]}
        `}
        >
          <i className="pi pi-flag text-white" style={{ fontSize: '18px' }}></i>
        </div>
      )}
    </form>
  )
}
