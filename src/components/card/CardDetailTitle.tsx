import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import style from './cardDetail.module.scss'
import priorityStyle from './priority.module.scss'
import { InputText } from 'primereact/inputtext'

import { useCardDetail } from '@/contexts/cardDetailContext'

export default function CardDetailTitle() {
  const { state, dispatch } = useCardDetail()
  const inputRef = useRef<HTMLInputElement>(null)
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

  const dispatchTitle = (title: string) => {
    dispatch({
      type: 'UPDATE_TITLE',
      payload: {
        title: title,
      },
    })
  }

  const onSubmit = (submitData: ITitle) => {
    dispatchTitle(submitData.title)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleBlur = () => {
    const submitData = getValues()
    dispatchTitle(submitData.title)
    setIsFoucs(false)
  }

  useEffect(() => {
    setValue('title', state.cardDetail.title)
    setPriorityColor(getPriorityColor(state.cardDetail.proiority))
  }, [state.cardDetail.title, state.cardDetail.proiority])

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
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8 relative">
      <Controller
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <InputText
              id={field.name}
              placeholder="卡片標題"
              ref={inputRef}
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              onFocus={() => setIsFoucs(true)}
              onBlur={() => handleBlur()}
              className={`w-full text-3xl ${isFocus || fieldState.error ? '' : style.card_title_view} 
                ${fieldState.error ? 'p-invalid' : ''}
                ${state.cardDetail.proiority != '' && 'pl-[54px]'}
              `}
            />
          </>
        )}
      />
      {errors.title && <small className="p-error">{errors.title.message}</small>}

      {state.cardDetail.proiority != '' && (
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
