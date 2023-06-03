import { useState, useRef, useEffect } from 'react'
import { InputText } from 'primereact/inputtext'
import { useAppSelector } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { useAppDispatch } from '@/hooks/useAppStore'

export default function BoardTitle() {
  const boardTitle = useAppSelector(state => state.board?.singleBaord?.title) || ''
  const boardId = useAppSelector(state => state.board?.boardId)
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
        {isEdit ? (
          <InputText ref={inputRef} value={localBoardTitle} onChange={e => setLocalBoardTitle(e.target.value)} />
        ) : (
          <h4 className="text-2xl">{boardTitle}</h4>
        )}
      </div>
    </>
  )
}
