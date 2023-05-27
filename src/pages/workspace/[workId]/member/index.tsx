import {
  GET_WORKSPACE_MEMBERS_BY_ID,
  PATCH_WORK_SPACE_MEMBER,
  POST_WORKSPACE_INVITATION_SEND_MAIL,
} from '@/apis/axios-service'
import { IWorkSpaceMembersByIdResponse } from '@/apis/interface/api'
import WorkSpaceTitle from '@/components/workSpace/WorkSpaceTitle'
import { useRouter } from 'next/router'
import { InputText } from 'primereact/inputtext'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import yup from '@/libs/yup'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import InvitationLink from '@/components/common/InvitationLink'

const schemaInvitation = yup.object().shape({
  userEmail: yup.string().required().email(),
})

interface IWorkspaceData {
  title: string
  viewSet: string
}

type IInvitationWorkspaceFormReq = {
  userEmail: string
}

export default function Members() {
  const router = useRouter()
  const workId = router.query.workId as string
  const [workspaceId, setworkspaceId] = useState('')
  const [members, setMembers] = useState<IWorkSpaceMembersByIdResponse[]>([])
  const roles = [
    { name: '管理員', role: 'admin' },
    { name: '成員', role: 'editor' },
  ]
  const [selectedRoles, setSelectedRoles] = useState('')

  const [workspaceData, setWorkspaceData] = useState<IWorkspaceData>({
    title: '',
    viewSet: '',
  })

  const WorkspaceInvitationSendMailValues: IInvitationWorkspaceFormReq = {
    userEmail: '',
  }

  const {
    control: controlInvitationSendMail,
    handleSubmit: handleSubmitInvitationSendMail,
    formState: { errors: errorsInvitationSendMail },
    reset: resetInvitationSendMail,
  } = useForm<IInvitationWorkspaceFormReq>({
    defaultValues: WorkspaceInvitationSendMailValues,
    resolver: yupResolver(schemaInvitation),
  })

  const handlerCallGetWorkPaceMembers = async (workId: string) => {
    try {
      const response = await GET_WORKSPACE_MEMBERS_BY_ID(workId)
      if (!response) return
      const data = response.data.members ?? []
      console.log('response', response)
      setMembers(data)
      setWorkspaceData({ title: response.data.title, viewSet: response.data.viewSet })
      console.log('members', members)
    } catch (error) {
      console.error('Error fetching user boards data:', error)
    }
  }

  const handleInvitationWorkspaceSendMail = async (reqData: IInvitationWorkspaceFormReq) => {
    console.log('reqData', reqData)
    const response = await POST_WORKSPACE_INVITATION_SEND_MAIL(workspaceId)
    if (!response) return
  }

  const onSubmitInvitationSendMail = (data: IInvitationWorkspaceFormReq) => {
    console.log(data)
    handleInvitationWorkspaceSendMail(data)
    resetInvitationSendMail()
  }

  const handleDeleteMember = async (userId: string) => {
    console.log('delete', userId)
    // const response = await DELETE_WORKSPACE_MEMBER(workspaceId, {userId: userId})
    // if (!response) return
    handlerCallGetWorkPaceMembers(workspaceId)
  }

  const getShortName = (name: string) => {
    return name.charAt(0)
  }
  const handleSelectMemberOption = async (value: any, userId: string) => {
    setSelectedRoles(value)
    const req = {
      role: value.role,
      userId: userId,
    }
    const response = await PATCH_WORK_SPACE_MEMBER(workspaceId, req)
    if (!response) return
    handlerCallGetWorkPaceMembers(workspaceId)
  }
  useEffect(() => {
    if (workId) {
      setworkspaceId(workId)
      // handlerCallGetWorkPace(workId)
      handlerCallGetWorkPaceMembers(workId)
    }
  }, [workId])
  return (
    <div>
      {workspaceData.title ? <WorkSpaceTitle boardData={workspaceData}></WorkSpaceTitle> : ''}

      <div className="invitation flex justify-between">
        <h5 className="pb-5">邀請成員加入你</h5>
        {/* 以連結邀請 */}
        <InvitationLink workspaceId={workspaceId}></InvitationLink>
      </div>

      <p>任何擁有邀請連結的人都可以加入此免費工作區。你也可以隨時停用並為此工作區建立新的邀請連結。</p>
      {/* 邀請成員 表單 */}
      <form
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
      </form>

      <h5 className="pb-5">工作區成員</h5>
      <div>
        {members.map(member => (
          <>
            <div className="flex justify-between">
              <div className="member flex" key={member._id}>
                <div className="member-icon bg-secondary-3 text-white rounded-full w-[48px] h-[48px] p-3 text-center mr-3">
                  {getShortName(member.userId.name)}
                </div>
                <div className="title flex flex-col">
                  <span>{member.userId.name}</span>
                  <span className="text-gray-400 text-sm">{member.userId.email}</span>
                </div>
              </div>
              <div className="member-setting">
                {/* disabled={members.length === 1 && member.role === 'admin'} */}
                <Dropdown
                  placeholder={member.role === 'admin' ? '管理員' : '成員'}
                  value={selectedRoles}
                  onChange={e => handleSelectMemberOption(e.value, member.userId._id)}
                  options={roles}
                  optionLabel="name"
                />
                {/* disabled={members.length === 1} */}
                <Button
                  className="ml-4 text-sm"
                  size="small"
                  label="退出"
                  onClick={() => {
                    handleDeleteMember(member.userId._id)
                  }}
                />
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}
