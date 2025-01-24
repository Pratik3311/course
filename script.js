// Array of video objects (unchanged)
const videos = [
    {
      id: "XTp5jaRU3Ws",
      title: "Video 1 kjbgsgbosig kuz  ",
      duration: "10:30",
      views: "12k",
      summary: "Summary of Video 1",
      completed: false,
    },
    {
      id: "g3r0IK73auk",
      title: "Video 2 kjbgsgbosig kuz",
      duration: "3:32",
      summary: "Summary of Video 2",
      views: "12k",
      completed: false,
    },
    {
      id: "jNQXAC9IVRw",
      title: "Video 3 kjbgsgbosig kuz",
      duration: "0:18",
      summary: "Summary of Video 3",
      views: "12k",
      completed: false,
    },
    {
      id: "EngW7tLk6R8",
      title: "Video 4 kjbgsgbosig kuz",
      duration: "7:45",
      summary: "Summary of Video 4",
      views: "12k",
      completed: false,
    },
    {
      id: "kJQP7kiw5Fk",
      title: "Video 5 kjbgsgbosig kuz",
      duration: "4:41",
      summary: "Summary of Video 5",
      views: "12k",
      completed: false,
    },
  ]
  
  let player
  let currentVideoIndex = 0
  let notes = {} // Object to store notes for each video
  
  // Function to create the video list (updated)
  function createVideoList() {
    const videoListContainer = document.querySelector(".video-list")
    if (!videoListContainer) {
      console.error("Video list container not found")
      return
    }
    videos.forEach((video, index) => {
      const videoItem = document.createElement("li")
      videoItem.classList.add("video-item")
      videoItem.innerHTML = `
        <div class="video-info">
          <div class="video-details">
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta">
              <p class="video-duration"><img src="https://img.icons8.com/ios/50/000000/clock.png" alt="Duration Icon" class="icon"> ${video.duration}</p>
              <p class="video-views"><img src="https://img.icons8.com/ios/50/000000/visible.png" alt="Views Icon" class="icon"> ${video.views} views</p>
            </div>
          </div>
          <input type="checkbox" id="video-${index}" class="video-checkbox" ${video.completed ? "checked" : ""} />
        </div>
      `
      videoItem.addEventListener("click", (e) => {
        if (e.target.type !== "checkbox") {
          loadVideo(index)
        }
      })
      videoListContainer.appendChild(videoItem)
    })
  }
  
  // Function to load a video (modified)
  function loadVideo(index) {
    currentVideoIndex = index
    const video = videos[index]
    if (player && player.loadVideoById) {
      player.loadVideoById(video.id)
    } else {
      // If player is not ready, update the iframe src directly
      const iframe = document.getElementById("player")
      if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${video.id}?enablejsapi=1`
      } else {
        console.error("Player iframe not found")
      }
    }
    updateVideoInfo(video)
    updateActiveVideoItem(index)
    loadNotes(index)
    console.log("Loading video:", index, video.title)
  }
  
  // Function to update video information (updated with error handling)
  function updateVideoInfo(video) {
    const titleElement = document.getElementById("current-title")
    const durationElement = document.getElementById("current-duration")
    const summaryElement = document.getElementById("video-summary")
  
    if (titleElement) {
      titleElement.textContent = video.title
    } else {
      console.error("Title element not found")
    }
  
    if (durationElement) {
      durationElement.textContent = `Duration: ${video.duration}`
    } else {
      console.error("Duration element not found")
    }
  
    if (summaryElement) {
      summaryElement.textContent = video.summary
      summaryElement.style.display = "block"
    } else {
      console.error("Summary element not found")
    }
  
    console.log("Updated video info:", video.title, video.summary)
  }
  
  // Function to update the active video item in the list (unchanged)
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
  
  // Function to load notes for the current video
  function loadNotes(index) {
    const notesTextarea = document.getElementById("video-notes")
    if (notesTextarea) {
      notesTextarea.value = notes[index] || ""
    }
  }
  
  // Function to save notes for the current video
  function saveNotes() {
    const notesTextarea = document.getElementById("video-notes")
    if (notesTextarea) {
      notes[currentVideoIndex] = notesTextarea.value
      console.log("Notes saved for video", currentVideoIndex)
    }
  }
  
  // Function to toggle the notes section
  function toggleNotes() {
    const notesSection = document.getElementById("notes-section")
    if (notesSection) {
      notesSection.style.display = notesSection.style.display === "none" ? "block" : "none"
    }
  }
  
  // Function to load the next video (unchanged)
  function loadNextVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videos.length
    loadVideo(currentVideoIndex)
  }
  
  // Function to mark video as completed (unchanged)
  function markVideoAsCompleted(index) {
    videos[index].completed = true
    const checkbox = document.querySelector(`#video-${index}`)
    if (checkbox) {
      checkbox.checked = true
    }
  }
  
  // YouTube Player API code (modified)
  function onYouTubeIframeAPIReady() {
    const playerContainer = document.getElementById("player")
    if (!playerContainer) {
      console.error("Player container not found")
      return
    }
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
  
  // The API will call this function when the video player is ready (modified)
  function onPlayerReady(event) {
    loadVideo(0) // Load the first video by default
  }
  
  // The API calls this function when the player's state changes (unchanged)
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
      markVideoAsCompleted(currentVideoIndex)
      loadNextVideo()
    }
  }
  
  // Call the function to create the video list when the DOM is loaded (modified)
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
  
    // Load the first video by default
    loadVideo(0)
  
    // Add event listeners for notes functionality
    const notesButton = document.getElementById("notes-button")
    if (notesButton) {
      notesButton.addEventListener("click", toggleNotes)
    }
  
    const saveNotesButton = document.getElementById("save-notes")
    if (saveNotesButton) {
      saveNotesButton.addEventListener("click", saveNotes)
    }
  })
  
  // Log the initial video information
  console.log("Initial video loaded:", videos[0])
  