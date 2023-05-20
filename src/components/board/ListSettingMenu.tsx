import { useRef, MouseEvent } from 'react'

import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'

import Style from './MenuItem.module.scss'

const listSettingDataItems = [
  {
    label: '複製列表',
  },
  {
    label: '移動列表',
  },
  {
    label: '排序依據',
  },
]

const listSettingItems = listSettingDataItems.map((item, i) => ({
  label: item.label,
  template: (
    <div className={Style.permission_item} key={i}>
      <div className={Style.permission_item_label}>{item.label}</div>
    </div>
  ),
}))

export default function BoardPermissionMenu() {
  const menu = useRef<Menu>(null)
  const items: MenuItem[] = [
    { label: 'title', template: () => <div className={Style.permission_item_title}>列表動作</div> },
    { separator: true },
    ...listSettingItems,
  ]

  const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (menu.current === null) return
    menu.current.toggle(event)
  }

  return (
    <>
      <Menu model={items} popup ref={menu} />
      <Button
        className="!text-secondary-3 !w-4 !p-0 !leading-none"
        icon="pi pi-ellipsis-v"
        text
        aria-label="MenuToggle"
        onClick={handleMenuToggle}
      />
    </>
  )
}
