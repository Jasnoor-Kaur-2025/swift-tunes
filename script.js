// Select the existing image element in the right section
let currentPic = document.querySelector(".rightImage img");
let currentSong = new Audio();  // This will handle the audio playing

const albumColors = {
    "Fearless": "#a69b6d",
    "1989": "#a9d6d5",
    "Lover": "#ebcce0",
    "Red": "#ad7b82",
    "Reputation": "#7d7c7c",
    "Taylor Swift": "#96bd93",
    "The Tortured Poet": "#fff4db",
    "Speak Now": "#baa3d1",
    "Folklore": "#a1ab95",
    "Evermore": "#aba495",
    "Midnights": "#95a6ab",
};

// Function to fetch songs from a JSON file
async function getSongs(albumName) {
    try {
        let response = await fetch("https://jasnoor-kaur-2025.github.io/swift-tunes/assets/songs/songs.json");
        let data = await response.json();
        return data[albumName] || []; // Return song list or empty array
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
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

    albums.forEach(album => {
        album.querySelector("img").addEventListener("click", async () => {
            const albumName = album.querySelector(".AName").innerText;
            currentPic.src = album.querySelector("img").src;
            document.querySelector(".right .music .info").innerHTML = albumName;
            document.querySelector(".right").style.backgroundColor = albumColors[albumName] || "#FFFFFF";
            
            const songs = await getSongs(albumName);
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
                        const circle = document.querySelector(".circle");
                        const line = document.querySelector(".line");
                        const percentPlayed = (currentSong.currentTime / currentSong.duration) * 100;
                        circle.style.left = `${(percentPlayed / 100) * line.offsetWidth - 6.5}px`;
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

    circle.addEventListener("mousedown", () => { isDragging = true; });
    document.addEventListener("mouseup", () => { isDragging = false; });
    
    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const lineRect = line.getBoundingClientRect();
            const offsetX = event.clientX - lineRect.left;
            const boundedX = Math.max(0, Math.min(offsetX, line.offsetWidth));
            circle.style.left = `${boundedX - 6.5}px`;
            currentSong.currentTime = (boundedX / line.offsetWidth) * currentSong.duration;
        }
    });
}

main();
