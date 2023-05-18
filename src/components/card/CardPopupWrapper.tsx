import { ReactNode } from 'react'

interface ICardPopupWrapperProps {
  title: string
  children: ReactNode
  onClose?: () => void
}

export default function CardPopupWrapper({ title, children, onClose }: ICardPopupWrapperProps) {
  return (
    <div
      className="
            absolute
            left-1/2 
            -translate-x-2/4
            z-50 
            min-w-[260px]
            bg-white
            drop-shadow-md
            rounded-md
            px-3
        "
    >
      <div className="flex items-center py-2">
        <h4 className="grow text-center">{title}</h4>
        <button onClick={onClose}>
          <i className="pi pi-times"></i>
        </button>
      </div>

      <div className="py-4">{children}</div>
    </div>
  )
}
