import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import style from './cardDetail.module.scss'
import { InputText } from 'primereact/inputtext'

import { useCardDetail } from '@/contexts/cardDetailContext'

export default function CardDetailTitle() {
  const { state, dispatch } = useCardDetail()
  const inputRef = useRef<HTMLInputElement>(null)

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
  }, [state.cardDetail.title])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
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
                ${fieldState.error ? 'p-invalid' : ''}`}
            />
          </>
        )}
      />
      {errors.title && <small className="p-error">{errors.title.message}</small>}
    </form>
  )
}
