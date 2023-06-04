import { memo } from 'react'

const BoardClosed = () => {
  return <div className="w-full flex flex-col content-center items-center bg-slate-50">無權限造訪此看板</div>
}

export default memo(BoardClosed)
