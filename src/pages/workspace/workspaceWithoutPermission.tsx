import { memo, useState, useEffect } from 'react'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/useAppStore'
import classes from '@/pages/login/login.module.scss'
import { classNames } from 'primereact/utils'

const WorkspaceClosed = () => {
  const [isShowLogin, setIsShowLogin] = useState(false)
  const token = useAppSelector(state => state.user.token)

  useEffect(() => {
    setIsShowLogin(!token)
  }, [token])
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className={classNames('text-center', classes['login-form-box'])}>
        <h4 className="mb-4">此為私人工作區</h4>
        {isShowLogin ? (
          <Link href="/login" legacyBehavior passHref>
            <a className="mt-4" target="_blank" rel="noopener noreferrer">
              若您為工作區成員，請先 <u className="text-secondary-1">登入</u>
            </a>
          </Link>
        ) : (
          '你可能必須成為工作區成員才能存取。'
        )}
      </div>
    </div>
  )
}

export default memo(WorkspaceClosed)
