


const videos = [
  {
    id: "XTp5jaRU3Ws",
    title: "1. Introduction to Modern Web Development",
    duration: "10:30",
    views: "12k",
    summary: "An overview of modern web development practices and technologies.",
    completed: false,
    questions: [
      "What is the main focus of modern web development?",
      "How does this course relate to current industry trends?",
      "Can you provide an example of a modern web development stack?",
    ],
    jobTips: {
      descriptions: [
        "Frontend Developer: Responsible for implementing visual elements that users see and interact with in a web application.",
        "Full Stack Developer: Develops both client and server software, working on projects from conception to completion.",
      ],
      advice:
        "Stay updated with the latest JavaScript frameworks and libraries. Practice building responsive and accessible websites.",
    },
  },
  {
    id: "g3r0IK73auk",
    title: "2. Advanced React Techniques",
    duration: "15:45",
    summary: "Deep dive into advanced React concepts and best practices.",
    views: "8k",
    completed: false,
    questions: [
      "What are the key advanced React techniques covered in this video?",
      "How can these techniques improve application performance?",
      "What challenges might you face when implementing these advanced concepts?",
    ],
    jobTips: {
      descriptions: [
        "React Developer: Specializes in building user interfaces using React and related technologies.",
        "Frontend Architect: Designs and implements the frontend architecture for large-scale web applications.",
      ],
      advice:
        "Build a strong portfolio showcasing complex React applications. Contribute to open-source React projects to gain visibility in the community.",
    },
  },
  {
    id: "jNQXAC9IVRw",
    title: "3. Backend Development with Node.js",
    duration: "12:18",
    summary: "Exploring server-side development using Node.js and Express.",
    views: "10k",
    completed: false,
    questions: [
      "What are the main advantages of using Node.js for backend development?",
      "How does Express.js simplify server-side development in Node.js?",
      "Can you think of any real-world applications that would benefit from a Node.js backend?",
    ],
    jobTips: {
      descriptions: [
        "Backend Developer: Focuses on server-side logic, database management, and API development.",
        "DevOps Engineer: Manages the deployment, scaling, and operations of both frontend and backend systems.",
      ],
      advice:
        "Gain experience with database technologies like MongoDB or PostgreSQL. Learn about RESTful API design and implementation.",
    },
  },
  {
    id: "EngW7tLk6R8",
    title: "4. Full Stack Integration",
    duration: "20:30",
    summary: "Connecting frontend and backend to create a full stack application.",
    views: "15k",
    completed: false,
    questions: [
      "What are the key considerations when integrating frontend and backend systems?",
      "How does this video demonstrate the flow of data in a full stack application?",
      "What challenges might arise in full stack development, and how can they be addressed?",
    ],
    jobTips: {
      descriptions: [
        "Full Stack JavaScript Developer: Proficient in both frontend and backend JavaScript technologies.",
        "Solution Architect: Designs comprehensive web solutions, considering both client and server-side requirements.",
      ],
      advice:
        "Develop end-to-end projects that showcase your ability to work across the entire stack. Familiarize yourself with cloud platforms like AWS or Google Cloud.",
    },
  },
  {
    id: "kJQP7kiw5Fk",
    title: "5. Deployment and Best Practices",
    duration: "18:22",
    summary: "Learn about deploying web applications and industry best practices.",
    views: "11k",
    completed: false,
    questions: [
      "What are the key steps in deploying a web application?",
      "How do the deployment strategies discussed relate to DevOps practices?",
      "Can you think of ways to apply these best practices in your own projects?",
    ],
    jobTips: {
      descriptions: [
        "DevOps Specialist: Focuses on streamlining development processes and managing deployments.",
        "Site Reliability Engineer: Ensures the reliability and performance of large-scale web applications.",
      ],
      advice:
        "Learn containerization technologies like Docker. Familiarize yourself with CI/CD pipelines and infrastructure-as-code concepts.",
    },
  },
]

let player
let currentVideoIndex = 0
const notes = {} // Object to store notes for each video

function updateProgress() {
  const totalVideos = videos.length
  const completedVideos = videos.filter((video) => video.completed).length
  const progressPercentage = Math.round((completedVideos / totalVideos) * 100)

  const circle = document.querySelector(".progress-ring__circle")
  const radius = circle.r.baseVal.value
  const circumference = radius * 2 * Math.PI
  circle.style.strokeDasharray = `${circumference} ${circumference}`
  circle.style.strokeDashoffset = circumference - (progressPercentage / 100) * circumference

  const greenHue = 120
  const hue = (progressPercentage / 100) * greenHue
  circle.style.stroke = `hsl(${hue}, 100%, 45%)`

  const progressText = document.querySelector(".progress-text")
  progressText.textContent = `${progressPercentage}%`
}

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
      } else {
        videos[index].completed = e.target.checked
        updateProgress()
      }
    })
    videoListContainer.appendChild(videoItem)
  })
  updateProgress()
}

function loadVideo(index) {
  currentVideoIndex = index
  const video = videos[index]
  if (player && player.loadVideoById) {
    player.loadVideoById(video.id)
  } else {
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
  displayQuestions()
  displayJobTips()

  // Hide all sections initially
  ;["notes-section", "questions-section", "job-tips-section"].forEach((id) => {
    document.getElementById(id).style.display = "none"
  })

  console.log("Loading video:", index, video.title)
}

function updateVideoInfo(video) {
  const titleElement = document.getElementById("current-title")
  const durationElement = document.getElementById("current-duration")
  const summaryElement = document.getElementById("current-summary")

  if (titleElement) titleElement.textContent = video.title
  if (durationElement) durationElement.textContent = `Duration: ${video.duration}`
  if (summaryElement) {
    summaryElement.textContent = video.summary
    summaryElement.style.display = "block"
  }

  console.log("Updated video info:", video.title, video.summary)
}

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

function loadNotes(index) {
  const notesTextarea = document.getElementById("video-notes")
  if (notesTextarea) {
    notesTextarea.value = notes[index] || ""
  }
}

function saveNotes() {
  const notesTextarea = document.getElementById("video-notes")
  if (notesTextarea) {
    notes[currentVideoIndex] = notesTextarea.value
    console.log("Notes saved for video", currentVideoIndex)
  }
}

function toggleContent(sectionId) {
  const section = document.getElementById(sectionId)
  const allSections = ["notes-section", "questions-section", "job-tips-section"]

  allSections.forEach((id) => {
    const el = document.getElementById(id)
    if (id === sectionId) {
      el.style.display = el.style.display === "none" ? "block" : "none"
    } else {
      el.style.display = "none"
    }
  })
}

function displayQuestions() {
  const currentVideo = videos[currentVideoIndex]
  const questionsList = document.getElementById("questions-list")
  questionsList.innerHTML = ""
  currentVideo.questions.forEach((question) => {
    const li = document.createElement("li")
    li.textContent = question
    questionsList.appendChild(li)
  })
}

function displayJobTips() {
  const currentVideo = videos[currentVideoIndex]
  const jobDescriptions = document.getElementById("job-descriptions")
  const careerAdvice = document.getElementById("career-advice")

  jobDescriptions.innerHTML = "<h4>Sample Job Descriptions:</h4>"
  currentVideo.jobTips.descriptions.forEach((desc) => {
    const p = document.createElement("p")
    p.textContent = desc
    jobDescriptions.appendChild(p)
  })

  careerAdvice.innerHTML = `<h4>Career Advice:</h4><p>${currentVideo.jobTips.advice}</p>`
}

function loadNextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % videos.length
  loadVideo(currentVideoIndex)
}

function markVideoAsCompleted(index) {
  videos[index].completed = true
  const checkbox = document.querySelector(`#video-${index}`)
  if (checkbox) {
    checkbox.checked = true
  }
  updateProgress()
}

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

function onPlayerReady(event) {
  loadVideo(0)
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    markVideoAsCompleted(currentVideoIndex)
    loadNextVideo()
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createVideoList()
  if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  } else {
    onYouTubeIframeAPIReady()
  }

  loadVideo(0)

  document.getElementById("notes-button").addEventListener("click", () => toggleContent("notes-section"))
  document.getElementById("questions-button").addEventListener("click", () => toggleContent("questions-section"))
  document.getElementById("job-tips-button").addEventListener("click", () => toggleContent("job-tips-section"))
  document.getElementById("save-notes").addEventListener("click", saveNotes)

  updateProgress()
})

console.log("Initial video loaded:", videos[0])

