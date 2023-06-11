import router from 'next/router'
import style from './cardDetail.module.scss'
import tagStyle from './tags.module.scss'
import { Chip } from 'primereact/chip'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { DELETE_CARD_TAG_BY_ID } from '@/apis/axios-service'

interface ICardDetailTagsProps {
  label: string
}

export default function CardDetailTags({ label }: ICardDetailTagsProps) {
  const { state, dispatch } = useCardDetail()
  const cardId = router.query.cardId as string
  // console.log('tag', state)

  const handleRemove = async (tagId: string) => {
    try {
      const data = {
        tagId: tagId,
      }
      const response = await DELETE_CARD_TAG_BY_ID(cardId, data)
      if (response == undefined) return

      dispatch({
        type: 'REMOVE_TAG',
        payload: {
          tagId: tagId,
        },
      })
    } catch (error) {
      console.log('Error delete tag:', error)
    }
  }

  return (
    <div className={`${style.detail_list}`}>
      <div>標籤</div>
      <Button
        icon="pi pi-plus"
        rounded
        aria-label="add"
        className={`${style.detail_list_add_btn}`}
        onClick={() => {
          dispatch({
            type: 'TOTGGLE_POPUP',
            payload: label,
          })
        }}
      />
      <ul className="flex items-center gap-2">
        {state.cardDetail.tags.map(tag => (
          <li key={tag._id}>
            <Chip
              label={tag.title}
              className={`cursor-pointer ${tagStyle.tag} ${tagStyle.tag_active}`}
              style={{ backgroundColor: tag.color }}
              removeIcon="pi pi-times"
              removable
              onRemove={() => handleRemove(tag._id)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
