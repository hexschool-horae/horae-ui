import { useRef, MouseEvent } from 'react'

import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { TieredMenu } from 'primereact/tieredmenu'

import MemberInfoGroup from './MemberInfoGroup'

import Style from './BoardSettingMenu.module.scss'
import CardPopupTags from '../card/CardPopupTags'

const BoardAboutTemplate = () => (
  <div className="p-4" style={{ fontSize: '14px' }}>
    <div className="mb-3">看板管理員</div>
    {/* <img src={item.img} alt="" style={{ width: "16px", height: "16px", marginRight: "0.75rem" }} /> */}
    <div className="flex">
      <div className="w-[3rem] h-[3rem] bg-black rounded-full mr-3"></div>
      <div>
        <div className="mb-1">成員名稱</div>
        <div className="text-gray-2 text-xs font-light mb-1">@Lia_333</div>

        <Button size="small" style={{ padding: 0 }} link>
          <span className="font-light">編輯基本資訊</span>
        </Button>
      </div>
    </div>

    <hr className="my-5" />
    <div className="mb-1">描述</div>

    <InputTextarea rows={30} className="w-full h-[100px]" placeholder="新增描述說明..." />
  </div>
)

const BoardSettingTemplate = () => (
  <div className="px-6 py-5" style={{ fontSize: '14px', letterSpacing: '1px' }}>
    <div className="mb-3">變更工作區</div>
    <Dropdown className="w-full" placeholder="工作區名稱" />

    <hr className="my-5" />
    <div>卡片封面已啟用</div>
    <div className="text-gray-2 text-xs font-light mb-1">@Lia_333</div>

    <hr className="my-5" />
    <div className="mb-1">留言權限...</div>
    <div className="text-gray-2 text-xs font-light mb-1">留言權限...</div>

    <hr className="my-5" />
    <div className="mb-1">新增/移除權限...</div>
    <div className="text-gray-2 text-xs font-light mb-1">成員</div>

    <hr className="my-5" />
    <div className="mb-1">卡片封面已啟用</div>
    <div className="text-gray-2 text-xs font-light mb-1">所有工作區成員皆可編輯和加入此看板</div>
  </div>
)

const LabelListTemplate = () => (
  <div className="px-6 py-5" style={{ fontSize: '14px', letterSpacing: '1px' }}>
    <CardPopupTags page="board" />
  </div>
)

const settingData1Items = [
  { mainLabel: '關於這個看板', subTemplate: <BoardAboutTemplate /> },
  { mainLabel: '設定', subTemplate: <BoardSettingTemplate /> },
  { mainLabel: '標籤', subTemplate: <LabelListTemplate /> },
]
const settingData2Items = ['以電子郵件新增看板內容', '追蹤', '複製看板']
const settingData3Items = ['關閉看板', '分享看板']
const activityDataItems = [
  { img: '', title: '成員名稱 | 活動描述', subtitle: '2023.03.23 19:45' },
  { img: '', title: '成員名稱 | 活動描述', subtitle: '2023.03.22 14:05' },
  { img: '', title: '成員名稱 | 活動描述', subtitle: '2023.03.15 09:34' },
]

const setting1Items = settingData1Items.map((item, i) => ({
  label: item.mainLabel,
  items: [{ template: item.subTemplate }],
  template: (
    <div className={Style.setting_item} key={i}>
      <div className={Style.setting_item_label}>{item.mainLabel}</div>
    </div>
  ),
}))

const setting2Items = settingData2Items.map((item, i) => ({
  label: item,
  template: (
    <div className={Style.setting_item} key={i}>
      <div className={Style.setting_item_label}>{item}</div>
    </div>
  ),
}))
const setting3Items = settingData3Items.map((item, i) => ({
  label: item,
  template: (
    <div className={Style.setting_item} key={i}>
      <div className={Style.setting_item_label}>{item}</div>
    </div>
  ),
}))

const activityItems = activityDataItems.map((item, i) => ({
  label: item.title,
  template: (
    <div className="px-6">
      <MemberInfoGroup key={i} model={item} />
    </div>
  ),
}))

export default function BoardSettingMenu() {
  const menu = useRef<Menu>(null)
  const items: MenuItem[] = [
    {
      label: 'title',
      template: () => <div className={Style.setting_item_title}>更多</div>,
    },
    {
      template: () => <div style={{ borderTop: '1px solid #dee2e6', margin: '0 0 1.25rem 0' }}></div>,
    },
    ...setting1Items,
    {
      template: () => <div style={{ borderTop: '1px solid #dee2e6', margin: '1.25rem 1.5rem' }}></div>,
    },
    ...setting2Items,
    {
      template: () => <div style={{ borderTop: '1px solid #dee2e6', margin: '1.25rem 1.5rem' }}></div>,
    },
    ...setting3Items,
    {
      label: 'sss',
      template: () => (
        <div className={Style.setting_item_shared}>
          <InputText style={{ width: '100%', marginBottom: '0.25rem' }} />
          <p style={{ color: '#606060' }} className={Style.setting_item_label}>
            所有人都能查看這個看板，但只有看板成員可以編輯
          </p>
          <Button style={{ padding: 0, fontWeight: '200' }} text>
            <span className="font-light" style={{ fontSize: '14px' }}>
              顯示QR Code
            </span>
          </Button>
        </div>
      ),
    },
    {
      template: () => <div style={{ borderTop: '1px solid #dee2e6', margin: '1.25rem 1.5rem' }}></div>,
    },
    {
      label: 'activity',
      template: () => (
        <div className={Style.setting_item}>
          <div className={Style.setting_item_label}>活動</div>
        </div>
      ),
    },
    ...activityItems,
    {
      template: () => (
        <div className={Style.setting_item} style={{ margin: '1.25rem' }}>
          <Button style={{ width: '100%' }} label="查看所有活動紀錄" size="small" outlined rounded />
        </div>
      ),
    },
  ]

  const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (menu.current === null) return
    menu.current.toggle(event)
  }

  return (
    <>
      <TieredMenu style={{ minWidth: '400px', padding: '0' }} model={items} popup ref={menu} />
      <Button icon="pi pi-ellipsis-v" severity="secondary" text aria-label="MenuToggle" onClick={handleMenuToggle} />
    </>
  )
}
