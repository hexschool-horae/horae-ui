import { Chip } from 'primereact/chip'

export default function Card({ title = '', labels = [] }: { title: string; labels: string[] }) {
  /* 卡片本體 */

  return (
    <div className="w-[254px] flex flex-col rounded-md  bg-white p-4 mb-3">
      <h6 className="mb-10">{title}</h6>
      {/* 卡片標籤 */}
      <div className="flex">
        {labels.map((label, i) => (
          <Chip key={i} label={label} className="!border-secondary-2 !text-secondary-3 !bg-secondary-4 mr-2"></Chip>
        ))}
      </div>
    </div>
  )
}
