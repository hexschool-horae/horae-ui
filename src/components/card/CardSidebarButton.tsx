import { Button } from 'primereact/button'

import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardSidebarButtonProps {
  name: string
  label: string
}

export default function CardSidebarButton({ name, label }: ICardSidebarButtonProps) {
  const { dispatch } = useCardDetail()

  return (
    <Button
      label={name}
      icon="pi pi-user"
      className="w-full"
      onClick={() => {
        dispatch({
          type: 'TOTGGLE_POPUP',
          payload: label,
        })
      }}
    />
  )
}
