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

export interface ICardList {
  _id: string
  title: string
  status: string
  position: number
  cards: {
    _id: string
    title: string
    startDate: number
    endDate: number
    tags: {
      _id: string
      title: string
      color: string
    }[]
    comments: {
      _id: string
      comment: string
      user: {
        _id: string
        name: string
        createdAt: string
      }
      card: string
    }[]
    proiority: string
    position: number
  }[]
}
