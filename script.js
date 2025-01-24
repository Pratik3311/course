// Array of video objects
const videos = [
    { id: "XTp5jaRU3Ws", title: "Video 1", duration: "10:30", summary: "Summary of Video 1" },
    { id: "g3r0IK73auk", title: "Video 2", duration: "3:32", summary: "Summary of Video 2" },
    { id: "jNQXAC9IVRw", title: "Video 3", duration: "0:18", summary: "Summary of Video 3" },
    { id: "EngW7tLk6R8", title: "Video 4", duration: "7:45", summary: "Summary of Video 4" },
    { id: "kJQP7kiw5Fk", title: "Video 5", duration: "4:41", summary: "Summary of Video 5" },
  ]
  
  let player
  let currentVideoIndex = 0
  
  // Function to create the video list
  function createVideoList() {
    const videoListContainer = document.querySelector(".video-list")
    videos.forEach((video, index) => {
      const videoItem = document.createElement("li")
      videoItem.classList.add("video-item")
      videoItem.innerHTML = `
        
        <div class="video-info">
        <div
          <h3>${video.title}</h3>
          <p>${video.duration}</p>
        </div>
      `
      videoItem.addEventListener("click", () => loadVideo(index))
      videoListContainer.appendChild(videoItem)
    })
  }
  
  // Function to load a video
  function loadVideo(index) {
    currentVideoIndex = index
    const video = videos[index]
    if (player && player.loadVideoById) {
      player.loadVideoById(video.id)
    } else {
      // If player is not ready, update the iframe src directly
      const iframe = document.getElementById("player")
      iframe.src = `https://www.youtube.com/embed/${video.id}?enablejsapi=1`
    }
    updateVideoInfo(video)
    updateActiveVideoItem(index)
  }
  
  // Function to update video information
  function updateVideoInfo(video) {
    document.getElementById("current-title").textContent = video.title
    document.getElementById("current-duration").textContent = `Duration: ${video.duration}`
    document.getElementById("video-summary").textContent = video.summary
  }
  
  // Function to update the active video item in the list
  function updateActiveVideoItem(index) {
    const videoItems = document.querySelectorAll(".video-item")
    videoItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add("active")
      } else {
        item.classList.remove("active")
      }
    })
  }
  
  // Function to load the next video
  function loadNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length
    loadVideo(currentVideoIndex)
  }
  
  // YouTube Player API code
  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      height: "100%",
      width: "100%",
      videoId: videos[0].id,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    })
  }
  
  // The API will call this function when the video player is ready
  function onPlayerReady(event) {
    loadVideo(0)
  }
  
  // The API calls this function when the player's state changes
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
      loadNextVideo()
    }
  }
  
  // Call the function to create the video list when the DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    createVideoList()
    // Check if YouTube API is loaded
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      // If not, load it manually
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    } else {
      // If it's already loaded, create the player
      onYouTubeIframeAPIReady()
    }
  })
  
  