import router from 'next/router'
import dynamic from 'next/dynamic'

import { useEffect, useState, useRef } from 'react'
import style from './cardDetail.module.scss'
import { Button } from 'primereact/button'

import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { IEditorChangeProps } from './EditorWrapper'

/*
建議使用 client-side render 
但會無法調用editor提供的方法，元件傳入的第一個參數會出現型別錯誤
*/

// /* eslint-disable */
// const MdEditor = dynamic(
//   /* @ts-ignore */
//   () => {
//     return new Promise(resolve => {
//       import('react-markdown-editor-lite').then(res => {
//         const Editor = res.default

//         Editor.unuse(Plugins.Image)
//         Editor.unuse(Plugins.FontUnderline)
//         resolve(Editor)
//       })
//     })
//   },
//   {
//     ssr: false,
//   }
// )

const EditorWrapper = dynamic(() => import('./EditorWrapper'), { ssr: false })

export default function CardDetailDescribe() {
  const cardId = router.query.cardId as string
  const boardId = router.query.boardId as string

  const appDispatch = useAppDispatch()
  const token = useAppSelector(state => state.user.token) || ''
  const socketDescribe = useAppSelector(state => state.board.cardDetail?.describe)
  const cardDetail = useAppSelector(state => state.board.cardDetail)

  const editorRef = useRef<any>(null)
  const [description, setDescription] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  const handleUpdate = () => {
    if (cardDetail) {
      appDispatch(
        socketServiceActions.modifyCard({
          boardId,
          cardId,
          title: cardDetail.title,
          describe: description,
          startDate: cardDetail.startDate,
          endDate: cardDetail.endDate,
          proiority: cardDetail.proiority,
        })
      )
      setIsEdit(false)
    }
  }

  const handleCancel = () => {
    if (socketDescribe == undefined) return
    setDescription(socketDescribe)
    setIsEdit(false)
  }

  const handleEditorChange = ({ text }: IEditorChangeProps) => {
    setDescription(text)
  }

  useEffect(() => {
    if (socketDescribe == undefined) return
    setDescription(socketDescribe)
  }, [socketDescribe])

  console.log(editorRef?.current && editorRef.current.getView())

  return (
    <div className="my-5" onClick={() => token && !isEdit && setIsEdit(true)}>
      <h5 className="mb-[16px]">描述</h5>
      <div className="relative mb-2">
        <EditorWrapper
          editorRef={editorRef}
          isEdit={isEdit}
          description={description}
          handleEditorChange={handleEditorChange}
        />
        {!isEdit && <div className={`${style.editor_overlay}`}></div>}
      </div>
      {isEdit && (
        <div className="flex justify-end gap-2">
          <Button label="取消" severity="secondary" rounded outlined size="small" onClick={handleCancel} />
          <Button label="儲存" severity="secondary" rounded size="small" onClick={handleUpdate} />
        </div>
      )}
    </div>
  )
}
