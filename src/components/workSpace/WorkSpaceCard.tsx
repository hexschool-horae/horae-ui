import { Fragment, useRef, useState } from 'react'
import styles from './workSpaceCard.module.scss'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Controller, useForm } from 'react-hook-form'
import yup from '@/libs/yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { classNames } from 'primereact/utils'
import axiosFetcher from '@/apis/axios'

import router from 'next/router'
import { IBoard } from '@/apis/interface/api'

const { post } = axiosFetcher

const schema = yup.object().shape({
  title: yup.string().required(),
})

interface Props {
  workSpaceId: string
  boardList: IBoard[]
  handleAddWorkSpaceSuccess?: () => void
}

type IWorkspaceFormReq = {
  title: string
  discribe: string
  viewSet: string
  workSpaceId: string
}

export default function WorkSpaceCard({ workSpaceId, boardList, handleAddWorkSpaceSuccess }: Props) {
  const newWorkSpaceOverlayPanel = useRef<OverlayPanel>(null)
  const [viewSetList] = useState([
    {
      name: '公開',
      value: 'public',
    },
    {
      name: '私人',
      value: 'private',
    },
  ])

  const [selectedViewSet, setSelectedViewSet] = useState('public')

  const WorkspaceValues: IWorkspaceFormReq = {
    title: '',
    discribe: '',
    viewSet: 'public', //看板觀看權限,預設public (private, public)
    workSpaceId: workSpaceId,
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IWorkspaceFormReq>({
    defaultValues: WorkspaceValues,
    resolver: yupResolver(schema),
  })

  const handleCreateBoard = async (reqData: IWorkspaceFormReq) => {
    reqData.viewSet = selectedViewSet

    const result = await post('/board', reqData)
    if (!result) return
    handleHide()
    if (handleAddWorkSpaceSuccess) {
      handleAddWorkSpaceSuccess()
    }
  }

  const handleHide = () => {
    newWorkSpaceOverlayPanel.current?.hide() // 關閉 OverlayPanel
  }

  const onSubmit = (data: IWorkspaceFormReq) => {
    handleCreateBoard(data)
    reset()
  }

  const goBoard = (boardId: string) => {
    router.push(`/board/${boardId}`)
  }

  return (
    <div>
      {/* 既有看版 */}
      <div className="flex w-full flex-wrap">
        {boardList
          ? boardList.map(item => (
              <Fragment key={item._id}>
                <div
                  className={styles.card}
                  onClick={() => goBoard(item._id)}
                  style={{ background: item?.coverPath ? `url(${item?.coverPath})` : '#fff', backgroundSize: 'cover' }}
                >
                  <p>{item.title}</p>
                </div>
              </Fragment>
            ))
          : null}
        {/* 建立看版 */}
        <div className={`${styles.card} ${styles.new_card}`} onClick={e => newWorkSpaceOverlayPanel.current?.toggle(e)}>
          <div className={styles.add}>+</div>
        </div>
      </div>

      <OverlayPanel ref={newWorkSpaceOverlayPanel} className="work-space-overlay-panel" showCloseIcon>
        <p className="text-center">建立看板</p>
        <div className="content">
          {/* 新建 看板表單 */}
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col pb-6">
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name}>看板名稱</label>
                    <InputText
                      id={field.name}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      className={classNames({ 'p-invalid': fieldState.error })}
                      placeholder="請輸入名稱"
                    />
                  </>
                )}
              />
              {errors.title && <small className="p-error">{errors.title.message}</small>}
            </div>
            <div className="flex flex-col pb-6">
              <label htmlFor="">觀看權限</label>
              <Dropdown
                value={selectedViewSet}
                onChange={e => setSelectedViewSet(e.value)}
                options={viewSetList}
                optionLabel="name"
                className="w-full md:w-14rem"
              />
            </div>
            <div className="flex flex-col pb-6">
              <Controller
                name="discribe"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name}>看板描述</label>
                    <InputTextarea
                      id={field.name}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      autoResize
                      className={classNames({ 'p-invalid': fieldState.error })}
                      placeholder="請輸入描述內容"
                      rows={5}
                      cols={30}
                    />
                  </>
                )}
              />
              {errors.discribe && <small className="p-error">{errors.discribe.message}</small>}
            </div>
            <div className="btn-box text-right">
              <Button className="w-full" type="submit" label="建立" severity="secondary" size="small" rounded />
            </div>
          </form>
        </div>
      </OverlayPanel>
    </div>
  )
}
