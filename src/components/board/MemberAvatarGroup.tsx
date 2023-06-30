import { Avatar } from 'primereact/avatar'
import { AvatarGroup } from 'primereact/avatargroup'
import { useAppSelector } from '@/hooks/useAppStore'

/** 看板上方主選單的團隊成員群組 */
export default function MemberAvatarGroup() {
  const boardMembersList = useAppSelector(state => state.board.boardMembersList)
  // console.log(boardMembersList)
  return (
    <>
      {boardMembersList !== null ? (
        <AvatarGroup className="ml-auto mr-4">
          {boardMembersList
            .filter((_, index) => index < 6)
            .map(({ userId }, index) => {
              return (
                <Avatar
                  key={index}
                  label={userId.name.slice(0, 1).toLocaleUpperCase()}
                  shape="circle"
                  size="large"
                  style={{ backgroundColor: userId.avatar, color: '#000' }}
                />
              )
            })}
          {/* 大於五位，後續縮寫 */}
          {/* {boardMembersList.length > 5 && (
            <Avatar
              label={`+ ${boardMembersList.length - 5}`}
              shape="circle"
              size="large"
              className="bg-primary"
            />
          )} */}
        </AvatarGroup>
      ) : (
        <></>
      )}
    </>
  )
}
