import { useState, useRef, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { useAppSelector } from '@/hooks/useAppStore'
import { useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'

export default function BoardTitle() {
  const boardTitle = useAppSelector(state => state.board?.singleBaord?.title) || ''
  const boardId = useAppSelector(state => state.board?.boardId)
  const token = useAppSelector(state => state.user.token)
  const dispatch = useAppDispatch()
  const [isEdit, setIsEdit] = useState(false)
  const [localBoardTitle, setLocalBoardTitle] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setLocalBoardTitle(boardTitle)
  }, [])

  useEffect(() => {
    setLocalBoardTitle(boardTitle)
  }, [boardTitle])

  useEffect(() => {
    if (isEdit) {
      if (inputRef) {
        inputRef.current?.focus()
      }
    } else {
      if (localBoardTitle !== boardTitle) {
        dispatch(
          socketServiceActions.modifyBoardTitle({
            boardId,
            title: localBoardTitle,
          })
        )
        dispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_MODIFY_TITLE_RESULT))
      }
    }
  }, [isEdit])
  return (
    <>
      <div
        onClick={() => {
          setIsEdit(true)
        }}
        onBlur={() => setIsEdit(false)}
      >
        {isEdit && token ? (
          <InputText ref={inputRef} value={localBoardTitle} onChange={e => setLocalBoardTitle(e.target.value)} />
        ) : (
          <h4 className="text-2xl">{boardTitle}</h4>
        )}
      </div>
    </>
  )
}
