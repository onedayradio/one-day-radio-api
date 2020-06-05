import moment from 'moment'

import { PlayListDao } from './playList.dao'
import { Constants } from './../../shared'
import { PlayList, DBUser, SpotifyPlayList, PlayListDate, PlayListData } from '../../types'
import { ValidationError } from 'apollo-server-lambda'
import { SpotifyService } from './../spotify/spotify.service'

import { GenresService } from '..'
import { DATE } from '../../shared/util/constants'

export class PlayListService {
  playListDao: PlayListDao

  constructor() {
    this.playListDao = new PlayListDao()
  }

  async createPlayList(user: DBUser, playList: PlayListData): Promise<SpotifyPlayList> {
    const spotifyService = new SpotifyService(user)
    const { name, description, genreId, year, month, day } = playList
    const spotifyPlayList = await spotifyService.createPlayList({ name, description })
    const { id } = spotifyPlayList
    await this.playListDao.create({
      spotifyId: id,
      name,
      description,
      genreId,
      year,
      month,
      day,
    })
    return spotifyPlayList
  }

  async loadPlayList(user: DBUser, genreId: string, date: string): Promise<PlayList> {
    const playListDate = this.createPlayListDate(date)
    const playList = await this.playListDao.load({ genreId, ...playListDate })
    if (playList && playList.spotifyId) {
      const spotifyService = new SpotifyService(user)
      return (await spotifyService.getPlayList(playList.spotifyId)) as PlayList
    }
    const playListData = await this.createPlayListData(genreId, playListDate)
    return this.createPlayList(user, playListData) as Promise<PlayList>
  }

  async createPlayListData(genreId: string, playListDate: PlayListDate): Promise<PlayListData> {
    const genreService = new GenresService()
    const genre = await genreService.getDetailById(genreId)
    const name = this.createPlayListName(genre.name)
    return {
      name,
      description: this.createPlayListDescription(name),
      genreId,
      ...playListDate,
    }
  }

  createPlayListName(genreName: string): string {
    const date = moment().format(Constants.DATE.FORMAT)
    return `One day Radio. ${genreName} playlist - ${date}`
  }

  createPlayListDescription(name: string): string {
    return `This playlist has been created to you, from your community. ${name}`
  }

  createPlayListDate(date: string): PlayListDate {
    if (!moment(date, DATE.FORMAT, true).isValid()) {
      throw new ValidationError('Invalid date format')
    }
    return {
      day: moment(date).day().toString(),
      month: moment(date).month().toString(),
      year: moment(date).year().toString(),
    }
  }
}
