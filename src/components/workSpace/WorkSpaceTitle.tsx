import React, { useEffect, useState } from 'react'
import { Tooltip } from 'primereact/tooltip'
import ValidateController from '../common/ValidateController'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import { InputText } from 'primereact/inputtext'
import { InputSwitch } from 'primereact/inputswitch'
import { IWorkSpaceEditDataRequest } from '@/apis/interface/api'
import { PATCH_WORK_SPACE } from '@/apis/axios-service'

const schema = yup
  .object({
    title: yup.string().required().max(10),
    discribe: yup.string().required(),
    viewSet: yup.string().required(),
    status: yup.boolean().required(),
  })
  .required()

interface Props {
  boardData: IWorkSpaceTitleForm
  isEdit?: boolean
  handleGetWorkSpaceData?: () => void
}

interface IWorkSpaceTitleForm {
  title: string
  viewSet: string
  discribe: string
  status: string
  _id: string
}

interface IWorkSpaceForm {
  title: string
  discribe: string
  viewSet: string
  status: boolean
  _id: string
}

export default function WorkSpaceTitle({ boardData, isEdit = false, handleGetWorkSpaceData }: Props) {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: boardData.title,
      discribe: boardData.discribe,
      viewSet: boardData.viewSet,
      status: boardData.status === 'open' ? true : false,
      _id: boardData._id,
    },
    resolver: yupResolver(schema),
  })

  const [workSpaceName, setWorkSpaceName] = useState('')
  const [isEditWorkSpace, setIsEditWorkSpace] = useState(false)
  const viewSets = [
    { name: '公開', value: 'public' },
    { name: '私人', value: 'private' },
  ]

  const handleGetBard = () => {
    setWorkSpaceName(boardData.title.charAt(0))
  }
  const handleEditWorkSpace = () => {
    setIsEditWorkSpace(true)
  }
  // 修改工作區
  const onSubmit = async (submitData: IWorkSpaceForm) => {
    const req: IWorkSpaceEditDataRequest = {
      title: submitData.title,
      discribe: submitData.discribe,
      viewSet: submitData.viewSet,
      status: submitData.status ? 'open' : 'close',
    }
    console.log('req', req)
    const res = await PATCH_WORK_SPACE(boardData?._id ?? '', req)
    if (res === undefined) return

    // 重取工作區資料
    if (handleGetWorkSpaceData) {
      handleGetWorkSpaceData()
    }
    reset()
    setIsEditWorkSpace(false)
  }
  const handleEditWorkSpaceHide = () => {
    reset()
    setIsEditWorkSpace(false)
  }
  useEffect(() => {
    handleGetBard()
    reset({
      title: boardData.title,
      discribe: boardData.discribe,
      viewSet: boardData.viewSet,
      status: boardData.status === 'open',
      _id: boardData._id,
    })
  }, [boardData])

  return (
    <>
      {!isEditWorkSpace ? (
        <div className="header border-b mb-5 border-secondary-2">
          <div className="flex pb-5">
            <span className="bg-primary text-white rounded py-3.5 px-[18px] mr-3">{workSpaceName}</span>
            <div className="title">
              <div className="edit-title flex items-center">
                <h2 className="text-2xl">{boardData.title}</h2>
                <Tooltip className="text-sm" mouseTrackLeft={20} target=".target-icon" mouseTrack>
                  修改工作區
                </Tooltip>
                {isEdit && (
                  <i className="target-icon pi pi-pencil ml-5 cursor-pointer" onClick={handleEditWorkSpace}></i>
                )}
              </div>
              <p className="text-sm">{boardData.viewSet === 'private' ? '私人' : '公開'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="editForm">
          {/* 新建 工作區表單 */}
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col pb-6">
              <ValidateController name="title" label="工作區名稱" control={control}>
                <InputText />
              </ValidateController>
            </div>
            <div className="flex flex-col pb-6">
              <ValidateController name="viewSet" label="工作區權限" control={control}>
                <Dropdown options={viewSets} optionLabel="name" />
              </ValidateController>
            </div>
            <div className="flex flex-col pb-6">
              <ValidateController name="discribe" label="工作區描述" control={control}>
                <InputTextarea autoResize />
              </ValidateController>
            </div>
            <div className="flex flex-col pb-6">
              <ValidateController name="status" label="工作區狀態" control={control}>
                <InputSwitch checked={false} />
              </ValidateController>
            </div>
            <div className="btn-box text-right">
              <Button
                type="button"
                label="取消"
                severity="secondary"
                text
                rounded
                onClick={() => handleEditWorkSpaceHide()}
              />
              <Button type="submit" label="確定" severity="secondary" rounded />
            </div>
          </form>
        </div>
      )}
    </>
  )
}
