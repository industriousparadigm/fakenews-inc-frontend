const state = {
  user: 1,
  news: [],
  myNews: [],
  selected: null
}

const my_news_url = `http://localhost:3000/users/${state.user}`
const news_url = `http://localhost:3000/news`
const search_url = 'http://localhost:3000/search/'

const newsDiv = document.querySelector('#news-container')
const userDiv = document.querySelector('#user-panel')
const form = document.querySelector('.form-inline')
const comment = document.querySelector('.commentList')

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

const renderNews = (news) => {
  newsDiv.innerHTML = ''
  news.forEach(renderANews)
}

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

const renderComment = (comment) => {
  const pane = document.querySelector('ul.commentList')
  const li = document.createElement('li')
  li.innerHTML = `
  <div class="commenterImage">
    ${comment.user_id}
    <img src="">
  </div>
  <div class="commentText">
    <p class="">${comment.content}</p>
    <span class="date sub-text">${comment.created_at}</span>
  </div>`
  pane.append(li)
}

const renderComments = (news) => news.comments.forEach(renderComment)

const renderANews = (news) => {

  const newsBlock = document.createElement('div')
  const likeCount = news.reacts.filter((r)=>r.like == true).length
  newsBlock.className = "article-wrapper"
  newsBlock.innerHTML = `
    <img src="${news.image}" />
    <div class="img-shadow text-center">
      <p>${news.title}</p>
      <span id="like"> ${likeCount}♡ </span>
      <span id="dislike"> ✗ </span>
      <span id="report"> ! </span>
      <span id="comment"> @ </span>
    </div>`
    newsBlock.addEventListener('click',(e)=>{
      const id = e.target.id
      if (id === "like") {
        likeNews(news.id)
      }  if (id === "dislike") {
        dislikeNews(news.id)
      }  if (id === "report") {
        reportNews(news.id)
      }  if (id === "comment") {
        renderComments(news)
      }
    })
  newsDiv.prepend(newsBlock)
}

// Viewport Listener

form.addEventListener('keypress', (e) => {
  if (form.search.value != '') {
    const articles = document.querySelectorAll('.article-wrapper')
    articles.forEach((article) => article.remove())
    searchNews(form.search.value)
  } else {
    renderNews(state.news)
  }
})

// Init

getNews(my_news_url).then(data => state.myNews = data)

getNews(news_url).then(data => {
  state.news = data
  renderNews(state.news)
})

getMeta().then(console.log)