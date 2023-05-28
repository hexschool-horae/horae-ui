import { Button } from 'primereact/button'
import IconUsers from '@/assets/icons/icon_users.svg'
import IconList from '@/assets/icons/icon_list.svg'
import IconTag from '@/assets/icons/icon_tag.svg'
import IconCalender from '@/assets/icons/icon_calender.svg'
import IconFile from '@/assets/icons/icon_file.svg'
import IconMoveCursor from '@/assets/icons/icon_move_cursor.svg'
import IconCopy from '@/assets/icons/icon_copy.svg'
import IconShare from '@/assets/icons/icon_share.svg'
import IconPriority from '@/assets/icons/icon_priority.svg'
import IconClock from '@/assets/icons/icon_clock.svg'

import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardSidebarButtonProps {
  name: string
  label: string
}

export default function CardSidebarButton({ name, label }: ICardSidebarButtonProps) {
  const { state, dispatch } = useCardDetail()

  const getButtonIcon = () => {
    switch (label) {
      case 'memberPopup':
        return <IconUsers />
      case 'todoListPopup':
        return <IconList />
      case 'tagsPopup':
        return <IconTag />
      case 'calenderPopup':
        return <IconCalender />
      case 'filesPopup':
        return <IconFile />
      case 'movePopup':
        return <IconMoveCursor />
      case 'copyPopup':
        return <IconCopy />
      case 'sharePopup':
        return <IconShare />
      case 'priorityPopup':
        return <IconPriority />
      case 'pomodoroPopup':
        return <IconClock />
    }
  }

  return (
    <Button
      outlined
      className={`w-full border-secondary-2 text-secondary-3 hover:bg-secondary-4 ${
        state.popups[label] ? 'bg-secondary-4 border-secondary-3' : ''
      }`}
      onClick={() => {
        dispatch({
          type: 'TOTGGLE_POPUP',
          payload: label,
        })
      }}
    >
      {getButtonIcon()}
      <p className="pl-3">{name}</p>
    </Button>
  )
}
