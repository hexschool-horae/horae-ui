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
  const token = useAppSelector(state => state.user.token)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocus, setIsFocus] = useState(false)

  const schema = yup.object().shape({
    [`title-${listId}`]: yup.string().required(),
  })

  const { handleSubmit, control, setValue, getValues } = useForm({
    mode: 'onChange',
    defaultValues: {
      [`title-${listId}`]: '',
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
    if (submitData[`title-${listId}`] == title) return setIsFocus(false)
    if (!submitData[`title-${listId}`]) return
    updateTitle(submitData[`title-${listId}`])
    setIsFocus(false)
  }

  useEffect(() => {
    if (!title) return
    setValue(`title-${listId}`, title ?? '')
  }, [title])

  useEffect(() => {
    if (isDragging) {
      setIsFocus(false)
      handleCurrentBlur()
    }
  }, [isDragging])

  return (
    <form className={`mb-8 relative ${isFocus ? '' : style.list_title_view}`} onSubmit={handleSubmit(onSubmit)}>
      <ValidateController name={`title-${listId}`} label="" control={control}>
        <InputText ref={inputRef} onClick={() => token && setIsFocus(true)} onBlur={() => handleOnModifySubmit()} />
      </ValidateController>
    </form>
  )
}
