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
const favoritesContainer = document.getElementById("favorites-container")
const main = document.querySelector(".main")
const pageTitle = document.querySelector("#page-title")

// sidebar
const videos = document.getElementById('videos')
const favorites = document.getElementById('favorites')

let favoritesArray = []

// on load page
window.addEventListener('load', () => {
  const localVideos = localStorage.getItem("videos")
  
  if (!localVideos) {
    getTopVideos()
  } else {
    renderVideos(JSON.parse(localVideos))
  }

  const localFavorites = localStorage.getItem("favorites")

  if (localFavorites.length) {
    renderFavorites()
  }
})

// Top Videos
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
  addToLocalStorage(items)
}

const addToLocalStorage = (items) => {
  console.log(items)
  localStorage.setItem("videos", JSON.stringify(items))
}

const renderVideos = (videos) => {
  let html = ""

  if (videos) {
    for(let i=0; i <= videos.length -1; i++) {
      html += `
        <div id="${videos[i].id.videoId}" class="card">
          <div class="card-header">
            <div class="card-title">
              <small>${getPuplishedTime(videos[i].snippet.publishedAt)}</small>
              <span class="favorites-star"><i class="fa-solid fa-star" style="font-size: 24px"></i><span>
            </div>            
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

    videosContainer.innerHTML = html

    const nodeList = document.querySelectorAll("#videos-container .card .favorites-star")

    if (nodeList) {
      nodeList.forEach(node => {
        node.addEventListener('click', (e) => {
          e.preventDefault()
          const nodeId = node.parentElement.parentElement.parentElement.id

          node.classList.add('favorite')

          let selectedVideo = videos.filter((video) => {
            return video.id.videoId === nodeId.toString()
          })

          addToFavorites(selectedVideo)
        })
      })
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

const togglePage = (page) => {
  if (page === 'favorites') {
    videosContainer.style.display = "none"
    favoritesContainer.style.display = "grid"
    pageTitle.children[0].classList = ""
    pageTitle.children[0].classList.add("fa-solid", "fa-star")
    pageTitle.children[1].textContent = "Favoritos"
  }

  if (page === 'videos') {
    favoritesContainer.style.display = "none"
    videosContainer.style.display = "grid"
    pageTitle.children[0].classList = ""
    pageTitle.children[0].classList.add("fa-solid", "fa-medal")
    pageTitle.children[1].textContent = "Top Videos"
  }
}

const addToFavorites = (video) => {
  const localFavorites = localStorage.getItem("favorites")

  if (!localFavorites) {
    localStorage.setItem("favorites", [])
  }

  if (video) {
    favoritesArray.push(video[0])
    localStorage.setItem("favorites", JSON.stringify(favoritesArray))
  }

}

const removeFavorites = (video) => {
  console.log(video)
  let filteredArray = favoritesArray.filter((favorite) => {
    return favorite.id.videoId !== video[0].id.videoId
  })

  let favorite = document.querySelector(`#${video[0].id.videoId} .card-title span`)
  favorite.classList.remove('favorite')

  favoritesArray = filteredArray
  localStorage.setItem("favorites", JSON.stringify(favoritesArray))

  renderFavorites()
}

const renderFavorites = () => {
  let videos = favoritesArray
  const localFavorites = localStorage.getItem("favorites")

  if (localFavorites.length) {
    videos = JSON.parse(localFavorites)
    for(let i=0; i<=videos.length -1; i++) {
      let favoriteVideos = document.querySelector(`#${videos[i].id.videoId} .card-title span`)
      favoriteVideos.classList.add('favorite')
    }
  }
  
  let html = ""
  
  for(let i=0; i<=videos.length -1; i++) {
    html += `
      <div id="${videos[i].id.videoId}" class="card">
        <div class="card-header">
          <div class="card-title">
            <small>${getPuplishedTime(videos[i].snippet.publishedAt)}</small>
            <span class="favorites-star favorite"><i class="fa-solid fa-star" style="font-size: 24px"></i><span>
          </div>            
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

  favoritesContainer.innerHTML = html

  const nodeList = document.querySelectorAll("#favorites-container .card .favorites-star")

  if (nodeList) {
    nodeList.forEach(node => {
      node.addEventListener('click', (e) => {
        e.preventDefault()
        const nodeId = node.parentElement.parentElement.parentElement.id

        node.classList.remove('favorite')

        let selectedVideo = videos.filter((video) => {
          return video.id.videoId === nodeId.toString()
        })

        removeFavorites(selectedVideo)
      })
    })
  }
}

// Listeners
hamburger.addEventListener("click", showSidebar)
closeSidebar.addEventListener("click", hideSidebar)

videos.addEventListener("click", (e) => {
  e.preventDefault()
  
  const id = e.target.id
  togglePage(id)
})

favorites.addEventListener("click", (e) => {
  e.preventDefault()
  
  const id = e.target.id
  togglePage(id)

  renderFavorites()
})


