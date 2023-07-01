import {
  DELETE_WORKSPACE_MEMBER,
  GET_WORKSPACE_MEMBERS_BY_ID,
  PATCH_WORK_SPACE_MEMBER,
  // POST_WORKSPACE_INVITATION_SEND_MAIL,
} from '@/apis/axios-service'
import { IWorkSpaceMembersByIdResponse, PatchMembersDataRequest } from '@/apis/interface/api'
import WorkSpaceTitle from '@/components/workSpace/WorkSpaceTitle'
import { useRouter } from 'next/router'
// import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
// import { Controller, useForm } from 'react-hook-form'
// import { classNames } from 'primereact/utils'
// import { yupResolver } from '@hookform/resolvers/yup'
// import yup from '@/libs/yup'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { ConfirmDialog } from 'primereact/confirmdialog'
import InvitationLink from '@/components/common/InvitationLink'
import { setWorkspaceId, setWorkspaceData } from '@/slices/workspaceSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { Fragment } from 'react'

// const schemaInvitation = yup.object().shape({
//   userEmail: yup.string().required().email(),
// })

interface IWorkspaceData {
  title: string
  viewSet: string
  discribe: string
  status: string
  _id: string
}

interface IRole {
  name: string
  role: string
}

// type IInvitationWorkspaceFormReq = {
//   userEmail: string
// }

export default function Members() {
  const isLogin = useAppSelector(state => state.user.isLogin)
  const router = useRouter()
  const workId = router.query.workId as string
  const dispatch = useAppDispatch()
  const workspaceId = useAppSelector(state => state.workspace.workspaceId)
  const [members, setMembers] = useState<IWorkSpaceMembersByIdResponse[]>([])
  const roles = [
    { name: '管理員', role: 'admin' },
    { name: '成員', role: 'editor' },
  ]

  const [workspaceObj, setWorkspaceObj] = useState<IWorkspaceData>({
    title: '',
    viewSet: '',
    discribe: '',
    status: '',
    _id: '',
  })

  const [selectedRolesMap, setSelectedRolesMap] = useState<{ [memberId: string]: IRole }>({})

  const [addWorkPaceMembersReq, setAddWorkPaceMembersReq] = useState<PatchMembersDataRequest>({
    userId: '',
    role: '',
  })

  // const WorkspaceInvitationSendMailValues: IInvitationWorkspaceFormReq = {
  //   userEmail: '',
  // }

  const [showAddMembersConfirmation, setShowAddMembersConfirmation] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState({
    message: '',
    type: '',
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

  const handlerCallGetWorkPaceMembers = async (workId: string) => {
    if (!isLogin) return router.push(`/workspace/${workId}/home`)
    try {
      const response = await GET_WORKSPACE_MEMBERS_BY_ID(workId)
      if (!response) return
      const data = response.data.members ?? []
      dispatch(
        setWorkspaceData({
          viewSet: response.data.viewSet,
          workspaceName: response.data.title,
        })
      )
      setMembers(data)
      setWorkspaceObj({
        title: response.data.title,
        viewSet: response.data.viewSet,
        discribe: '',
        status: '',
        _id: '',
      })
    } catch (e: any) {
      // 401 msg	此為私人看板，訪客請先登入
      // 403 msg	此為私人看板，您不是看板成員，不可查看
      const { status } = e.response
      if (status === 401 || status === 403) {
        router.push('/workspace/workspaceWithoutPermission')
      }
    }
  }

  // const handleInvitationWorkspaceSendMail = async (reqData: IInvitationWorkspaceFormReq) => {
  //   console.log('reqData', reqData)
  //   const response = await POST_WORKSPACE_INVITATION_SEND_MAIL(workspaceId)
  //   if (!response) return
  // }

  // const onSubmitInvitationSendMail = (data: IInvitationWorkspaceFormReq) => {
  //   console.log(data)
  //   handleInvitationWorkspaceSendMail(data)
  //   resetInvitationSendMail()
  // }

  // 點擊 退出
  const handleDeleteMember = async (memberId: string, role: string) => {
    setAddWorkPaceMembersReq({ role: role, userId: memberId })
    setShowAddMembersConfirmation(true) // 顯示確認對話框
    setConfirmConfig({ message: '確定要退出此工作區嗎?', type: 'delete-member' })
  }
  // 刪除成員 API
  const handleCallDeleteMember = async (memberId: string) => {
    const response = await DELETE_WORKSPACE_MEMBER(workspaceId, { userId: memberId })
    if (!response) return
    handlerCallGetWorkPaceMembers(workspaceId)
  }

  const getShortName = (name: string) => {
    return name.charAt(0)
  }

  const handleSelectMemberOption = (value: IRole, memberId: string) => {
    const req = {
      role: value.role,
      userId: memberId,
    }
    setAddWorkPaceMembersReq(req)
    setSelectedRolesMap(prevState => ({
      ...prevState,
      [memberId]: value,
    }))

    setShowAddMembersConfirmation(true) // 顯示確認對話框
    setConfirmConfig({ message: '確定要更改成員權限嗎?', type: 'add-member' })
  }

  const handleCancelModal = () => {
    const originalRolesMap: { [memberId: string]: IRole } = {}
    members.forEach(member => {
      originalRolesMap[member.userId._id] = { name: member.role === 'admin' ? '管理員' : '成員', role: member.role }
    })
    setSelectedRolesMap(originalRolesMap)
  }

  // 調整成員權限 API
  const handlerCallAddWorkPaceMembers = async (req: PatchMembersDataRequest) => {
    console.log('req', req)
    const response = await PATCH_WORK_SPACE_MEMBER(workspaceId, addWorkPaceMembersReq)
    if (!response) {
      handleCancelModal()
      return
    }
    handlerCallGetWorkPaceMembers(workspaceId)
  }

  const accept = () => {
    if (confirmConfig.type === 'add-member') {
      handlerCallAddWorkPaceMembers(addWorkPaceMembersReq) // 傳遞最新的 addWorkPaceMembersReq 值
    } else if (confirmConfig.type === 'delete-member') {
      handleCallDeleteMember(addWorkPaceMembersReq.userId)
    }

    setShowAddMembersConfirmation(false) // 隱藏確認對話框
  }

  const reject = () => {
    if (confirmConfig.type === 'add-member') {
      handleCancelModal()
    }
    setShowAddMembersConfirmation(false) // 隱藏確認對話框
  }

  // 檢查管理員數量
  const isAdminOnly = members.filter(member => member.role === 'admin').length === 1

  useEffect(() => {
    if (workId) {
      dispatch(setWorkspaceId(workId))
      // handlerCallGetWorkPace(workId)
      handlerCallGetWorkPaceMembers(workId)
    }
  }, [workId])

  return (
    <div className="bg-secondary-4 min-h-full py-[50px] px-[64px]" key={workspaceId}>
      {/* 確認對話框 */}
      <ConfirmDialog
        visible={showAddMembersConfirmation}
        message={confirmConfig.message}
        header="訊息"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
      />
      {workspaceObj.title ? <WorkSpaceTitle boardData={workspaceObj}></WorkSpaceTitle> : ''}

      <div className="invitation flex justify-between">
        {/* <h5 className="pb-5">邀請成員加入你</h5> */}
        {/* 以連結邀請 */}
        <InvitationLink workspaceId={workspaceId}></InvitationLink>
      </div>

      {/* <p>任何擁有邀請連結的人都可以加入此免費工作區。你也可以隨時停用並為此工作區建立新的邀請連結。</p> */}
      {/* 邀請成員 表單 */}
      {/* <form
        className="flex my-5 pb-5 border-b  border-secondary-2"
        onSubmit={handleSubmitInvitationSendMail(onSubmitInvitationSendMail)}
      >
        <div className="flex flex-col pb-6 w-[50%]">
          <Controller
            name="userEmail"
            control={controlInvitationSendMail}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  id={field.name}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  className={classNames({ 'p-invalid': fieldState.error, 'w-full': true })}
                  placeholder="例如：123@gmail.com"
                />
              </>
            )}
          />
          {errorsInvitationSendMail.userEmail && (
            <small className="p-error">{errorsInvitationSendMail.userEmail.message}</small>
          )}
        </div>
        <div className="btn-box ml-4 mt-1">
          <Button
            className="text-sm"
            type="submit"
            size="small"
            label="email邀請加入工作區"
            severity="secondary"
            rounded
          />
        </div>
      </form> */}

      <h5 className="pb-5">工作區成員</h5>
      <div>
        {members.map(member => (
          <Fragment key={member._id}>
            <div className="flex justify-between mb-4">
              <div className="member flex">
                <div
                  className="member-icon text-black rounded-full w-[48px] h-[48px] p-3 text-center mr-3"
                  style={{ backgroundColor: member.userId.avatar ? member.userId.avatar : '#CC3A3A' }}
                >
                  {getShortName(member.userId.name)}
                </div>
                <div className="title flex flex-col">
                  <span>{member.userId.name}</span>
                  <span className="text-gray-400 text-sm">{member.userId.email}</span>
                </div>
              </div>
              <div className="member-setting">
                <Dropdown
                  disabled={isAdminOnly && member.role === 'admin'}
                  placeholder={member.role === 'admin' ? '管理員' : '成員'}
                  value={selectedRolesMap[member.userId._id] || null}
                  onChange={e => handleSelectMemberOption(e.value, member.userId._id)}
                  options={roles}
                  optionLabel="name"
                />
                <Button
                  disabled={isAdminOnly && member.role === 'admin'}
                  className="ml-4 text-sm"
                  size="small"
                  label="退出"
                  onClick={() => {
                    handleDeleteMember(member.userId._id, member.role)
                  }}
                />
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
