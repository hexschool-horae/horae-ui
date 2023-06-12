import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import Style from './CoverSelector.module.scss'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'

type TCoverType = 'local' | 'unsplash' | 'theme' | null

const CoverSelector = () => {
  const [imgList, setImgList] = useState<string[]>([])
  const [coverType, setCoverType] = useState<TCoverType>(null)

  const hanldeGetUnsplash = async () => {
    const result = await axios.get(
      'https://api.unsplash.com/photos/random?client_id=g37xgq9_G4tU9dk1fT3TWVJnPR-4jzDBbGSTji-WLME&count=8&orientation=landscape'
    )
    if (result) {
      const { data } = result

      const list = data.map((item: any) => item?.urls?.thumb)
      setImgList(list)
    }
  }

  const handleSetCoverType = (type: TCoverType) => {
    setTimeout(() => {
      setCoverType(type)
    }, 1000)
  }

  const handleUpdateCover = (type: TCoverType) => {
    console.log(type)
  }

  useEffect(() => {
    if (coverType === 'unsplash') {
      hanldeGetUnsplash()
    }
  }, [coverType])

  return (
    <div className="p-8 w-[400px]">
      <div className="w-full flex items-center mb-4">
        {coverType !== null && (
          <Button
            className="p-0"
            icon="pi pi-angle-left"
            severity="secondary"
            text
            onClick={() => handleSetCoverType(null)}
          />
        )}

        <h5 className="w-full text-center">更換背景</h5>

        {coverType === 'unsplash' && (
          <Button className="p-0" icon="pi pi-sync" severity="secondary" text onClick={hanldeGetUnsplash} />
        )}
      </div>

      {coverType === null && (
        <div className="w-full flex mb-5">
          <div className="flex-1 mr-2">
            <div
              className={classNames('bg-secondary-3', Style.cover_selector_item)}
              onClick={() => handleSetCoverType('unsplash')}
            ></div>
            <div className="text-center">照片</div>
          </div>

          <div className="flex-1 ">
            <div
              className={classNames('bg-secondary-4', Style.cover_selector_item)}
              onClick={() => handleSetCoverType('theme')}
            ></div>
            <div className="text-center">顏色</div>
          </div>
        </div>
      )}

      {/* 從 unsplash 選擇 */}
      {coverType === 'unsplash' && (
        <div className="w-full flex flex-wrap justify-between">
          {imgList.map((item, index: number) => (
            <div key={index} className={Style.img_item} onClick={() => handleUpdateCover('unsplash')}>
              <img style={{ width: '100%', height: '100px' }} src={item} />
            </div>
          ))}
        </div>
      )}

      {/* 從主題選擇 */}
      {coverType === 'theme' && (
        <div className="w-full flex mb-5">
          <div className="flex-1 mr-2">
            <div
              className={classNames('bg-gray-2', Style.theme_item)}
              onClick={() => handleSetCoverType('theme')}
            ></div>
          </div>
          <div className="flex-1  mr-2">
            <div
              className={classNames('bg-gray-3', Style.theme_item)}
              onClick={() => handleSetCoverType('theme')}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(CoverSelector)
