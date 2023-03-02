import { getUniqueId } from "./utils.js";

export function removeAllSongs(playlistSongsContainer) {
  playlistSongsContainer.innerHTML = '';
}

export function createSongUI(playlistSongsContainer, song, stateLess) {
  const li = document.createElement(stateLess ? "p" : "li");
  li.classList.add('playlist-song');
  li.classList.add(song.type === 'file' ? 'file' : 'remote');
  li.id = song.id;

  const baseInfo = document.createElement("div");
  baseInfo.classList.add("base")
  // Play button
  if (!stateLess) {
    let playButton = null;
    playButton = document.createElement("button");
    playButton.classList.add('play');
    playButton.setAttribute('title', 'Play this song');
    playButton.innerHTML = '<span>Play</span>';
    baseInfo.appendChild(playButton);
  }

  // Album artwork
  const albumArt = document.createElement("img");
  albumArt.classList.add('artwork');
  albumArt.setAttribute('loading', 'lazy');
  let picurl = './album-art-placeholder.png'
  if(song.hasOwnProperty("picture") && (song["picture"] instanceof  Blob)){
    picurl = URL.createObjectURL(song.picture)
  }
  albumArt.setAttribute('src', song.artworkUrl || picurl );
  baseInfo.appendChild(albumArt);

  // Song title
  const titleInput = document.createElement("span");
  titleInput.classList.add('title');
  titleInput.setAttribute('title', song.title+' - '+song.artist);
  titleInput.textContent = song.title +' - '+song.artist;
  if (!stateLess) {
    titleInput.setAttribute('contenteditable', true);
    titleInput.setAttribute('spellcheck', false);
  }
  baseInfo.appendChild(titleInput);
  li.appendChild(baseInfo)

  // Artist name
  const artistInput = document.createElement("span");
  artistInput.classList.add('artist');
  artistInput.setAttribute('title', 'Artist');
  artistInput.textContent = song.artist;
  if (!stateLess) {
    artistInput.setAttribute('contenteditable', true);
    artistInput.setAttribute('spellcheck', false);
  }
  li.appendChild(artistInput);

  // Album name
  const albumInput = document.createElement("span");
  albumInput.classList.add('album');
  albumInput.setAttribute('title', 'Album');
  albumInput.textContent = song.album;
  if (!stateLess) {
    albumInput.setAttribute('contenteditable', true);
    albumInput.setAttribute('spellcheck', false);
  }
  li.appendChild(albumInput);

  // Duration label
  const durationLabel = document.createElement("time");
  durationLabel.classList.add('duration');
  durationLabel.textContent = song.duration;
  li.appendChild(durationLabel);

  if(stateLess){
    li.addEventListener('click', () => {
      li.dispatchEvent(new CustomEvent("play-song", { bubbles: true }));
    });
  }
  // Actions button
  if (!stateLess) {

    const actionsButton = document.createElement("button");
    actionsButton.classList.add('actions');
    actionsButton.setAttribute('title', 'Song actions');
    actionsButton.innerHTML = '<span>Actions</span>';
    li.appendChild(actionsButton);

  // Play button event listener
    playButton.addEventListener('click', () => {
      li.dispatchEvent(new CustomEvent("play-song", { bubbles: true }));
    });
    // Auto-select text on focus
    function focusText() {
      window.setTimeout(function () {
        const range = document.createRange();
        range.selectNodeContents(document.activeElement);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }, 1);
    }
    titleInput.addEventListener('focus', focusText);
    artistInput.addEventListener('focus', focusText);
    albumInput.addEventListener('focus', focusText);

    // Song details change listener
    function handleDetailsEdit() {
      li.dispatchEvent(new CustomEvent("edit-song", {
        detail: {
          artist: artistInput.textContent,
          album: albumInput.textContent,
          title: titleInput.textContent
        }
      }));
    }
    titleInput.addEventListener('input', handleDetailsEdit);
    artistInput.addEventListener('input', handleDetailsEdit);
    albumInput.addEventListener('input', handleDetailsEdit);

    // Actions button event listener
    actionsButton.addEventListener('click', () => {
      const anchorID = getUniqueId();
      actionsButton.id = anchorID;
      li.dispatchEvent(new CustomEvent("show-actions", {
        bubbles: true,
        detail: { anchorID, x: actionsButton.offsetLeft, y: actionsButton.offsetTop + actionsButton.offsetHeight }
      }));
    });
  }

  playlistSongsContainer.appendChild(li);

  return li;
}

export function createLoadingSongPlaceholders(playlistSongsContainer, nbOfPlaceholders) {
  for (let i = 0; i < nbOfPlaceholders; i++) {
    const playlistSongEl = createSongUI(playlistSongsContainer, { title: '', artist: '', album: '', id: getUniqueId(), type: 'file' ,picture:''},true);
    playlistSongEl.classList.add('loading-placeholder');
    playlistSongsContainer.appendChild(playlistSongEl);
  }
}

export function removeLoadingSongPlaceholders(playlistSongsContainer) {
  playlistSongsContainer.querySelectorAll('.loading-placeholder').forEach(li => {
    li.remove();
  });
}
