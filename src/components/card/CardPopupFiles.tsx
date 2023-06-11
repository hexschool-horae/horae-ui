import { Button } from 'primereact/button'
import CardPopupWrapper from './CardPopupWrapper'
import cardPopupsStyle from './cardPopups.module.scss'
import { Fragment, useRef, useState } from 'react'
import IconDelete from '@/assets/icons/icon_delete_circle.svg'

interface ICardPopupPriorityProps {
  label: string
}

export default function CardPopupFiles({ label }: ICardPopupPriorityProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileList, setFileList] = useState<File[]>([])

  const handleFileChange = () => {
    if (!fileInputRef.current?.files || fileInputRef.current?.files.length === 0) return
    setFileList(Array.from(fileInputRef.current?.files)) // 將 FileList 轉換為陣列
    // if (selectedFiles) {
    //   setFileList(Array.from(selectedFiles))
    // }
  }

  const handleRemoveFile = (index: number) => {
    setFileList(prevFileList => {
      const updatedFileList = [...prevFileList]
      updatedFileList.splice(index, 1) // 從陣列中移除指定索引的檔案
      return updatedFileList
    })
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const selectedFiles = fileList
    console.log(selectedFiles)
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
          <Button className="w-full" type="submit" label="附加" severity="secondary" rounded></Button>
        </form>
      </div>
    </CardPopupWrapper>
  )
}
