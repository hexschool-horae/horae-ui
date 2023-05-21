import style from './cardDetail.module.scss'
import { Chip } from 'primereact/chip'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardDetailTagsProps {
  label: string
}

export default function CardDetailTags({ label }: ICardDetailTagsProps) {
  const { dispatch } = useCardDetail()

  const handleRemove = () => {
    console.log('remove tag')
  }

  return (
    <div className={`${style.detail_list}`}>
      <div>標籤</div>
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
          <Chip label="標籤" removable onRemove={handleRemove} />
        </li>
      </ul>
    </div>
  )
}
