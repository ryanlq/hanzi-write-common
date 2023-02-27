import { get, set } from './idb-keyval.js';
import { getUniqueId } from './utils.js';

export let wasStoreEmpty = false;

// Songs are stored in IDB as an array under the 'songs' key.
//
// Songs have unique IDs to identify them. Songs also have a title, artist, album, and duration.
// We do not read this information from the song file itself, this is stored in IDB too.
// 
// There are 2 types of songs: remote and file.
// A remote song is one that has a URL to a remote audio file. A remote song's ID is its URL.
// A file song is one that was loaded as a file from disk and stored in IDB. A file song's ID
// is a unique ID generated when importing the file.

/**
 * Get the list of all songs stored in IDB.
 */
export async function getSongs() {
  let songs = await get('pwamp-songs');

  if (!songs) {
    wasStoreEmpty = true;

    // The songs array doesn't even exist, so this is the first time we're running.
    // Add a couple of songs to get started so the app isn't empty.
    songs = [{
      type: 'url',
      id: 'https://hanzi-write-common.pages.dev/pwamp/songs/醉酒的蝴蝶.mp3',
      title: '醉酒的蝴蝶',
      artist: 'Noi2er',
      album: '醉酒的蝴蝶',
      duration: '02:48',
      dateAdded: Date.now(),
      lyric:"[00:00.47]崔伟立 - 酒醉的蝴蝶[00:02.66]作词：刘海东[00:04.04]作曲：刘海东[00:05.37]编曲：崔伟立[00:15.53]怎么也飞不出[00:18.89]花花的世界[00:22.26]原来我是一只[00:25.67]酒醉的蝴蝶[00:28.78]你的那一句誓约[00:32.20]来的轻描又淡写[00:35.62]却要换我这一生[00:38.96]再也解不开的结[00:42.90]春去镜前花[00:46.21]秋来水中月[00:49.43]原来我就是那一只[00:53.12]酒醉的蝴蝶[00:56.53]花开花时节[01:00.00]月落月圆缺[01:03.11]原来我就是那一只[01:06.88]酒醉的蝴蝶[01:24.14]怎么也飞不出[01:27.42]花花的世界[01:30.84]原来我是一只[01:34.27]酒醉的蝴蝶[01:37.48]你的那一句誓约[01:40.70]来的轻描又淡写[01:44.23]却要换我这一生[01:47.55]再也解不开的结[01:51.48]春去镜前花[01:54.80]秋来水中月[01:58.01]原来我就是那一只[02:01.71]酒醉的蝴蝶[02:05.19]花开花时节[02:08.61]月落月圆缺[02:11.72]原来我就是那一只[02:15.43]酒醉的蝴蝶[02:19.01]酒醉的蝴蝶"
    },
    {
      type: 'url',
      id: 'https://hanzi-write-common.pages.dev/pwamp/songs/幸福万年长.m4a',
      title: '幸福万年长',
      artist: 'David Rousset',
      album: '幸福万年长',
      duration: '04:14',
      lyric:"[00:00]幸福万年长 (单曲) - 汤灿[00:09]词：晓东[00:19]曲：浮克[00:29]手把一只划船的小桨[00:35]载满了鲜花儿去街上[00:42]划呀划呀划呀划呀[00:49]清清的河水花儿香[00:56]手把一只划船的小桨[01:03]卖完了鲜花儿买衣裳[01:10]划呀划呀划呀划呀[01:17]穿着那新衣真漂亮[01:24]嘿呀 水呀水荡漾前浪推后浪[01:31]嘿呀 心呀心向往幸福万年长[02:06]手把一只划船的小桨[02:13]阿哥撒网我摇桨[02:20]划呀划呀划呀划呀[02:27]满船的鱼儿条条壮[02:33]手把一只划船的小桨[02:41]阿哥伴我坐船上[02:48]看着夕阳望着流水[02:55]爱象那江水万年长[03:02]嘿呀 水呀水荡漾前浪推后浪[03:09]嘿呀 心呀心向往幸福万年长[03:15]嘿呀 水呀水荡漾前浪推后浪[03:22]嘿呀 心呀心向往幸福万年长",
      dateAdded: Date.now()
    },
    {
      type: 'url',
      id: 'https://hanzi-write-common.pages.dev/pwamp/songs/彩云之南.m4a',
      title: '彩云之南',
      artist: 'David Rousset',
      album: '彩云之南',
      duration: '04:14',
      lyric:"[00:01.18]徐千雅 - 彩云之南[00:02.52]作词：何沐阳[00:03.35]作曲：何沐阳[00:27.76]彩云之南我心的方向[00:33.32]孔雀飞去回忆悠长[00:39.05]玉龙雪山闪耀着银光[00:45.09]秀色丽江人在路上[00:50.48]彩云之南归去的地方[00:56.17]往事芬芳随风飘扬[01:01.91]蝴蝶泉边歌声在流淌[01:08.04]泸沽湖畔心仍荡漾[01:14.63]记得那时那里的天多湛蓝[01:17.19]你的眼里闪着温柔的阳光[01:20.11]这世界变幻无常[01:22.87]如今你又在何方[01:25.79]原谅我无法陪你走那么长[01:28.63]别人的天堂不是我们的远方[01:31.50]不虚此行别遗憾[01:42.29]彩云之南我心的方向[01:47.60]孔雀飞去回忆悠长[01:53.31]玉龙雪山闪耀着银光[01:59.37]秀色丽江人在路上[02:04.75]彩云之南归去的地方[02:10.41]往事芬芳随风飘扬[02:16.14]蝴蝶泉边歌声在流淌[02:22.31]泸沽湖畔心仍荡漾[02:28.91]记得那时那里的天多湛蓝[02:31.50]你的眼里闪着温柔的阳光[02:34.33]这世界变幻无常[02:37.18]如今你又在何方[02:40.11]原谅我无法陪你走那么长[02:42.94]别人的天堂不是我们的远方[02:45.78]不虚此行别遗憾[03:03.17]记得那时那里的天多湛蓝[03:05.86]你的眼里闪着温柔的阳光[03:08.67]这世界变幻无常[03:11.52]如今你又在何方[03:14.40]原谅我无法陪你走那么长[03:17.25]别人的天堂不是我们的远方[03:20.06]不虚此行别遗憾[03:25.99]记得那时那里的天多湛蓝[03:28.66]你的眼里闪着温柔的阳光[03:31.45]这世界变幻无常[03:34.35]如今你又在何方[03:37.22]原谅我无法陪你走那么长[03:40.07]别人的天堂不是我们的远方[03:42.85]不虚此行别遗憾",
      dateAdded: Date.now()
    }
];

    await set('pwamp-songs', songs);

    // And store the artwork for those songs.
    await setArtwork('Noi2er', 'Beyond Reality (Vacuum) (LP)', 'https://ia803401.us.archive.org/11/items/DWK382/Noi2er_-_Beyond_Reality_Vacuum_Front.jpg');
    await setArtwork('David Rousset', 'Davrous Universe', 'https://microsoftedge.github.io/Demos/pwamp/songs/Reunion.jpg');
  }

  // Verify that all songs have the new dateAdded field,
  // If not, set it to the current date.
  for (let i = 0; i < songs.length; i++) {
    let needToStore = false;
    if (!songs[i].dateAdded) {
      songs[i].dateAdded = Date.now();
      needToStore = true;
    }

    if (needToStore) {
      await set('pwamp-songs', songs);
    }
  }

  return songs;
}

/**
 * Get a song by its ID.
 */
export async function getSong(id) {
  const songs = await getSongs();
  return songs.find(song => song.id === id);
}

/**
 * Check if the given remote song URL is already in IDB.
 */
export async function hasRemoteURLSong(url) {
  const songs = await getSongs();
  return !!songs.find(s => s.id === url);
}

/**
 * Add a new remote song to the list of songs in IDB.
 */
export async function addRemoteURLSong(url, title, artist, album, duration) {
  await addSong('url', url, title, artist, album, duration);
}

/**
 * DO NOT LOOP OVER THIS FUNCTION TO IMPORT SEVERAL FILES, THIS WILL LEAD TO
 * AN INCONSISTENT STORE STATE. USE addMultipleLocalFileSongs() INSTEAD.
 * Add a new file song to the list of songs in IDB.
 * The song is expected to be passed as a File object.
 */
export async function addLocalFileSong(file, title, artist, album, duration) {
  const id = getUniqueId();
  await addSong('file', id, title, artist, album, duration, file);
}

/**
 * Add several new file songs to the list of songs in IDB.
 */
export async function addMultipleLocalFileSongs(fileSongs) {
  fileSongs = fileSongs.map(fileSong => {
    return {
      title: fileSong.title,
      artist: fileSong.artist,
      album: fileSong.album,
      duration: fileSong.duration,
      data: fileSong.file,
      type: 'file',
      id: getUniqueId(),
      dateAdded: Date.now()
    }
  });

  let songs = await getSongs();
  songs = [...songs, ...fileSongs];
  await set('pwamp-songs', songs);
}

/**
 * Private implementation of addSong.
 */
async function addSong(type, id, title, artist, album, duration, data = null) {
  const song = {
    type,
    id,
    title,
    artist,
    album,
    duration,
    dateAdded: Date.now(),
    data
  };

  let songs = await getSongs();
  songs.push(song);
  await set('pwamp-songs', songs);
}

/**
 * Given the unique ID to an existing song, edit its title, artist and album.
 */
export async function editSong(id, title, artist, album) {
  const songs = await getSongs();
  const song = songs.find(s => s.id === id);
  if (!song) {
    throw new Error(`Could not find song with id ${id}`);
  }

  song.title = title;
  song.artist = artist;
  song.album = album;

  await set('pwamp-songs', songs);
}

/**
 * Given the unique ID to an existing song, delete it from IDB.
 */
export async function deleteSong(id) {
  let songs = await getSongs();
  songs = songs.filter(song => song.id !== id);
  await set('pwamp-songs', songs);
}

/**
 * Delete all songs from IDB.
 */
export async function deleteAllSongs() {
  await set('pwamp-songs', []);
}

export async function sortSongsBy(field) {
  if (['dateAdded', 'title', 'artist', 'album'].indexOf(field) === -1) {
    return;
  }

  let songs = await getSongs();

  songs = songs.sort((a, b) => {
    if (a[field] < b[field]) {
      return field === 'dateAdded' ? 1 : -1;
    } else if (a[field] > b[field]) {
      return field === 'dateAdded' ? -1 : 1;
    } else {
      return 0;
    }
  });
  await set('pwamp-songs', songs);
}

/**
 * Set the volume in IDB so that we can remember it next time.
 */
export async function setVolume(volume) {
  await set('pwamp-volume', volume);
}

/**
 * Get the stored volume.
 */
export async function getVolume() {
  return await get('pwamp-volume');
}

/**
 * Set a custom skin in IDB.
 */
export async function setCustomSkin(skin) {
  await set('pwamp-customSkin', skin);
}

/**
 * Get the currently stored custom skin.
 */
export async function getCustomSkin(skin) {
  return await get('pwamp-customSkin');
}

/**
 * Store a new artwork for the given artist and album.
 */
export async function setArtwork(artist, album, image) {
  let artworks = await get('pwamp-artworks');
  if (!artworks) {
    artworks = {};
  }
  artworks[`${artist}`] = image;
  await set('pwamp-artworks', artworks);
}

/**
 * Get the stored artworks.
 */
export async function getArtworks() {
  return await get('pwamp-artworks') || {};
}
