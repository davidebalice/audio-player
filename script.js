const overlay = document.getElementById("overlay");
const audioPlayer = document.getElementById("audio-player");
const closeButton = document.getElementById("close-button");
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
const volumeControl = document.getElementById("volume-control");
const infoControl = document.getElementById("info-button");
const progressContainer = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");
const playlistContainer = document.getElementById("playlist-container");
const currentTrack = document.getElementById("current-track");
let currentTrackIndex = 0;
let isPlaying = false;
let tracks = [];

playButton.addEventListener("click", () => {
  audioPlayer.play();
  isPlaying = true;
});

pauseButton.addEventListener("click", () => {
  audioPlayer.pause();
  isPlaying = false;
});

stopButton.addEventListener("click", () => {
  audioPlayer.pause();
  isPlaying = false;
});

infoControl.addEventListener("click", () => {
  overlay.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  overlay.style.display = "none";
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
    tracks.forEach((track) => {
      track.addEventListener("click", () => {
        tracks.forEach((t) => {
          t.style.color = "#f2c90a";
        });
        const src = track.getAttribute("data-src");
        audioPlayer.src = src;
        audioPlayer.play();
        track.style.color = "#c1a316";

        const titleElement = track.querySelector(
          ".playlist-content .playlist-title"
        );
        const trackTitle = titleElement ? titleElement.innerText : "";
        currentTrack.innerText = trackTitle;
      });

      const itemsPerColumn = Math.ceil(playlist.length / 2);
      tracks.forEach((item, index) => {
        const row = (index % itemsPerColumn) + 1;
        const column = index < itemsPerColumn ? 1 : 2;
        item.style.gridRow = row;
        item.style.gridColumn = column;
        currentTrackIndex = index;
      });
    });
  } catch (error) {
    console.error("Error loading playlist:", error);
  }
}

loadPlaylist();

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
