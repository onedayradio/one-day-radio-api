export interface Genre {
  id: number
  name: string
  order: number
  maxSongs: number
}

export interface LoadGenreArgs {
  genreId: number
}
