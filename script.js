// Select the existing image element in the right section
let currentPic = document.querySelector(".rightImage img");
let currentSong = new Audio();  // This will handle the audio playing

const albumColors = {
    "Fearless": "#a69b6d", // Yellow
    "1989": "#a9d6d5",      // Light Blue
    "Lover": "#ebcce0",     // Pink
    "Red": "#ad7b82",       // Firebrick Red
    "Reputation": "#7d7c7c", // Dark Slate Grey
    "Taylor Swift": "#96bd93", // Gold
    "The Tortured Poet": "#fff4db", // Blue Violet
    "Speak Now": "#baa3d1", // Hot Pink
    "Folklore": "#a1ab95",  // Brown
    "Evermore": "#aba495",  // Saddle Brown
    "Midnights": "#95a6ab", // Dark Blue
};

// Fetch songs from songs.json
async function getSongs() {
    let response = await fetch("./songs.json");
    return await response.json();
}

// Play the selected song
const playMusic = (track, albumName) => {
    currentSong.src = `https://jasnoor-kaur-2025.github.io/swift-tunes/assets/songs/${albumName}/${track}`;
    currentSong.play();
};

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

async function main() {
    const albums = Array.from(document.querySelector(".cardAlbum").getElementsByClassName("Album"));
    const songData = await getSongs();

    albums.forEach(album => {
        album.querySelector("img").addEventListener("click", async () => {
            const albumName = album.querySelector(".AName").innerText;
            const albumImage = album.querySelector("img").src;
            currentPic.src = albumImage;
            document.querySelector(".right .music .info").innerHTML = albumName;
            document.querySelector(".right").style.backgroundColor = albumColors[albumName] || "#FFFFFF";
            
            const songs = songData[albumName] || [];
            const listSongsContainer = document.querySelector(".listSongs");
            listSongsContainer.innerHTML = '';
            let listSongs = document.createElement("ul");

            songs.forEach(song => {
                let listItem = document.createElement("li");
                listItem.textContent = song.replace(".mp3", "").replaceAll("%20", " ");
                listItem.addEventListener("click", () => {
                    playMusic(song, albumName);
                    document.querySelector(".info").innerHTML = song.replace(".mp3", "").replaceAll("%20", " ");

                    currentSong.addEventListener("loadedmetadata", () => {
                        document.querySelector(".time2").innerHTML = formatTime(currentSong.duration);
                    });
                    currentSong.addEventListener("timeupdate", () => {
                        document.querySelector(".time1").innerHTML = formatTime(currentSong.currentTime);
                    });
                    currentSong.addEventListener("timeupdate", () => {
                        const circle = document.querySelector(".circle");
                        const line = document.querySelector(".line");
                        const percentPlayed = (currentSong.currentTime / currentSong.duration) * 100;
                        const lineWidth = line.offsetWidth;
                        const circlePosition = (percentPlayed / 100) * lineWidth;
                        circle.style.left = `${circlePosition - 6.5}px`;
                    });
                    document.querySelector(".playing").src = "pause.svg";
                });
                listSongs.appendChild(listItem);
            });
            listSongsContainer.appendChild(listSongs);
        });
    });

    let button = document.querySelector(".playing");
    button.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            button.src = "pause.svg";
        } else {
            currentSong.pause();
            button.src = "playButton.svg";
        }
    });

    const line = document.querySelector(".line");
    const circle = document.querySelector(".circle");
    let isDragging = false;

    circle.addEventListener("mousedown", () => {
        isDragging = true;
    });
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const lineRect = line.getBoundingClientRect();
            const offsetX = event.clientX - lineRect.left;
            const boundedX = Math.max(0, Math.min(offsetX, line.offsetWidth));
            circle.style.left = `${boundedX - 6.5}px`;
            const percent = boundedX / line.offsetWidth;
            currentSong.currentTime = percent * currentSong.duration;
        }
    });
}

main();
