import { memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/useAppStore'
import classes from '@/pages/login/login.module.scss'
import { classNames } from 'primereact/utils'

const BoardClosed = () => {
  const [isShowLogin, setIsShowLogin] = useState(false)
  const token = useAppSelector(state => state.user.token)

  useEffect(() => {
    setIsShowLogin(!token)
  }, [token])
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className={classNames('text-center', classes['login-form-box'])}>
        <h4 className="mb-4">此看板為私密看板</h4>

        {isShowLogin && (
          <Link href="/login" legacyBehavior passHref>
            <a className="mt-4" target="_blank" rel="noopener noreferrer">
              若您為看板成員，請先 <u className="text-secondary-1">登入</u>
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}

export default memo(BoardClosed)
