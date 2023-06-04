import Head from 'next/head'
import { FC, useEffect, useRef } from 'react'
import { MenuBar } from '@/components/board'
import { useRouter } from 'next/router'
import { boardSliceActions } from '@/slices/boardSlice'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { GET_BOARD_BY_ID } from '@/apis/axios-service'
import { Toast } from 'primereact/toast'
import { AxiosError } from 'axios'

const Board: FC = () => {
  const router = useRouter()
  const token = useAppSelector(state => state.user.token) || ''
  const boardId = useAppSelector(state => state.board.boardId)

  const dispatch = useAppDispatch()

  const toastRef = useRef<Toast>(null)

  /** 取得單一看板資訊 */
  const handleGetSingleBoard = async () => {
    try {
      const result = await GET_BOARD_BY_ID(boardId)
      dispatch(boardSliceActions.setSingleBoard(result.data || {}))
    } catch (e) {
      let errorMessage = ''
      if (e instanceof AxiosError) {
        errorMessage = e.response?.data.message
      } else {
        errorMessage = '發生錯誤'
      }
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error Message',
        detail: errorMessage,
        life: 3000,
      })
    }
  }

  /** 取得 url query boardID */
  useEffect(() => {
    const boardId = router.query?.boardId as string
    dispatch(boardSliceActions.setBoardId(boardId))
    dispatch(socketServiceActions.initialBoardService({ boardId, token }))

    return () => {
      dispatch(boardSliceActions.reset())
      dispatch(socketServiceActions.terminateBoardService())
    }
  }, [router.isReady])

  /** 看板初始化
   * B03-5 取得單一看板 */
  useEffect(() => {
    if (!boardId) return
    handleGetSingleBoard()
  }, [boardId])

  return (
    <>
      <Head>
        <title>Horae - 看板</title>
      </Head>
      <div className="flex flex-col h-full py-[50px] px-[64px]">
        <div className="mb-6">
          <MenuBar />
        </div>
        <Toast ref={toastRef} position="bottom-left" />
      </div>
    </>
  )
}

export default Board
