import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { InputText } from 'primereact/inputtext'

interface IHeaderProps {
  className: string
}

const BackHeader: FC<IHeaderProps> = () => {
  return (
    <div className="h-[72px] px-12 bg-primary flex items-center">
      <Image src="/images/logo.png" alt="logo.png" width={148} height={48} />
      <Link href="/board" className="text-white ml-8">
        工作區
      </Link>
      <Link href="/board" className="text-white ml-5">
        最近的
      </Link>
      <Link href="/board" className="text-white ml-5">
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

export default BackHeader
