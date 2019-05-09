const state = {
  user: 1,
  news: [],
  myNews: [],
  selected: null
}

const my_news_url = `http://localhost:3000/users/${state.user}`
const a_news_url = `http://localhost:3000/news/`
const all_news_url = 'http://localhost:3000/news/index'
const search_url = 'http://localhost:3000/search/'

const newsDiv = document.querySelector('#news-container')
const userDiv = document.querySelector('#user-panel')
const form = document.querySelector('.form-inline')

const getNews = (url) => fetch(url)
  .then(response => response.json())
  .catch(error => alert(error))

const patchNews = (like) => fetch(a_news_url+like.news_id,{
  method: 'PATCH',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(like)
}).catch(error => alert(error))

const searchNews = (term) => fetch(search_url+term)
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
  state.myNews.push(state.news.find((e)=>e.id === id))
}

const dislikeNews = (id) => {
  const obj = {
    user_id: state.user,
    news_id: id,
    like: false
  }
  patchNews(obj)
}

const renderANews = (news) => {
  const newsBlock = document.createElement('div')
  newsBlock.className = "article-wrapper"
  newsBlock.innerHTML = `
    <img src="${news.image}" />
    <div class="img-shadow text-center">
      <p>${news.title}</p>
      <span style="font-size:30px;cursor:pointer" onclick="likeNews(${news.id})">&#9786</span>
      <span style="font-size:30px;cursor:pointer" onclick="dislikeNews(${news.id})">&#9785</span>
    </div>`
  newsDiv.prepend(newsBlock)
}

// Init

getNews(my_news_url).then(data => state.myNews = data)

getNews(all_news_url).then(data => {
  state.news = data
  renderNews(state.news)
})

form.addEventListener('keydown',(e)=>{
  if (form.search.value != '') {
    const articles = document.querySelectorAll('.article-wrapper')
    articles.forEach((article)=>article.remove())
    searchNews(form.search.value)
  } else {
    renderNews(state.news)
  }
})