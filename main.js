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

// main
const videosContainer = document.getElementById("videos-container")
const favoritesContainer = document.getElementById("favorites-container")
const main = document.querySelector(".main")

// navbar
const navbar = document.querySelector("navbar")
const hamburger = document.getElementById("hamburger")
const pageTitle = document.querySelector("#page-title")

// sidebar
const sidebar = document.querySelector("sidebar")
const closeSidebar = document.getElementById("close-sidebar")
const videos = document.getElementById('videos')
const favorites = document.getElementById('favorites')

// search bar
const searchVideos = document.getElementById('search-videos')
const searchIcon = document.getElementById('search-icon')

// modal
const modal = document.getElementById('modal')

const videoPlay = document.getElementById('video-play')

let favoritesArray = []

let player

function closeModal(){
  modal.style.display = "none"
  stopVideo()
}


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
    favoritesArray = JSON.parse(localFavorites)
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
  const items = data.items

  renderVideos(items)
  addToLocalStorage(items)
}

const addToLocalStorage = (items) => {
  localStorage.setItem("videos", JSON.stringify(items))
}

const getLocalFavorites = () => {
  const localFavorites = localStorage.getItem("favorites")

  if (localFavorites === null) {
    localStorage.setItem("favorites", [])
  }

  if (localFavorites.length) {
    favoritesArray = JSON.parse(localFavorites)
  }
}

const flagFavoritesOnStart = (videos) => {
  // get local favorites on start
  getLocalFavorites()

  let hasFavorite = ''
  // verify if has favorites and if yes, favorite is toggle on load
  let selectedVideo = favoritesArray.filter((video) => {
    return video.id.videoId === videos.id.videoId
  })

  if (selectedVideo.length){
    hasFavorite = 'favorite'
  } else {
    hasFavorite = ''
  }

  return hasFavorite
}

const toogleVideoFavoriteClickEvent = (videos) => {
  const nodeList = document.querySelectorAll("#videos-container .card .favorites-star")

  if (nodeList) {
    nodeList.forEach(node => {
      const nodeId = node.parentElement.parentElement.parentElement.id

      node.addEventListener('click', (e) => {
        e.preventDefault()
        // const nodeId = node.parentElement.parentElement.parentElement.id

        if (node.classList.contains('favorite')) {
          node.classList.remove('favorite')

          let selectedVideo = videos.filter((video) => {
            return video.id.videoId === nodeId.toString()
          })

          removeFavorites(selectedVideo)

        } else {
          node.classList.add('favorite')

          let selectedVideo = videos.filter((video) => {
            return video.id.videoId === nodeId.toString()
          })

          addToFavorites(selectedVideo)
        }
      })
    })
  }
}

const addVideoPlayClickEvent = (videos) => {
  const nodePlay = document.querySelectorAll("#videos-container .card .card-footer button")
  
  nodePlay.forEach(node => {
    node.addEventListener('click', (e) => {
      e.preventDefault()
      const nodeId = node.parentElement.parentElement.id

      let selectedVideo = videos.filter((video) => {
      return video.id.videoId === nodeId.toString()
      })

      showModal(selectedVideo)

    })
  })
}

// Render Videos
const renderVideos = (videos) => {
  let html = ""

  if (videos) {
    for(let i=0; i <= videos.length -1; i++) {
      
      const hasFavorite = flagFavoritesOnStart(videos[i])

      html += `
        <div id="${videos[i].id.videoId}" class="card">
          <div class="card-header">
            <div class="card-title">
              <small>${getPuplishedTime(videos[i].snippet.publishedAt)}</small>
              <span class="favorites-star ${hasFavorite}"><i class="fa-solid fa-star" style="font-size: 24px"></i><span>
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
            <button id="video-play" class="btn btn-primary">Play</button>
          </span>
        </div>
      `
    }

    videosContainer.innerHTML = html

    toogleVideoFavoriteClickEvent(videos)
    addVideoPlayClickEvent(videos)
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

const showSidebar = () => {
    sidebar.classList.remove("hide")
    sidebar.classList.add("show")
    main.style.marginLeft = '320px'
    navbar.style.marginLeft = '275px'
}

const hideSidebar = () => {
    sidebar.classList.remove("show")
    sidebar.classList.add("hide")
    main.style.marginLeft = 'auto'
    navbar.style.marginLeft = 'auto'
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

  if (localFavorites === null) {
    localStorage.setItem("favorites", [])
  }

  if (video) {
    favoritesArray.push(video[0])
    localStorage.setItem("favorites", JSON.stringify(favoritesArray))
  }

}

// Remove videos from favorites
const removeFavorites = (video) => {
  let filteredArray = favoritesArray.filter((favorite) => {
    return favorite.id.videoId !== video[0].id.videoId
  })

  let favorite = document.querySelector(`#${video[0].id.videoId} .card-title span`)
  favorite.classList.remove('favorite')

  favoritesArray = filteredArray
  localStorage.setItem("favorites", JSON.stringify(favoritesArray))

  renderFavorites()
}

const removeFromFavoritesEvent = (videos) => {
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

// Render Favorites
const renderFavorites = () => {
  let videos = favoritesArray
  const localFavorites = localStorage.getItem("favorites")

  if (localFavorites.length) {
    videos = JSON.parse(localFavorites)
    //TODO: videos container doesnt exist in this momment
    // for(let i=0; i<=videos.length -1; i++) {
    //   let favoriteVideos = document.querySelector(`#${videos[i].id.videoId} .card-title span`)
    //   favoriteVideos.classList.add('favorite')
    // }
  }
  
  let html = ""

  if (videos.length) {
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
            <button id="video-play" class="btn btn-primary">Play</button>
          </span>
        </div>
      `
    }
  } else {
    html += `
      <h2>Nenhum favorito econtrado.</h2>
    `
  }

  favoritesContainer.innerHTML = html
  
  removeFromFavoritesEvent(videos)
}

const getVideo = async(query) => {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&type=${params.type}&part=${params.part}&q=${query}&maxResults=${params.maxResults}`)
  const data = await res.json()
  const items = data.items
  renderVideos(items)
}

// video player
const playVideo = (videoId) => {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: videoId,
    events: {
      'onReady': onPlayerReady,
      // 'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

function stopVideo() {
  player.stopVideo();
}

const addCloseButtonEvent = () => {
  const nodeList = document.querySelectorAll('.close-button')

  nodeList.forEach(node => {
    node.addEventListener('click', (e) => {
      closeModal()
    })
  })
}

// let done = false

// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     setTimeout(stopVideo, 2000);
//     done = true;
//   }
// }


const renderModal = (video) => {
  let html = ""
  const videoId = video[0].id.videoId
  const videoTitle = video[0].snippet.title
  const channelTitle = video[0].snippet.channelTitle
  const publishedAt = video[0].snippet.publishedAt

  html += `
    <div class="modal-content">
      <div class="modal-header">
        <div class="logo">
          <img src="./images/icon-play.png" class="icon-play"/>
          <label>Play</label>
        </div>
        <span id="close-button" class="close-button">
          <i class="fa fa-times"></i>
        </span>
      </div>
      <div class="modal-body">
        <small class="video-title">${getPuplishedTime(publishedAt)}</small>
        <div class="iframe-container">
          <div id="player" class="video-iframe" style="width: 90%; text-align:center"></div>
        </div>
        <div class="video-info">
          <label>${videoTitle}</label>
          <span class="channel-info">
            <img src="./images/icon-play.png" width="18px"/>
            <small>${channelTitle}</small>
          </span>
        </div>
      </div>
      <div class="modal-footer">
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
          <button class="btn btn-primary">Youtube</button>
        </a>
        <button class="btn btn-secondary close-button" class="btn btn-secondary">Close</button>
      </div>
    </div>
  `

  modal.innerHTML = html

  addCloseButtonEvent()
  playVideo(videoId)
}

const showModal = (video) => {
  modal.style.display = "flex"

  renderModal(video)
}

// Listeners
hamburger.addEventListener("click", showSidebar)
closeSidebar.addEventListener("click", hideSidebar)

videos.addEventListener("click", (e) => {
  e.preventDefault()
  
  const id = e.target.id
  togglePage(id)
  searchVideos.textContent = ""

  hideSidebar()
})

favorites.addEventListener("click", (e) => {
  e.preventDefault()
  
  const id = e.target.id
  togglePage(id)
  searchVideos.textContent = ""
  renderFavorites()
  hideSidebar()
})

searchIcon.addEventListener('click', () => {
  let query = searchVideos.value

  if (query.length) {
    getVideo(query)
  }
})

searchVideos.addEventListener('keypress', (e) => {  
  if (e.key === "Enter") {
    if (searchVideos.value) {
      searchIcon.click()
    }
  }
})

videoPlay.addEventListener('click', (e) => {
  e.preventDefault()
  modal.style.display = "block"
  alert('here')
})


