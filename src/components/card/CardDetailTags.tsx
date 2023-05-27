import style from './cardDetail.module.scss'
import tagStyle from './tags.module.scss'
import { Chip } from 'primereact/chip'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardDetailTagsProps {
  label: string
}

export default function CardDetailTags({ label }: ICardDetailTagsProps) {
  const { state, dispatch } = useCardDetail()
  // console.log('tag', state)

  const handleRemove = (tagId: string) => {
    dispatch({
      type: 'REMOVE_TAG',
      payload: {
        tagId: tagId,
      },
    })
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
      <ul className="flex items-center gap-2">
        {state.cardDetail.tags.map(tag => (
          <li key={tag.id}>
            <Chip
              label={tag.title}
              className={`cursor-pointer ${tagStyle.tag} ${tagStyle.tag_active}`}
              style={{ backgroundColor: tag.color }}
              removeIcon="pi pi-times"
              removable
              onRemove={() => handleRemove(tag.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
