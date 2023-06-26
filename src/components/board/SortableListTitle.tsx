import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'
import { InputText } from 'primereact/inputtext'
import style from './sortableList.module.scss'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import ValidateController from '../common/ValidateController'
interface IListProps {
  title: string
  listId: string
  isDragging: boolean
}

export default function SortableListTitle({ title, listId, isDragging }: IListProps) {
  const appDispatch = useAppDispatch()
  const boardId = useAppSelector(state => state.board.boardId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocus, setIsFocus] = useState(false)

  const schema = yup.object().shape({
    title: yup.string().required(),
  })

  interface ITitle {
    title: string
  }

  const { handleSubmit, control, setValue, getValues } = useForm<ITitle>({
    mode: 'onChange',
    defaultValues: {
      title: '',
    },
    resolver: yupResolver(schema),
  })

  const updateTitle = (title: string) => {
    appDispatch(
      socketServiceActions.modifyListTitle({
        boardId,
        listId,
        title,
      })
    )
  }

  const onSubmit = () => {
    handleCurrentBlur()
  }

  const handleCurrentBlur = () => {
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }

  const handleOnModifySubmit = () => {
    const submitData = getValues()
    if (submitData.title == title) return setIsFocus(false)
    if (!submitData.title) return
    updateTitle(submitData.title)
    setIsFocus(false)
  }

  useEffect(() => {
    if (!title) return
    setValue('title', title ?? '')
  }, [title])

  useEffect(() => {
    if (isDragging) {
      setIsFocus(false)
      handleCurrentBlur()
    }
  }, [isDragging])

  return (
    <form className={`mb-8 relative ${isFocus ? '' : style.list_title_view}`} onSubmit={handleSubmit(onSubmit)}>
      <ValidateController name="title" label="" control={control}>
        <InputText ref={inputRef} onClick={() => setIsFocus(true)} onBlur={() => handleOnModifySubmit()} />
      </ValidateController>
    </form>
  )
}
