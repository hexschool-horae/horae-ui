import { Button } from 'primereact/button'

import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardSidebarButtonProps {
  name: string
  label: string
}

export default function CardSidebarButton({ name, label }: ICardSidebarButtonProps) {
  const { state, dispatch } = useCardDetail()

  return (
    <Button
      label={name}
      icon="pi pi-user"
      outlined
      className={`w-full border-secondary-2 text-secondary-3 ${
        state.popups[label] ? 'bg-secondary-4 border-secondary-3' : ''
      }`}
      onClick={() => {
        dispatch({
          type: 'TOTGGLE_POPUP',
          payload: label,
        })
      }}
    />
  )
}
