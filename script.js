const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const playingSong = document.getElementById("player-song-title");
const songArtist = document.getElementById("player-song-artist");

const allSongs = [
  // --- Arijit Singh Hits ---
  {
    id: 0,
    title: "Dil Sambhal Ja",
    artist: "Arijit Singh",
    duration: "4:22",
    // NOTE: Replace the link below with your actual file name like "dil_sambhal.mp3" if you have it
 src="https://www.youtube.com/embed/r_3zVIyblLQ?si=7XJSi5MaBTqF83EW" ,
  },
  {
    id: 1,
    title: "Channa Mereya",
    artist: "Arijit Singh",
    duration: "4:49",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/in-the-zone.mp3",
  },
  {
    id: 2,
    title: "Kesariya",
    artist: "Arijit Singh",
    duration: "4:28",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/camper-cat.mp3",
  },
  
  // --- Romantic Songs ---
  {
    id: 3,
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal",
    duration: "3:50",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/electronic.mp3",
  },
  {
    id: 4,
    title: "Pehli Nazar Mein",
    artist: "Atif Aslam",
    duration: "5:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3",
  },

  // --- Bhakti (Devotional) ---
  {
    id: 5,
    title: "Hanuman Chalisa",
    artist: "Hariharan",
    duration: "9:45",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/hello-world.mp3",
  },
  {
    id: 6,
    title: "Achyutam Keshavam",
    artist: "Vikram Hazra",
    duration: "5:30",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/in-the-zone.mp3",
  },

  // --- Sadabahar (Evergreen) ---
  {
    id: 7,
    title: "Lag Jaa Gale",
    artist: "Lata Mangeshkar",
    duration: "4:17",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/camper-cat.mp3",
  },
  {
    id: 8,
    title: "Non-stop",
    artist: "Imran Hashmi",
    duration: "4:30",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/electronic.mp3",
  },
  
  // --- Demo ---
  {
    id: 9,
    title: "Hello World (Demo)",
    artist: "Rafael",
    duration: "0:23",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/hello-world.mp3",
  }
];

const audio = new Audio();

const userData = {
  songs: allSongs,
  currentSong: null,
  songCurrentTime: 0,
};

// Function to Render songs dynamically
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

// Initial Render
renderSongs(userData.songs);

const playSong = (id, start = true) => {
  const song = userData.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData.currentSong === null || start) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData.songCurrentTime;
  }
  
  userData.currentSong = song;
  playButton.classList.add("playing");
  setPlayerDisplay();
  highlightCurrentSong();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
};

const getCurrentSongIndex = () => userData.songs.indexOf(userData.currentSong);

const getNextSong = () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSong = userData.songs[currentSongIndex + 1];
  return nextSong ? nextSong : userData.songs[0]; // Loop back to start
};

const getPreviousSong = () => {
  const currentSongIndex = getCurrentSongIndex();
  const prevSong = userData.songs[currentSongIndex - 1];
  return prevSong ? prevSong : userData.songs[userData.songs.length - 1]; // Loop to end
};

const playPreviousSong = () => {
  if (userData.currentSong === null) return;
  const previousSong = getPreviousSong();
  playSong(previousSong.id);
};

const playNextSong = () => {
    if (userData.currentSong === null) {
      playSong(userData.songs[0].id);
    } else {
      const nextSong = getNextSong();
      playSong(nextSong.id);
    }
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
  playButton.setAttribute(
    "aria-label",
    song ? `Play ${song.title}` : "Play"
  );
};

// Event Listeners
playButton.addEventListener("click", () => {
    if (userData.currentSong === null) {
      playSong(userData.songs[0].id);
    } else {
      playSong(userData.currentSong.id, false);
    }
});

pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);

// Audio ended listener to auto-play next
audio.addEventListener("ended", () => {
    const nextSong = getNextSong();
    playSong(nextSong.id);
});
