// import dynamic from "next/dynamic";
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
// import MdEditor, { Plugins } from 'react-markdown-editor-lite';
import MdEditor, { Plugins } from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import { useEffect, useRef, useState } from 'react'
import { useCardDetail } from '@/contexts/cardDetailContext'
import React from 'react'

// const MdEditor = dynamic(
//   /* @ts-ignore */
//   () => {
//     return new Promise((resolve) => {
//       import("react-markdown-editor-lite").then((res) => {
//         const Editor = res.default;
//         Editor.addLocale("zh-TW", {
//           btnHeader: "標頭",
//           btnClear: "清除",
//           btnBold: "粗體"
//         });
//         Editor.useLocale("zh-TW");
//         Editor.unuse(Plugins.Image);
//         resolve(Editor);
//       });
//     });
// },
// {
//   ssr: false
// });

export default function CardDetailDescribe() {
  const editor = useRef(null)
  const { state, dispatch } = useCardDetail()
  const [description, setDescription] = useState('')

  MdEditor.unuse(Plugins.Image)
  // eslint-disable-next-line
  const dispatchDescribe = () => {
    dispatch({
      type: 'SAVE_DESCRIPTION',
      payload: {
        describe: description,
      },
    })
  }

  useEffect(() => {
    setDescription(state.cardDetail.describe)
  }, [state.cardDetail.describe])

  return (
    <MdEditor
      ref={editor}
      style={{ height: '240px' }}
      placeholder="輸入描述..."
      view={{ menu: true, html: true, md: true }}
      // eslint-disable-next-line
      renderHTML={(text: string) => <ReactMarkdown children={text} remarkPlugins={[remarkGfm]} />}
    />
  )
}
