const state = {
  x: 1
}

const url = 'http://localhost:3000/users/1'
const url2 = 'http://localhost:3000/news/index'
const url3 = 'http://localhost:3000/search/'

const newsDiv = document.querySelector('#news-container')
const userDiv = document.querySelector('#user-panel')
const form = document.querySelector('.form-inline')

const getNews = () => fetch(url2)
  .then(response => response.json())
  .catch(error => alert(error))

const searchNews = (term) => fetch(url3+term)
  .then(response => response.json())
  .then(data => renderNews(data))

const renderNews = (news) => news.forEach(renderANews)

const renderANews = (news) => {
  const newsBlock = document.createElement('div')
  newsBlock.className = "article-wrapper"
  newsBlock.innerHTML = `
    <img src="${news.image}" />
    <div class="img-shadow text-center">
      <p>${news.title}</p>
      <span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776;</span>
    </div>`
  newsDiv.prepend(newsBlock)
}

getNews().then(data => renderNews(data))

form.addEventListener('submit',(e)=>{
  e.preventDefault()
  searchNews(form.search.value)
  form.reset()
})

function openNav() {
  document.getElementById("side-panel").style.width = "25vw";
}

function closeNav() {
  document.getElementById("side-panel").style.width = "0";
}