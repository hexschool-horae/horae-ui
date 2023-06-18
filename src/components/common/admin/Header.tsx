import { FC, useEffect, useState, useMemo } from 'react'
import IconLogo from '@/assets/icons/icon_logo.svg'
import Link from 'next/link'
import { POST_USER_LOGOUT } from '@/apis/axios-service'
import { useRouter } from 'next/router'
import { AppDispatch } from '@/app/store'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/hooks/useAppStore'
import { setIsLogin, setToken } from '@/slices/userSlice'

interface IHeaderProps {
  boardId?: string
  theme?: string
}

const Header: FC<IHeaderProps> = ({ boardId, theme }) => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const profile = useAppSelector(state => state.user.profile)
  const [avatorDisplayName, setAvatorDisplayName] = useState('')
  const headerStyle = (() => {
    if (boardId) {
      return 'bg-gray-3'
    } else {
      return 'bg-white'
    }
  })()
  const themeMapping: { [key: string]: string } = useMemo(() => {
    return {
      ['theme1']: 'bg-theme1-header',
      ['theme2']: 'bg-theme2-header',
      ['theme3']: 'bg-theme3-header',
    }
  }, [])
  useEffect(() => {
    if (profile?.email) {
      const displayName = getAvatorDisplayName()
      setAvatorDisplayName(displayName)
      console.log('displayName = ', displayName)
    }
  }, [profile])

  const getAvatorDisplayName = () => {
    return profile?.email.slice(0, 1)
  }

  const onLogout = async () => {
    try {
      await POST_USER_LOGOUT()
      dispatch(setIsLogin(false))
      dispatch(setToken(''))
      router.push('/login')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div
      className={`flex items-center py-4 px-[50px] text-black border-b border-white ${headerStyle} ${
        theme && boardId ? themeMapping[theme] : ''
      }`}
    >
      <Link href="/board">
        <IconLogo className={`cursor-pointer ${theme ? 'text-white' : 'text-black'}`} />
      </Link>
      <div className="ml-auto flex items-center">
        <span className={`${theme ? 'text-white' : 'text-black'} mr-4 cursor-pointer`} onClick={onLogout}>
          登出
        </span>
        <div
          className="w-[48px] h-[48px] rounded-full bg-primary ml-auto flex justify-center items-center select-none cursor-pointer"
          style={{ backgroundColor: profile.avatar }}
        >
          <span className="text-black">{avatorDisplayName}</span>
        </div>
      </div>
    </div>
  )
}

export default Header
