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
import { POST_WORKSPACE_INVITATION_LINK_BY_ID } from '@/apis/axios-service'

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

type IInvitationWorkspaceFormReq = {
  userEmail: string
}

type IWorkspaceId = {
  data: string
}

const schema = Yup.object().shape({
  title: Yup.string().required(),
})
const schemaInvitation = Yup.object().shape({
  userEmail: Yup.string().required().email(),
})

export default function WorkSpaceModel({ visible, onHide, setVisible, handleGetWorkSpaceTitleData }: Props) {
  const { handleGetUserBoardsData } = useContext(AdminLayoutContext)
  const [workspaceId, setWorkspaceId] = useState('')
  const [invitationStep, setInvitationStep] = useState('1')

  const handleHide = () => {
    onHide()
    setVisible(false) // 調用父元件傳遞過來的更新函數，將 visible 設為 false
    reset()
    resetInvitationSendMail()
    setInvitationStep('1')
  }

  const WorkspaceValues: IWorkspaceFormReq = {
    title: '',
    discribe: '',
    viewSet: 'public', //工作區觀看權限,預設public (private, public)
  }

  const WorkspaceInvitationSendMailValues: IInvitationWorkspaceFormReq = {
    userEmail: '',
  }

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
    console.log('handleCreateWorkspace')
  }

  const handleInvitationWorkspaceSendMail = async (reqData: IInvitationWorkspaceFormReq) => {
    console.log('reqData', reqData)
    const result = await post(`/work-space/${workspaceId}/invitation-sendMail`, reqData)
    if (!result) return

    handleHide()
  }

  const handleInvitationLikeWorkspace = async () => {
    const response = await POST_WORKSPACE_INVITATION_LINK_BY_ID(workspaceId)
    if (!response) return
    navigator.clipboard.writeText(response.data.invitationLink) // 複製連結
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

  const {
    control: controlInvitationSendMail,
    handleSubmit: handleSubmitInvitationSendMail,
    formState: { errors: errorsInvitationSendMail },
    reset: resetInvitationSendMail,
  } = useForm<IInvitationWorkspaceFormReq>({
    defaultValues: WorkspaceInvitationSendMailValues,
    resolver: yupResolver(schemaInvitation),
  })

  const onSubmit = (data: IWorkspaceFormReq) => {
    handleCreateWorkspace(data)
    reset()
  }

  const onSubmitInvitationSendMail = (data: IInvitationWorkspaceFormReq) => {
    console.log(data)
    handleInvitationWorkspaceSendMail(data)
    resetInvitationSendMail()
  }

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
                {/* 邀請成員 表單 */}
                <form className="flex flex-col" onSubmit={handleSubmitInvitationSendMail(onSubmitInvitationSendMail)}>
                  <div className="flex flex-col pb-6">
                    <Controller
                      name="userEmail"
                      control={controlInvitationSendMail}
                      render={({ field, fieldState }) => (
                        <>
                          <div className="form-label flex justify-between">
                            <label htmlFor={field.name}>工作區成員</label>
                            <span
                              className="text-secondary flex items-center cursor-pointer"
                              onClick={handleInvitationLikeWorkspace}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.6665 10.6667C8.95281 11.0495 9.31808 11.3662 9.73754 11.5954C10.157 11.8245 10.6208 11.9608 11.0976 11.9949C11.5744 12.0291 12.0529 11.9603 12.5007 11.7932C12.9486 11.6262 13.3552 11.3648 13.6932 11.0267L15.6932 9.02672C16.3004 8.39805 16.6363 7.55604 16.6288 6.68205C16.6212 5.80806 16.2706 4.97202 15.6526 4.354C15.0345 3.73597 14.1985 3.38541 13.3245 3.37781C12.4505 3.37022 11.6085 3.7062 10.9798 4.31339L9.83317 5.45339"
                                  stroke="#FD1414"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M11.3335 9.33332C11.0472 8.95057 10.6819 8.63387 10.2624 8.40469C9.84297 8.17552 9.37913 8.03924 8.90237 8.0051C8.4256 7.97095 7.94708 8.03974 7.49924 8.2068C7.0514 8.37386 6.64472 8.63527 6.3068 8.97332L4.3068 10.9733C3.69961 11.602 3.36363 12.444 3.37122 13.318C3.37881 14.192 3.72938 15.028 4.3474 15.646C4.96543 16.2641 5.80147 16.6146 6.67546 16.6222C7.54945 16.6298 8.39146 16.2938 9.02013 15.6867L10.1601 14.5467"
                                  stroke="#FD1414"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              以連結邀請
                            </span>
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
                </form>
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
