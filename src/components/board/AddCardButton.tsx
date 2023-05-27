import { FC, useState } from 'react'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { classNames } from 'primereact/utils'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'

import ValidateController from '../common/ValidateController'

// import { useAppSelector } from '@/hooks/useAppStore'
// import { useBoardService } from '@/socketService'

interface IAddCardButtonProps {
  onCreateCard: (title: string) => void
}

const schema = yup
  .object({
    title: yup.string().required(),
  })
  .required()

/** 新增看板按鈕 */
const AddCardButton: FC<IAddCardButtonProps> = ({ onCreateCard }) => {
  // const boardId = useAppSelector(state => state.boardSocket.boardId)

  const [inputVisible, setInputVisible] = useState(false)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
    },
    resolver: yupResolver(schema),
  })

  // const boardService = useBoardService()

  /** 看板新增卡片 */
  // const onCreateCard = (title = '') => {
  //   const payload = {
  //     title,
  //     boardId,
  //   }
  //   boardService?.createCard(payload)
  // }

  const onSubmit = (submitData: { title: string }) => {
    const { title } = submitData
    onCreateCard && onCreateCard(title)
    reset()
  }
  return (
    <>
      {/* 卡片標題輸入框 */}
      <div className={classNames('mb-4', { hidden: !inputVisible })}>
        <ValidateController className="mb-4" label="" name="title" control={control}>
          <InputTextarea />
        </ValidateController>
        <Button size="small" onClick={handleSubmit(onSubmit)}>
          新增卡片
        </Button>
      </div>

      {/* 新增卡片按鈕 */}
      <Button
        className="!w-full !tracking-[1px] !text-sm !text-secondary-3 !text-center p-0"
        label="+ 新增卡片"
        text
        onClick={() => setInputVisible(true)}
      />

      {/* <Button
        className="w-[286px] border-secondary-2 row-span-full text-secondary-3 flex h-16"
        outlined
        onClick={() => setInputVisible(true)}
      >
        新增其他列表
        <span className="ml-auto">+</span>
      </Button> */}
    </>
  )
}

export default AddCardButton
