const hamburger = document.getElementById("hamburger")
const closeSidebar = document.getElementById("close-sidebar")
const sidebar = document.querySelector("sidebar")

const showSidebar = (e) => {
    e.preventDefault()
    sidebar.classList.remove("hide")
    sidebar.classList.add("show")
}

const hideSidebar = (e) => {
    e.preventDefault()
    sidebar.classList.remove("show")
    sidebar.classList.add("hide")
}

hamburger.addEventListener("click", showSidebar)
closeSidebar.addEventListener("click", hideSidebar)

