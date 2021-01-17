import { object, string, number } from 'yup'

export const PlaylistSchema = object().shape({
  name: string().required(),
  spotifyId: string().required(),
  description: string().required(),
  genreId: number().required(),
})
