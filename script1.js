let url = "http://127.0.0.1:3000/songs/";
let currentSong = new Audio();
let currFolder;
let play = document.querySelector("#play");

async function getSongs() {
    try {
        let a = await fetch(url);
        if (!a.ok) {
            throw new Error(`HTTP error! status: ${a.status}`);
        }
        let response = await a.text();
        // console.log(response); 
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = [];
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if(element.href.endsWith(".mp3")){
                songs.push(element.href);
            }
        }
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        // Fallback: return hardcoded song list if server is not available
        return [
            "Agar Tum Saath Ho.mp3",
            "creep.mp3", 
            "Humdard.mp3",
            "Let Down.mp3",
            "No Surprises.mp3",
            "Phir Mohabbat.mp3",
            "Pretty Woman .mp3"
        ];
    }
}

const playMusic = (track)=>{
    // let audio = new Audio("/songs/" + track);
    // audio.play();
    currentSong.src = "./songs/" + track;
    
    // Ensure volume is maintained when switching songs
    const volumeControl = document.querySelector(".volume-ctrl");
    if (volumeControl) {
        currentSong.volume = volumeControl.value / 100;
    }
    
    currentSong.play();
    play.src = "./assets/pause.svg";
    document.querySelector("#song-info").innerHTML = track.replaceAll(".mp3","").replaceAll("%20","");
    if(track.includes("Humdard")){
    document.querySelector("#mp-img2").src = "./assets/Humdard.jpeg";
    document.querySelector(".mp-a2").innerHTML = "Arijit Singh";
    }else if(track.includes("Agar Tum Saath Ho")){
        document.querySelector("#mp-img2").src = "./assets/agartumsaathho.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Alka Yagnik, Arijit Singh";
    }else if(track.includes("creep")){
        document.querySelector("#mp-img2").src = "./assets/creep.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Radiohead";
    }else if(track.includes("Let Down")){
        document.querySelector("#mp-img2").src = "./assets/letdown.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Radiohead";
    }else if(track.includes("No Surprises")){
        document.querySelector("#mp-img2").src = "./assets/nosurprises.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Radiohead";
    }else if(track.includes("Phir Mohabbat")){
        document.querySelector("#mp-img2").src = "./assets/phirmohabbat.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Arijit Singh, Mohmmad Irfan";
    }else if(track.includes("Pretty Woman")){
        document.querySelector("#mp-img2").src = "./assets/prettywoman.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Shankar Mahadevan";
    }
}


// Add this helper function at the top of your script
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function main() {

    // Get the list of all the songs
    let songs = await getSongs();

    
    
    // Show all the songs in the playlist
    let songUL = document.querySelector("#songListol");
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
            <img src="./assets/music.svg" alt="" class="invert">
            <div class="info">
                <div>${song.split("/").pop().replaceAll("%20", " ").replaceAll("%5", " ").replaceAll("Csongs", "").replaceAll("C", "")}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="./assets/play.svg" alt="" class="invert">
            </div>
        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        });
    });

    // Attach an event listener to play, next, and previous buttons


    // Listen for timeupdate event to update the progress bar and time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".curr-time").innerHTML = secondsToMinutesSeconds(currentSong.currentTime);
        document.querySelector(".tot-time").innerHTML = secondsToMinutesSeconds(currentSong.duration);
        
        // Update the progress bar's position
        document.querySelector(".progress-bar").value = (currentSong.currentTime / currentSong.duration) * 100;
    });

    // Add an event listener to the progress bar for seeking
    document.querySelector(".progress-bar").addEventListener("change", (e) => {
        // The value of the range input is between 0 and 100
        currentSong.currentTime = (currentSong.duration * e.target.value) / 100;
    });

    // Add event listener for volume control
    const volumeControl = document.querySelector(".volume-ctrl");
    if (volumeControl) {
        // Set initial volume to 50%
        currentSong.volume = 0.5;
        volumeControl.value = 50;
        
        volumeControl.addEventListener("input", (e) => {
            // Convert the range value (0-100) to volume (0-1)
            const volume = e.target.value / 100;
            currentSong.volume = volume;
            console.log("Volume changed to:", volume);
            
            // Update the volume icon based on volume level
            const volumeIcon = document.querySelector(".ctrl-img5");
            if (volumeIcon) {
                if (volume === 0) {
                    // Muted icon
                    volumeIcon.src = "./assets/mute.svg";
                    volumeIcon.style.opacity = "0.5";
                } else if (volume < 0.5) {
                    // Low volume - show speaker icon
                    volumeIcon.src = "./assets/volume.svg";
                    volumeIcon.style.opacity = "0.7";
                } else {
                    // Normal volume - show speaker icon
                    volumeIcon.src = "./assets/volume.svg";
                    volumeIcon.style.opacity = "1";
                }
            }
        });
        
        console.log("Volume control initialized");
    } else {
        console.error("Volume control not found!");
    }

    // Add click-to-mute functionality on volume icon
    const volumeIcon = document.querySelector(".ctrl-img5");
    if (volumeIcon) {
        volumeIcon.addEventListener("click", () => {
            const volumeControl = document.querySelector(".volume-ctrl");
            if (currentSong.volume > 0) {
                // Store current volume and mute
                volumeIcon.dataset.previousVolume = currentSong.volume;
                currentSong.volume = 0;
                volumeControl.value = 0;
                volumeIcon.src = "./assets/mute.svg";
                volumeIcon.style.opacity = "0.5";
                console.log("Volume muted");
            } else {
                // Restore previous volume or set to 50%
                const previousVolume = parseFloat(volumeIcon.dataset.previousVolume) || 0.5;
                currentSong.volume = previousVolume;
                volumeControl.value = previousVolume * 100;
                volumeIcon.style.opacity = previousVolume < 0.5 ? "0.7" : "1";
                // Restore the speaker icon
                volumeIcon.src = "./assets/volume.svg";
                console.log("Volume unmuted to:", previousVolume);
            }
        });
        
        // Make volume icon cursor pointer
        volumeIcon.style.cursor = "pointer";
        console.log("Volume icon click-to-mute initialized");
    }

    // Attach an event listener to play, next, and previous buttons
    if (play) {
        console.log("Play button found, attaching event listener");
        play.addEventListener("click", () => {
            console.log("Play button clicked");
            // First, check if a song has been loaded into the player
            if (!currentSong.src) {
                console.log("No song loaded");
                return; // Do nothing if no song is loaded
            }

            // If a song is loaded, then toggle play/pause
            if (currentSong.paused) {
                console.log("Playing song");
                currentSong.play();
                play.src = "./assets/pause.svg";
            } else {
                console.log("Pausing song");
                currentSong.pause();
                play.src = "./assets/play.svg";
            }
        });
    } else {
        console.error("Play button not found!");
    }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    main();
});


// async function displayAlbums() {
//     console.log("displaying albums")
//     let a = await fetch(`/songs/`)
//     let response = await a.text();
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")
//     let cardContainer = document.querySelector(".cardContainer")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index]; 
//         if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
//             let folder = e.href.split("/").slice(-2)[0]
//             // Get the metadata of the folder
//             let a = await fetch(`/songs/${folder}/info.json`)
//             let response = await a.json(); 
//             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
//             <div class="play">
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
//                     xmlns="http://www.w3.org/2000/svg">
//                     <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
//                         stroke-linejoin="round" />
//                 </svg>
//             </div>

//             <img src="/songs/${folder}/cover.jpg" alt="">
//             <h2>${response.title}</h2>
//             <p>${response.description}</p>
//         </div>`
//         }
//     }
// } 