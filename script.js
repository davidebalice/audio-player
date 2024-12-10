const overlay = document.getElementById("overlay");
const audioPlayer = document.getElementById("audio-player");
const closeButton = document.getElementById("close-button");
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
const volumeButton = document.getElementById("volume-button");
const volumeControlContainer = document.getElementById(
  "volume-control-container"
);
const volumeControl = document.getElementById("volume-control");
const infoControl = document.getElementById("info-button");
const progressContainer = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");
const playlistContainer = document.getElementById("playlist-container");
const playlistButton = document.getElementById("playlist-button");
const lyricsContainer = document.getElementById("lyrics-container");
const lyricsButton = document.getElementById("lyrics-button");
const coverContainer = document.getElementById("cover-container");
const coverImageContainer = document.getElementById("cover-image-container");
const coverButton = document.getElementById("cover-button");
const currentTrack = document.getElementById("current-track");
const nextTrack = document.getElementById("next-track");
const prevTrack = document.getElementById("prev-track");
const coverPlay = document.getElementById("cover-play");
const playTrack = document.getElementById("play-track");
const style = document.getElementById("style").value;

let currentTrackIndex = 0;
let isPlaying = false;
let tracks = [];
const colorPrimary = document.getElementById("color-primary").value;
const colorSecondary = document.getElementById("color-secondary").value;

function isMobile() {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

if (playButton) {
  playButton.addEventListener("click", () => {
    audioPlayer.play();
    isPlaying = true;
  });
}

if (pauseButton) {
  pauseButton.addEventListener("click", () => {
    audioPlayer.pause();
    isPlaying = false;
  });
}

if (stopButton) {
  stopButton.addEventListener("click", () => {
    audioPlayer.pause();
    isPlaying = false;
  });
}

infoControl.addEventListener("click", () => {
  overlay.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  overlay.style.display = "none";
});

volumeButton.addEventListener("click", () => {
  if (
    volumeControlContainer.style.display === "none" ||
    volumeControlContainer.style.display === ""
  ) {
    volumeControlContainer.style.display = "block";
  } else {
    volumeControlContainer.style.display = "none";
  }
});

volumeControl.addEventListener("input", () => {
  audioPlayer.volume = volumeControl.value;
});

audioPlayer.addEventListener("timeupdate", () => {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;

  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);
  const totalMinutes = Math.floor(duration / 60);
  const totalSeconds = Math.floor(duration % 60);

  currentTimeDisplay.textContent = `${currentMinutes}:${
    currentSeconds < 10 ? "0" : ""
  }${currentSeconds}`;
  totalTimeDisplay.textContent = `${totalMinutes}:${
    totalSeconds < 10 ? "0" : ""
  }${totalSeconds}`;

  const progress = (currentTime / duration) * 100;
  progressBar.style.width = `${progress}%`;
});

async function loadPlaylist() {
  try {
    const response = await fetch("playlist.json");
    const playlist = await response.json();

    const olElement = document.createElement("ol");
    olElement.id = "playlist";
    playlistContainer.appendChild(olElement);

    playlist.forEach((track, index) => {
      const liElement = document.createElement("li");
      liElement.innerHTML = `<div class='playlist-row'> <div class='playlist-content'><div class='playlist-number'>${
        index + 1
      }.</div><div class='playlist-title'>${track.title}</div></div><div>${
        track.time
      }</div></div>`;
      liElement.setAttribute("data-src", track.url);
      olElement.appendChild(liElement);
    });

    tracks = olElement.querySelectorAll("li");
    tracks.forEach((track, index) => {
      track.addEventListener("click", () => {
        tracks.forEach((t) => {
          t.style.color = colorPrimary;
        });
        const src = track.getAttribute("data-src");
        audioPlayer.src = src;
        audioPlayer.play();
        track.style.color = colorSecondary;
        currentTrackIndex = index;
        isPlaying = true;
        coverPlay.src = "img/pause3.png";
        loadInfo();

        const titleElement = track.querySelector(
          ".playlist-content .playlist-title"
        );
        const trackTitle = titleElement ? titleElement.innerText : "";
        currentTrack.innerText = trackTitle;
      });

      if (!isMobile()) {
        const itemsPerColumn = Math.ceil(playlist.length / 2);
        tracks.forEach((item, index) => {
          const row = (index % itemsPerColumn) + 1;
          const column = index < itemsPerColumn ? 1 : 2;
          item.style.gridRow = row;
          item.style.gridColumn = column;
        });
      } else {
        tracks.forEach((item, index) => {
          item.style.display = "block";
        });
      }
    });
  } catch (error) {
    console.error("Error loading playlist:", error);
  }
}

if (playTrack) {
  playTrack.addEventListener("click", () => {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      coverPlay.src = "img/play3.png";
    } else {
      audioPlayer.play();
      isPlaying = true;
      coverPlay.src = "img/pause3.png";
    }
  });
}

async function loadInfo() {
  try {
    const playlistResponse = await fetch("playlist.json");
    const playlist = await playlistResponse.json();

    const currentTrackData = playlist[currentTrackIndex];

    let coverImage;

    if (currentTrackData) {
      if (style == 2) {
        coverImage = currentTrackData.thumb;
      } else {
        coverImage = currentTrackData.cover;
      }

      const title = currentTrackData.title;
      const lyrics = currentTrackData.lyrics;
      coverImageContainer.innerHTML = `<img src="${coverImage}" alt="Cover" class="track-cover"  id="cover-img"/><div id="cover-title">${title}</div>`;
      if (lyrics) {
        lyricsContainer.innerHTML = `<b>${title}</b><br /><br />${lyrics}`;
      } else {
        lyricsContainer.innerHTML = `<b>${title}</b>`;
      }
    }
  } catch (error) {
    console.error("Error loading cover:", error);
  }
}

function showPlaylist() {
  playlistContainer.style.display = "block";
  coverContainer.style.display = "none";
  lyricsContainer.style.display = "none";
}

function showCover() {
  playlistContainer.style.display = "none";
  coverContainer.style.display = "flex";
  lyricsContainer.style.display = "none";
}

function showLyrics() {
  playlistContainer.style.display = "none";
  coverContainer.style.display = "none";
  lyricsContainer.style.display = "block";
}

nextTrack.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  tracks[currentTrackIndex].click();
  loadInfo();
});

prevTrack.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  tracks[currentTrackIndex].click();
  loadInfo();
});

audioPlayer.addEventListener("ended", () => {
  currentTrackIndex++;
  if (currentTrackIndex < tracks.length) {
    const nextTrack = tracks[currentTrackIndex];
    nextTrack.click();
  } else {
    currentTrackIndex = 0;
    const nextTrack = tracks[currentTrackIndex];
    nextTrack.click();
  }
});

audioPlayer.addEventListener("timeupdate", () => {
  const currentTime = audioPlayer.currentTime;
  const duration = audioPlayer.duration;
  const progress = (currentTime / duration) * 100;
  progressBar.style.width = `${progress}%`;
  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);
  const totalMinutes = Math.floor(duration / 60);
  const totalSeconds = Math.floor(duration % 60);

  currentTimeDisplay.textContent = `${currentMinutes}:${
    currentSeconds < 10 ? "0" : ""
  }${currentSeconds}`;
  totalTimeDisplay.textContent = `${totalMinutes}:${
    totalSeconds < 10 ? "0" : ""
  }${totalSeconds}`;
});

progressContainer.addEventListener("click", (event) => {
  const progressWidth = progressContainer.offsetWidth;
  const clickX = event.offsetX;
  const newTime = (clickX / progressWidth) * audioPlayer.duration;
  audioPlayer.currentTime = newTime;
});

playlistButton.addEventListener("click", (event) => {
  showPlaylist();
});

coverButton.addEventListener("click", (event) => {
  showCover();
});

lyricsButton.addEventListener("click", (event) => {
  showLyrics();
});

loadPlaylist().then(() => {
  loadInfo().then(() => {});
});
