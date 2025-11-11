// Remove server dependency - use direct file listing
// let url = "./songs/";
let currentSong = new Audio();
let currFolder;
let play = document.querySelector("#play");
let songs = []; // Global variable to store the songs list
let originalSongs = []; // Keep original order for shuffle toggle
let likedSongs = []; // Array to store liked songs
let currentSongIndex = 0; // Track current song index
let isShuffled = false; // Track shuffle state
let isRepeatOn = false; // Track repeat state

// Map card titles to song files
const cardToSongMap = {
    // Existing Songs
    "Agar Tum Saath Ho": "./songs/Agar Tum Saath Ho.mp3",
    "Phir Mohabbat": "./songs/Phir Mohabbat.mp3",
    "Humdard": "./songs/Humdard.mp3",
    "Let Down": "./songs/Let Down.mp3",
    "No Surprises": "./songs/No Surprises.mp3",
    "Creep": "./songs/creep.mp3",
    // ADDED: New songs from your HTML
    "Tujhe Kitna Chahne Lage": "./songs/Tujhe Kitna Chahne Lage.mp3",
    "Kalank": "./songs/Kalank.mp3",
    "For A Reason": "./songs/For A Reason.mp3",
    "Winning Speech": "./songs/Winning Speech.mp3",
    "Wavy": "./songs/Wavy.mp3",
    "Jee Ni Lagda": "./songs/Jee Ni Lagda.mp3",
    "I Really Do...": "./songs/I Really Do.mp3",
    "All I Need": "./songs/All I Need.mp3"
};

async function getSongs() {
    // Direct file list - no server dependency
    console.log("Using direct file list (no server needed)");
    // UPDATED: Added all new song files to the list
    const songList = [
        "./songs/Agar Tum Saath Ho.mp3",
        "./songs/creep.mp3",
        "./songs/Humdard.mp3",
        "./songs/Let Down.mp3",
        "./songs/No Surprises.mp3",
        "./songs/Phir Mohabbat.mp3",
        "./songs/Pretty Woman .mp3",
        "./songs/Tujhe Kitna Chahne Lage.mp3", 
        "./songs/Kalank.mp3", 
        "./songs/For A Reason.mp3", 
        "./songs/Winning Speech.mp3", 
        "./songs/Wavy.mp3", 
        "./songs/Jee Ni Lagda.mp3", 
        "./songs/I Really Do.mp3", 
        "./songs/All I Need.mp3" 
    ];

    // Test accessibility of each song
    console.log("Testing song file accessibility...");
    for (let i = 0; i < songList.length; i++) {
        const song = songList[i];
        try {
            const testAudio = new Audio();
            testAudio.src = song;
            await new Promise((resolve, reject) => {
                testAudio.addEventListener('canplay', () => {
                    console.log(`✅ ${song} - accessible`);
                    resolve();
                });
                testAudio.addEventListener('error', (e) => {
                    console.error(`❌ ${song} - not accessible:`, e);
                    reject(e);
                });
                // Timeout after 3 seconds
                setTimeout(() => {
                    console.warn(`⚠️ ${song} - timeout (may still work)`);
                    resolve();
                }, 3000);
            });
        } catch (error) {
            console.error(`Failed to test ${song}:`, error);
        }
    }

    return songList;
}

// Shuffle function using Fisher-Yates algorithm
function shuffleSongs(songsArray) {
    const shuffled = [...songsArray]; // Create a copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Toggle shuffle functionality
function toggleShuffle() {
    const shuffleButton = document.querySelector(".player-control-icon[alt='Shuffle']");

    if (!isShuffled) {
        // Turn on shuffle
        isShuffled = true;
        originalSongs = [...songs]; // Save original order
        songs = shuffleSongs(songs);

        // Update button appearance
        if (shuffleButton) {
            shuffleButton.style.opacity = "1";
            shuffleButton.style.filter = "none";
            shuffleButton.style.backgroundColor = "#1bd760";
            shuffleButton.style.borderRadius = "50%";
            shuffleButton.style.padding = "2px";
        }

        console.log("Shuffle ON - Songs shuffled internally");
    } else {
        // Turn off shuffle
        isShuffled = false;
        songs = [...originalSongs]; // Restore original order

        // Update button appearance
        if (shuffleButton) {
            shuffleButton.style.opacity = "0.7";
            shuffleButton.style.filter = "none";
            shuffleButton.style.backgroundColor = "transparent";
            shuffleButton.style.borderRadius = "0";
            shuffleButton.style.padding = "0";
        }

        console.log("Shuffle OFF - Songs restored to original order");
    }
}

// Toggle repeat functionality
function toggleRepeat() {
    const repeatButton = document.querySelector(".player-control-icon[alt='Repeat']");

    if (!isRepeatOn) {
        // Turn on repeat
        isRepeatOn = true;

        // Update button appearance
        if (repeatButton) {
            repeatButton.style.opacity = "1";
            repeatButton.style.filter = "none";
            repeatButton.style.backgroundColor = "#1bd760";
            repeatButton.style.borderRadius = "50%";
            repeatButton.style.padding = "2px";
        }

        console.log("Repeat ON - Current song will repeat");
    } else {
        // Turn off repeat
        isRepeatOn = false;

        // Update button appearance
        if (repeatButton) {
            repeatButton.style.opacity = "0.7";
            repeatButton.style.filter = "none";
            repeatButton.style.backgroundColor = "transparent";
            repeatButton.style.borderRadius = "0";
            repeatButton.style.padding = "0";
        }

        console.log("Repeat OFF - Normal playback");
    }
}

// Alternative approach: Create a simple file checker
function checkSongFile(songPath) {
    return new Promise((resolve) => {
        const audio = new Audio();
        audio.addEventListener('canplay', () => resolve(true));
        audio.addEventListener('error', () => resolve(false));
        audio.src = songPath;
        // Timeout after 2 seconds
        setTimeout(() => resolve(false), 2000);
    });
}

// Function to update the UI of the like button based on the current song
function updateLikeButtonUI() {
    const likeButton = document.querySelector("#like-button");
    if (!likeButton || !currentSong.src) return;

    // The src property gives the full URL, so we need to find the relative path
    const currentSongPath = songs[currentSongIndex];
    if (likedSongs.includes(currentSongPath)) {
        likeButton.src = "./assets/filledheart.png";
    } else {
        likeButton.src = "./assets/album_icon1.png";
    }
}


const playMusic = (track, index = null) => {
    // Update current song index if provided
    if (index !== null) {
        currentSongIndex = index;
    }

    // Handle both full paths and relative paths
    if (track.startsWith("./songs/")) {
        currentSong.src = track;
    } else {
        currentSong.src = "./songs/" + track;
    }

    // Ensure volume is maintained when switching songs
    const volumeControl = document.querySelector(".volume-ctrl");
    if (volumeControl) {
        currentSong.volume = volumeControl.value / 100;
    }

    // Load the new audio source and play when ready
    currentSong.load();

    // Wait for the audio to be ready to play
    const handleCanPlay = () => {
        currentSong.removeEventListener('canplay', handleCanPlay);
        const playPromise = currentSong.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay started successfully
                console.log("Song started playing:", track);
                play.src = "./assets/pause.svg";
            }).catch(error => {
                // Autoplay was prevented, user interaction required
                console.log("Autoplay prevented, user needs to interact first:", error);
                play.src = "./assets/play.svg";
            });
        }
    };

    // Add event listener for when audio is ready
    currentSong.addEventListener('canplay', handleCanPlay);

    // Also try to play immediately (for cases where audio is already loaded)
    currentSong.play().catch(error => {
        console.log("Immediate play failed, waiting for canplay event:", error);
    });

    // Remove path and extension for display
    let displayName = track;
    if (track.includes("./songs/")) {
        displayName = track.replace("./songs/", "");
    }
    displayName = displayName.replaceAll(".mp3", "").replaceAll("%20", " ").replace(".mp3", ""); // Clean up name
    document.querySelector("#song-info").innerHTML = displayName;

    // UPDATED: Added album art and artist info for all new songs
    if (track.includes("Humdard")) {
        document.querySelector("#mp-img2").src = "./assets/humdard.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Arijit Singh";
    } else if (track.includes("Agar Tum Saath Ho")) {
        document.querySelector("#mp-img2").src = "./assets/agartumsaathho.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Alka Yagnik, Arijit Singh";
    } else if (track.includes("creep")) {
        document.querySelector("#mp-img2").src = "./assets/creep.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Radiohead";
    } else if (track.includes("Let Down")) {
        document.querySelector("#mp-img2").src = "./assets/letdown.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Radiohead";
    } else if (track.includes("No Surprises")) {
        document.querySelector("#mp-img2").src = "./assets/nosurprises.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Radiohead";
    } else if (track.includes("Phir Mohabbat")) {
        document.querySelector("#mp-img2").src = "./assets/phirmohabbat.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Arijit Singh, Mohmmad Irfan";
    } else if (track.includes("Pretty Woman")) {
        document.querySelector("#mp-img2").src = "./assets/prettywoman.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Shankar Mahadevan";
    } else if (track.includes("Tujhe Kitna Chahne Lage")) { // ADDED
        document.querySelector("#mp-img2").src = "./assets/tujhekitnachahnelage.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Arijit Singh";
    } else if (track.includes("Kalank")) { // ADDED
        document.querySelector("#mp-img2").src = "./assets/kalank.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Arijit Singh";
    } else if (track.includes("For A Reason")) { // ADDED
        document.querySelector("#mp-img2").src = "./assets/forareason.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Karan Aujla, Ikky";
    } else if (track.includes("Winning Speech")) { // ADDED
        document.querySelector("#mp-img2").src = "./assets/winningspeech.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Karan Aujla, Ikky";
    } else if (track.includes("Wavy")) { // ADDED
        document.querySelector("#mp-img2").src = "./assets/wavy.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Karan Aujla, Ikky";
    } else if (track.includes("Jee Ni Lagda")) { // ADDED
        document.querySelector("#mp-img2").src = "./assets/jeenilagda.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Karan Aujla, Ikky";
    } else if (track.includes("I Really Do")) { // ADDED
        document.querySelector("#mp-img2").src = "./assets/ireallydo.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Karan Aujla, Ikky";
    } else if (track.includes("All I Need")) { // ADDED
        document.querySelector("#mp-img2").src = "./assets/allineed.jpeg";
        document.querySelector(".mp-a2").innerHTML = "Radiohead";
    }
    
    // Update the like button's appearance for the new song
    updateLikeButtonUI();
}

// Function to find song index by title
function findSongIndexByTitle(title) {
    for (let i = 0; i < songs.length; i++) {
        const songPath = songs[i];
        let songName = songPath.split("/").pop().replace(".mp3", "").replaceAll("%20", " ");

        // Try to match the song title
        if (songName.toLowerCase().includes(title.toLowerCase()) ||
            title.toLowerCase().includes(songName.toLowerCase())) {
            return i;
        }
    }
    return -1; // Not found
}

// Function to play song by card title
function playSongByCardTitle(cardTitle) {
    console.log("Looking for song with title:", cardTitle);

    // First try the direct mapping
    if (cardToSongMap[cardTitle]) {
        const songPath = cardToSongMap[cardTitle];
        const index = songs.indexOf(songPath);
        if (index !== -1) {
            console.log("Found song via direct mapping:", songPath);
            playMusic(songPath, index);
            return;
        }
    }

    // If direct mapping fails, try to find by title matching
    const index = findSongIndexByTitle(cardTitle);
    if (index !== -1) {
        console.log("Found song via title matching:", songs[index]);
        playMusic(songs[index], index);
    } else {
        console.error("Song not found for card title:", cardTitle);
        // Fallback: play the first song
        if (songs.length > 0) {
            console.log("Playing first song as fallback");
            playMusic(songs[0], 0);
        }
    }
}

// Function to play next song
const playNextSong = () => {
    if (songs.length === 0) {
        console.log("No songs available");
        return;
    }

    currentSongIndex = (currentSongIndex + 1) % songs.length;
    let nextTrackPath = songs[currentSongIndex];
    let nextTrack = nextTrackPath.split("/").pop().replaceAll("%20", " ").replaceAll("%5", " ").replaceAll("Csongs", "").replaceAll("C", "");
    console.log("=== NEXT SONG ===");
    console.log("Playing next song:", nextTrack, "at index:", currentSongIndex);
    console.log("Full path:", nextTrackPath);
    console.log("Songs array length:", songs.length);
    console.log("Current song index before change:", (currentSongIndex - 1 + songs.length) % songs.length);
    playMusic(nextTrackPath, currentSongIndex);
}

// Function to play previous song
const playPreviousSong = () => {
    if (songs.length === 0) {
        console.log("No songs available");
        return;
    }

    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    let prevTrackPath = songs[currentSongIndex];
    let prevTrack = prevTrackPath.split("/").pop().replaceAll("%20", " ").replaceAll("%5", " ").replaceAll("Csongs", "").replaceAll("C", "");
    console.log("=== PREVIOUS SONG ===");
    console.log("Playing previous song:", prevTrack, "at index:", currentSongIndex);
    console.log("Full path:", prevTrackPath);
    console.log("Songs array length:", songs.length);
    console.log("Current song index before change:", (currentSongIndex + 1) % songs.length);
    playMusic(prevTrackPath, currentSongIndex);
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

// Function to add click event listeners to cards
function setupCardClickEvents() {
    const cards = document.querySelectorAll('.card');
    console.log(`Found ${cards.length} cards to setup click events`);

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('.card-title').textContent;
            console.log(`Card clicked: ${cardTitle}`);
            playSongByCardTitle(cardTitle);
        });

        // Add pointer cursor to indicate clickability
        card.style.cursor = 'pointer';
    });
}

// NEW: Function to display liked songs in "Your Library"
function updateLibrary() {
    let songUL = document.querySelector("#songListol");
    songUL.innerHTML = ""; // Clear the current list

    if (likedSongs.length === 0) {
        songUL.innerHTML = `<li><div class="info"><div>Your liked songs will appear here.</div></div></li>`;
        return;
    }

    for (const song of likedSongs) {
        let cleanSongName = song.replace("./songs/", "").replaceAll(".mp3", "").replaceAll("%20", " ");
        songUL.innerHTML += `<li>
            <img src="./assets/music.svg" alt="" class="invert">
            <div class="info">
                <div>${cleanSongName}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img src="./assets/play.svg" alt="" class="invert">
            </div>
        </li>`;
    }

    // Re-attach event listeners for the new list items in the library
    Array.from(songUL.getElementsByTagName("li")).forEach((e, index) => {
        // Make sure not to add listener to the empty message
        if (likedSongs.length > 0) {
             e.addEventListener("click", () => {
                const songToPlay = likedSongs[index];
                // Find the original index in the main 'songs' array to keep next/prev working
                const originalIndex = songs.indexOf(songToPlay);
                playMusic(songToPlay, originalIndex);
            });
        }
    });
}

// Add this new function anywhere before your main() function
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const cards = document.querySelectorAll('.card');
    const cardContainers = document.querySelectorAll('.card-container');
    const headings = document.querySelectorAll('.main-content h2');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();

        // Filter the song cards
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = ''; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });

        // Hide headings if all their songs are hidden
        headings.forEach(heading => {
            const container = heading.nextElementSibling;
            if (container && container.classList.contains('card-container')) {
                // Check if any card in this container is visible
                const isAnyCardVisible = [...container.querySelectorAll('.card')].some(card => card.style.display !== 'none');
                
                if (isAnyCardVisible) {
                    heading.style.display = ''; // Show heading
                } else {
                    heading.style.display = 'none'; // Hide heading
                }
            }
        });
    });
}

function setupHomeButton() {
    const homeButton = document.getElementById('homeButton');
    
    homeButton.addEventListener('click', () => {
        // Select all cards and headings
        const cards = document.querySelectorAll('.card');
        const headings = document.querySelectorAll('.main-content h2');
        const searchInput = document.getElementById('searchInput');

        // Make all headings visible
        headings.forEach(heading => {
            heading.style.display = ''; // Resets to default display
        });
        
        // Make all song cards visible
        cards.forEach(card => {
            card.style.display = ''; // Resets to default display
        });

        // Clear the search bar
        if (searchInput) {
            searchInput.value = '';
        }

        console.log("Navigated back to Home. All items shown.");
    });
}

async function main() {
    // Get the list of all the songs
    songs = await getSongs();
    originalSongs = [...songs]; // Store original order
    console.log("Songs loaded:", songs);
    console.log("Number of songs:", songs.length);
    
    // NEW: Load liked songs from localStorage on startup
    const savedLikedSongs = localStorage.getItem('likedSongs');
    if (savedLikedSongs) {
        likedSongs = JSON.parse(savedLikedSongs);
    }
    
    // Show liked songs in the library
    updateLibrary();


    // Attach an event listener to each song in the playlist (This seems to be for another list, but we'll adapt it for the library)
    // The main logic is now handled inside updateLibrary()

    // Setup click events for cards
    setupCardClickEvents();

    // Setup search functionality
    setupSearch();

    // Setup home button functionality
    setupHomeButton();

    // Listen for timeupdate event to update the progress bar and time
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".curr-time").innerHTML = secondsToMinutesSeconds(currentSong.currentTime);
        document.querySelector(".tot-time").innerHTML = secondsToMinutesSeconds(currentSong.duration);

        // Update the progress bar's position
        document.querySelector(".progress-bar").value = (currentSong.currentTime / currentSong.duration) * 100;
    });

    // Auto-play next song when current song ends
    currentSong.addEventListener("ended", () => {
        console.log("Song ended");
        if (isRepeatOn) {
            // Repeat current song
            console.log("Repeat ON - replaying current song");
            const currentTrack = songs[currentSongIndex];
            playMusic(currentTrack, currentSongIndex);
        } else {
            // Play next song
            console.log("Playing next song");
            playNextSong();
        }
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
                console.log("No song loaded, playing first song from library");
                 if (songs.length > 0) {
                    playMusic(songs[0], 0);
                }
                return; 
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

    // Add event listener for next button
    const nextButton = document.querySelector("#next");
    if (nextButton) {
        console.log("Next button found, attaching event listener");
        nextButton.addEventListener("click", () => {
            console.log("Next button clicked");
            playNextSong();
        });
    } else {
        console.error("Next button not found!");
    }

    // Add event listener for previous button
    const previousButton = document.querySelector("#previous");
    if (previousButton) {
        console.log("Previous button found, attaching event listener");
        previousButton.addEventListener("click", () => {
            console.log("Previous button clicked");
            playPreviousSong();
        });
    } else {
        console.error("Previous button not found!");
    }

    // Add event listener for shuffle button
    const shuffleButton = document.querySelector(".player-control-icon[alt='Shuffle']");
    if (shuffleButton) {
        console.log("Shuffle button found, attaching event listener");
        shuffleButton.addEventListener("click", () => {
            console.log("Shuffle button clicked");
            toggleShuffle();
        });
    } else {
        console.error("Shuffle button not found!");
    }

    // Add event listener for repeat button
    const repeatButton = document.querySelector(".player-control-icon[alt='Repeat']");
    if (repeatButton) {
        console.log("Repeat button found, attaching event listener");
        repeatButton.addEventListener("click", () => {
            console.log("Repeat button clicked");
            toggleRepeat();
        });
    } else {
        console.error("Repeat button not found!");
    }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    main();
});


// Like button functionality
const likeButton = document.querySelector("#like-button");
if (likeButton) {
    likeButton.addEventListener("click", () => {
        if (!currentSong.src) return; // Do nothing if no song is playing

        const currentSongPath = songs[currentSongIndex];
        const isCurrentlyLiked = likedSongs.includes(currentSongPath);

        if (isCurrentlyLiked) {
            // Song is liked, so unlike it
            likedSongs = likedSongs.filter(song => song !== currentSongPath);
            likeButton.src = "./assets/album_icon1.png";
            console.log("Song Unliked:", currentSongPath);
        } else {
            // Song is not liked, so like it
            likedSongs.push(currentSongPath);
            likeButton.src = "./assets/filledheart.png";
            console.log("Song Liked:", currentSongPath);
        }
        
        // Save the updated liked songs list to localStorage
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));

        // Refresh the "Your Library" view
        updateLibrary();
    });
    console.log("Like button event listener attached.");
} else {
    console.error("Like button with id='like-button' not found!");
}
// GATEKEEPER: Check if the user is logged in
if (sessionStorage.getItem('loggedIn') !== 'true') {
    // If not logged in, redirect them to the login page
    window.location.href = 'login.html';
}


// --- YOUR EXISTING CODE STARTS BELOW ---
// let currentSong = new Audio();
// let currFolder;
// ...etc