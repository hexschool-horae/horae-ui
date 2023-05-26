import { useEffect, useMemo, useState } from 'react'
import style from './tags.module.scss'

import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Chip } from 'primereact/chip'

import { useCardDetail } from '@/contexts/cardDetailContext'
import { ITag } from '@/contexts/reducers/cardDetailReducer'
import CardPopupWrapper from './CardPopupWrapper'

interface ICardPopupTagsProps {
  label: string
}

type TStep = 'list' | 'create' | 'edit'

const tagColorList = ['#ffe4e2', '#ffe1d6', '#fff1bc', '#D8F9C7', '#e8f1fc', '#f2e8fc', '#fce8f7', '#eaeaea', '#f7f7f7']

const tagListDummy = [
  {
    id: '001',
    title: '標籤001',
    color: '#ffe4e2',
  },
  {
    id: '002',
    title: 'Tag002',
    color: '#fff1bc',
  },
  {
    id: '003',
    title: 'Tag003',
    color: '#fce8f7',
  },
  {
    id: '004',
    title: '',
    color: '#f7f7f7',
  },
]

export default function CardPopupTags({ label }: ICardPopupTagsProps) {
  const { state, dispatch } = useCardDetail()
  const [currentStep, setCurrentStep] = useState<TStep>('list')
  const [tagList, setTagList] = useState<ITag[]>([])
  const [search, setSearch] = useState('')

  const [tagColor, setTagColor] = useState(tagColorList[0])
  const [tagTitle, setTagTitle] = useState('')
  const [editTagId, setEditTagId] = useState('')

  const getTags = () => {
    //GET API B03-13 /board/:board-id/tags
    setTimeout(function () {
      setTagList(tagListDummy)
    }, 1000)
  }

  useEffect(() => {
    getTags()
  }, [])

  const isActiveTag = (tag: string) => {
    return state.cardDetail.tags.some(cardTag => cardTag.id === tag)
  }

  const filteredTags = useMemo(() => {
    return tagList.filter(tag => {
      return tag.title.toLowerCase().includes(search.toLocaleLowerCase())
    })
  }, [tagList, search])

  const creatTag = () => {
    // POST API /board/:board-id/tags
    const ID = new Date().getTime().toString()

    // Response
    dispatch({
      type: 'ADD_TAG',
      payload: {
        tag: {
          id: ID,
          title: tagTitle,
          color: tagColor,
        },
      },
    })
    setTagColor(tagColorList[0])
    setTagTitle('')

    setTagList([
      ...tagList,
      {
        id: ID,
        title: tagTitle,
        color: tagColor,
      },
    ])

    setCurrentStep('list')
  }

  const EditTag = () => {
    // PATCH API
    // Response
    dispatch({
      type: 'EDIT_TAG',
      payload: {
        tag: {
          id: editTagId,
          title: tagTitle,
          color: tagColor,
        },
      },
    })
    setTagColor(tagColorList[0])
    setTagTitle('')

    const tags = [...tagList]
    const i = tags.findIndex(tag => tag.id === editTagId)
    tags[i] = {
      id: editTagId,
      title: tagTitle,
      color: tagColor,
    }
    setTagList(tags)

    setCurrentStep('list')
  }

  const goEditTag = (tag: ITag) => {
    console.log(tag)
    setTagColor(tag.color)
    setTagTitle(tag.title)
    setEditTagId(tag.id)
    setCurrentStep('edit')
  }

  const goCreateTag = () => {
    setTagColor(tagColorList[0])
    setTagTitle('')
    setEditTagId('')
    setCurrentStep('create')
  }

  const toggleTag = (tag: ITag) => {
    if (isActiveTag(tag.id)) {
      dispatch({
        type: 'REMOVE_TAG',
        payload: {
          tagId: tag.id,
        },
      })
    } else {
      dispatch({
        type: 'ADD_TAG',
        payload: {
          tag: {
            id: tag.id,
            title: tag.title,
            color: tag.color,
          },
        },
      })
    }
  }

  return (
    <CardPopupWrapper title="標籤" label={label}>
      {currentStep === 'list' ? (
        <>
          <InputText placeholder="搜尋標籤" className="w-full my-2" onChange={e => setSearch(e.target.value)} />
          <Divider />
          <div className="text-xs mb-2">標籤</div>
          <ul className="flex flex-wrap gap-2">
            {filteredTags.map(tag => (
              <li key={tag.id} className="relative">
                <Chip
                  label={tag.title}
                  className={`cursor-pointer pr-[40px]  ${style.tag} ${
                    isActiveTag(tag.id) ? 'opacity-100 border-[1px] border-primary' : 'opacity-60'
                  }`}
                  style={{ backgroundColor: tag.color }}
                  onClick={() => toggleTag(tag)}
                />

                <Button
                  icon="pi pi-pencil"
                  rounded
                  aria-label="edit"
                  className="absolute right-0 w-[33px] h-[33px]"
                  onClick={() => goEditTag(tag)}
                />
              </li>
            ))}
          </ul>
          <Button label="建立新標籤" severity="secondary" rounded className="w-full mt-5" onClick={goCreateTag} />
        </>
      ) : (
        <>
          <div className="h-[120px] mb-5 ">
            <div className="flex justify-center items-center h-[120px] bg-gray-100 absolute left-0 right-0">
              <Chip label={tagTitle} className={`drop-shadow-md ${style.tag}`} style={{ backgroundColor: tagColor }} />
            </div>
          </div>
          <label htmlFor="todo-title">標題</label>
          <InputText
            placeholder="標籤標題"
            id="todo-title"
            aria-describedby="todo-title-help"
            className="w-full my-2"
            value={tagTitle}
            onChange={e => setTagTitle(e.target.value)}
          />
          <Divider />
          <div className="text-xs mb-2">顏色</div>
          <ul className="flex justify-center flex-wrap gap-3">
            {tagColorList.map(color => (
              <li
                key={color}
                className={`w-[42px] h-[42px] p-[3px] rounded-full ${style.tag_color_item}
                    ${tagColor === color ? style.selected_tag : ''}
                  `}
              >
                <label
                  className="inline-block w-full h-full rounded-full cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => setTagColor(color)}
                >
                  <input type="radio" name="tag-color" value={color} className="hidden" />
                </label>
              </li>
            ))}
          </ul>
          <Button
            label={`${currentStep === 'create' ? '建立' : '儲存'}`}
            severity="secondary"
            rounded
            className="w-full mt-4"
            onClick={() => (currentStep === 'create' ? creatTag() : EditTag())}
          />
          <Button
            label="返回"
            severity="secondary"
            rounded
            outlined
            className="w-full mt-3"
            onClick={() => setCurrentStep('list')}
          />
        </>
      )}
    </CardPopupWrapper>
  )
}
