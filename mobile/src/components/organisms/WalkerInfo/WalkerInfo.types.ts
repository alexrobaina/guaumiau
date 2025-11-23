export interface Walker {
  id: string
  name: string
  avatar?: string
  rating: number
  reviews: number
}

export interface WalkerInfoProps {
  walker: Walker
}
