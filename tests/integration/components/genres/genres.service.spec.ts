import mongodb from 'mongodb'
import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { GenresService } from '../../../../src/components'
import { ids } from '../../fixtures-ids'

const genresService = new GenresService()

describe('GenresService', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should load genres by ids', async () => {
    const { genres } = ids
    const genresLoaded = await genresService.loadByIds([genres.punkId, genres.metalId])
    expect(genresLoaded.length).to.equal(2)
  })

  it('should create an genre', async () => {
    const genre = await genresService.create({
      name: 'Rock',
      order: 3,
      maxSongs: 20,
    })
    expect(genre._id).not.to.be.undefined
    expect(genre.name).to.equal('Rock')
    expect(genre.order).to.equal(3)
    expect(genre.maxSongs).to.equal(20)
  })

  it('should load genre details', async () => {
    const { genres } = ids
    const genre = await genresService.getDetailById(genres.metalId)
    expect(genre.name).to.equal('Heavy Metal')
  })

  it('should throw error if trying to find a genre with an invalid id', async () => {
    const badId = new mongodb.ObjectID() + ''
    try {
      await genresService.getDetailById(badId)
    } catch (error) {
      expect(error.message).to.equal(`Genre with id ${badId} not found in the database`)
    }
  })

  it('should load all genres', async () => {
    const genresLoaded = await genresService.loadAll()
    expect(genresLoaded.length).to.equal(4)
    expect(genresLoaded[0].name).to.equal('Heavy Metal')
    expect(genresLoaded[1].name).to.equal('Punk')
    expect(genresLoaded[2].name).to.equal('Rock')
    expect(genresLoaded[3].name).to.equal('Pop')
  })
})
