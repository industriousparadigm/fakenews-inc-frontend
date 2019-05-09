const state = {
  x: 1
}

const url = 'http://localhost:3000/users/1'
const url2 = 'http://localhost:3000/news/index'
const url3 = 'http://localhost:3000/search/'

const newsDiv = document.querySelector('#news-container')
const form = document.querySelector('.form-inline')

const sidePanel = document.querySelector('#side-panel')

const trendingNews = sidePanel.querySelector("#trending .top-stories")
const controversialNews = sidePanel.querySelector("#controversial .top-stories")
const newNews = sidePanel.querySelector("#new .top-stories")

const getNews = () => fetch(url2)
  .then(response => response.json())
  .catch(error => alert(error))

const searchNews = (term) => fetch(url3+term)
  .then(response => response.json())
  .then(data => renderNews(data))

const renderNews = (news) => news.forEach(renderANews)

const renderANews = (aNews) => {
  const newsBlock = document.createElement('div')
  newsBlock.className = "article-wrapper"
  newsBlock.innerHTML = `
    <img src="${aNews.image}" />
    <div class="img-shadow text-center">
      <p>${aNews.title}</p>
      <span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776;</span>
    </div>`
  newsDiv.prepend(newsBlock)
}

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
})