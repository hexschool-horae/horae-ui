import MdEditor, { Plugins } from 'react-markdown-editor-lite'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import 'react-markdown-editor-lite/lib/index.css'

import style from './cardDetail.module.scss'
import { useEffect } from 'react'

export interface IEditorChangeProps {
  // html: string
  text: string
}

interface IEditorWrapperProps {
  editorRef: any
  isEdit: boolean
  description: string
  handleEditorChange: (text: IEditorChangeProps) => void
}

MdEditor.unuse(Plugins.Image)
MdEditor.unuse(Plugins.FontUnderline)

export default function EditorWrapper({ editorRef, isEdit, description, handleEditorChange }: IEditorWrapperProps) {
  useEffect(() => {
    if (!editorRef.current) return

    if (isEdit) {
      editorRef.current.setView({
        md: true,
        menu: true,
      })
    } else {
      editorRef.current.setView({
        md: false,
        menu: false,
      })
    }
  }, [isEdit])

  return (
    <MdEditor
      ref={editorRef}
      className="rounded-md"
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
  )
}
