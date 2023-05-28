import { useRouter } from 'next/router'
import { useEffect } from 'react'

import style from './card.module.scss'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'

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
import CardPopupWrapper from '@/components/card/CardPopupWrapper'
import { GET_CARD_BY_ID } from '@/apis/axios-service'

const popupLabels = {
  member: 'memberPopup',
  todoList: 'todoListPopup',
  tags: 'tagsPopup',
  calender: 'calenderPopup',
  files: 'filesPopup',
  move: 'movePopup',
  copy: 'copyPopup',
  share: 'sharePopup',
  priority: 'priorityPopup',
  pomodoro: 'pomodoroPopup',
}

export default function CardDetail() {
  return (
    <CardDetailProvider>
      <CardInternal />
    </CardDetailProvider>
  )
}

const CardInternal = () => {
  const { state, dispatch } = useCardDetail()
  const router = useRouter()
  const cardId = router.query.cardId as string

  // useEffect(() => {
  //   // 測試用
  //   const timer = setTimeout(() => {
  //     dispatch({
  //       type: 'INITIALIZE_CARD',
  //       payload: {
  //         cardDetail: {
  //           title: '測試卡片',
  //           describe: '卡片描述文字',
  //           tags: [
  //             {
  //               id: '001',
  //               title: '標籤001',
  //               color: '#ffe4e2',
  //             },
  //             {
  //               id: '003',
  //               title: 'Tag003',
  //               color: '#fce8f7',
  //             },
  //           ],
  //           comments: [{ content: '測試文字', date: '2023/10/20' }],
  //         },
  //       },
  //     })
  //   }, 500)

  //   return () => {
  //     clearTimeout(timer)
  //   }
  // }, [])

  const getCardDetail = async () => {
    try {
      const response = await GET_CARD_BY_ID(cardId)

      if (response === undefined) return

      dispatch({
        type: 'INITIALIZE_CARD',
        payload: {
          cardDetail: response.data,
        },
      })
    } catch (error) {
      console.error('Error fetching card data:', error)
    }
  }

  useEffect(() => {
    getCardDetail()
  }, [])

  const handleCloseCardDetail = () => {
    router.push(`/board/${router.query.boardId}`)
  }

  return (
    <>
      <Dialog visible={true} onHide={handleCloseCardDetail} className="w-full md:w-[800px] mx-3">
        {state.initialized ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              {/* main col */}
              <div className="md:col-span-5">
                <div className="text-[14px] mb-3">
                  在列表<span className="pl-1 text-secondary-3 cursor-pointer">測試列表</span>
                </div>

                <CardDetailTitle />
                <CardDetailMember label={popupLabels.member} />
                {state.cardDetail.tags.length > 0 && <CardDetailTags label={popupLabels.tags} />}
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
                  <CardSidebarButton name="日期" label={popupLabels.calender} />
                  <CardSidebarButton name="附件" label={popupLabels.files} />
                </div>

                <h6 className={`${style.sidebar_title} pt-8`}>動作</h6>
                <div
                  className="grid grid-cols-2 gap-4 
                  md:grid-cols-1 md:gap-2"
                >
                  <CardSidebarButton name="移動" label={popupLabels.move} />
                  <CardSidebarButton name="複製" label={popupLabels.copy} />
                  <CardSidebarButton name="分享" label={popupLabels.share} />
                  <CardSidebarButton name="優先權" label={popupLabels.priority} />
                  <CardSidebarButton name="番茄鐘" label={popupLabels.pomodoro} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-80">
            <ProgressSpinner />
          </div>
        )}
      </Dialog>

      <CardPopupMember label={popupLabels.member} key={popupLabels.member + state.popupKey} />
      <CardPopupTodoList label={popupLabels.todoList} key={popupLabels.todoList + state.popupKey} />
      {/* 與board共用 Wrapper放外層*/}
      <CardPopupWrapper title="標籤" label={popupLabels.tags}>
        <CardPopupTags page="card" key={popupLabels.tags + state.popupKey + 2} state={state} dispatch={dispatch} />
      </CardPopupWrapper>
    </>
  )
}