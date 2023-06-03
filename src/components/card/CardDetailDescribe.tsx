import dynamic from 'next/dynamic'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { Plugins } from 'react-markdown-editor-lite'
// import MdEditor, { Plugins } from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { useEffect, useState } from 'react'
import { useCardDetail } from '@/contexts/cardDetailContext'
import React from 'react'

/* eslint-disable */
const MdEditor = dynamic(
  /* @ts-ignore */
  () => {
    return new Promise(resolve => {
      import('react-markdown-editor-lite').then(res => {
        const Editor = res.default
        Editor.addLocale('zh-TW', {
          btnHeader: '標頭',
          btnClear: '清除',
          btnBold: '粗體',
        })
        Editor.useLocale('zh-TW')
        Editor.unuse(Plugins.Image)
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

  // MdEditor.unuse(Plugins.Image)
  // eslint-disable-next-line
  const dispatchDescribe = () => {
    dispatch({
      type: 'SAVE_DESCRIPTION',
      payload: {
        describe: description,
      },
    })
  }

  const handleClick = () => {
    // if (editor.current) {
    //   // alert(editor.current.getMdValue());
    // }
  }

  interface props {
    html: string
    text: string
  }

  const handleEditorChange = ({ html, text }: props) => {
    const newValue = text.replace(/\d/g, '')
    console.log(newValue)
    console.log(html)
    setDescription(newValue)
  }

  useEffect(() => {
    // setDescription(state.cardDetail.describe)
    setDescription('### ooo')
  }, [state.cardDetail.describe])

  return (
    <>
      <MdEditor
        value={description}
        style={{ height: '240px' }}
        placeholder="輸入描述..."
        view={{ menu: true, html: true, md: true }}
        onChange={handleEditorChange}
        // eslint-disable-next-line
        renderHTML={(text: string) => <ReactMarkdown children={text} remarkPlugins={[remarkGfm]} />}
      />
      <button onClick={handleClick}>Get value</button>
    </>
  )
}
