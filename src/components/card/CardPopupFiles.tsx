import { Button } from 'primereact/button'
import CardPopupWrapper from './CardPopupWrapper'
import cardPopupsStyle from './cardPopups.module.scss'
import { Fragment, useRef, useState } from 'react'
import IconDelete from '@/assets/icons/icon_delete_circle.svg'
import { Dto, IUploadFileRequest } from '@/apis/interface/api'
import { UploadFileType } from '@/apis/enum/api'
import { UPLOAD_CARD_FILE } from '@/apis/axios-service'
import { AxiosError } from 'axios'
import { useAppDispatch } from '@/hooks/useAppStore'
import { errorSliceActions } from '@/slices/errorSlice'
// import { socketServiceActions } from '@/slices/socketServiceSlice'

interface ICardPopupPriorityProps {
  label: string
  cardId: string
  handleGetCardDetail: () => void
}

export default function CardPopupFiles({ label, cardId, handleGetCardDetail }: ICardPopupPriorityProps) {
  // const boardId = useAppSelector(state => state.board.boardId)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileList, setFileList] = useState<File[]>([])
  const appDispatch = useAppDispatch()

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
    // appDispatch(
    //   socketServiceActions.uploadCardAttachment({
    //     boardId,
    //     cardId,
    //     file: fileList[0],
    //     // dto: UploadFileType.FILE
    //   })
    // )
    try {
      const dto: Dto = {
        type: UploadFileType.FILE,
      }
      const req: IUploadFileRequest = {
        fileData: fileList[0],
        dto,
      }
      console.log('req', req)
      const response = await UPLOAD_CARD_FILE(cardId, req)
      if (!response) return
      handleGetCardDetail()
    } catch (e) {
      let errorMessage = ''
      if (e instanceof AxiosError) {
        errorMessage = e.response?.data.message
      } else {
        errorMessage = '發生錯誤'
      }

      appDispatch(
        errorSliceActions.pushNewErrorMessage({
          code: -1,
          message: errorMessage,
        })
      )
    }
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const selectedFiles = fileList
    console.log(selectedFiles)
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
                      {/* <Button
                    icon="pi pi-times"
                    rounded
                    outlined
                    aria-label="remove"
                    className="w-[20px] h-[20px]"
                   
                  /> */}
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
