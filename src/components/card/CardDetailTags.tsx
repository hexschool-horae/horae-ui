import router from 'next/router'
import { useEffect, useState } from 'react'
import style from './cardDetail.module.scss'
import tagStyle from './tags.module.scss'
import { Chip } from 'primereact/chip'
import { Button } from 'primereact/button'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { ITag } from '@/apis/interface/api'

interface ICardDetailTagsProps {
  label: string
}

export default function CardDetailTags({ label }: ICardDetailTagsProps) {
  const boardId = router.query.boardId as string
  const cardId = router.query.cardId as string

  const { state, dispatch } = useCardDetail()
  const appDispatch = useAppDispatch()
  const socketTags = useAppSelector(state => state.board.cardDetail?.tags)

  const [tags, setTags] = useState<ITag[]>([])

  const handleRemove = (tagId: string) => {
    appDispatch(
      socketServiceActions.removeTagFromCard({
        boardId,
        cardId,
        tagId,
      })
    )
    dispatch({
      type: 'REMOVE_TAG',
      payload: {
        tagId: tagId,
      },
    })
  }

  // const handleRemove = async (tagId: string) => {
  //   try {
  //     const data = {
  //       tagId: tagId,
  //     }
  //     const response = await DELETE_CARD_TAG_BY_ID(cardId, data)
  //     if (response == undefined) return

  //     dispatch({
  //       type: 'REMOVE_TAG',
  //       payload: {
  //         tagId: tagId,
  //       },
  //     })
  //   } catch (error) {
  //     console.log('Error delete tag:', error)
  //   }
  // }

  useEffect(() => {
    setTags(state.cardDetail.tags)
  }, [state.cardDetail.tags])

  useEffect(() => {
    if (socketTags == undefined) return
    setTags(socketTags)
  }, [socketTags])

  return (
    <>
      {tags.length > 0 && (
        <div className={`${style.detail_list}`}>
          <div className="min-w-[32px]">標籤</div>
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
          <ul className="flex items-center flex-wrap gap-2">
            {tags.map(tag => (
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
      )}
    </>
  )
}
