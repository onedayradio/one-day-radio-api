interface ItemImage {
  height: number
  width: number
  url: string
}

interface Album {
  id: string
  name: string
  images: ItemImage[]
}

export interface Song {
  id: string
  name: string
  artists: string
  album: Album
}
