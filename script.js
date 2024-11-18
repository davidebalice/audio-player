const overlay = document.getElementById("overlay");
const audioPlayer = document.getElementById("audio-player");
const closeButton = document.getElementById("close-button");
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
const volumeControl = document.getElementById("volume-control");
const infoControl = document.getElementById("info-button");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-time");
const playlistContainer = document.getElementById("playlist-container");

let isPlaying = false;


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

    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;

    const progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;
});

async function loadPlaylist() {
    try {
        const response = await fetch('playlist.json');
        const playlist = await response.json();

        const olElement = document.createElement('ol');
        olElement.id = 'playlist';
        playlistContainer.appendChild(olElement);

        playlist.forEach((track) => {
            const liElement = document.createElement('li');
            liElement.textContent = track.title;
            liElement.setAttribute('data-src', track.url);
            olElement.appendChild(liElement);
        });

        const tracks = olElement.querySelectorAll('li');
        tracks.forEach(track => {
            track.addEventListener('click', () => {
                const src = track.getAttribute('data-src');
                audioPlayer.src = src;
                audioPlayer.play();
                track.style.color = "#c1a316";
            });
        });
    } catch (error) {
        console.error('Error loading playlist:', error);
    }
}

loadPlaylist();
