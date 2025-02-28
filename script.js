// Select the existing image element in the right section
let currentPic = document.querySelector(".rightImage img");
let currentSong = new Audio();  // This will handle the audio playing

const albumColors = {
    "Fearless": "#a69b6d", // Yellow
    "1989": "#a9d6d5",      // Light Blue
    "lover": "#ebcce0",     // Pink
    "Red": "#ad7b82",       // Firebrick Red
    "Reputation": "#7d7c7c", // Dark Slate Grey
    "Taylor Swift": "#96bd93", // Gold
    "The Tortured Poet": "#fff4db", // Blue Violet
    "Speak Now": "#baa3d1", // Hot Pink
    "ForkLore": "#a1ab95",  // Brown
    "Evermore": "#aba495",  // Saddle Brown
    "Midnights": "#95a6ab", // Dark Blue
};

// Function to extract songs from an album
async function getSongs(albumName) {
let a = await fetch("./assets/songs/" + albumName);
let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
}

// Play the selected song
const playMusic = (track, albumName) => {
    currentSong.src = `https://jasnoor-kaur-2025.github.io/swift-tunes/assets/songs/${albumName}/${track}`;
    currentSong.play(); // Play the song
};

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}


async function main() {
    // Get all album elements
    const albums = Array.from(document.querySelector(".cardAlbum").getElementsByClassName("Album"));

    // Iterate through each album
    albums.forEach(album => {
        album.querySelector("img").addEventListener("click", async () => {
            const albumName = album.querySelector(".AName").innerText; // Get the album name

            // Update the currentPic source based on the clicked album
            const albumImage = album.querySelector("img").src; // Get the clicked album's image source
            currentPic.src = albumImage; // Change the main image to the clicked album's image

            // Update the displayed album name in the right section
            document.querySelector(".right .music .info").innerHTML = albumName;

            // Set the background color of the right div
            document.querySelector(".right").style.backgroundColor = albumColors[albumName] || "#FFFFFF"; // Default to white if not found

            // Fetch songs for the selected album
            const songs = await getSongs(albumName);

            // Clear any existing song list before adding a new one
            const listSongsContainer = document.querySelector(".listSongs");
            listSongsContainer.innerHTML = ''; // Clear the existing content

            // Create a new list and populate it with songs
            let listSongs = document.createElement("ul");
            songs.forEach(song => {
                let listItem = document.createElement("li");
                listItem.textContent = song.replace(".mp3", "").replaceAll("%20", " ");
                
                // Add click event to play the song when clicked
                listItem.addEventListener("click", () => {
                    playMusic(song, albumName); // Play the selected song
                    let content = document.querySelector(".info")
                    content.innerHTML = song.replace(".mp3", "").replaceAll("%20", " ");
                    
                    currentSong.addEventListener("loadedmetadata", () => {
                        let time2 = document.querySelector(".time2");
                        time2.innerHTML = formatTime(currentSong.duration);
                    });
                    currentSong.addEventListener("timeupdate", () => {
                        let time1 = document.querySelector(".time1");
                        time1.innerHTML = formatTime(currentSong.currentTime);
                    });

                    currentSong.addEventListener("timeupdate", () => {
                        const circle = document.querySelector(".circle");
                        const line = document.querySelector(".line");

                        // Calculate percentage of song played
                        const percentPlayed = (currentSong.currentTime / currentSong.duration) * 100;

                        // Move the circle along the line based on the percent played
                        const lineWidth = line.offsetWidth;
                        const circlePosition = (percentPlayed / 100) * lineWidth;

                        // Update circle's position
                        circle.style.left = `${circlePosition - 6.5}px`; // Adjust for circle's width (half of 13px)
                    });

                    let button = document.querySelector(".playing");
                    button.src = "pause.svg";
                });

                listSongs.appendChild(listItem);
            });

            // Append the song list under "This is Taylor Swift"
            listSongsContainer.appendChild(listSongs);
        });
    });

    let button = document.querySelector(".playing");
    button.addEventListener("click", () => {
        if (currentSong.paused) {  
            currentSong.play(); // Play the song
            button.src = "pause.svg"; // Change to pause icon
        } else {
            currentSong.pause(); // Pause the song
            button.src = "playButton.svg"; // Change to play icon
        }
    });

    // Line and circle for playback control
    const line = document.querySelector(".line");
    const circle = document.querySelector(".circle");
    

    let isDragging = false;

    // Mouse down event for the circle
    circle.addEventListener("mousedown", (event) => {
        isDragging = true;
    });

    // Mouse up event on document to stop dragging
    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    // Mouse move event for dragging the circle
    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const lineRect = line.getBoundingClientRect();
            const offsetX = event.clientX - lineRect.left; // Get the x coordinate relative to the line
            const boundedX = Math.max(0, Math.min(offsetX, line.offsetWidth)); // Keep within bounds

            // Update the circle position
            circle.style.left = `${boundedX - 6.5}px`; // Adjust for circle's width

            // Calculate the new time in seconds and set it
            const percent = boundedX / line.offsetWidth; // Calculate percentage
            const newTime = percent * currentSong.duration; // Set the new time
            currentSong.currentTime = newTime; // Set the song time
        }
    });
}

main();
