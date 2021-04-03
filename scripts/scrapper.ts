import scrapeIt from 'scrape-it'
import fs from 'fs'

export const webscrapWebsite = async (): Promise<void> => {
  console.log('--------------------------')
  const response = await scrapeIt('https://digitaldreamdoor.com/pages/best_songs-motown.html', {
    list: '.list',
  })
  const { data } = response
  const list: string = (data as any).list
  const listItems = list.split('\n')
  const max = 100
  let count = 0
  const songs = []
  for (const listItem of listItems) {
    if (count >= max) {
      break
    }
    const songNumber = parseInt(listItem.substring(0, listItem.indexOf('.')).trim())
    if (isNaN(songNumber)) {
      continue
    }
    const listItemWithoutNumber = listItem
      .substring(listItem.indexOf('.') + 1, listItem.length)
      .trim()
    const songAndArtist = listItemWithoutNumber.split('-')
    const songName = songAndArtist[0].trim()
    const artistName = songAndArtist[1].trim()
    songs.push({
      name: songName,
      artist: artistName,
    })
    count++
  }
  fs.writeFileSync('./scripts/songs/soul.json', JSON.stringify(songs))
  console.log('genre file generated successfully')
}

export const webscrapWebsiteClassicalSongs = async (): Promise<void> => {
  console.log('--------------------------')
  const response = await scrapeIt(
    'http://kickassclassical.com//classical-music-popular-famous-best-top-100-list.html',
    {
      songs: {
        listItem: 'tr',
      },
    },
  )
  const { data } = response as any
  const songs: string[] = (data.songs as []).slice(1, data.songs.length)
  console.log('data', songs.length)
  const finalSongs: any[] = []
  for (const song of songs) {
    const songData = song.split('\n')
    const artist = songData[1].replace('\r', '').trim()
    const songName = songData[2].replace('\r', '').trim()
    finalSongs.push({
      name: songName,
      artist,
    })
  }
  fs.writeFileSync('./scripts/songs/classical.json', JSON.stringify(finalSongs))
  console.log('genre file generated successfully')
}

export const webscrapWebsiteJazzSongs = async (): Promise<void> => {
  console.log('--------------------------')
  const response = await scrapeIt('https://www.jazz24.org/the-jazz-100/', {
    songs: {
      listItem: 'tr',
      data: {
        number: 'td.xl74',
        songName: 'td.xl75',
        artistName: 'td.xl76',
      },
    },
  })
  const { data } = response as any
  const songs: any[] = (data.songs as []).slice(2, data.songs.length)
  console.log('songs', songs)
  const finalSongs: any[] = []
  for (const song of songs) {
    finalSongs.push({
      name: song.songName.replace('\n', ' ').trim(),
      artist: song.artistName.replace('\n', ' ').trim(),
    })
  }
  fs.writeFileSync('./scripts/songs/jazz.json', JSON.stringify(finalSongs))
  console.log('genre file generated successfully')
}

export const webscrapWebsitePopSongs = async (): Promise<void> => {
  console.log('--------------------------')
  const response = await scrapeIt('https://www.liveabout.com/top-pop-songs-of-all-time-3248395', {
    songs: {
      listItem: '.mntl-sc-list-item',
      data: {
        title: '.mntl-sc-list-item-title > a',
      },
    },
  })
  const { data } = response as any
  const songs: any[] = (data.songs as []).slice(2, data.songs.length)
  const finalSongs: any[] = []
  for (const song of songs) {
    const title = song.title
    if (!title) {
      continue
    }
    const songData = title.split(':')
    const artist = songData[0]
    const songName = songData[1].substring(
      songData[1].indexOf("'") + 1,
      songData[1].lastIndexOf("'"),
    )
    finalSongs.push({
      name: artist.trim(),
      artist: songName.trim(),
    })
  }
  fs.writeFileSync('./scripts/songs/pop.json', JSON.stringify(finalSongs))
  console.log('genre file generated successfully')
}

webscrapWebsite()
  .then(() => {
    console.log('all good...')
  })
  .catch((err) => console.error('Error web scrapping website', err, err.message))
