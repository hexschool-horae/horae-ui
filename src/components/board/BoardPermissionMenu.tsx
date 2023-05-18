import { useRef, MouseEvent } from 'react'

import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'

import Style from './BoardPermissionMenu.module.scss'

const permissionDataItems = [
  {
    label: '公開',
    des: '擁有看板連結的人都能看到看板，但不能編輯',
  },
  {
    label: '工作區',
    des: '只有工作區成員可以看到該看板，也可編輯',
  },
  {
    label: '私密',
    des: '只有該看板的成員可以看到該看板，也可編輯',
  },
]

const permissionItems = permissionDataItems.map((item, i) => ({
  label: item.label,
  template: (
    <div className={Style.permission_item} key={i}>
      <div className={Style.permission_item_label}>{item.label}</div>
      <div className={Style.permission_item_des}>{item.des}</div>
    </div>
  ),
}))

export default function BoardPermissionMenu() {
  const menu = useRef<Menu>(null)
  const items: MenuItem[] = [
    { label: 'title', template: () => <div className={Style.permission_item_title}>觀看權限</div> },
    { separator: true },
    ...permissionItems,
  ]

  const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (menu.current === null) return
    menu.current.toggle(event)
  }

  return (
    <>
      <Menu style={{ minWidth: '240px', padding: '0' }} model={items} popup ref={menu} />
      <Button className="mr-4" label="私密" severity="secondary" size="small" onClick={handleMenuToggle} />
    </>
  )
}
