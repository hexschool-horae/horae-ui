import { InputText } from 'primereact/inputtext'
import CardPopupWrapper from './CardPopupWrapper'

interface ICardPopupMemberProps {
  isOpen: boolean
  setIsOpen: (toggle: boolean) => void
}

export default function CardPopupMember({ isOpen, setIsOpen }: ICardPopupMemberProps) {
  const handleOnClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <>
      <CardPopupWrapper title="成員" onClose={handleOnClose}>
        <InputText
          placeholder="搜尋成員"
          className="
                        w-full
                        my-2
                        mr-10
                    "
        />
      </CardPopupWrapper>
    </>
  )
}
