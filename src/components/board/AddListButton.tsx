import { FC, useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'
import { classNames } from 'primereact/utils'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'

import ValidateController from '../common/ValidateController'

interface IAddListButtonProps {
  onCreateList?: (title: string) => void
}

const schema = yup
  .object({
    title: yup.string().required(),
  })
  .required()

/** 新增看板按鈕 */
const AddListButton: FC<IAddListButtonProps> = () => {
  const [inputVisible, setInputVisible] = useState(false)
  const boardId = useAppSelector(state => state.board?.boardId)
  const dispatch = useAppDispatch()

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
    },
    resolver: yupResolver(schema),
  })

  const onClose = () => {
    reset()
    setInputVisible(false)
  }

  const onSubmit = (submitData: { title: string }) => {
    const { title } = submitData
    dispatch(socketServiceActions.createList({ boardId, title }))

    onClose()
  }

  return (
    <>
      {/* 列表標題輸入框 */}
      <div className={classNames('mb-4', { hidden: !inputVisible })}>
        <ValidateController className="mb-4" label="" name="title" control={control}>
          <InputText />
        </ValidateController>

        <div className="flex">
          <Button size="small" onClick={handleSubmit(onSubmit)}>
            新增列表
          </Button>
          <Button className="!w-1/5" size="small" text onClick={onClose}>
            x
          </Button>
        </div>
      </div>

      {/* 新增列表按鈕 */}
      <Button
        name="add-list"
        className="w-[286px] border-secondary-2 row-span-full text-secondary-3 flex h-16"
        outlined
        onClick={() => setInputVisible(true)}
      >
        新增其他列表
        <span className="ml-auto">+</span>
      </Button>
    </>
  )
}

export default AddListButton
