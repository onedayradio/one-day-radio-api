import { expect } from 'chai'

import { TestsUtil } from '../../tests.util2'
import { GenresService } from '../../../../src/components'

const testsUtil = new TestsUtil()

describe('GenresService', () => {
  beforeEach((done: any) => {
    testsUtil.setupData().then(() => done())
  })

  afterEach((done: any) => {
    testsUtil.closeSession().then(() => {
      done()
    })
  })

  after((done) => {
    testsUtil.closeDriverAndSession().then(() => done())
  })

  it('should load genres by ids', async () => {
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    let genresById = await genresService.loadByIds({
      ids: [allGenres[0].id, allGenres[1].id],
      orderBy: 'order',
    })
    expect(genresById[0].name).to.equal('Heavy Metal')
    expect(genresById[1].name).to.equal('Punk')

    genresById = await genresService.loadByIds({
      ids: [allGenres[1].id, allGenres[0].id],
    })
    expect(genresById[0].name).to.equal('Punk')
    expect(genresById[1].name).to.equal('Heavy Metal')
  })

  it('should create a genre', async () => {
    const genresService = new GenresService(testsUtil.session)
    const genre = await genresService.create({
      name: 'Rock',
      order: 3,
      maxSongs: 20,
    })
    expect(genre.id).not.to.be.undefined
    expect(genre.name).to.equal('Rock')
    expect(genre.order).to.equal(3)
    expect(genre.maxSongs).to.equal(20)
  })

  it('should update an existing genre', async () => {
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const heavyMetalGenre = await genresService.loadById({ id: allGenres[0].id })
    const genre = await genresService.update(heavyMetalGenre.id, {
      name: 'Super Heavy Metal',
    })
    expect(genre.id).not.to.be.undefined
    expect(genre.name).to.equal('Super Heavy Metal')
    expect(genre.order).to.equal(1)
    expect(genre.maxSongs).to.equal(5)
  })

  it('should load genre details', async () => {
    const genresService = new GenresService(testsUtil.session)
    const allGenres = await genresService.loadAll({ orderBy: 'order' })
    const genre = await genresService.loadById({ id: allGenres[0].id })
    expect(genre.name).to.equal('Heavy Metal')
  })

  it('should throw error if trying to find a genre with an invalid id', async () => {
    const badId = 1133
    try {
      const genresService = new GenresService(testsUtil.session)
      await genresService.loadById({ id: badId })
    } catch (error) {
      expect(error.message).to.equal(`Genre with id ${badId} not found in the database`)
    }
  })

  it('should load all genres', async () => {
    const genresService = new GenresService(testsUtil.session)
    const genresLoaded = await genresService.loadAll({ orderBy: 'order' })
    expect(genresLoaded.length).to.equal(4)
    expect(genresLoaded[0].name).to.equal('Heavy Metal')
    expect(genresLoaded[1].name).to.equal('Punk')
    expect(genresLoaded[2].name).to.equal('Rock')
    expect(genresLoaded[3].name).to.equal('Pop')
  })
})
