let url = "http://127.0.0.1:3000/songs/";

async function getSongs() {

        let a = await fetch(url);
        let response = await a.text();
        console.log(response); 
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

async function main() {
    let songs = await getSongs();
    console.log(songs);
    
    let songUL = document.querySelector("#songListol");
    console.log(songUL);

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><a href="${song}">${song.split("/").pop().replaceAll("%20", " ").replaceAll("%5", " ").replaceAll("Csongs", "").replaceAll("C", "")}</a></li>`;
    }

    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata", () => {
     let duration = audio.duration; // Duration in seconds
     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    }
    );
}

main();