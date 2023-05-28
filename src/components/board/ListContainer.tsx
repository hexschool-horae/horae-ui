import { ReactNode } from 'react'

export default function ListContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-[286px] row-span-full">
      <div className="bg-secondary-4 h-auto px-4 py-5">{children}</div>
    </div>
  )
}
