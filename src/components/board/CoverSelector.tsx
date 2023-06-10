import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from 'primereact/button'

type TCoverType = 'local' | 'unsplash' | 'color' | null

const CoverSelector = () => {
  const [imgList, setImgList] = useState<string[]>([])
  const [coverType, setCoverType] = useState<TCoverType>(null)

  const hanldeGetUnsplash = async () => {
    const result = await axios.get(
      'https://api.unsplash.com/photos/?client_id=g37xgq9_G4tU9dk1fT3TWVJnPR-4jzDBbGSTji-WLME'
    )
    if (result) {
      const { data } = result

      const list = data.map((item: any) => item?.urls?.thumb)
      setImgList(list)
    }
    console.log(result)
  }

  useEffect(() => {
    if (coverType === 'unsplash') {
      hanldeGetUnsplash()
    }
  }, [coverType])

  return (
    <div className="p-8">
      <h5 className="text-center">更換背景</h5>
      <div className="flex flex-col items-center">
        {coverType === null && (
          <div className="mr-4">
            <Button onClick={() => setCoverType('unsplash')}>照片</Button>
            <Button severity="secondary" onClick={() => setCoverType('color')}>
              顏色
            </Button>
          </div>
        )}

        {coverType === 'unsplash' && (
          <div className="w-[200px] flex flex-wrap">
            {imgList.map((item, index: number) => (
              <img width={50} height={50} key={index} src={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(CoverSelector)
