const state = {
  user: null,
  news: [],
  myNews: [],
  selected: null,
  currentNewsDiv: null
}

// URLs ::

const my_news_url = `http://localhost:3000/users/${state.user}`
const news_url = `http://localhost:3000/news`
const search_url = 'http://localhost:3000/search/'
const login_url = 'http://localhost:3000/users'

// Selectors ::

const newsDiv = document.querySelector('#news-container')
const sidePanel = document.querySelector('#side-panel')
const form = document.querySelector('.form-inline')
const comment = document.querySelector('ul.commentList')
const commentPanel = document.querySelector('div#comment-panel')
const aNav = document.querySelector('a#nav-avatar')
const pwdDiv = document.querySelector('#pwd')

// API ::

const getNews = (url) => fetch(url)
  .then(response => response.json())
  .catch(error => alert(error))

const getMeta = () => fetch(news_url + '/meta')
  .then(response => response.json())
  .catch(error => alert(error))

const patchNews = (like) => fetch(news_url + '/' + like.news_id, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(like)
}).catch(error => alert(error))

const searchNews = (term) => fetch(search_url + term)
  .then(response => response.json())
  .then(data => renderNews(data))

const postComment = (com) => fetch(news_url + '/' + like.news_id,{
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(com)
})

const postUser = (email) => fetch(login_url,{
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email: email})
}).then(r => r.json())

  // Social ::

const likeNews = (id) => {
  const obj = {
    user_id: state.user,
    news_id: id,
    like: true,
  }
  patchNews(obj)
  state.myNews.push(state.news.find((e) => e.id === id))
}

const dislikeNews = (id) => {
  const obj = {
    user_id: state.user,
    news_id: id,
    like: false
  }
  patchNews(obj)
}

const reportNews = (id) => {
  const obj = {
    user_id: state.user,
    news_id: id,
    report: true
  }
  patchNews(obj)
}

// SEC ::

const loggedIn = () => state.user !== null

const generateAvatar = () => {
  fetch("https://randomuser.me/api/?inc=picture&noinfo")
    .then(resp => resp.json())
    .then(p => {
      document.querySelector("#avatar").src = p.results[0].picture.large
    })
 }

const logIn = () => {
  pwdDiv.hidden = false
  const form = document.querySelector('#pwd-form')
  form.addEventListener ('submit',(e)=>{
    e.preventDefault()
    postUser(form.email.value).then(data => {
      state.user = parseInt(data.id,10)
      pwdDiv.hidden = true
      generateAvatar()
    })
  })
}

// DOM ::

const renderComment = (com) => {
  const li = document.createElement('li')
  li.innerHTML = `
  <div class="commenterImage">
    <img src="http://placekitten.com/50/50">
  </div>
  <div class="commentText">
    <p class="">${com.content}</p>
    <span class="date sub-text">${com.created_at}</span>
  </div>`
  comment.append(li)
}

const renderComments = (news) => {
  const form = document.querySelector('form#cmt')
  commentPanel.hidden = false
  comment.innerHTML = ``
  let likeCount = news.reacts.filter((r)=>r.like == true).length
  let disCount = news.reacts.filter((r)=>r.like == false).length
  let comCount = news.comments.length
  news.comments.forEach(renderComment)
  const div = form.querySelector('#cmt-post')
  div.innerHTML=`<button id="cmt-btn" class="btn btn-light z-depth-0">Ok</button>`
  const button = document.querySelector('#cmt-btn')
  button.addEventListener('click',(e) => {
    e.preventDefault()
    e.stopPropagation()
    const com = {
      new_id: news.id,
      user_id: state.user,
      content: form.comment.value,
      created_at: Date.now()
    }
    renderComment(com)
    state.news.find((e) => e.id === news.id).comments.push(com)
    postComment(com)
    updateComCount()
    form.reset()
  })
  const close = document.querySelector('#cmt-cls')
  close.addEventListener('click',()=> {
    state.currentNewsDiv = null
    commentPanel.hidden = true
  })

  const updateComCount = () => {
    comCount++
    state.currentNewsDiv.querySelector(".article-stats").innerHTML = `likes: ${likeCount} angry: ${disCount} comments: ${comCount}`
  }
}

const renderTrend = (trend) => {
  const img = document.createElement('img')
  img.src = trend.image
  sidePanel.querySelector('#trending').append(img)
}

const renderControvosy = (controvosy) =>{
  const img = document.createElement('img')
  img.src = controvosy.image
  sidePanel.querySelector('#controvosy').append(img)
}

const renderANews = (news) => {

  const newsBlock = document.createElement('div')
  let likeCount = news.reacts.filter((r)=>r.like == true).length
  let disCount = news.reacts.filter((r)=>r.like == false).length
  let comCount = news.comments.length

  newsBlock.className = "article-wrapper"
  newsBlock.innerHTML = `
    <img src="${news.image}" />
    <div class="img-shadow text-center">
      <p><a href="${news.source}" target="none">${news.title}</a></p>
      <span id="like"> ♡ </span>
      <span id="dislike"> 💢 </span>
      <span id="report"> &#9760; </span>
      <span id="comment">&#128172</span>
      <div class="article-stats text-center">likes: ${likeCount} angry: ${disCount} comments: ${comCount}</div>
    </div>
    `

    const countersDiv = newsBlock.querySelector(".article-stats")

    newsBlock.addEventListener('click',(e)=>{
      const artId = e.target.id
      if (artId === "like") {
        likeNews(news.id)
        updateLikeCount()
      }  if (artId === "dislike") {
        dislikeNews(news.id)
        updateDisCount()
      }  if (artId === "report") {
        reportNews(news.id)
      }  if (artId === "comment") {
        renderComments(state.news.find((e) => e.id === news.id))
        state.currentNewsDiv = newsBlock
      }
    })
  newsDiv.prepend(newsBlock)
  inView.offset(300)
  inView('.article-wrapper').on('exit', ()=> {
    state.currentNewsDiv = null
    commentPanel.hidden = true
  })

  const updateLikeCount = () => {
    comCount = news.comments.length
    likeCount++
    countersDiv.innerHTML = `likes: ${likeCount} angry: ${disCount} comments: ${comCount}`
  }

  const updateDisCount = () => {
    comCount = news.comments.length
    disCount++
    countersDiv.innerHTML = `likes: ${likeCount} angry: ${disCount} comments: ${comCount}`
  }
}

const renderNews = (news) => {
  newsDiv.innerHTML = ''
  news.forEach(renderANews)
}

// Listeners ::

form.addEventListener('keypress', (e) => {
  if (form.search.value != '') {
    const articles = document.querySelectorAll('.article-wrapper')
    articles.forEach((article) => article.remove())
    searchNews(form.search.value)
  } else {
    renderNews(state.news)
  }
})

aNav.addEventListener('click', ()=> {
  if (loggedIn() == true) {
    getNews(my_news_url).then(console.log)
   } else { logIn() }
  })

// Initialize ::

getNews(news_url).then(data => {
  state.news = data
  renderNews(state.news)
})

getMeta().then(data => {
  data.trending.forEach(renderTrend)
  data.controvosy.forEach(renderControvosy)
})
