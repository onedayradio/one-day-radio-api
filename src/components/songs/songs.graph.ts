export const songType = `
  type ItemImage {
    height: Int
    width: Int
    url: String
  }

  type Album {
    id: String!
    name: String
    images: [ItemImage]
  }

  type Song {
    id: String!
    name: String
    artists: String
    album: Album
  }
`
