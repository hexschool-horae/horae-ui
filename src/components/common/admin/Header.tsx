import { FC } from 'react'
import IconLogo from '@/assets/icons/icon_logo.svg'
import Link from 'next/link'
import { InputText } from 'primereact/inputtext'

interface IHeaderProps {
  boardId?: string
}

const Header: FC<IHeaderProps> = ({ boardId }) => {
  const headerStyle = (() => {
    if (boardId) {
      return 'bg-gray-3'
    } else {
      return 'bg-white'
    }
  })()
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
      <div className="w-[48px] h-[48px] rounded-full bg-black ml-auto"></div>
    </div>
  )
}

export default Header
