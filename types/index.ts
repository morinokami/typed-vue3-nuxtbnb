export type HomeType = {
  objectID: string
  type: string
  title: string
  description: string
  note: string
  reviewCount: number
  reviewValue: number
  features: string[]
  pricePerNight: number
  location: {
    address: string
    city: string
    state: string
    country: string
  }
  guests: number
  bedrooms: number
  beds: number
  bathrooms: number
  images: string[]
  host: {
    name: string
    image: string
    note: string
    reviewCount: number
    reviewValue: number
    joined: string
  }
  _geoloc: {
    lat: number
    lng: number
  }
}

export type ReviewType = {
  objectID: string
  homeId: string
  reviewer: {
    image: string
    name: string
  }
  rating: number
  date: string
  comment: string
}

export type UserType = {
  objectID: string
  joined: string
  name: string
  image: string
  reviewCount: number
  description: string
  homeId: string[]
}

export type MarkerType = {
  id: string
  lat: number
  lng: number
  pricePerNight: number
}
