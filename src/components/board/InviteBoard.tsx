import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'

import MemberInfoGroup from './MemberInfoGroup'

interface IPermissonOption {
  name: string
  code: string | number
}

const PermissionDropdown = ({
  name = 'name',
}: // onSelected,
{
  name?: string
  onSelected?: (e: DropdownChangeEvent) => void
}) => (
  <Dropdown
    value={{ name: '管理員', code: 0 }}
    options={[
      { name: '管理員', code: 0 },
      {
        name: '成員',
        code: 1,
        itemTemplate: (option: IPermissonOption) => (
          <div>
            {option.name}
            <div className="text-sm text-gray-2">看板至少必須有一位管理員</div>
          </div>
        ),
      },
      { name: '離開看板', code: 2 },
    ]}
    optionLabel={name}
    className="w-full md:w-14rem"
  />
)

const memberModel = [
  { img: '', title: '透過連結分享此看板', subtitle: '建立連結' },
  {
    img: '',
    title: '成員名稱',
    subtitle: '@nick name',
    append: <PermissionDropdown />,
  },
  {
    img: '',
    title: '成員名稱',
    subtitle: '@nick name',
    append: <PermissionDropdown />,
  },
  { img: '', title: '成員名稱', subtitle: '@nick name', append: <PermissionDropdown /> },
]

export default function InviteBoard() {
  const [visible, setVisible] = useState<boolean>(false)

  return (
    <>
      <Button label="邀請成員" severity="secondary" size="small" rounded onClick={() => setVisible(true)}></Button>

      <div className="card flex justify-content-center">
        <Dialog visible={visible} style={{ width: '62vw' }} onHide={() => setVisible(false)}>
          <div className="px-[36px]">
            <div className="text-2xl text-secondary-1 mb-6">邀請成員加入看板</div>
            <div className="mb-6">
              <div className="flex">
                <InputText className="w-3/4" placeholder="請輸入郵件地址或名稱" />
                <Button label="成員" className="bg-secondary-4 text-secondary-1 ml-auto" rounded></Button>
                <Button label="邀請" className="bg-secondary-1 ml-3" rounded></Button>
              </div>
            </div>

            <div className="mt-4">
              {memberModel.map((item, i) => (
                <MemberInfoGroup append={item.append} model={item} key={i}></MemberInfoGroup>
              ))}
            </div>
          </div>
        </Dialog>
      </div>
    </>
  )
}
