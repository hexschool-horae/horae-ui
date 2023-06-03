import { FC } from 'react'
import IconLogo from '@/assets/icons/icon_logo.svg'
import Link from 'next/link'
import { InputText } from 'primereact/inputtext'
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
      <IconLogo />
      <Link href="/board" className="ml-8">
        工作區
      </Link>
      <Link href="/board" className="ml-5">
        最近的
      </Link>
      <Link href="/board" className="ml-5">
        已標記
      </Link>
      <span className="p-input-icon-left ml-[200px]">
        <i className="pi pi-search" />
        <InputText placeholder="Search" />
      </span>
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
