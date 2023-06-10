import { memo, useState } from 'react'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { classNames } from 'primereact/utils'
import Style from './MemberInfoGroup.module.scss'

import { useAppSelector } from '@/hooks/useAppStore'
import { PATCH_BOARD_MEMBERS_BY_ID, DELETE_BOARD_MEMBERS_BY_ID } from '@/apis/axios-service'
/** 團隊成員資訊 */
interface IBoardMember {
  userId: {
    _id: string
    name: string
    email: string
  }
  role: string
  inviteHashData: string
  _id: string
}

interface IPermissonOption {
  name: string
  code: string | number
}

const permissionOptions = new Map([
  ['admin', '管理員'],
  ['editor', '成員'],
  ['exit', '離開看板'],
])

const MemberInfoGroup = ({ className, model }: { model: IBoardMember; className?: string }) => {
  const boardId = useAppSelector(state => state.board.boardId)
  const [permission, setPermission] = useState<IPermissonOption>({
    name: permissionOptions.get(model.role) || '',
    code: model.role,
  })

  const handleChangePermission = async (value: IPermissonOption) => {
    setPermission(value)
    if (model.role === 'admin' && value.code === 'admin') return

    if (value.code !== 'leave') {
      PATCH_BOARD_MEMBERS_BY_ID(boardId, {
        role: value,
        userId: model.userId?._id,
      })
    } else {
      DELETE_BOARD_MEMBERS_BY_ID(boardId, {
        userId: model.userId?._id,
      })
    }
  }

  return model !== undefined ? (
    <div className={classNames(className, Style.member_info_item)}>
      {/* 照片之後補上 */}

      <div className="w-[3rem] h-[3rem] bg-black rounded-full mr-3"></div>
      <div>
        <span>{model.userId?.name}</span>
        <div className={classNames(Style.member_info_subtitle, 'text-gray-2')}>{model.userId?.email}</div>
      </div>

      <span className="ml-auto">
        <Dropdown
          className="w-full md:w-14rem"
          value={permission}
          placeholder={permission.name}
          options={Array.from(permissionOptions).map(item => ({
            name: item[1],
            code: item[0],
            disabled: model.role === item[0],
          }))}
          optionLabel="name"
          onChange={(e: DropdownChangeEvent) => {
            handleChangePermission(e.value)
          }}
        />
      </span>
    </div>
  ) : (
    <></>
  )
}

export default memo(MemberInfoGroup)
