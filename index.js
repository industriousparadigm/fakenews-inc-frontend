const state = {
  user: 1,
  news: [],
  myNews: [],
  selected: null
}

// URLs ::

const my_news_url = `http://localhost:3000/users/${state.user}`
const news_url = `http://localhost:3000/news`
const search_url = 'http://localhost:3000/search/'

// Selectors ::

const newsDiv = document.querySelector('#news-container')
const sidePanel = document.querySelector('#side-panel')
const form = document.querySelector('.form-inline')
const comment = document.querySelector('ul.commentList')
const commentPanel = document.querySelector('div#comment-panel')
const navBar = document.querySelector('nav#menu-bar')

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

const logIn = () => state.user !== null

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
  })
  const close = document.querySelector('#cmt-cls')
  close.addEventListener('click',()=>commentPanel.hidden = true)

  }

function listen(e, form, commentPanel, news){
  console.log('asdf')
  e.preventDefault()
  e.stopPropagation()
  const cmtId = e.target.id
    if (cmtId === 'cmt-btn' && form.comment.value != ''){
      const com = {
        new_id: news.id,
        user_id: state.user,
        content: form.comment.value,
        created_at: Date.now()
      }
      renderComment(com)
      state.news.find((e) => e.id === news.id).comments.push(com)
      postComment(com)
    }
     if (cmtId === 'cmt-cls'){
      commentPanel.hidden = true
    }
    commentPanel.removeEventListener("click", listen, false)

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
  const likeCount = news.reacts.filter((r)=>r.like == true).length
  const disCount = news.reacts.filter((r)=>r.like == false).length
  const comCount = news.comments.length

  newsBlock.className = "article-wrapper"
  newsBlock.innerHTML = `
    <img src="${news.image}" />
    <div class="img-shadow text-center">
      <p>${news.title}</p>
      <span id="like"> ♡ </span>
      <span id="dislike"> 💢 </span>
      <span id="report"> &#9760; </span>
      <span id="comment">&#128172</span>
    </div>
    <em>likes: ${likeCount} angry: ${disCount} comments: ${comCount}</em>`
    newsBlock.addEventListener('click',(e)=>{
      const artId = e.target.id
      if (artId === "like") {
        likeNews(news.id)
      }  if (artId === "dislike") {
        dislikeNews(news.id)
      }  if (artId === "report") {
        reportNews(news.id)
      }  if (artId === "comment") {
        renderComments(state.news.find((e) => e.id === news.id))
      }
    })
  newsDiv.prepend(newsBlock)
  inView.offset(300)
  inView('.article-wrapper').on('exit', ()=>commentPanel.hidden = true)
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



// Initialize ::

getNews(news_url).then(data => {
  state.news = data
  renderNews(state.news)
})

getMeta().then(data => {
  data.trending.forEach(renderTrend)
  data.controvosy.forEach(renderControvosy)
})
