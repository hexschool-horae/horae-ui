import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import Style from './CoverSelector.module.scss'
import { Button } from 'primereact/button'
import { classNames } from 'primereact/utils'

// import { boardSliceActions } from '@/slices/boardSlice'
import { socketServiceActions } from '@/slices/socketServiceSlice'
// import { errorSliceActions } from '@/slices/errorSlice'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore'
import IconCancelTheme from '@/assets/icons/icon_cancel_theme.svg'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { SOCKET_EVENTS_ENUM } from '@/socketService/sockets.events'

type TCoverType = 'local' | 'unsplash' | 'theme' | null
interface IImgItem {
  url: string
  fullUrl: string
  color: string
}
const CoverSelector = () => {
  const [imgList, setImgList] = useState<IImgItem[]>([])
  const [coverType, setCoverType] = useState<TCoverType>(null)
  const boardId = useAppSelector(state => state.board.boardId)
  // const boardThemeColor = useAppSelector(state => state.user.themeColor)
  const dispatch = useAppDispatch()

  const hanldeGetUnsplash = async () => {
    const result = await axios.get(
      'https://api.unsplash.com/photos/random?client_id=g37xgq9_G4tU9dk1fT3TWVJnPR-4jzDBbGSTji-WLME&count=8&orientation=landscape'
    )
    if (result) {
      const { data } = result

      const list = data.map((item: any) => ({ url: item?.urls?.thumb, fullUrl: item?.urls?.full, color: item?.color }))
      setImgList(list)
    }
  }

  const handleSetCoverType = (type: TCoverType) => {
    setTimeout(() => {
      setCoverType(type)
    }, 1000)
  }

  const onSetCoverTheme = (theme: string) => {
    dispatch(
      socketServiceActions.deleteBoardCover({
        boardId,
      })
    )
    dispatch(
      socketServiceActions.modifyBoardTheme({
        covercolor: theme,
        boardId,
      })
    )
    dispatch(dialogSliceActions.pushSpinnerQueue(SOCKET_EVENTS_ENUM.BOARD_MODIFY_THEME_RESULT))
  }

  const handleUpdateCover = (type: TCoverType, payload: IImgItem) => {
    if (type === 'unsplash') {
      // 更新看板封面
      dispatch(socketServiceActions.updateBoardCover({ boardId, fileURL: payload.fullUrl }))
      dispatch(socketServiceActions.modifyBoardTheme({ boardId, covercolor: payload.color }))
    }
  }

  useEffect(() => {
    if (coverType === 'unsplash') {
      hanldeGetUnsplash()
    }
  }, [coverType])

  return (
    <div className="px-6 py-5" style={{ fontSize: '14px', letterSpacing: '1px' }}>
      <div className="w-full flex items-center">
        {coverType !== null && (
          <Button
            className="p-0"
            icon="pi pi-angle-left"
            severity="secondary"
            text
            onClick={() => handleSetCoverType(null)}
          />
        )}

        <div className="text-xl text-center">
          {coverType === null ? '更換背景' : coverType === 'unsplash' ? '照片由 Unsplash 提供' : '顏色主題'}
        </div>

        {coverType === 'unsplash' && (
          <Button className="p-0" icon="pi pi-sync" severity="secondary" text onClick={hanldeGetUnsplash} />
        )}
      </div>

      <hr className="my-5" />

      {coverType === null && (
        <div className="w-full flex mb-5">
          <div className="flex-1 mr-2">
            <div
              className={classNames(Style.cover_selector_item)}
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1654119220681-517da68f36f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80")',
                backgroundSize: 'cover',
              }}
              onClick={() => handleSetCoverType('unsplash')}
            ></div>
            <div className="text-center">照片</div>
          </div>

          <div className="flex-1 ">
            <div
              className={classNames('bg-secondary-4', Style.cover_selector_item)}
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80")',
                backgroundSize: 'cover',
              }}
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
            <div
              key={index}
              className={classNames('p-[4px] hover:border-violet-700 active:border-violet-700', Style.img_item)}
              onClick={() => handleUpdateCover('unsplash', item)}
            >
              <img style={{ width: '100%', height: '100px' }} src={item.url} />
            </div>
          ))}
        </div>
      )}

      {/* 從主題選擇 */}
      {coverType === 'theme' && (
        <div className={Style['cover-theme-box']}>
          <div className={`${Style.theme} ${Style['default-theme']}`} onClick={() => onSetCoverTheme('')}>
            <IconCancelTheme className="w-[50px] h-[50px]" />
          </div>
          <div className={`${Style.theme} ${Style.theme1}`} onClick={() => onSetCoverTheme('theme1')}></div>
          <div className={`${Style.theme} ${Style.theme2}`} onClick={() => onSetCoverTheme('theme2')}></div>
          <div className={`${Style.theme} ${Style.theme3}`} onClick={() => onSetCoverTheme('theme3')}></div>
        </div>
      )}
    </div>
  )
}

export default memo(CoverSelector)
