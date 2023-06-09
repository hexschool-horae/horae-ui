import { memo, useState } from 'react'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { classNames } from 'primereact/utils'
import { ConfirmDialog } from 'primereact/confirmdialog'
import Style from './MemberInfoGroup.module.scss'

import { IBoardMember } from '@/apis/interface/api'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
// import { PATCH_BOARD_MEMBERS_BY_ID, DELETE_BOARD_MEMBERS_BY_ID } from '@/apis/axios-service'

interface IPermissonOption {
  name: string
  code: string
  disabled: boolean
}

const permissionOptions = new Map([
  ['admin', '管理員'],
  ['editor', '成員'],
  ['exit', '離開看板'],
])

const MemberInfoGroup = ({
  className,
  model,
  disabled = false,
}: {
  model: IBoardMember
  className?: string
  disabled?: boolean
}) => {
  const dispatch = useAppDispatch()
  const boardId = useAppSelector(state => state.board.boardId)
  const [permission, setPermission] = useState<IPermissonOption>({
    name: permissionOptions.get(model.role) || '',
    code: model.role,
    disabled: false,
  })

  const [visible, setVisible] = useState(false)

  const handleChangePermission = async (value: IPermissonOption) => {
    setPermission(value)
    if (model.role === 'admin' && value.code === 'admin') return

    if (value.code !== 'exit') {
      dispatch(
        socketServiceActions.modifyBoardMemberPermission({ boardId, role: value.code, userId: model.userId?._id })
      )
    } else {
      setVisible(true)
    }
  }
  const handleDeleteMember = () => {
    dispatch(socketServiceActions.deleteBoardMember({ boardId, userId: model.userId?._id }))
  }

  return model !== undefined ? (
    <div className={classNames(className, Style.member_info_item)}>
      {/* 照片之後補上 */}

      <div
        className="w-[3rem] h-[3rem] flex justify-center items-center rounded-full mr-3"
        style={{ backgroundColor: model.userId.avatar }}
      >
        {model.userId.name.slice(0, 1)}
      </div>
      <div>
        <span>{model.userId?.name}</span>
        <div className={classNames(Style.member_info_subtitle, 'text-gray-2')}>{model.userId?.email}</div>
      </div>

      <span className="ml-auto">
        <Dropdown
          className="w-full md:w-14rem"
          value={permission}
          placeholder={permission.name}
          disabled={disabled}
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
      <ConfirmDialog
        header="確認離開看板？"
        visible={visible}
        onHide={() => setVisible(false)}
        rejectLabel="取消"
        acceptLabel="確定離開"
        accept={handleDeleteMember}
        message={`確認離開看板後，${model.userId?.name} 將從看板成員中移除`}
      />
    </div>
  ) : (
    <></>
  )
}

export default memo(MemberInfoGroup)
