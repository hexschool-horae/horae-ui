import { memo } from 'react'
import { Chip } from 'primereact/chip'
import { classNames } from 'primereact/utils'
import priorityStyle from '@/components/card/priority.module.scss'
import tagStyle from '@/components/card/tags.module.scss'

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
  priority = '1',
  tags = [],
}: {
  title: string
  priority?: string
  tags: { title: string; color: string }[]
}) => {
  const getPriorityColor = (val: string) => {
    switch (val) {
      case '1':
        return 'high-bg'
      case '2':
        return 'medium-bg'
      case '3':
        return 'low-bg'
      default:
        return ''
    }
  }

  /* 卡片本體 */
  return (
    <div
      className={classNames(
        { 'h-[152px]': tags.length > 0 || priority != '' },
        'w-[254px] flex flex-col justify-between rounded-md  bg-white p-4 mb-3'
      )}
    >
      <h6 className={classNames({ 'mb-10': tags.length > 0 }, 'text-start')}>{title}</h6>
      {/* 優先權 */}
      <div className="flex items-center flex-wrap gap-1">
        {priority && (
          <div
            className={`w-[32px] h-[32px] rounded-full text-center leading-[32px] ${
              priorityStyle[getPriorityColor(priority)]
            }`}
          >
            <i className="pi pi-flag text-white" style={{ fontSize: '18px' }}></i>
          </div>
        )}
        {/* 卡片標籤 */}
        {tags.map((tag, i) => (
          <Chip
            key={i}
            label={tag.title}
            style={{ backgroundColor: tag.color, color: '#CC3A3A' }}
            className={tagStyle.list_card_tag}
          ></Chip>
        ))}
      </div>
    </div>
  )
}

export default memo(Card)
