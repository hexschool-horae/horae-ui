import { FC, useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'

import ValidateController from '../common/ValidateController'

// import { useAppSelector } from '@/hooks/useAppStore'
// import { useBoardService } from '@/socketService'

interface IAddCardButtonProps {
  listId?: string
  onCreateCard?: (listId: string, title: string) => void
}

const schema = yup
  .object({
    title: yup.string().required(),
  })
  .required()

/** 新增看板按鈕 */
const AddCardButton: FC<IAddCardButtonProps> = ({ listId = '', onCreateCard }) => {
  // const boardId = useAppSelector(state => state.boardSocket.boardId)

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
    console.log(title, onCreateCard)
    onCreateCard && onCreateCard(listId, title)
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
