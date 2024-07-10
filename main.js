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
const main = document.querySelector(".main")

window.addEventListener('load', () => {
  getTopVideos()
})

const getTopVideos = async () => {
  const req = await fetch(`${apiURL}/search?key=${apiKey}&type=${params.type}&part=${params.part}&${params.rate}&maxResults=${params.maxResults}`)
  
  if (req.status !== 200) {
    main.innerHTML += `
      <div class="request-error">
        <h2>Ocorreu um erro, tente novamente mais tarde</h2>
      </div>
    `
  }
  
  const data = await req.json()
  console.log(data.items)

  const items = data.items

  renderVideos(items)
  // getChannelId(items)
}

const renderVideos = (videos) => {
  if (videos) {
    for(let i=0; i <= videos.length -1; i++) {
      videosContainer.innerHTML += `
        <div class="card">
          <div class="card-header">
            <small>${getPuplishedTime(videos[i].snippet.publishedAt)}</small>
            <a href="https://www.youtube.com/watch?v=${videos[i].id.videoId}" target="_blank">
              <img src="${videos[i].snippet.thumbnails.medium.url}" />
            </a>
          </div>
          <div class="card-body">
            <label>${videos[i].snippet.title}</label>
            <span class="channel-info">
              <img src="./images/icon-play.png" width="18px"/>
              <small>${videos[i].snippet.channelTitle}</small>
            </span>
          </div>
          <span class="card-footer">
            <a href="https://www.youtube.com/watch?v=${videos[i].id.videoId}" target="_blank">
              <button class="btn btn-primary">Play</button>
            </a>
          </span>
        </div>
      `
    }
  }
}

const getPuplishedTime = (dateTime) => {
  const date = new Date(dateTime).toLocaleDateString()
  const time = new Date(dateTime).toLocaleTimeString()
  const dateString = `Publicado em ${date} as ${time}`
  return dateString
}

// const getChannelId  = (items) => {
//   console.log('get in')
//   const channels = []
//   // if (items){
//     console.log(items)
//     for(let i=0; i <= items.length -1; i++){
//       channels.push(items[i].snippet.channelId)
//     }
//   // }

//   console.log('channels', channels)
// }

const showSidebar = (e) => {
    e.preventDefault()
    sidebar.classList.remove("hide")
    sidebar.classList.add("show")
    main.style.marginLeft = '320px'
}

const hideSidebar = (e) => {
    e.preventDefault()
    sidebar.classList.remove("show")
    sidebar.classList.add("hide")
    main.style.marginLeft = 'auto'
}

hamburger.addEventListener("click", showSidebar)
closeSidebar.addEventListener("click", hideSidebar)

