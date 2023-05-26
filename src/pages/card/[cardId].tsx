import { useEffect } from 'react'

import style from './card.module.scss'
import { Dialog } from 'primereact/dialog'

import { CardDetailProvider, useCardDetail } from '@/contexts/cardDetailContext'
import CardSidebarButton from '@/components/card/CardSidebarButton'
import CardDetailTitle from '@/components/card/CardDetailTitle'
import CardDetailMember from '@/components/card/CardDetailMember'
import CardDetailTags from '@/components/card/CardDetailTags'
import CardDetailDescribe from '@/components/card/CardDetailDescribe'
import CardDetailTodoList from '@/components/card/CardDetailTodoList'
import CardDetailComments from '@/components/card/CardDetailComments'

import CardPopupMember from '@/components/card/CardPopupMember'
import CardPopupTodoList from '@/components/card/CardPopupTodoList'
import CardPopupTags from '@/components/card/CardPopupTags'

const popupLabels = {
  member: 'memberPopup',
  todoList: 'todoListPopup',
  tags: 'tagsPopup',
}

const CardInternal = () => {
  const { state, dispatch } = useCardDetail()

  useEffect(() => {
    // 測試用
    const timer = setTimeout(() => {
      dispatch({
        type: 'INITIALIZE_CARD',
        payload: {
          cardDetail: {
            title: '測試卡片',
            describe: '卡片描述文字',
            tags: [
              {
                id: '001',
                title: '標籤001',
                color: '#ffe4e2',
              },
              {
                id: '003',
                title: 'Tag003',
                color: '#fce8f7',
              },
            ],
            comments: [{ content: '測試文字', date: '2023/10/20' }],
          },
        },
      })
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <Dialog
        visible={true}
        onHide={() => {
          console.log('hide')
        }}
        className="w-full md:w-[800px] mx-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          {/* main col */}
          <div className="md:col-span-5">
            <div className="text-[14px] mb-3">
              在列表<span className="pl-1 text-primary cursor-pointer">測試列表</span>
            </div>

            <CardDetailTitle />
            <CardDetailMember label={popupLabels.member} />
            <CardDetailTags label={popupLabels.tags} />
            <CardDetailDescribe />
            <CardDetailTodoList />
            <CardDetailComments />
          </div>

          {/* sidebar */}
          <div className="md:col-span-2">
            <h6 className={`${style.sidebar_title}`}>新增至卡片</h6>
            <div
              className="grid grid-cols-2 gap-4 
                md:grid-cols-1 md:gap-2"
            >
              <CardSidebarButton name="成員" label={popupLabels.member} />
              <CardSidebarButton name="代辦清單" label={popupLabels.todoList} />
              <CardSidebarButton name="標籤" label={popupLabels.tags} />
            </div>

            <h6 className={`${style.sidebar_title} pt-8`}>動作</h6>
          </div>
        </div>
      </Dialog>

      <CardPopupMember label={popupLabels.member} key={popupLabels.member + state.popupKey} />
      <CardPopupTodoList label={popupLabels.todoList} key={popupLabels.todoList + state.popupKey} />
      <CardPopupTags label={popupLabels.tags} key={popupLabels.tags + state.popupKey + 2} />
    </>
  )
}

export default function Card() {
  return (
    <CardDetailProvider>
      <CardInternal />
    </CardDetailProvider>
  )
}
