import { InputText } from 'primereact/inputtext'
import CardPopupWrapper from './CardPopupWrapper'

interface ICardPopupMemberProps {
  label: string
}

export default function CardPopupMember({ label }: ICardPopupMemberProps) {
  return (
    <CardPopupWrapper title="成員" label={label}>
      <InputText placeholder="搜尋成員" className="w-full my-2" />
    </CardPopupWrapper>
  )
}
