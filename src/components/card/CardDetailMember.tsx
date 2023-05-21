import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardDetailMemberProps {
  label: string
}

export default function CardDetailMember({ label }: ICardDetailMemberProps) {
  const { dispatch } = useCardDetail()

  return (
    <div className={`${style.detail_list}`}>
      <div>成員</div>
      <Button
        icon="pi pi-plus"
        rounded
        aria-label="add"
        className="mx-3 !w-[30px] !h-[30px]"
        onClick={() => {
          dispatch({
            type: 'TOTGGLE_POPUP',
            payload: label,
          })
        }}
      />
      <ul>
        <li className="flex items-center">
          <div className="w-[42px] h-[42px] rounded-full bg-black"></div>
          <div className="mx-3">Yuyay</div>
          <Button icon="pi pi-times" rounded outlined aria-label="remove" className="!w-[30px] !h-[30px]" />
        </li>
      </ul>
    </div>
  )
}
