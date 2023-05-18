import BoardPermissionMenu from './BoardPermissionMenu'
import BoardTitle from './BoardTitle'
import MemberAvatarGroup from './MemberAvatarGroup'
import FiltersMenu from './FiltersMenu'
import InviteBoard from './InviteBoard'
import InviteButton from './InviteButton'
import ListSettingMenu from './ListSettingMenu'

export default function MenuBar() {
  //const router = useRouter();

  return (
    <>
      <section>
        <div className="flex">
          <div className="flex items-center">
            {/* 看板觀看權限 */}
            <BoardPermissionMenu />
            {/* 看版標題 */}
            <BoardTitle />
          </div>

          {/* 成員列表 */}
          <MemberAvatarGroup />

          {/* 篩選條件選單按鈕 */}
          <FiltersMenu />
          {/* 邀請成員彈窗按鈕 */}
          <InviteButton />
          {/* 邀請成員彈窗 */}
          <InviteBoard />

          {/* 設定選單按鈕 */}
          <ListSettingMenu />
        </div>
      </section>
    </>
  )
}
