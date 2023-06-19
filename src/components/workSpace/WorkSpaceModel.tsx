import Image from 'next/image'
import homeStyles from '@/pages/home/home.module.scss'
import styles from '@/pages/home/workApplication.module.scss'
import { Controller, useForm } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'

import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'
import axiosFetcher from '@/apis/axios'
import { useContext, useState } from 'react'
import { AdminLayoutContext } from '@/contexts/adminLayoutContext'
import InvitationLink from '../common/InvitationLink'

const { post } = axiosFetcher

interface Props {
  visible: boolean
  onHide: () => void
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  handleGetWorkSpaceTitleData?: () => void
}

type IWorkspaceFormReq = {
  title: string
  discribe: string
  viewSet: string
}

// type IInvitationWorkspaceFormReq = {
//   userEmail: string
// }

type IWorkspaceId = {
  data: string
}

const schema = Yup.object().shape({
  title: Yup.string().required(),
})
// const schemaInvitation = Yup.object().shape({
//   userEmail: Yup.string().required().email(),
// })

export default function WorkSpaceModel({ visible, onHide, setVisible, handleGetWorkSpaceTitleData }: Props) {
  const { handleGetUserBoardsData } = useContext(AdminLayoutContext)
  const [workspaceId, setWorkspaceId] = useState('')
  const [invitationStep, setInvitationStep] = useState('1')

  const handleHide = () => {
    onHide()
    setVisible(false) // 調用父元件傳遞過來的更新函數，將 visible 設為 false
    reset()
    // resetInvitationSendMail()
    setInvitationStep('1')
  }

  const WorkspaceValues: IWorkspaceFormReq = {
    title: '',
    discribe: '',
    viewSet: 'public', //工作區觀看權限,預設public (private, public)
  }

  // const WorkspaceInvitationSendMailValues: IInvitationWorkspaceFormReq = {
  //   userEmail: '',
  // }

  const handleCreateWorkspace = async (reqData: IWorkspaceFormReq) => {
    console.log('reqData', reqData)
    const result = await post<IWorkspaceId>('/work-space', reqData)
    if (!result) return

    // 重取側邊欄工作區資料
    if (handleGetWorkSpaceTitleData) {
      handleGetWorkSpaceTitleData()
    }
    // 重取個人所有工作區看板資料
    handleGetUserBoardsData()
    setInvitationStep('2')
    setWorkspaceId(result.data)
  }

  // const handleInvitationWorkspaceSendMail = async (reqData: IInvitationWorkspaceFormReq) => {
  //   console.log('reqData', reqData)
  //   const result = await post(`/work-space/${workspaceId}/invitation-sendMail`, reqData)
  //   if (!result) return

  //   handleHide()
  // }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IWorkspaceFormReq>({
    defaultValues: WorkspaceValues,
    resolver: yupResolver(schema),
  })

  // const {
  //   control: controlInvitationSendMail,
  //   handleSubmit: handleSubmitInvitationSendMail,
  //   formState: { errors: errorsInvitationSendMail },
  //   reset: resetInvitationSendMail,
  // } = useForm<IInvitationWorkspaceFormReq>({
  //   defaultValues: WorkspaceInvitationSendMailValues,
  //   resolver: yupResolver(schemaInvitation),
  // })

  const onSubmit = (data: IWorkspaceFormReq) => {
    handleCreateWorkspace(data)
    reset()
  }

  // const onSubmitInvitationSendMail = (data: IInvitationWorkspaceFormReq) => {
  //   console.log(data)
  //   handleInvitationWorkspaceSendMail(data)
  //   resetInvitationSendMail()
  // }

  return (
    <>
      <Dialog
        className="work-space-model home-dialog flex-col"
        visible={visible}
        style={{ margin: '24px' }}
        draggable={false}
        onHide={() => handleHide()}
      >
        <div className={styles.dialog_panel}>
          <div className={styles.dialog_left_panel}>
            <h4 className={`${homeStyles.h4} my-6 text-secondary`}>開始建立你的工作區吧</h4>
            {invitationStep === '1' ? (
              <>
                {/* 新建 工作區表單 */}
                <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col pb-6">
                    <Controller
                      name="title"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name}>工作區名稱</label>
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
                    <Controller
                      name="discribe"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <label htmlFor={field.name}>工作區描述</label>
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
                    <Button type="button" label="取消" severity="secondary" text rounded onClick={() => handleHide()} />
                    <Button type="submit" label="送出" severity="secondary" rounded />
                  </div>
                </form>
              </>
            ) : (
              <>
                <p>Horae使團隊合作成為你最耀眼權限的表現。</p>
                <p className="mb-12">邀請你的新團隊成員一同使用！</p>
                {/* 以連結邀請 */}
                <InvitationLink workspaceId={workspaceId} iconBgColor={'bg-secondary-4'}></InvitationLink>
                <div className="btn-box text-right">
                  <Button type="button" label="稍後再說" severity="secondary" rounded onClick={() => handleHide()} />
                  {/* <Button type="submit" label="邀請加入工作區" severity="secondary" rounded /> */}
                </div>
                {/* 邀請成員 表單 */}
                {/* <form className="flex flex-col" onSubmit={handleSubmitInvitationSendMail(onSubmitInvitationSendMail)}>
                  <div className="flex flex-col pb-6">
                    <Controller
                      name="userEmail"
                      control={controlInvitationSendMail}
                      render={({ field, fieldState }) => (
                        <>
                          <div className="form-label flex justify-between">
                            <label htmlFor={field.name}>工作區成員</label>

                          </div>

                          <InputText
                            id={field.name}
                            value={field.value}
                            onChange={e => field.onChange(e.target.value)}
                            className={classNames({ 'p-invalid': fieldState.error })}
                            placeholder="例如：123@gmail.com"
                          />
                        </>
                      )}
                    />
                    {errorsInvitationSendMail.userEmail && (
                      <small className="p-error">{errorsInvitationSendMail.userEmail.message}</small>
                    )}
                  </div>
                  <div className="btn-box text-right">
                    <Button
                      type="button"
                      label="稍後再說"
                      severity="secondary"
                      text
                      rounded
                      onClick={() => handleHide()}
                    />
                    <Button type="submit" label="邀請加入工作區" severity="secondary" rounded />
                  </div>
                </form> */}
              </>
            )}
          </div>
          <div className={styles.dialog_right_panel}>
            <Image
              className="min-h-[480px]"
              src={invitationStep === '1' ? '/images/workspace-new.png' : '/images/workspace-invitation.png'}
              alt="remote"
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
              width={600}
              height={400}
            />
          </div>
        </div>
      </Dialog>
    </>
  )
}
