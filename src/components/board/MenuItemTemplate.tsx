import Style from './MenuItem.module.scss'
import { MenuItem } from 'primereact/menuitem'

export default function MenuItemTemplate({ title = '', menuItems }: { title: string; menuItems: MenuItem[] }) {
  if (menuItems.length === 0) return <></>

  const items = menuItems.map((item, i) => ({
    label: item.label,
    template: (
      <div className={Style.permission_item} key={i}>
        <div className={Style.permission_item_label}>{item.label}</div>
        {/* <div className={Style.permission_item_des}>{item.des}</div> */}
      </div>
    ),
  }))

  return [
    { label: 'title', template: () => <div className={Style.permission_item_title}>{title}</div> },
    { separator: true },
    ...items,
  ]
}
