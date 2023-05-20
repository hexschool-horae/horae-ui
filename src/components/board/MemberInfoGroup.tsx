import { classNames } from 'primereact/utils'
import Style from './MemberInfoGroup.module.scss'
import { ReactNode } from 'react'

/** 團隊成員資訊 */
interface IMemberInfoModel {
  /** url */
  img?: string
  title?: string | ReactNode
  subtitle?: string | ReactNode
}

export default function MemberInfoGroup({
  className,
  model,
  append = <></>,
}: {
  model: IMemberInfoModel
  className?: string
  append?: ReactNode
}) {
  if (model === undefined) {
    return <></>
  }

  return (
    <div className={classNames(className, Style.member_info_item)}>
      {/* 照片之後補上 */}
      {/* <img src={img} alt="" style={{ width: "16px", height: "16px", marginRight: "0.75rem" }} /> */}
      <div className="w-[3rem] h-[3rem] bg-black rounded-full mr-3"></div>
      <div>
        <span>{model.title}</span>
        <div className={classNames(Style.member_info_subtitle, 'text-gray-2')}>{model.subtitle}</div>
      </div>
      <span className="ml-auto"> {append}</span>
    </div>
  )
}
