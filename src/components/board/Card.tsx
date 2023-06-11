import { memo } from 'react'
import { Chip } from 'primereact/chip'
import { classNames } from 'primereact/utils'
// import priorityStyle from './priority.module.scss'

// const list = [
//   {
//     label: '高',
//     value: '1',
//     color: 'high',
//   },
//   {
//     label: '中',
//     value: '2',
//     color: 'medium',
//   },
//   {
//     label: '低',
//     value: '3',
//     color: 'low',
//   },
// ]

const Card = ({
  title = '',
  // priority = '',
  tags = [],
}: {
  title: string
  priority?: string
  tags: { title: string; color: string }[]
}) => {
  /* 卡片本體 */
  return (
    <div
      className={classNames(
        { 'h-[152px]': tags.length > 0 },
        'w-[254px] flex flex-col justify-between rounded-md  bg-white p-4 mb-3'
      )}
    >
      <h6 className={classNames({ 'mb-10': tags.length > 0 }, 'text-start')}>{title}</h6>
      {/* 卡片標籤 */}
      <div className="flex">
        {/* <div className="">
          <i className={`pi pi-flag-fill ${priorityStyle[priority]}`} style={{ fontSize: '18px' }}></i>
        </div> */}
        {tags.map((tag, i) => (
          <Chip
            key={i}
            label={tag.title}
            style={{ backgroundColor: tag.color, color: '#CC3A3A' }}
            // className="!border-secondary-2 !text-secondary-3 !bg-secondary-4 mr-2"
          ></Chip>
        ))}
      </div>
    </div>
  )
}

export default memo(Card)
