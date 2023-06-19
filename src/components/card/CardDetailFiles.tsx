import { Fragment, useState } from 'react'
import IconDelete from '@/assets/icons/icon_delete_circle.svg'
import filesStyle from './files.module.scss'
import Image from 'next/image'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { Button } from 'primereact/button'
import { IAttachment } from '@/apis/interface/api'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'

interface ICardDetailFileProps {
  cardId: string
}

export default function CardDetailFiles({ cardId }: ICardDetailFileProps) {
  const { dispatch } = useCardDetail()
  const appDispatch = useAppDispatch()
  const socketFileList = useAppSelector(state => state.board.cardDetail?.attachments)
  const selectedFileList: IAttachment[] = socketFileList as IAttachment[]
  const [fileList] = useState<IAttachment[]>(selectedFileList ?? [])
  const [showFileConfirmation, setShowFileConfirmation] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState({ message: '' })
  const [fileId, setFileId] = useState('')
  const boardId = useAppSelector(state => state.board.boardId)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const selectedFiles = fileList
    console.log(selectedFiles)
  }

  const handleRemoveFile = (index: number, fileId: string) => {
    // setFileList(prevFileList => {
    //   const updatedFileList = [...prevFileList]
    //   updatedFileList.splice(index, 1) // 從陣列中移除指定索引的檔案
    //   return updatedFileList
    // })

    setShowFileConfirmation(true)
    setConfirmConfig({ message: '確定要刪除此附件嗎?' })
    setFileId(fileId)
  }
  function formatDate(dateString: string) {
    if (dateString == undefined) return 'YYYY/MM/DD HH:mm'
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes}`
  }

  /**
   * B05-23 卡片中附件刪除
   * */
  const handleDeleteCardFile = async () => {
    appDispatch(
      socketServiceActions.deleteCardAttachment({
        boardId,
        cardId,
        fileId: fileId,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_DELETE_ATTACHMENT_RESULT))
  }

  const accept = () => {
    handleDeleteCardFile()
    setShowFileConfirmation(false) // 隱藏確認對話框
  }

  const reject = () => {
    setShowFileConfirmation(false) // 隱藏確認對話框
  }

  return (
    <>
      {/* 確認對話框 */}
      <ConfirmDialog
        visible={showFileConfirmation}
        message={confirmConfig.message}
        header="訊息"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
        acceptLabel="確定"
        rejectLabel="取消"
      />
      <form onSubmit={onSubmit} className="mb-8 relative">
        <h5>附件</h5>
        {selectedFileList
          ? selectedFileList.map((file, index) => (
              <Fragment key={index}>
                <div className={filesStyle.file_card}>
                  <div className="flex w-full">
                    <Image src={file.fileUrl} alt="home-pomodoro" width={180} height={120} />

                    <div className="file-name flex flex-col justify-center w-[60%] p-4">
                      <span className="text-secondary-3 text-lg">{file.fileName}</span>
                      <span className="text-sm">{formatDate(file.createdAt)}</span>
                    </div>
                    <IconDelete onClick={() => handleRemoveFile(index, file._id)} />
                  </div>
                </div>
              </Fragment>
            ))
          : null}
        <div className="text-center">
          <Button
            icon="pi pi-plus"
            iconPos="right"
            text
            label="增加附件"
            className="text-secondary-3 hover:text-secondary-1 hover: bg-white"
            onClick={() => {
              dispatch({
                type: 'TOTGGLE_POPUP',
                payload: 'filesPopup',
              })
            }}
          />
        </div>
      </form>
    </>
  )
}
