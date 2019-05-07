const state = {
  x: 1
}

const newsDiv = document.querySelector('#news-container')
const userDiv = document.querySelector('#user-panel')

const renderNewsBlock = (article) => {
  const newsBlock = document.createElement('div')
  newsBlock.className = "article-wrapper"
  newsBlock.innerHTML = `    
    <img src="${article.urlToImage}" />
    <div class="img-shadow text-center">
      <p>${article.title}</p>
      <p>${article.author}</p>
    </div>
  `
  newsDiv.append(newsBlock)
}

const renderAllNews = () => {
  articles.forEach(renderNewsBlock)
}

const init = () => {
  renderAllNews()
}

init()