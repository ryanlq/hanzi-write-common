import { getSongs, getSong, editSong, setVolume, getVolume, deleteSong, deleteAllSongs, addLocalFileSong, setArtwork, wasStoreEmpty, sortSongsBy } from "./store.js";
import { Player } from "./player.js";
import { Lyric } from "./lyric.js";
import { formatTime, openFilesFromDisk, getFormattedDate, canShare, analyzeDataTransfer, getImageAsDataURI } from "./utils.js";
import { importSongsFromFiles } from "./importer.js";
import { Visualizer } from "./visualizer.js";
import { exportSongToFile } from "./exporter.js";
import { loadCustomOrResetSkin, reloadStoredCustomSkin } from "./skin.js";
import { startRecordingAudio, stopRecordingAudio } from "./recorder.js";
import { createSongUI, removeAllSongs, createLoadingSongPlaceholders, removeLoadingSongPlaceholders } from "./song-ui-factory.js";
import { initMediaSession } from "./media-session.js";
import { initKeyboardShortcuts } from "./keys.js";
import { Speaker } from "./libs/Speaker.js";
import { LyricParser } from "./libs/LyricParser.js"
import { preload } from "./libs/preload.js"

// Whether the app is running in the Microsoft Edge sidebar.
const isSidebarPWA = (() => {
  if (navigator.userAgentData) {
    return navigator.userAgentData.brands.some(b => {
      return b.brand === "Edge Side Panel";
    });
  }

  return false;
})();

// Whether we are running as an installed PWA or not.
const isInstalledPWA = window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                       window.matchMedia('(display-mode: standalone)').matches;

// All of the UI DOM elements we need.
const playButton = document.getElementById("playpause");
const playButtonLabel = playButton.querySelector("span");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const playHeadInput = document.getElementById("playhead");
const visualizerButton = document.getElementById("toggle-visualizer");
const visualizerEl = document.getElementById("waveform");
const volumeInput = document.getElementById("volume");
const currentTimeLabel = document.getElementById("currenttime");
const durationLabel = document.getElementById("duration");
const playlistEl = document.querySelector(".playlist");
export const playlistSongsContainer = document.querySelector(".playlist .songs");
const addSongsButton = document.getElementById("add-songs");
const songActionsPopover = document.getElementById("song-actions-popover");
const songActionDelete = document.getElementById("song-action-delete");
const songActionCopyUri = document.getElementById("song-action-copy-uri");
const songActionExport = document.getElementById("song-action-export");
const songActionShare = document.getElementById("song-action-share");
const playlistActionsButton = document.getElementById("playlist-actions");
const playlistActionsPopover = document.getElementById("playlist-actions-popover");
const playlistActionDeleteAll = document.getElementById("playlist-action-delete");
const playlistActionExportAll = document.getElementById("playlist-action-export");
const playlistActionAbout = document.getElementById("playlist-action-about");
const playlistActionSortByArtist = document.getElementById("playlist-action-sortbyartist");
const playlistActionSortByAlbum = document.getElementById("playlist-action-sortbyalbum");
const playlistActionSortByDateAdded = document.getElementById("playlist-action-sortbydateadded");
const loadCustomSkinButton = document.getElementById("load-custom-skin");
const recordAudioButton = document.getElementById("record-audio");
const aboutDialog = document.getElementById("about-dialog");
const installButton = document.getElementById("install-button");
const currentSongSection = document.querySelector('.current-song');
const lyricPanel = document.querySelector('#lyric-panel');

let currentSongEl = null;

let isFirstUse = true;
let MYSONGS = {};

// Instantiate the player object. It will be used to play/pause/seek/... songs. 
const player = new Player();
window.xPlayer = player;

// Instantiate the player object. It will be used to play/pause/seek/... songs. 
const lyric = new Lyric();

// Initialize the media session.
initMediaSession(player);

// Instantiate the visualizer object to draw the waveform.
const visualizer = new Visualizer(player, visualizerEl);

// Aa simple interval loop is used to update the UI (e.g. the playhead and current time).
let updateLoop = null;

// The update loop.
function updateUI() {
  // Reset the play states in the playlist. We'll update the current one below.
  playlistSongsContainer.querySelectorAll(".playing").forEach(el => el.classList.remove('playing'));
  playButton.classList.remove('playing');
  playButtonLabel.textContent = 'Play';
  playButton.title = 'Play (space)';
  document.documentElement.classList.toggle('playing', false);

  if (!player.song) {
    // No song is loaded. Show the default UI.
    playHeadInput.value = 0;
    currentTimeLabel.textContent = "00:00";
    durationLabel.textContent = "00:00";

    return;
  }

  // Update the play head and current time/duration labels.
  const currentTime = player.currentTime;
  const duration = player.duration;

  playHeadInput.value = currentTime;
  playHeadInput.max = duration;

  currentTimeLabel.innerText = formatTime(currentTime);
  durationLabel.innerText = formatTime(duration);

  if (player.isPlaying) {
    playButton.classList.add('playing');
    playButtonLabel.textContent = 'Pause';
    playButton.title = 'Pause (space)';
    document.documentElement.classList.toggle('playing', true);
  }

  // Update the play state in the playlist.
  const currentSong = playlistSongsContainer.querySelector(`[id="${player.song.id}"]`);
  currentSong && currentSong.classList.add('playing');
  loadLyric()
  // lyricPanel.scrollTo(0,0)
}

// Calling this function starts (or reloads) the app.
// If the store is changed, you can call this function again to reload the app.
export async function startApp() {
  clearInterval(updateLoop);
  const _songs = await getSongs()
  _songs.forEach(song=>{
    if(!song) return
    MYSONGS[song.id.toString()] = song
  })
  removeLoadingSongPlaceholders(playlistSongsContainer);

  // Restore the volume from the store.
  const previousVolume = await getVolume();
  player.volume = previousVolume === undefined ? 1 : previousVolume;
  volumeInput.value = player.volume * 10;

  // Restore the skin from the store.
  await reloadStoredCustomSkin();

  // Reload the playlist from the store.
  const songs = await player.loadPlaylist();

  // Populate the playlist UI.
  removeAllSongs(playlistSongsContainer);
  for (const song of songs) {
    // const playlistSongEl = createSongUI(playlistSongsContainer, song);
    const playlistSongEl = createSongUI(playlistSongsContainer, song, true);// stateless = true

    playlistSongEl.addEventListener('play-song', () => {
      player.pause();
      player.play(song);
      currentSongEl = playlistSongEl;
    });

    playlistSongEl.addEventListener('edit-song', e => {
      editSong(song.id, e.detail.title, e.detail.artist, e.detail.album);
    });

    playlistSongEl.addEventListener('show-actions', e => {
      songActionsPopover.showPopover();

      // TODO: anchoring is not yet supported. Once it is, use the ID passed in the event.
      // This is the ID for the button that was clicked.
      // songActionsPopover.setAttribute('anchor', e.detail.id);
      // In the meantime, anchor manually.
      songActionsPopover.style.left = `${e.detail.x - songActionsPopover.offsetWidth}px`;
      songActionsPopover.style.top = `${e.detail.y - playlistEl.scrollTop}px`;

      songActionsPopover.currentSong = song;

      songActionShare.disabled = !canShare(song);
      songActionCopyUri.disabled = song.type !== 'url';
    });
  }
  if(songs.length > 0){
    playlistEl.classList.add('has-songs');
  } else {
    playlistEl.classList.remove('has-songs');
  }
  

  // Start the update loop.
  updateLoop = setInterval(updateUI, 500);

  // Show the about dialog if this is the first time the app is started.
  if (wasStoreEmpty && isFirstUse && !isInstalledPWA && !isSidebarPWA) {
    aboutDialog.showModal();
    isFirstUse = false;
  }
}

// Below are the event handlers for the UI.

// Manage the play button.
playButton.addEventListener("click", () => {
  if (player.isPlaying) {
    player.pause();
  } else {   
    player.play();
  }
});

// Seek on playhead input.
playHeadInput.addEventListener("input", () => {
  player.currentTime = playHeadInput.value;
});

// Manage the volume input
volumeInput.addEventListener("input", () => {
  player.volume = volumeInput.value / 10;
  setVolume(player.volume);
});

// Manage the previous and next buttons.
function goPrevious() {
  // If this happened in the first few seconds of the song, go to the previous one.
  // Otherwise just restart the current song.
  const time = player.currentTime;
  const isSongStart = time < 3;

  if (isSongStart) {
    player.playPrevious();
  } else {
    player.currentTime = 0;
  }
}

previousButton.addEventListener("click", () => {
  goPrevious();
});

nextButton.addEventListener("click", () => {
  player.playNext();
});

// Also go to the next or previous songs if the SW asks us to do so.
navigator.serviceWorker.addEventListener('message', (event) => {
  switch (event.data.action) {
    case 'play':
      player.play();
      break;
    case 'next':

      player.playNext();
      break;
    case 'previous':
      goPrevious();
      break;
  }
  
});

// Listen to player playing/paused status to update the visualizer.
player.addEventListener("canplay", async () => {
  isVisualizing() && visualizer.start();

  // Also tell the SW we're playing.
  const artworkUrl = player.song.artworkUrl
    ? await getImageAsDataURI(player.song.artworkUrl)
    : 'https://microsoftedge.github.io/Demos/pwamp/album-art-placeholder.png';

  await sendMessageToSW({
    action: 'playing',
    song: player.song.title,
    artist: player.song.artist,
    playing: true,
    artworkUrl
  });

  // Update the current song section.
  currentSongSection.innerHTML = '';
  createSongUI(currentSongSection, player.song, true);
});

player.addEventListener("paused", () => {
  isVisualizing() && visualizer.stop();

  // Also tell the SW we're paused.
  sendMessageToSW({ action: 'paused' });
});

async function sendMessageToSW(data) {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration.active) {
    registration.active.postMessage(data);
  }
}

// Listen to beforeunload to clean things up.
addEventListener('beforeunload', () => {
  sendMessageToSW({ action: 'paused' });
});

// Listen to song errors to let the user know they can't play remote songs while offline.
player.addEventListener("error", () => {
  if (currentSongEl) {
    currentSongEl.classList.add('error');
  }
});
player.addEventListener("playing", () => {
  if (currentSongEl) {
    currentSongEl.classList.remove('error');
  }
});

// Manage the add song button.
addSongsButton.addEventListener("click", async () => {
  const files = await openFilesFromDisk();

  try {
    
    createLoadingSongPlaceholders(playlistSongsContainer, files.length);
    await importSongsFromFiles(files);

    await startApp();
  } catch (error) {
    console.log(error)
  }
});

// Manage the song actions.
songActionDelete.addEventListener("click", async () => {
  const song = songActionsPopover.currentSong;
  if (!song) {
    return;
  }

  songActionsPopover.currentSong = null;
  songActionsPopover.hidePopover();

  await deleteSong(song.id);
  await startApp();
});

songActionExport.addEventListener("click", async () => {
  const song = songActionsPopover.currentSong;
  if (!song) {
    return;
  }

  songActionsPopover.currentSong = null;
  songActionsPopover.hidePopover();

  await exportSongToFile(song);
});

songActionShare.addEventListener("click", async () => {
  const song = songActionsPopover.currentSong;
  if (!song || !canShare(song.data)) {
    return;
  }

  songActionsPopover.currentSong = null;
  songActionsPopover.hidePopover();

  navigator.share({
    title: song.title,
    files: [song.data]
  });
});

songActionCopyUri.addEventListener("click", async () => {
  const song = songActionsPopover.currentSong;
  if (!song || song.type !== 'url') {
    return;
  }

  songActionsPopover.currentSong = null;
  songActionsPopover.hidePopover();

  // The current song is a remote one. Let's create a web+amp link for it.
  const url = `web+amp:remote-song:${song.id}`;

  // And put it into the clipboard.
  await navigator.clipboard.writeText(url);
});

// Manage the custom skin button.
loadCustomSkinButton.addEventListener('click', async () => {
  await loadCustomOrResetSkin();
});

function isVisualizing() {
  return document.documentElement.classList.contains('visualizing');
}

// Manage the visualizer button.
visualizerButton.addEventListener('click', toggleVisualizer);

function toggleVisualizer() {
  const isVis = isVisualizing();

  // If we're asked to visualize but no song is playing, start the first song.
  if (!isVis && !player.isPlaying) {
    player.play();
  }

  const label = isVis ? 'Show visualizer (V)' : 'Stop visualizer (V)';
  visualizerButton.title = label;
  visualizerButton.querySelector('span').textContent = label;

  document.documentElement.classList.toggle('visualizing');

  if(isVis){
    visualizer.stop()
  } else {
    visualizer.start()
    if(!document.querySelector(".playlist-song.playing")){
      const _s = document.querySelector(".playlist-song")
      _s.classList.add("playing")
    }
  }


}

// Manage the record audio button.
recordAudioButton.addEventListener('click', async () => {
  const isRecording = recordAudioButton.classList.contains('recording');

  recordAudioButton.classList.toggle('recording', !isRecording);
  const label = !isRecording ? 'Stop recording' : 'Record an audio clip';
  recordAudioButton.title = label;
  recordAudioButton.querySelector('span').textContent = label;

  if (isRecording) {
    const { blob, duration } = await stopRecordingAudio();
    // Because audio recordings come with a duration already, no need to call
    // importSongFromFile, we can go straight to addLocalFileSong.
    await addLocalFileSong(blob, getFormattedDate(), 'Me', 'Audio recordings', formatTime(duration));
    await startApp();
  } else {
    await startRecordingAudio();
  }
});

// Manage the more tools button.
playlistActionsButton.addEventListener('click', () => {
  playlistActionsPopover.showPopover();
  playlistActionsPopover.style.left = `${playlistActionsButton.offsetLeft + (playlistActionsButton.offsetWidth / 2) - (playlistActionsPopover.offsetWidth / 2)}px`;
  playlistActionsPopover.style.top = `calc(${playlistActionsButton.offsetTop - playlistActionsPopover.offsetHeight}px - 1rem)`;
});

playlistActionDeleteAll.addEventListener('click', async () => {
  await deleteAllSongs();
  playlistActionsPopover.hidePopover();
  await startApp();
});

playlistActionSortByArtist.addEventListener('click', async () => {
  await sortSongsBy('artist');
  playlistActionsPopover.hidePopover();
  await startApp();
});

playlistActionSortByAlbum.addEventListener('click', async () => {
  await sortSongsBy('album');
  playlistActionsPopover.hidePopover();
  await startApp();
});

playlistActionSortByDateAdded.addEventListener('click', async () => {
  await sortSongsBy('dateAdded');
  playlistActionsPopover.hidePopover();
  await startApp();
});

playlistActionExportAll.addEventListener('click', async () => {
  const songs = await getSongs();
  await Promise.all(songs.map(song => exportSongToFile(song)));
  playlistActionsPopover.hidePopover();
});

playlistActionAbout.addEventListener('click', () => {
  if (typeof aboutDialog.showModal === "function") {
    aboutDialog.showModal();
  }
});

if (!isInstalledPWA && !isSidebarPWA) {
  window.addEventListener('beforeinstallprompt', e => {
    // Don't let the default prompt go.
    e.preventDefault();

    // Instead, wait for the user to click the install button.
    aboutDialog.addEventListener('close', () => {
      if (aboutDialog.returnValue === "install") {
        e.prompt();
      }
    });
  });
} else {
  installButton.disabled = true;
}

addEventListener('appinstalled', () => {
  aboutDialog.close();
});

// Manage drag/dropping songs from explorer to playlist.
addEventListener('dragover', e => {
  e.preventDefault();

  // If we're visualizing, don't allow dropping.
  if (document.documentElement.classList.contains('visualizing')) {
    return;
  }

  // If both songs and images are being dragged, or if other file types are being dragged, don't allow dropping.
  const { containsImages, containsSongs, containsOthers } = analyzeDataTransfer(e);
  if (containsOthers || (containsImages && containsSongs)) {
    return;
  }

  if (containsImages) {
    document.documentElement.classList.add('dropping-artwork');
  } else if (containsSongs) {
    document.documentElement.classList.add('dropping-songs');
  }
});

addEventListener('dragleave', e => {
  e.preventDefault();

  // If we're visualizing, don't allow dropping.
  if (document.documentElement.classList.contains('visualizing')) {
    return;
  }

  // If both songs and images are being dragged, or if other file types are being dragged, don't allow dropping.
  const { containsImages, containsSongs, containsOthers } = analyzeDataTransfer(e);
  if (containsOthers || (containsImages && containsSongs)) {
    return;
  }

  document.documentElement.classList.remove('dropping-songs');
  document.documentElement.classList.remove('dropping-artwork');
});

addEventListener('drop', async (e) => {
  e.preventDefault();

  // If we're visualizing, don't allow dropping.
  if (document.documentElement.classList.contains('visualizing')) {
    return;
  }

  // If both songs and images are being dragged, or if other file types are being dragged, don't allow dropping.
  const { containsImages, containsSongs, containsOthers, files } = analyzeDataTransfer(e);
  if (containsOthers || (containsImages && containsSongs)) {
    return;
  }

  if (containsSongs) {
    document.documentElement.classList.remove('dropping-songs');

    createLoadingSongPlaceholders(playlistSongsContainer, files.length);

    await importSongsFromFiles(files);

    await startApp();
  } else if (containsImages) {
    document.documentElement.classList.remove('dropping-artwork');

    // Only the first artwork is imported.
    const image = files[0];

    const targetSong = e.target.closest('.playlist-song');
    if (targetSong) {
      const song = await getSong(targetSong.id);
      if (song) {
        await setArtwork(song.artist, song.album, image);
        
      }
    }

    await startApp();
  }
});

// Start the app.
startApp();

// When we first start, tell the SW we're not playing.
sendMessageToSW({ action: 'paused' });

// Initialize the shortcuts.
initKeyboardShortcuts(player, toggleVisualizer);
const speak = Speaker()
function loadLyric(){
  const cur = document.querySelector(".playlist-song.playing")
  if(cur && cur.id){
    const lyric_songid = lyricPanel.getAttribute("songid")
    if(cur.id !== lyric_songid){
      const pictureid = parseInt(Math.random() * 16)
      let dir = "./imgs/"
      if(document.querySelector("html").offsetWidth<800)  dir ="./imgs/mobile/"
      
      document.body.style.backgroundImage= 'url("'+dir+pictureid+'.jpg")'
      lyricPanel.setAttribute("songid",cur.id)
      if(MYSONGS[cur.id].hasOwnProperty("lyric") && MYSONGS[cur.id]["lyric"]){
        lyric.load(MYSONGS[cur.id]["lyric"])
        setLyricPanel()
      } else {
        lyric.load("[00:03.000] 暂无歌词")
        setLyricPanel(true)
      }
      lyricPanel.scrollTo(0,0)
    }
  }
}

function setLyricPanel(isEmpty=false){
  if(lyric.symbols.length==0) return;
  
  let item_node = document.createElement("div")
  item_node.classList.add("lyric-item")
  let nodes = lyric.symbols.map(s=>{
    let new_node = item_node.cloneNode(true)
    new_node.setAttribute("data-time",s)
    new_node.innerText = lyric.lyric[s]
    new_node.addEventListener("click",function(e){
      if(document.querySelector("html").classList.contains("playing")){
        const _time = new_node.getAttribute("data-time")
        const _currentTime = parseInt(_time.slice(0,2)) * 60 + parseInt(_time.slice(3,5))
        if(player.isBuffered()){
          player.currentTime = _currentTime
        } else {
          console.log("未缓冲完成")
        }
      } else {
        speak(e.target.innerText,false)
      }

    })
    return new_node
  })
  lyricPanel.innerHTML = ""
  if(isEmpty){
    const find_lyric_btn = document.createElement("button")
    find_lyric_btn.id = "find_lyric_btn"
    find_lyric_btn.addEventListener("click",async e=>{
      const palying = document.querySelector(".playlist-song.playing")
      let _song = await getSong(palying.id)
      const lyric = await LyricParser(_song.title+" - "+_song.artist)
      
      if(lyric){
        await editSong(_song.id,_song.title,_song.artist,_song.album,lyric)
        await startApp()
      } 
    })
  }

  lyricPanel.append(...nodes)
}




player.addEventListener('timeupdated', (e) => {
  let minites = parseInt(e.target.audio.currentTime /60)
  // let seconds = (e.target.audio.currentTime %60).toFixed(3)
  let seconds = parseInt(e.target.audio.currentTime %60)

  if(minites < 10) minites = "0"+minites
  if(seconds < 10) seconds = "0"+seconds
  // seconds = seconds+".000"
  const tag = minites + ":" +seconds
  if(lyric.symbols.includes(tag)){
    
    if(!document.querySelector(".lyric-item.playing[data-time='"+tag+"']")){
      const curplay = document.querySelector(".lyric-item.playing")
      curplay && curplay.classList.remove("playing")
      const _t = document.querySelector(".lyric-item[data-time='"+tag+"']")
      const _h = _t.clientHeight
      _t.classList.add("playing")
      const _offset = lyricPanel.clientHeight - _t.offsetTop;
      const startpos = lyricPanel.clientHeight/2
      if(_offset < startpos){

        lyricPanel.scrollTo(0,lyricPanel.scrollTop + _h)
      }
    } 
  }

},false);

function add_local_song(){
  const btn = document.querySelector("#add-local-song")
  btn.addEventListener("click",function(e){
    document.querySelector("#add-songs").click()
  })
}



window.onload = ()=>{
  add_local_song()
  preload()
}