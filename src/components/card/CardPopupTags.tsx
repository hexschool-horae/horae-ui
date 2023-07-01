import router from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import style from './tags.module.scss'

import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { Chip } from 'primereact/chip'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'

import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'
import { IInitialState } from '@/contexts/reducers/cardDetailReducer'
import { ITag } from '@/apis/interface/api'
import { GET_BOARD_TAGS_BY_ID } from '@/apis/axios-service'

interface ICardPopupTagsProps {
  page: string
  state?: IInitialState
  dispatch?: React.Dispatch<any>
}

type TStep = 'list' | 'create' | 'edit'

const tagColorList = ['#ffe4e2', '#ffe1d6', '#fff1bc', '#D8F9C7', '#e8f1fc', '#f2e8fc', '#fce8f7', '#eaeaea', '#f7f7f7']

export default function CardPopupTags({ page, dispatch }: ICardPopupTagsProps) {
  const appDispatch = useAppDispatch()
  const socketBoardTags = useAppSelector(state => state.board.boardTags)
  const socketCardTags = useAppSelector(state => state.board.cardDetail?.tags) || []

  const [currentStep, setCurrentStep] = useState<TStep>('list')
  const [tagList, setTagList] = useState<ITag[]>([])
  const [search, setSearch] = useState('')

  const [tagColor, setTagColor] = useState(tagColorList[0])
  const [tagTitle, setTagTitle] = useState('')
  const [editTagId, setEditTagId] = useState('')

  const boardId = router.query.boardId as string
  const cardId = router.query.cardId as string

  const getTags = async () => {
    try {
      const response = await GET_BOARD_TAGS_BY_ID(boardId)
      if (response == undefined) return
      setTagList(response.data)
    } catch (error) {
      console.error('Error fetching tags data:', error)
    }
  }

  useEffect(() => {
    getTags()
  }, [])

  useEffect(() => {
    setTagList(socketBoardTags)
  }, [socketBoardTags])

  const isActiveTag = (tag: string) => {
    if (page !== 'card' || cardId == undefined) return true
    return socketCardTags.some(cardTag => cardTag._id === tag)
  }

  const filteredTags = useMemo(() => {
    return tagList.filter(tag => {
      return tag.title.toLowerCase().includes(search.toLocaleLowerCase())
    })
  }, [tagList, search])

  const goList = () => {
    setTimeout(function () {
      //TieredMenu不用setTimeout會消失
      setCurrentStep('list')
    }, 100)
  }

  const creatTag = () => {
    appDispatch(
      socketServiceActions.createNewBoardTag({
        boardId,
        title: tagTitle,
        color: tagColor,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CREATE_NEW_TAG_RESULT))
    goList()
  }

  const goCreateTag = () => {
    setTagColor(tagColorList[0])
    setTagTitle('')
    setEditTagId('')
    setCurrentStep('create')
  }

  const EditTag = () => {
    appDispatch(
      socketServiceActions.modifyBoardTag({
        boardId,
        title: tagTitle,
        color: tagColor,
        tagId: editTagId,
      })
    )

    if (page === 'card' && dispatch !== undefined) {
      dispatch({
        type: 'EDIT_TAG',
        payload: {
          tag: {
            _id: editTagId,
            title: tagTitle,
            color: tagColor,
          },
        },
      })
    }
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TAG_RESULT))
    goList()
  }

  const goEditTag = (tag: ITag) => {
    setTagColor(tag.color)
    setTagTitle(tag.title)
    setEditTagId(tag._id)
    setTimeout(function () {
      //TieredMenu不用setTimeout會消失
      setCurrentStep('edit')
    }, 100)
  }

  const deleteTag = () => {
    appDispatch(
      socketServiceActions.deleteBoardTag({
        boardId,
        tagId: editTagId,
      })
    )
    deleteTagFromCard(editTagId)
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_DELETE_TAG_RESULT))
    goList()
  }

  const toggleTag = (tag: ITag) => {
    if (page !== 'card' || dispatch == undefined) return

    if (isActiveTag(tag._id)) {
      deleteTagFromCard(tag._id)
    } else {
      addTagToCard(tag)
    }
  }

  const addTagToCard = (tag: ITag) => {
    if (page !== 'card' || dispatch == undefined) return
    appDispatch(
      socketServiceActions.attachTagToCard({
        boardId,
        cardId,
        tagId: tag._id,
      })
    )
    dispatch({
      type: 'ADD_TAG',
      payload: { tag },
    })
  }

  const deleteTagFromCard = (tagId: string) => {
    if (page !== 'card' || dispatch == undefined) return
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

  return (
    <>
      {currentStep === 'list' ? (
        <>
          <InputText placeholder="搜尋標籤" className="w-full my-2" onChange={e => setSearch(e.target.value)} />
          <Divider />
          <div className="text-xs mb-2 ">標籤</div>
          <ul className="flex flex-wrap gap-2">
            {filteredTags.map(tag => (
              <li key={tag._id} className="relative">
                <Chip
                  label={tag.title}
                  className={`cursor-pointer pr-[38px] ${style.tag} ${
                    isActiveTag(tag._id) ? style.tag_active : 'border-gray-400 text-gray-500'
                  }`}
                  style={isActiveTag(tag._id) ? { backgroundColor: tag.color } : { backgroundColor: 'white' }}
                  onClick={() => toggleTag(tag)}
                />

                <Button
                  icon="pi pi-pencil"
                  rounded
                  aria-label="edit"
                  className="absolute right-0 w-[33px] h-[33px] bg-secondary-3"
                  onClick={() => goEditTag(tag)}
                />
              </li>
            ))}
          </ul>
          {page === 'card' ? (
            <Button label="建立新標籤" severity="secondary" rounded className="w-full mt-5" onClick={goCreateTag} />
          ) : (
            <div
              className="w-full bg-secondary-4 text-secondary-3 flex items-center mt-5 px-3 py-2 rounded-s cursor-pointer"
              onClick={goCreateTag}
            >
              新增建立標籤
              <span className="ml-auto">+</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="h-[120px] mb-5 ">
            <div className="flex justify-center items-center h-[136px] -translate-y-[20px] bg-gray-100 absolute left-0 right-0">
              <Chip
                label={tagTitle}
                className={`drop-shadow-md text-secondary-3 ${style.tag}`}
                style={{ backgroundColor: tagColor }}
              />
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
          {page === 'card' ? (
            <>
              <div className="flex gap-2">
                {currentStep === 'edit' && (
                  <Button
                    label="刪除"
                    severity="secondary"
                    rounded
                    outlined
                    className="w-full mt-4"
                    onClick={deleteTag}
                  />
                )}
                <Button
                  label={`${currentStep === 'create' ? '建立' : '儲存'}`}
                  severity="secondary"
                  rounded
                  className="w-full mt-4"
                  disabled={tagTitle == ''}
                  onClick={() => (currentStep === 'create' ? creatTag() : EditTag())}
                />
              </div>

              <Button
                label="返回"
                severity="secondary"
                rounded
                outlined
                className="w-full mt-3"
                onClick={() => setCurrentStep('list')}
              />
            </>
          ) : (
            <>
              <div className="flex gap-2">
                {currentStep === 'edit' && (
                  <div
                    className="w-full bg-secondary-4 text-secondary-3 flex items-center mt-5 px-3 py-2 rounded-s cursor-pointer"
                    onClick={deleteTag}
                  >
                    刪除
                    <span className="ml-auto">-</span>
                  </div>
                )}

                <div
                  className={`w-full  text-secondary-3 flex items-center mt-5 px-3 py-2 rounded-s 
                    ${tagTitle != '' ? 'bg-secondary-4 cursor-pointer ' : 'bg-secondary-2'}
                  `}
                  onClick={() => tagTitle != '' && (currentStep === 'create' ? creatTag() : EditTag())}
                >
                  {currentStep === 'create' ? '建立' : '儲存'}
                  <span className="ml-auto">+</span>
                </div>
              </div>

              <div
                className="w-full bg-secondary-4 text-secondary-3 flex items-center mt-3 px-3 py-2 rounded-s cursor-pointer"
                onClick={() => {
                  setTimeout(function () {
                    setCurrentStep('list')
                  }, 100)
                }}
              >
                返回標籤列表
                <span className="ml-auto">←</span>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}
