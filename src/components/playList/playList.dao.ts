import { PlayListModel } from './playList'
import { DBPlayList, PlayListData, PlayListFilter } from '../../types'

export class PlayListDao {
  create(playListData: PlayListData): Promise<DBPlayList> {
    const playList = new PlayListModel(playListData)
    return playList.save()
  }

  async load(playListFilter: PlayListFilter): Promise<DBPlayList | null> {
    return PlayListModel.findOne(playListFilter)
  }
}
