let urls = [
  'https://striveschool-api.herokuapp.com/api/deezer/search?q=eminem',
  'https://striveschool-api.herokuapp.com/api/deezer/search?q=metallica',
  'https://striveschool-api.herokuapp.com/api/deezer/search?q=queen',
  'https://striveschool-api.herokuapp.com/api/deezer/search?q=sexpistols',
  'https://striveschool-api.herokuapp.com/api/deezer/search?q=thedoors',
  'https://striveschool-api.herokuapp.com/api/deezer/search?q=tiromancino'
];

const getAllData = async () => {
  try {
    let requests = urls.map(url => fetch(url));
    let responses = await Promise.all(requests);

    let dataPromises = responses.map(response => response.json());
    let data = await Promise.all(dataPromises);

    let allTracks = data.flatMap(artistData => artistData.data);

    function getRandomElements(array, numElements) {
      let shuffled = array.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, numElements);
    }

    let randomAlbums = getRandomElements(allTracks, 10);

    const cardTemplate = document.getElementById('cardTemplate');
    const playlistCard = document.getElementById('playlistCard');

    randomAlbums.forEach(element => {
      const clone = document.importNode(cardTemplate.content, true);

      clone.querySelector(".cardImgTop").src = element.album.cover_medium;

      const albumLink = clone.querySelector(".cardLink");
      albumLink.href = `dettaglioAlbum.html?id=${element.album.id}`;

      playlistCard.appendChild(clone);
    });
  } catch (error) {
    console.error("errore di rerte", error);
  }
};

getAllData();




