import { Fragment, useState } from 'react'
import IconDelete from '@/assets/icons/icon_delete_circle.svg'
import filesStyle from './files.module.scss'
import Image from 'next/image'
import { useCardDetail } from '@/contexts/cardDetailContext'
import { Button } from 'primereact/button'

export default function CardDetailFiles() {
  const { dispatch } = useCardDetail()
  const [fileList, setFileList] = useState<File[]>([
    {
      name: 'file?.name',
      lastModified: 1686305900703,
      lastModifiedDate: new Date(),
      size: 1039871,
      type: 'application/pdf',
      webkitRelativePath: '',
    },
  ])

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const selectedFiles = fileList
    console.log(selectedFiles)
  }

  const handleRemoveFile = (index: number) => {
    setFileList(prevFileList => {
      const updatedFileList = [...prevFileList]
      updatedFileList.splice(index, 1) // 從陣列中移除指定索引的檔案
      return updatedFileList
    })
  }

  return (
    <form onSubmit={onSubmit} className="mb-8 relative">
      <h5>附件</h5>
      {fileList
        ? fileList.map((file, index) => (
            <Fragment key={index}>
              <div className={filesStyle.file_card}>
                <div className="flex w-full">
                  <Image src={'/images/home-pomodoro.jpg'} alt="home-pomodoro" width={180} height={120} />

                  <div className="file-name flex flex-col justify-center w-[60%] p-4">
                    <span className="text-secondary-3 text-lg">測試</span>
                    <span className="text-sm">上傳於 XXXXXX</span>
                  </div>
                  <IconDelete onClick={() => handleRemoveFile(index)} />
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
  )
}
