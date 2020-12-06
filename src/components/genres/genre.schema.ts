import { object, string, number } from 'yup'

export const GenreSchema = object().shape({
  name: string().required(),
  order: number().required(),
  maxSongs: number().required(),
})
