import request from 'request'
import { expect } from 'chai'
import sinon from 'sinon'
import { SpotifyClient, SpotifyUnauthorizedError } from '../../../../src/shared'
import { searchSongsMock } from '../../mock-data/spotify-api.mocks'

describe('Spotify client', () => {
  it('should return token request options when passing a valid code', () => {
    const options = SpotifyClient.getTokenRequestOptions({ grantType: 'test', code: 'a good code' })
    expect(options).to.deep.equal({
      url: 'https://accounts.spotify.com/api/token',
      form: {
        ['grant_type']: 'test',
        ['redirect_uri']: 'redirect_url',
        code: 'a good code',
      },
      headers: { Authorization: 'Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=' },
      json: true,
    })
  })

  it('should return token request options when passing a refresh token', () => {
    const options = SpotifyClient.getTokenRequestOptions({
      grantType: 'test',
      refreshToken: 'a refresh token',
    })
    expect(options).to.deep.equal({
      url: 'https://accounts.spotify.com/api/token',
      form: {
        ['grant_type']: 'test',
        ['refresh_token']: 'a refresh token',
      },
      headers: { Authorization: 'Basic Y2xpZW50X2lkOmNsaWVudF9zZWNyZXQ=' },
      json: true,
    })
  })

  it('should get Spotify tokens', async () => {
    sinon.stub(request, 'post').yields(
      null,
      {
        statusCode: 200,
      },
      {
        ['access_token']: 'access_token',
        ['refresh_token']: 'refresh_token',
        ['expires_in']: 'expires_in',
      },
    )
    const tokens = await SpotifyClient.getTokens('a nice code')
    expect(tokens).to.deep.equal({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      expiresIn: 'expires_in',
    })
    ;(request.post as any).restore()
  })

  it('should get Spotify user data with images', async () => {
    sinon.stub(request, 'get').yields(
      null,
      {
        statusCode: 200,
      },
      {
        country: 'CR',
        id: '123123',
        display_name: 'juan.morales',
        email: 'juan.morales@gmail.com',
        images: [{ url: 'image_url' }],
      },
    )
    const userData = await SpotifyClient.getUserData('access_token')
    expect(userData).to.deep.equal({
      country: 'CR',
      id: '123123',
      displayName: 'juan.morales',
      email: 'juan.morales@gmail.com',
      profileImageUrl: 'image_url',
    })
    ;(request.get as any).restore()
  })

  it('should get Spotify user data without images', async () => {
    sinon.stub(request, 'get').yields(
      null,
      {
        statusCode: 200,
      },
      {
        country: 'CR',
        id: '123123',
        display_name: 'juan.morales',
        email: 'juan.morales@gmail.com',
      },
    )
    const userData = await SpotifyClient.getUserData('access_token')
    expect(userData).to.deep.equal({
      country: 'CR',
      id: '123123',
      displayName: 'juan.morales',
      email: 'juan.morales@gmail.com',
      profileImageUrl: undefined,
    })
    ;(request.get as any).restore()
  })

  it('Should handle unauthorized errors', async () => {
    sinon
      .stub(request, 'get')
      .yields(
        null,
        { statusCode: 200 },
        { error: { status: 401, message: 'Invalid access token' } },
      )
    const options = {
      url: 'some-url',
      json: true,
      headers: {
        Authorization: 'some-token',
      },
    }
    try {
      await SpotifyClient.doSpotifyRequest(options)
    } catch (error) {
      expect(error instanceof SpotifyUnauthorizedError).to.equal(true)
      expect(error.message).to.equal('Invalid access token')
    }
    ;(request.get as any).restore()
  })

  it('Should handle general errors', async () => {
    sinon
      .stub(request, 'get')
      .yields(null, { statusCode: 200 }, { error: { status: 404, message: 'Super bad error' } })
    const options = {
      url: 'some-url',
      json: true,
      headers: {
        Authorization: 'some-token',
      },
    }
    try {
      await SpotifyClient.doSpotifyRequest(options)
    } catch (error) {
      expect(error instanceof Error).to.equal(true)
      expect(error.message).to.equal('Super bad error')
    }
    ;(request.get as any).restore()
  })

  it('Should search for songs', async () => {
    sinon.stub(request, 'get').yields(null, { statusCode: 200 }, searchSongsMock)
    const searchResponse = await SpotifyClient.searchSong('access-token', 'raw deal')
    expect(searchResponse).to.deep.equal(searchSongsMock)
    ;(request.get as any).restore()
  })

  it('Should add song to playlist', async () => {
    sinon.stub(request, 'post').yields(null, { statusCode: 200 }, {})
    const addSongResponse = await SpotifyClient.addSongToPlaylist(
      'access-token',
      'playlist1',
      'spotify:track:1',
    )
    expect(addSongResponse).to.deep.equal(true)
    ;(request.post as any).restore()
  })

  it('Should refresh access tokens', async () => {
    sinon
      .stub(request, 'post')
      .yields(null, { statusCode: 200 }, { ['access_token']: 'new-access-token' })
    const response = await SpotifyClient.refreshAccessToken('some-refresh-token')
    expect(response).to.equal('new-access-token')
    ;(request.post as any).restore()
  })
})
