import { FC, useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'

import ValidateController from '../common/ValidateController'
interface IAddCardButtonProps {
  listId?: string
}

const schema = yup
  .object({
    title: yup.string().required(),
  })
  .required()

/** 新增看板按鈕 */
const AddCardButton: FC<IAddCardButtonProps> = ({ listId = '' }) => {
  const boardId = useAppSelector(state => state.board?.boardId)
  const dispatch = useAppDispatch()

  const [cardInputVisible, setCardInputVisible] = useState(false)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
    },
    resolver: yupResolver(schema),
  })

  const onClose = () => {
    reset()
    setCardInputVisible(false)
  }

  const onSubmit = (submitData: { title: string }) => {
    const { title } = submitData
    if (listId === '' || title === '') return
    dispatch(socketServiceActions.createCard({ boardId, listId, title }))

    onClose()
  }
  return (
    <>
      {/* 卡片標題輸入框 */}
      <div className={classNames('flex', 'flex-col', 'mb-4', { hidden: !cardInputVisible })}>
        <ValidateController className="mb-4" label="" name="title" control={control}>
          <InputText />
        </ValidateController>
        <div className="flex">
          <Button className="!w-2/5" size="small" onClick={handleSubmit(onSubmit)}>
            新增卡片
          </Button>
          <Button className="!w-1/5" size="small" text onClick={onClose}>
            x
          </Button>
        </div>
      </div>

      {/* 新增卡片按鈕 */}
      <Button
        name="add-card"
        className="!w-full !tracking-[1px] !text-sm !text-secondary-3 !text-center p-0"
        label="+ 新增卡片"
        text
        onClick={() => setCardInputVisible(true)}
      />
    </>
  )
}

export default AddCardButton
