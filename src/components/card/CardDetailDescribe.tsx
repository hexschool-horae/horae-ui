import router from 'next/router'
import dynamic from 'next/dynamic'

import { Plugins } from 'react-markdown-editor-lite'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import 'react-markdown-editor-lite/lib/index.css'

import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { useCardDetail } from '@/contexts/cardDetailContext'
import style from './cardDetail.module.scss'
import { PATCH_CARD_BASIC_INFO_BY_ID } from '@/apis/axios-service'

/*
建議使用 client-side render 
但會無法調用editor提供的方法，元件傳入的第一個參數會出現型別錯誤
*/

/* eslint-disable */
const MdEditor = dynamic(
  /* @ts-ignore */
  () => {
    return new Promise(resolve => {
      import('react-markdown-editor-lite').then(res => {
        const Editor = res.default

        Editor.unuse(Plugins.Image)
        Editor.unuse(Plugins.FontUnderline)
        resolve(Editor)
      })
    })
  },
  {
    ssr: false,
  }
)

export default function CardDetailDescribe() {
  const { state, dispatch } = useCardDetail()
  const [description, setDescription] = useState('')
  const [isEdit, setIsEdit] = useState(false)

  const cardId = router.query.cardId as string

  const handleUpdate = async () => {
    try {
      const data = {
        title: state.cardDetail.title,
        describe: description,
        startDate: state.cardDetail.startDate,
        endDate: state.cardDetail.endDate,
        proiority: state.cardDetail.proiority,
      }

      const response = await PATCH_CARD_BASIC_INFO_BY_ID(cardId, data)

      if (response == undefined) return
      dispatchDescribe()
      setIsEdit(false)
    } catch (error) {
      console.log('Error update card basic info:', error)
    }
  }

  const dispatchDescribe = () => {
    dispatch({
      type: 'UPDATE_DESCRIBE',
      payload: {
        describe: description,
      },
    })
  }

  const handleCancel = () => {
    setDescription(state.cardDetail.describe)
    setIsEdit(false)
  }

  interface IEditorChangeProps {
    // html: string
    text: string
  }

  const handleEditorChange = ({ text }: IEditorChangeProps) => {
    setDescription(text)
  }

  useEffect(() => {
    setDescription(state.cardDetail.describe)
  }, [state.cardDetail.describe])

  return (
    <div className="my-5" onClick={() => !isEdit && setIsEdit(true)}>
      <div className="relative mb-2">
        <MdEditor
          /* @ts-ignore */
          htmlClass={`${style.editor_preview} custom-html-style`}
          value={description}
          style={{ height: '240px' }}
          placeholder="輸入描述..."
          onChange={handleEditorChange}
          /* eslint-disable */
          renderHTML={(text: string) => (
            <ReactMarkdown
              children={text}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      style={docco}
                      language={match[1]}
                      PreTag="div"
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                },
              }}
            />
          )}
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
