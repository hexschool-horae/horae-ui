import { ReactNode } from 'react'
import { Dialog } from 'primereact/dialog'
import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardPopupWrapperProps {
  title: string
  label: string
  children: ReactNode
}

export default function CardPopupWrapper({ title, label, children }: ICardPopupWrapperProps) {
  const { state, dispatch } = useCardDetail()

  const onClose = () => {
    dispatch({
      type: 'TOTGGLE_POPUP',
      payload: label,
    })
  }

  return (
    <Dialog header={title} modal={false} visible={state.popups[label]} style={{ width: '50vw' }} onHide={onClose}>
      {children}
    </Dialog>
  )
}
