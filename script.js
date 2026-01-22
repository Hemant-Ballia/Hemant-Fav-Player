const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const playingSong = document.getElementById("player-song-title");
const songArtist = document.getElementById("player-song-artist");

// --- SONGS LIST (WITH YOUTUBE VIDEO IDs) ---
// src ki jagah ab 'id' use hogi.
// Example: https://www.youtube.com/watch?v=r_3zVIyblLQ  --> id is "r_3zVIyblLQ"

const allSongs = [
  // --- Arijit Singh Hits ---
  {
    id: 0,
    title: "Dil Sambhal Ja",
    artist: "Arijit Singh",
    duration: "4:50",
    ytId: "r_3zVIyblLQ", // Correct YouTube ID
  },
  {
    id: 1,
    title: "Channa Mereya",
    artist: "Arijit Singh",
    duration: "4:49",
    ytId: "284Ov7ysmfA", 
  },
  {
    id: 2,
    title: "Kesariya",
    artist: "Arijit Singh",
    duration: "4:28",
    ytId: "BddP6PYo2gs", 
  },
  
  // --- Romantic Songs ---
  {
    id: 3,
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal",
    duration: "3:50",
    ytId: "gvyUuxSY41Q",
  },
  {
    id: 4,
    title: "Pehli Nazar Mein",
    artist: "Atif Aslam",
    duration: "5:12",
    ytId: "BadB1z-V_qU", 
  },

  // --- Bhakti (Devotional) ---
  {
    id: 5,
    title: "Hanuman Chalisa",
    artist: "Hariharan",
    duration: "9:45",
    ytId: "AETFvQonfV8",
  },
  {
    id: 6,
    title: "Achyutam Keshavam",
    artist: "Vikram Hazra",
    duration: "5:30",
    ytId: "pp5P2Vd13kE",
  },

  // --- Sadabahar (Evergreen) ---
  {
    id: 7,
    title: "Lag Jaa Gale",
    artist: "Lata Mangeshkar",
    duration: "4:17",
    ytId: "TFr6G5zveS8", 
  },
  {
    id: 8,
    title: "Non-stop Hit",
    artist: "Emraan Hashmi",
    duration: "4:30",
    ytId: "EWZqulvXnZQ", 
  },
];

const userData = {
  songs: allSongs,
  currentSong: null,
  songCurrentTime: 0,
};

// --- YOUTUBE API SETUP ---
// This loads the YouTube Iframe API asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    playerVars: {
      'playsinline': 1,
      'controls': 0, // hide yt controls
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // Player is ready
  console.log("YouTube Player Ready");
}

function onPlayerStateChange(event) {
  // 0 means ended
  if (event.data === YT.PlayerState.ENDED) {
    playNextSong();
  }
  // 1 means playing
  if (event.data === YT.PlayerState.PLAYING) {
    playButton.classList.add("playing");
    playButton.setAttribute("aria-label", "Pause");
  }
  // 2 means paused
  if (event.data === YT.PlayerState.PAUSED) {
    playButton.classList.remove("playing");
    playButton.setAttribute("aria-label", "Play");
  }
}

// --- APP LOGIC ---

const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      </li>
      `;
    })
    .join("");
  playlistSongs.innerHTML = songsHTML;
};

renderSongs(userData.songs);

const playSong = (id) => {
  const song = userData.songs.find((song) => song.id === id);
  userData.currentSong = song;

  // Check if player is ready
  if (player && player.loadVideoById) {
    player.loadVideoById(song.ytId);
  }

  setPlayerDisplay();
  highlightCurrentSong();
  setPlayButtonAccessibleText();
};

const togglePlayPause = () => {
    if (!player || !userData.currentSong) {
        // If no song selected, play first
        playSong(userData.songs[0].id);
        return;
    }
    
    const playerState = player.getPlayerState();
    if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
};

const getCurrentSongIndex = () => userData.songs.indexOf(userData.currentSong);

const getNextSong = () => {
  if (!userData.currentSong) return userData.songs[0];
  const currentSongIndex = getCurrentSongIndex();
  const nextSong = userData.songs[currentSongIndex + 1];
  return nextSong ? nextSong : userData.songs[0];
};

const getPreviousSong = () => {
  if (!userData.currentSong) return userData.songs[0];
  const currentSongIndex = getCurrentSongIndex();
  const prevSong = userData.songs[currentSongIndex - 1];
  return prevSong ? prevSong : userData.songs[userData.songs.length - 1];
};

const playPreviousSong = () => {
  const previousSong = getPreviousSong();
  playSong(previousSong.id);
};

const playNextSong = () => {
  const nextSong = getNextSong();
  playSong(nextSong.id);
};

const setPlayerDisplay = () => {
  const currentTitle = userData.currentSong?.title;
  const currentArtist = userData.currentSong?.artist;
  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const previousCurrentSong = document.querySelector('[aria-current="true"]');
  if (previousCurrentSong) {
    previousCurrentSong.removeAttribute("aria-current");
  }
  const songToHighlight = document.getElementById(`song-${userData.currentSong?.id}`);
  if (songToHighlight) {
    songToHighlight.setAttribute("aria-current", "true");
  }
};

const setPlayButtonAccessibleText = () => {
  const song = userData.currentSong;
  playButton.setAttribute("aria-label", song ? `Play ${song.title}` : "Play");
};

// Event Listeners
playButton.addEventListener("click", togglePlayPause);
pauseButton.addEventListener("click", togglePlayPause); // Reuse toggle for pause button too
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
