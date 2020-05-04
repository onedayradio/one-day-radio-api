import request from 'request'
import { expect } from 'chai'
import sinon from 'sinon'
import { SpotifyApi } from 'src/shared'

describe('Spotify api', () => {
  it('should return token request options when passing a valid code', () => {
    const options = SpotifyApi.getTokenRequestOptions({ grantType: 'test', code: 'a good code' })
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
    const options = SpotifyApi.getTokenRequestOptions({
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
    const tokens = await SpotifyApi.getTokens('a nice code')
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
        id: 'juan.morales',
        email: 'juan.morales@gmail.com',
        images: [{ url: 'image_url' }],
      },
    )
    const userData = await SpotifyApi.getUserData('access_token')
    expect(userData).to.deep.equal({
      country: 'CR',
      username: 'juan.morales',
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
        id: 'juan.morales',
        email: 'juan.morales@gmail.com',
      },
    )
    const userData = await SpotifyApi.getUserData('access_token')
    expect(userData).to.deep.equal({
      country: 'CR',
      username: 'juan.morales',
      email: 'juan.morales@gmail.com',
      profileImageUrl: undefined,
    })
    ;(request.get as any).restore()
  })
})
