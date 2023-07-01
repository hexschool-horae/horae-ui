import { useRef, MouseEvent } from 'react'

import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import Style from './MenuItem.module.scss'

import { useAppDispatch } from '@/hooks/useAppStore'
import { useAppSelector } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'

const permissionData = {
  workspace: '工作區',
  public: '公開',
  private: '私密',
}
const permissionDataItems = [
  {
    label: '公開',
    value: 'public',
    des: '擁有看板連結的人都能看到看板，但不能編輯',
  },
  // {
  //   label: '工作區',
  //   value: 'wo',
  //   des: '只有工作區成員可以看到該看板，也可編輯',
  // },
  {
    label: '私密',
    value: 'private',
    des: '只有該看板的成員可以看到該看板，也可編輯',
  },
]

const permissionItems = (onClick: (event: MouseEvent, viewSet: 'public' | 'private' | 'workspace') => void) =>
  permissionDataItems.map((item, i) => ({
    label: item.label,
    template: (
      <div
        className={Style.permission_item}
        key={i}
        onClick={(event: MouseEvent) => onClick(event, item.value as 'public' | 'private' | 'workspace')}
      >
        <div className={Style.permission_item_label}>{item.label}</div>
        <div className={Style.permission_item_des}>{item.des}</div>
      </div>
    ),
  }))

export default function BoardPermissionMenu() {
  const boardViewSet = useAppSelector(state => state.board?.singleBaord?.viewSet) || ''
  const boardId = useAppSelector(state => state.board?.boardId)
  const token = useAppSelector(state => state.user?.token)
  const dispatch = useAppDispatch()

  const onClick = (event: MouseEvent, viewSet: 'public' | 'private' | 'workspace') => {
    // return
    dispatch(socketServiceActions.modifyBoardViewPermission({ boardId, viewSet }))
    menu?.current?.hide(event)
  }

  const menu = useRef<Menu>(null)
  const items: MenuItem[] = [
    { label: 'title', template: () => <div className={Style.permission_item_title}>觀看權限</div> },
    { separator: true },
    ...permissionItems(onClick),
  ]

  const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (menu.current === null) return
    menu.current.toggle(event)
  }

  return (
    <>
      <Menu style={{ minWidth: '240px', padding: '0' }} model={items} popup ref={menu} />
      <Button
        disabled={!token}
        className="mr-4"
        label={boardViewSet && permissionData[boardViewSet]}
        severity="secondary"
        size="small"
        onClick={handleMenuToggle}
      />
    </>
  )
}
