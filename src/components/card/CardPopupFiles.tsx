import { Button } from 'primereact/button'
import CardPopupWrapper from './CardPopupWrapper'
import cardPopupsStyle from './cardPopups.module.scss'
import { Fragment, useRef, useState } from 'react'
import IconDelete from '@/assets/icons/icon_delete_circle.svg'
import { UploadFileType } from '@/apis/enum/api'
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore'
import { socketServiceActions } from '@/slices/socketServiceSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'
import { useCardDetail } from '@/contexts/cardDetailContext'

interface ICardPopupPriorityProps {
  label: string
  cardId: string
}

export default function CardPopupFiles({ label, cardId }: ICardPopupPriorityProps) {
  const boardId = useAppSelector(state => state.board.boardId)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileList, setFileList] = useState<File[]>([])
  const appDispatch = useAppDispatch()
  const { dispatch } = useCardDetail()

  const handleFileChange = () => {
    const selectedFile = fileInputRef.current?.files
    if (!selectedFile || selectedFile.length === 0) return
    setFileList(Array.from(selectedFile)) // 將 FileList 轉換為陣列
  }

  const handleRemoveFile = (index: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setFileList(prevFileList => {
      const updatedFileList = [...prevFileList]
      updatedFileList.splice(index, 1) // 從陣列中移除指定索引的檔案
      return updatedFileList
    })
  }

  /**
   * B05-22 卡片中附件上傳
   * */
  const handleUploadCardFile = async (fileList: File[]) => {
    const formData = new FormData()
    formData.append(UploadFileType.FILE, fileList[0])

    appDispatch(
      socketServiceActions.addCardAttachment({
        boardId,
        cardId,
        file: fileList[0],
        fileName: fileList[0].name,
      })
    )
    appDispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_CARD_UPLOAD_ATTACHMENT_RESULT))
    dispatch({
      type: 'TOTGGLE_POPUP',
      payload: label,
    })
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const selectedFiles = fileList
    handleUploadCardFile(selectedFiles)
  }

  return (
    <CardPopupWrapper title="附件檔案" label={label}>
      <div className="mt-1">
        <form className="real-file" onSubmit={onSubmit}>
          <label className={`${cardPopupsStyle.fake_file}`}>
            選擇本機檔案路徑
            <input ref={fileInputRef} className="attach-file" type="file" name="file" onChange={handleFileChange} />
          </label>
          <div className="file-name-box mb-6">
            {fileList
              ? fileList.map((file, index) => (
                  <Fragment key={index}>
                    <div className="file-name mb-2 flex items-center justify-between">
                      <span>{file?.name}</span>
                      <IconDelete onClick={() => handleRemoveFile(index)} />
                    </div>
                  </Fragment>
                ))
              : null}
          </div>
          <Button
            disabled={fileList.length === 0}
            className="w-full"
            type="submit"
            label="附加"
            severity="secondary"
            rounded
          ></Button>
        </form>
      </div>
    </CardPopupWrapper>
  )
}
