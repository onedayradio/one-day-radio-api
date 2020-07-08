import { expect } from 'chai'

import { testsSetup } from '../../tests.util'
import { GenreModel } from '../../../../src/components/genres/genre'

describe('Genre Model', () => {
  beforeEach((done: any) => {
    void testsSetup(done)
  })

  it('should not save a genre if no name is provided', async () => {
    const genre = new GenreModel({
      order: 1,
      maxSongs: 20,
    })
    try {
      await genre.save()
    } catch (error) {
      expect(error.message).to.equal('Genre validation failed: name: Name is required')
    }
  })

  it('should not save a genre if no order is provided', async () => {
    const genre = new GenreModel({
      name: 'Genre 1',
      maxSongs: 20,
    })
    try {
      await genre.save()
    } catch (error) {
      expect(error.message).to.equal('Genre validation failed: order: Order is required')
    }
  })
})
