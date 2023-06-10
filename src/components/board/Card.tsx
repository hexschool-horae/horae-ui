import { Chip } from 'primereact/chip'
import { memo } from 'react'

const Card = ({ title = '', tags = [] }: { title: string; tags: { title: string; color: string }[] }) => {
  /* 卡片本體 */
  return (
    <div className="w-[254px] h-[152px] flex flex-col rounded-md  bg-white p-4 mb-3">
      <h6 className="text-start mb-10">{title}</h6>
      {/* 卡片標籤 */}
      <div className="flex">
        {tags.map((tag, i) => (
          <Chip
            key={i}
            label={tag.title}
            style={{ color: tag.color }}
            // className="!border-secondary-2 !text-secondary-3 !bg-secondary-4 mr-2"
          ></Chip>
        ))}
      </div>
    </div>
  )
}

export default memo(Card)
