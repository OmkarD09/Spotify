let url = "http://127.0.0.1:3000/songs/";
let currentSong = new Audio();
let currFolder;

async function getSongs() {

        let a = await fetch(url);
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
}

const playMusic = (track)=>{
    // let audio = new Audio("/songs/" + track);
    // audio.play();
    currentSong.src = "/songs/" + track;
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

async function main() {


    //Attach an event listener to play, next, previous buttons
        play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./assets/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "./assets/play.svg"
        }
    })
    //next button
    // next.addEventListener("click", () => {
    //     let index = songs.findIndex((e) => e === currentSong.src.split(`/${currFolder}/`)[1]);
    //     if (index === songs.length - 1) index = -1;
    //     playMusic(songs[index + 1])
    // })
    // //previous button
    // previous.addEventListener("click", () => {
    //     let index = songs.findIndex((e) => e === currentSong.src.split(`/${currFolder}/`)[1]);
    //     if (index === 0) index = songs.length;
    //     playMusic(songs[index - 1])
    // })

    let songs = await getSongs();
    // console.log(songs);
    
    let songUL = document.querySelector("#songListol");
    // console.log(songUL);

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
//attach an event listener to all the songs in the list
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", elements=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML); 
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
});

}
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

main(); 