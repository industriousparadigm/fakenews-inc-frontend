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
const form = document.querySelector('.form-inline')

<<<<<<< HEAD
const sidePanel = document.querySelector('#side-panel')

const trendingNews = sidePanel.querySelector("#trending .top-stories")
const controversialNews = sidePanel.querySelector("#controversial .top-stories")
const newNews = sidePanel.querySelector("#new .top-stories")

const getNews = () => fetch(url2)
=======
const getNews = (url) => fetch(url)
>>>>>>> origin/dis-like
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

const renderANews = (aNews) => {
  const newsBlock = document.createElement('div')
  newsBlock.className = "article-wrapper"
  newsBlock.innerHTML = `
    <img src="${aNews.image}" />
    <div class="img-shadow text-center">
<<<<<<< HEAD
      <p>${aNews.title}</p>
      <span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776;</span>
=======
      <p>${news.title}</p>
      <span style="font-size:30px;cursor:pointer" onclick="likeNews(${news.id})">&#9786</span>
      <span style="font-size:30px;cursor:pointer" onclick="dislikeNews(${news.id})">&#9785</span>
>>>>>>> origin/dis-like
    </div>`
  newsDiv.prepend(newsBlock)
}

<<<<<<< HEAD
const renderASideNews = (aNews, parentElementId) => {
  const newsImg = document.createElement('img')
  newsImg.src = aNews.image

  sidePanel.querySelector(`#${parentElementId} .top-stories`).prepend(newsImg)
}

const populateSideNews = () => {
  const news = Array(9)
  news.map(element => randomImgUrl(90))
  console.log(news)
  return news
}

const randomImgUrl = (width, height = width) => {
  return fetch(`https://picsum.photos/${width}/${height}`).then(resp => resp.url)
}

getNews().then(data => {
  renderNews(data)
})

for (let i = 0; i < 3; i++) {
  let codes = ["trending", "controversial", "new"]
  for (let j = 0; j < 3; j++) {
    renderASideNews({ image: `https://picsum.photos/90` }, codes[i])
  }
}

form.addEventListener('submit',(e)=>{
  e.preventDefault()
  searchNews(form.search.value)
  form.reset()
=======
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
>>>>>>> origin/dis-like
})