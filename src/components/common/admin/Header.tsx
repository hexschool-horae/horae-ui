import { FC } from 'react'
import IconLogo from '@/assets/icons/icon_logo.svg'
import Link from 'next/link'
import { POST_USER_LOGOUT } from '@/apis/axios-service'
import { useRouter } from 'next/router'
import { AppDispatch } from '@/app/store'
import { useDispatch } from 'react-redux'
import { setIsLogin, setToken } from '@/slices/userSlice'

interface IHeaderProps {
  boardId?: string
}

const Header: FC<IHeaderProps> = ({ boardId }) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const headerStyle = (() => {
    if (boardId) {
      return 'bg-gray-3'
    } else {
      return 'bg-white'
    }
  })()

  const onLogout = async () => {
    try {
      await POST_USER_LOGOUT()
      dispatch(setIsLogin(false))
      dispatch(setToken(''))
      router.push('/')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={`flex items-center py-4 px-[50px] text-black border-b border-white ${headerStyle}`}>
      <Link href="/board">
        <IconLogo className="cursor-pointer" />
      </Link>
      <div className="ml-auto flex items-center">
        <span className="text-black mr-4 cursor-pointer" onClick={onLogout}>
          登出
        </span>
        <div className="w-[48px] h-[48px] rounded-full bg-black ml-auto"></div>
      </div>
    </div>
  )
}

export default Header
