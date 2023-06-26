import style from './cardPopups.module.scss'
import { ReactNode } from 'react'
import { Dialog } from 'primereact/dialog'
import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardPopupWrapperProps {
  title: string
  label: string
  wh?: string
  maximizable?: boolean
  children: ReactNode
}

export default function CardPopupWrapper({
  title,
  label,
  wh = '560px',
  maximizable = false,
  children,
}: ICardPopupWrapperProps) {
  const { state, dispatch } = useCardDetail()

  const onClose = () => {
    dispatch({
      type: 'TOTGGLE_POPUP',
      payload: label,
    })
    dispatch({
      type: 'MAXIMIZE_POPUP',
      payload: false,
    })
  }

  return (
    <Dialog
      header={title}
      modal={false}
      visible={state.popups[label]}
      style={{ width: wh }}
      onHide={onClose}
      contentClassName={style.popup_wrapper_content}
      headerClassName={style.popup_wrapper_header}
      maximizable={maximizable}
      maximized={state.maximize}
      onMaximize={() => {
        dispatch({
          type: 'MAXIMIZE_POPUP',
          payload: !state.maximize,
        })
      }}
    >
      {children}
    </Dialog>
  )
}
