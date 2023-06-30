import { useRef, MouseEvent, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'

import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { TieredMenu } from 'primereact/tieredmenu'
import { Message } from 'primereact/message'

import Style from './BoardSettingMenu.module.scss'
import CardPopupTags from '../card/CardPopupTags'
import CoverSelector from './CoverSelector'
import { POST_BOARD_INVITATION_LINK_BY_ID } from '@/apis/axios-service'

const BoardAboutTemplate = () => {
  const members = useAppSelector(state => state.board?.singleBaord?.members)
  const discribe = useAppSelector(state => state.board?.singleBaord?.discribe)
  const admins = members?.filter(item => item.role === 'admin')
  const admin = admins?.[0]
  // const token = useAppSelector(state => state.user?.token)

  return (
    <div className="p-4" style={{ fontSize: '14px' }}>
      <div className="text-xl text-center mb-3">關於這個看板</div>
      <hr className="my-5" />
      <div className="mb-3">看板管理員</div>

      <div className="flex">
        <div className="w-[3rem] h-[3rem] bg-black rounded-full mr-3"></div>
        <div>
          <div className="mb-1">{admin?.userId?.name || '成員名稱'}</div>
          <div className="text-gray-2 text-xs font-light mb-1">{admin?.userId?.email || '@nick name'}</div>

          {/* <Button size="small" style={{ padding: 0 }} link> */}
          {/* <span className="font-light">編輯基本資訊</span> */}
          {/* </Button> */}
        </div>
      </div>

      <hr className="my-5" />
      <div className="mb-1">描述</div>

      <InputTextarea rows={30} className="w-full h-[100px]" value={discribe || '-'} disabled />
    </div>
  )
}

const BoardSettingTemplate = () => {
  const dispatch = useAppDispatch()
  const boardId = useAppSelector(state => state.board?.boardId)
  const boardCover = useAppSelector(state => state.board?.singleBaord?.coverPath)
  const [checked, setIsChecked] = useState(false)

  const handleDeleteCover = () => {
    dispatch(socketServiceActions.deleteBoardCover({ boardId }))
    setIsChecked(!checked)
  }

  useEffect(() => {
    if (boardCover !== '') {
      setIsChecked(true)
    } else {
      setIsChecked(false)
    }
  }, [boardCover])

  return (
    <div className="px-6 py-5" style={{ fontSize: '14px', letterSpacing: '1px' }}>
      <div className="text-xl text-center mb-3">設定</div>
      <hr className="my-5" />

      <div className="mb-2">看板封面已啟用</div>
      <Button className="p-0" label="關閉看板封面" text onClick={handleDeleteCover}></Button>

      <hr className="my-5" />
      <div className="mb-1">允許工作區成員編輯和加入</div>
      <div className="text-gray-2 text-xs font-light mb-1">所有工作區成員皆可編輯和加入此看板</div>
    </div>
  )
}

const LabelListTemplate = () => (
  <div className="px-6 py-5" style={{ fontSize: '14px', letterSpacing: '1px' }}>
    <div className="text-xl text-center mb-3">標籤</div>
    <hr className="my-5" />
    <CardPopupTags page="board" />
  </div>
)

const settingData1Items = [
  { mainLabel: '關於這個看板', subTemplate: <BoardAboutTemplate /> },
  { mainLabel: '設定', subTemplate: <BoardSettingTemplate /> },
  { mainLabel: '標籤', subTemplate: <LabelListTemplate /> },
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

// const setting2Items = {
//   label: '新增看板背景',
//   items: [{ template: <CoverSelector />, popup: true }],
//   template: (
//     <div className={Style.setting_item}>
//       <div className={Style.setting_item_label}>更換背景</div>
//     </div>
//   ),
// }

// const CloseBoardItem = () => {
//   const boardId = useAppSelector(state => state.board?.boardId)
//   const dispatch = useAppDispatch()

//   const onClick = () => {
//     dispatch(socketServiceActions.archiveBoard({ boardId, status: 'close' }))
//   }
//   return (
//     <div className={Style.setting_item} onClick={onClick}>
//       <div className={Style.setting_item_label}>關閉看板</div>
//     </div>
//   )
// }

export default function BoardSettingMenu() {
  const token = useAppSelector(state => state.user.token) || ''
  const boardId = useAppSelector(state => state.board.boardId)
  const [invitationLink, setInvitationLink] = useState('')
  const [boardLink, setBoardLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const boardLinkRef = useRef<HTMLInputElement>(null)

  const menu = useRef<Menu>(null)
  const items: MenuItem[] = [
    {
      label: 'advanced',
      template: () => <div className={Style.setting_item_title}>更多</div>,
    },
    {
      template: () => <div style={{ borderTop: '1px solid #dee2e6', margin: '0 0 1.25rem 0' }}></div>,
    },
    ...setting1Items,
    {
      label: '新增看板背景',
      items: [{ template: <CoverSelector /> }],
      disabled: !token,
      template: (
        <div className={Style.setting_item}>
          <div className={Style.setting_item_label}>更換背景</div>
        </div>
      ),
    },
    {
      template: () => <div style={{ borderTop: '1px solid #dee2e6', margin: '1.25rem 1.5rem' }}></div>,
    },
    {
      label: 'share',
      template: () => (
        <div className={Style.setting_item_shared}>
          {token && (
            <>
              <div className={Style.setting_item_label}>看板成員邀請連結</div>
              <InputText
                ref={linkInputRef}
                placeholder="看板成員邀請連結"
                value={invitationLink}
                style={{ width: '100%', marginBottom: '0.75rem' }}
                onClick={handleCopyIvitationLink}
                onBlur={() => setIsCopied(false)}
              />
            </>
          )}

          <div className={Style.setting_item_label}>看板分享連結</div>
          <InputText
            ref={boardLinkRef}
            placeholder="看板分享連結"
            value={boardLink}
            style={{ width: '100%', marginBottom: '1.25rem' }}
            onClick={handleCopyBoardLink}
            onBlur={() => setIsCopied(false)}
          />

          {isCopied && <Message className="my-4" severity="success" text={'連結已複製到剪貼簿'} />}

          <p style={{ color: '#606060' }} className={Style.setting_item_label}>
            所有人都能查看這個看板，但只有看板成員可以編輯
          </p>
        </div>
      ),
    },
  ]

  const handleMenuToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (menu.current === null) return
    menu.current.toggle(event)
  }

  const handleGetInvitationLink = async () => {
    const result = await POST_BOARD_INVITATION_LINK_BY_ID(boardId)
    if (result === undefined) return
    const {
      data: { invitationLink },
    } = result

    invitationLink && setInvitationLink(invitationLink)
  }
  const handleGetBoardLink = async () => {
    const result = location.href

    result && setBoardLink(result)
  }

  const handleCopyIvitationLink = async () => {
    if (linkInputRef.current) {
      try {
        await navigator.clipboard.writeText(linkInputRef.current.value)
        setIsCopied(true)
      } catch (error) {
        setIsCopied(false)
      }
    }
  }

  const handleCopyBoardLink = async () => {
    if (boardLinkRef.current) {
      try {
        await navigator.clipboard.writeText(boardLinkRef.current.value)
        setIsCopied(true)
      } catch (error) {
        setIsCopied(false)
      }
    }
  }

  useEffect(() => {
    if (!boardId) return
    handleGetBoardLink()

    if (token) {
      handleGetInvitationLink()
    }
  }, [boardId])

  return (
    <>
      <TieredMenu style={{ minWidth: '400px', padding: '0' }} model={items} popup ref={menu} />
      <Button icon="pi pi-ellipsis-v" severity="secondary" text aria-label="MenuToggle" onClick={handleMenuToggle} />
    </>
  )
}
