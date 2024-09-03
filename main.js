uros milenkovic 03/09/2024 19:33 • 
const container = document.getElementById("cards-container");
const template = document.getElementById("card-template").content;


let urls = [
'https://striveschool-api.herokuapp.com/api/deezer/search?q=eminem',
'https://striveschool-api.herokuapp.com/api/deezer/search?q=metallica',
'https://striveschool-api.herokuapp.com/api/deezer/search?q=queen',
'https://striveschool-api.herokuapp.com/api/deezer/search?q=sexpistols',
'https://striveschool-api.herokuapp.com/api/deezer/search?q=thedoors',
'https://striveschool-api.herokuapp.com/api/deezer/search?q=tiromancino'
]


const getAllData = async () => {
try {
let requests = urls.map(url => fetch(url));
let responses = await Promise.all(requests)


let dataPromises = responses.map(response => response.json())
let dates = await Promise.all(dataPromises)


dates.forEach(data => {
data.data.forEach(element => {
const clone = document.importNode(template, true);


clone.querySelector(".card-img-top").src = element.album.cover_medium;
clone.querySelector(".card-title").innerText = element.artist.name;
clone.querySelector(".card-text").innerText = element.title;

container.appendChild(clone);

});

})



} catch (error) {
console.error("Fetch error:", error);
}
}
getAllData(); 