import sinon from 'sinon'
import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { SearchService, UsersService } from '../../../../src/components'
import { SpotifyClient } from '../../../../src/shared'
import { ids } from '../../fixtures-ids'
import { searchSongsMock } from '../../fixtures/spotify-api.mocks'
import { spotifyServiceSearchSongs } from '../../snapshots/spotify'

const usersService = new UsersService()

describe('SearchService', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should search for songs', async () => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(SpotifyClient, 'refreshAccessToken')
    sandbox.stub(SpotifyClient, 'searchSong').returns(Promise.resolve(searchSongsMock))
    const { users } = ids
    const user = await usersService.getDetailById(users.sanId)
    const searchService = new SearchService()
    const searchResponse = await searchService.search(user, 'raw deal')
    expect(searchResponse).to.deep.equal(spotifyServiceSearchSongs)
    sandbox.restore()
  })
})
