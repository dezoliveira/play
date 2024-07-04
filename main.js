import config from "./config.js";

const YOUTUBE_API_KEY = config.YOUTUBE_API_KEY

if (!YOUTUBE_API_KEY) {
  throw new Error("No API key is provided");
}

const apiKey = YOUTUBE_API_KEY
const apiURL = "https://www.googleapis.com/youtube/v3"

const params = {
  type: "video",
  part: "snippet",
  rate: "getRating",
  maxResults: 20,
}

const hamburger = document.getElementById("hamburger")
const closeSidebar = document.getElementById("close-sidebar")
const sidebar = document.querySelector("sidebar")
const videosContainer = document.getElementById("videos-container")

window.addEventListener('load', () => {
  getTopVideos()
})

const getTopVideos = async () => {
  const req = await fetch(`${apiURL}/search?key=${apiKey}&type=${params.type}&part=${params.part}&${params.rate}&maxResults=${params.maxResults}`)
  const data = await req.json()
  console.log(data.items)

  const items = data.items

  renderVideos(items)
}

const renderVideos = (videos) => {
  if (videos) {
    for(let i=0; i <= 20; i++) {
      videosContainer.innerHTML += `
        <img src="${videos[i].snippet.thumbnails.default.url}" />
        <p>${videos[i].snippet.description}</p>
      `
    }
  }
}

const showSidebar = (e) => {
    e.preventDefault()
    sidebar.classList.remove("hide")
    sidebar.classList.add("show")
    videosContainer.style.marginLeft = '320px'
}

const hideSidebar = (e) => {
    e.preventDefault()
    sidebar.classList.remove("show")
    sidebar.classList.add("hide")
    videosContainer.style.marginLeft = 'auto'
}

hamburger.addEventListener("click", showSidebar)
closeSidebar.addEventListener("click", hideSidebar)

