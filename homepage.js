const playlistCard = document.getElementById("playlistCard");
const cardContainer = document.getElementById("cardContainer");


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
  
      data.forEach(artistData => {
        artistData.data.forEach(element => {
          const clone = document.importNode(cardContainer, true);
  
          clone.querySelector(".cardImgTop").src = element.album.cover_medium;
          clone.querySelector(".cardTitle").innerText = element.artist.name;
          clone.querySelector(".cardText").innerText = element.title;
  
          playlistCard.appendChild(clone);
        });
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  
  getAllData();
  