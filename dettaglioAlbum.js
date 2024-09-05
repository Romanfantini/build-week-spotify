let tracks = []; // Array delle tracce dell'album
let currentTrackIndex = 0; // Indice della traccia attualmente in riproduzione
let flagLoop = false; // Flag per gestire la ripetizione

async function fetchAlbumData(albumId) {
    try {
        const albumUrl = `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`;
        const response = await fetch(albumUrl);

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Dati dell\'album:', data);

        // Visualizza le canzoni nella pagina
        displayTracks(data.tracks.data);
        tracks = data.tracks.data;
   
        
    } catch (error) {
        console.error('Errore durante il recupero dei dati dell\'album:', error);
    }
}

function getAlbumIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

function displayTracks(tracks) {
    const trackListContainer = document.getElementById('trackList');
    if (!trackListContainer) {
        console.error('Elemento per la lista delle canzoni non trovato');
        return;
    }

    trackListContainer.innerHTML = '';

    tracks.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.className = 'track';
        trackElement.innerHTML = `
            <h5>${track.title}</h5>
            <p>${track.artist.name}</p>
            <p>Durata: ${formatDuration(track.duration)}</p>
        `;
        trackElement.addEventListener('click', () => playTrack(track.preview, index));
        trackListContainer.appendChild(trackElement);
    });
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function playTrack(previewUrl, trackIndex) {
    const audio = document.getElementById('audio');
    const playIcon = document.getElementById('play');

    if (previewUrl) {
        audio.src = previewUrl;
        audio.play().catch(error => console.error('Errore durante la riproduzione:', error));
        playIcon.classList.remove('bi-play-circle-fill');
        playIcon.classList.add('bi-pause-circle-fill');
        currentTrackIndex = trackIndex; // Aggiorna l'indice della traccia corrente
    }
}

function player() {
    const audio = document.getElementById('audio');
    const rangeAudio = document.getElementById('rangeAudio');
    const currentDuration = document.getElementById('currentDuration');
    const maxDuration = document.getElementById('maxDuration');
    const playIcon = document.getElementById('play');
    const resetButton = document.getElementById('resetButton');
    const volumeControl = document.getElementById('volumeControl');
    const loopButton = document.getElementById('loopButton');

    rangeAudio.value = 0;

    // 
    audio.addEventListener('loadedmetadata', () => {
        rangeAudio.max = Math.floor(audio.duration);
        maxDuration.innerText = formatTime(audio.duration);
    });

    // Aggiorna il valore del range e il tempo corrente
    audio.addEventListener('timeupdate', () => {
        rangeAudio.value = Math.floor(audio.currentTime);
        currentDuration.innerText = formatTime(audio.currentTime);
    });

    // controllo tempo
    rangeAudio.addEventListener('input', () => {
        audio.currentTime = rangeAudio.value;
    });

    // Quando la traccia finisce controlla il valore del tasto loop e passa alla traccia successiva
    audio.addEventListener('ended', () => {
        if (tracks.length > 1 && !flagLoop) {
            nextTrack();
        } else {
            rangeAudio.value = 0;
            if (!audio.paused) {
                audio.play();
            }
        }
    });

    // traccia successiva 
    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        const nextTrack = tracks[currentTrackIndex];
        playTrack(nextTrack.preview, currentTrackIndex);
    }

    // pulsante di reset
    resetButton.addEventListener('click', () => {
        audio.currentTime = 0; // Riporta la riproduzione all'inizio
        if (!audio.paused) {
            audio.pause(); // Mette in pausa l'audio se è in riproduzione
            playIcon.classList.remove('bi-pause-circle-fill');
            playIcon.classList.add('bi-play-circle-fill');
        }
    });

    // play/pausa
    playIcon.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(error => console.error('Errore durante la riproduzione:', error));
            playIcon.classList.remove('bi-play-circle-fill');
            playIcon.classList.add('bi-pause-circle-fill');
        } else {
            audio.pause();
            playIcon.classList.remove('bi-pause-circle-fill');
            playIcon.classList.add('bi-play-circle-fill');
        }
    });

    // volume
    volumeControl.addEventListener('input', () => {
        const volumeValue = parseFloat(volumeControl.value);
        if (volumeValue < 0 || volumeValue > 1) {
            console.error('Volume value out of range:', volumeValue);
        } else {
            audio.volume = volumeValue;
        }
    });

    // pulsante di loop
    loopButton.addEventListener('click', () => {
        flagLoop = !flagLoop;
        loopButton.classList.toggle('active', flagLoop);
    });

    // traccia successiva
    document.getElementById('nextTrack').addEventListener('click', nextTrack);
}

document.addEventListener('DOMContentLoaded', () => {
    const albumId = getAlbumIdFromUrl();
    if (albumId) {
        fetchAlbumData(albumId);
    } else {
        console.error('ID dell\'album non trovato nella URL');
    }
    player();
});
