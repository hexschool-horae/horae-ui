// export interface

export interface IBoardListItem {
  _id: string
  title: string
  status?: string
  position: number
  cards?: ICard[]
}

export interface IBoardCardItem {
  _id: string
  title: string
  startDate?: string
  endDate?: string
  tags?: any[]
  proiority?: string
  position: number
}
