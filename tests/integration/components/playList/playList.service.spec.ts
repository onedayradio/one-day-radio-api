import sinon from 'sinon'
import { fn as moment } from 'moment'
import { expect } from 'chai'

import { PlayListService } from '../../../../src/components'
import { PlayListDao } from '../../../../src/components/playList/playList.dao'
import { testsSetup } from '../../tests.util'
import { SpotifyClient } from '../../../../src/shared'
import { playListMock } from '../../mock-data/spotify-api.mocks'
import { ids } from '../../fixtures-ids'

const playListService = new PlayListService()

describe('Playlist Service', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should create a play list description', () => {
    const playListDescription = playListService.createPlayListDescription('Test name')
    expect(playListDescription).to.equal(
      'This playlist has been created to you, from your community. Test name',
    )
  })

  it('should create a play list name', async () => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(moment, 'format').returns('2020-12-24')
    const playListDescription = playListService.createPlayListName('Rock')
    expect(playListDescription).to.equal('One day Radio. Rock playlist - 2020-12-24')
    sandbox.restore()
  })

  it('should create play list data', async () => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(moment, 'format').returns('2020-12-24')
    const { genres } = ids
    const expectedData = {
      name: 'One day Radio. Heavy Metal playlist - 2020-12-24',
      description:
        'This playlist has been created to you, from your community. One day Radio. Heavy Metal playlist - 2020-12-24',
      genreId: genres.metalId,
      year: '2020',
      month: '12',
      day: '24',
    }
    const playListData = await playListService.createPlayListData(genres.metalId, {
      year: '2020',
      month: '12',
      day: '24',
    })
    expect(playListData).to.deep.equal(expectedData)
    sandbox.restore()
  })

  it('should create a play list', async () => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(PlayListDao.prototype, 'load').resolves(null)
    sandbox.stub(PlayListDao.prototype, 'create').resolves(undefined)
    sandbox.stub(SpotifyClient, 'createPlayList').resolves(playListMock)
    const { users, genres } = ids
    const data = await playListService.createPlayListData(genres.metalId, {
      year: '2020',
      month: '12',
      day: '24',
    })
    const playListData = await playListService.createPlayList(users.pabloId, data)
    expect(playListData).to.equal(playListMock)
    sandbox.restore()
  })
})
