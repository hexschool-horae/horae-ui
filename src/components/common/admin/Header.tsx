import { FC, useEffect, useState, useRef, MouseEvent, useMemo } from 'react'
import IconLogo from '@/assets/icons/icon_logo.svg'
// import LogoSVG from '@/components/layout/LogoSVG'
import Link from 'next/link'
import { POST_USER_LOGOUT } from '@/apis/axios-service'
import { useRouter } from 'next/router'
import { AppDispatch } from '@/app/store'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '@/hooks/useAppStore'
import { setIsLogin, setToken } from '@/slices/userSlice'
import { dialogSliceActions } from '@/slices/dialogSlice'
import { TieredMenu } from 'primereact/tieredmenu'
import { Menu } from 'primereact/menu'

interface IHeaderProps {
  boardId?: string
}

const boardRouters = [
  '/board/[boardId]',
  '/board/[boardId]/members/[id]',
  '/board/boardClosed',
  '/board/boardWithoutPermission',
]

const Header: FC<IHeaderProps> = ({ boardId }) => {
  const router = useRouter()
  const { pathname } = router
  const dispatch = useDispatch<AppDispatch>()
  const profile = useAppSelector(state => state.user.profile)
  const { themeColor: theme, textColor } = useAppSelector(state => state.board.themeColor)
  const [avatorDisplayName, setAvatorDisplayName] = useState('')
  const [headerClass, setHeaderClass] = useState('')
  const [headerColor, setHeaderColor] = useState('')
  type HeaderThemeMapping = {
    [key: string]: string
  }
  const headerThemeMapping: HeaderThemeMapping = useMemo(() => {
    return {
      theme1: 'bg-theme1-header',
      theme2: 'bg-theme2-header',
      theme3: 'bg-theme3-header',
    }
  }, [])

  useEffect(() => {
    if (boardRouters.includes(pathname)) {
      if (['theme1', 'theme2', 'theme3'].indexOf(theme) > -1) {
        setHeaderClass(`${headerThemeMapping[theme]}`)
        setHeaderColor('')
      } else if (theme) {
        setHeaderClass('')
        setHeaderColor(theme)
      } else {
        setHeaderClass('bg-gray-3')
        setHeaderColor('')
      }
    } else {
      setHeaderClass('bg-white')
      setHeaderColor('')
    }
  }, [theme, pathname, boardId, textColor])
  useEffect(() => {
    if (profile?.email) {
      const displayName = getAvatorDisplayName()
      setAvatorDisplayName(displayName)
    }
  }, [profile])

  const getAvatorDisplayName = () => {
    return profile?.name.slice(0, 1)
  }

  const onLogout = async () => {
    try {
      await POST_USER_LOGOUT()
      dispatch(setIsLogin(false))
      dispatch(setToken(''))
      dispatch(dialogSliceActions.purgeSpinnerQueue())
      router.push('/login')
    } catch (e) {
      console.log(e)
    }
  }

  const profileItems = [
    {
      label: '個人中心',
      command: () => {
        router.push('/profile')
      },
    },
    {
      label: '登出',
      command: () => {
        onLogout()
      },
    },
  ]

  const menu = useRef<Menu>(null)
  const onOpenProfileMenu = (e: MouseEvent<HTMLDivElement>) => {
    menu?.current?.toggle(e)
  }

  return (
    <div
      className={`flex items-center py-4 px-[50px] text-black border-b border-white ${headerClass}`}
      style={{ backgroundColor: headerColor }}
    >
      <Link href="/board">
        {/* <LogoSVG fillColor={boardThemeColor?.textColor ? boardThemeColor?.textColor : '#1A1A1A'}></LogoSVG> */}
        <IconLogo className="cursor-pointer" style={{ color: textColor ? textColor : '#1A1A1A' }} />
      </Link>
      <div className="ml-auto flex items-center">
        <div
          className="w-[48px] h-[48px] rounded-full bg-primary ml-auto flex justify-center items-center select-none cursor-pointer"
          style={{ backgroundColor: profile.avatar }}
          onClick={e => onOpenProfileMenu(e)}
        >
          <span className="text-black">{avatorDisplayName}</span>
        </div>
      </div>
      <TieredMenu model={profileItems} popup ref={menu} />
    </div>
  )
}

export default Header
