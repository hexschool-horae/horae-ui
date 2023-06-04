import { memo } from 'react'
import { Dialog } from 'primereact/dialog'

// const state = {
//   留在原地: {
//     default: [
//       ['isLogin', 'public'],
//       ['isLogin', 'private'],
//       ['isLogin', 'workspace'],
//     ],
//     無側邊欄: [['!isLogin', 'public']],
//   },
//   跳轉看板已關閉警告頁: {
//     default: [
//       ['isLogin', 'public'],
//       ['isLogin', 'private'],
//       ['isLogin', 'workspace'],
//       ['!isLogin', 'public'],
//     ],
//   },
//   跳轉看板非公開警告頁: {
//     default: [
//       ['!isLogin', 'private'],
//       ['!isLogin', 'workspace'],
//     ],
//   },
//   跳轉看板非工作區成員警告頁: {
//     default: [['isLogin', 'workspace']],
//   },
// }

const PermissionMessage = () => {
  const fn = () => {
    console.log('a')
  }

  return (
    <Dialog onHide={() => fn()}>
      <p>跳轉看板已關閉警告頁</p>
    </Dialog>
  )
}

export default memo(PermissionMessage)
