import BoardPermissionMenu from './BoardPermissionMenu'
import BoardTitle from './BoardTitle'
import MemberAvatarGroup from './MemberAvatarGroup'
// import FiltersMenu from './FiltersMenu'
import InviteBoard from './InviteBoard'
import BoardSettingMenu from './BoardSettingMenu'
import { useAppSelector } from '@/hooks/useAppStore'
import { classNames } from 'primereact/utils'
// import { useAppDispatch } from '@/hooks/useAppStore'

export default function MenuBar() {
  const token = useAppSelector(state => state.user.token) || ''
  return (
    <>
      <section>
        <div className={classNames('flex items-center', { 'w-full': !token })}>
          <div className="flex items-center">
            {/* 看板觀看權限 */}
            <BoardPermissionMenu />
            {/* 看版標題 */}
            <BoardTitle />
          </div>

          <div className="flex ml-auto">
            {/* 成員列表 */}
            <MemberAvatarGroup />

            {/* 篩選條件選單按鈕 */}
            {/* <FiltersMenu /> */}

            {/* 邀請成員彈窗 */}
            <InviteBoard />

            {/* 設定選單按鈕 */}
            <BoardSettingMenu />
          </div>
        </div>
      </section>
    </>
  )
}
