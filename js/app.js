const API_KEY = '56580974a0954667943fd573412f210d';
const API_ENDPOINT = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;

const xhr = new XMLHttpRequest();

const feedr = {
  init: () => {
    feedr.defineElements();
    feedr.addListeners();
    feedr.getNews('');
  },
  defineElements: () => {
    feedr.resultsContainer = document.querySelector('.feedr-content__articles');
    feedr.sourceContainer = document.querySelector('.feedr-sources');
    feedr.modalContainer = document.querySelector('.feedr-modal');
    feedr.modalContent = feedr.modalContainer.querySelector('.feedr-modal__content');
    feedr.modalTitle = feedr.modalContainer.querySelector('.feedr-modal__title');
    feedr.searchInput = document.querySelector('.feedr-search__input');
  },
  addListeners: () => {
    const closeModalButton = feedr.modalContainer.querySelector('.feedr-modal__close');
    closeModalButton.addEventListener('click', feedr.toggleModal);
    feedr.searchInput.addEventListener('change', e => {
      feedr.searchTerm = e.currentTarget.value;
      feedr.getNews(feedr.searchTerm);
    });
  },
  getNews: (searchTerm) => {
    let term = searchTerm.length > 0 ? `&q=${searchTerm}` : '&country=us';
    xhr.open('GET', `${API_ENDPOINT}${term}`);
    xhr.send();
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (data.status === 'error') {
        console.error(data.message);
      } else {
        const articles = data.articles;
        feedr.results = articles.map(article => {
          return {
            formatted: feedr.formatFeedPost(article),
            data: article
          }
        });
        feedr.updateResults(feedr.results);
        let sources = feedr.results.map(article => article.data.source.name).filter((item, i, self) => self.indexOf(item) == i);
        feedr.updateSources(sources);
      }
    }
  },
  updateResults: (results) => {
    feedr.resultsContainer.innerHTML = results.map(result => result.formatted).join('');
    const articleCards = feedr.resultsContainer.querySelectorAll('.feedr-article');
    articleCards.forEach(card => card.addEventListener('click', e => {
      const title = e.currentTarget.querySelector('h3').innerText;
      feedr.toggleModal(results.find(result => result.data.title === title));
    }));
  },
  updateSources: (sources) => {
    feedr.sourceContainer.innerHTML = feedr.formatSourceFilters(sources).join('');
    const sourceButtons = feedr.sourceContainer.querySelectorAll('.feedr-sources__button');
    const selectedSourceDisplay = document.querySelector('.feedr-sources__source.selected');
    sourceButtons.forEach(button => {
      button.addEventListener('click', e => {
        sourceButtons.forEach(button => button.parentNode.classList.remove('selected'));
        feedr.clickedSource = e.currentTarget;
        feedr.clickedSource.parentNode.classList.add('selected');
      });
    });
  },
  toggleModal: (content) => {
    feedr.modalContent.innerHTML = '';
    feedr.modalContainer.classList.toggle('show');
    feedr.modalContainer.classList.toggle('loader');
    feedr.modalContent.innerHTML = feedr.formatModal(content);
    feedr.modalTitle.innerText = content.data.title;
  },
  formatModal: (article) => {
    const { title, content, source, url } = article.data;
    return `
      <div class="feedr-modal__article-text">
        <p>${content}</p>
      </div>
      <div class="feedr-modal__source">
        <a href="${url}">Read more from <span class="source">${source.name}</span></a>
      </div>
    `;
  },
  formatFeedPost: (article) => {
    return `
      <article class="feedr-article">
        <div class="feedr-article__image-container">
        ${article.urlToImage ? `
          <a href="#">
            <img class="feedr-article__image" src="${article.urlToImage}" alt="#" />
          </a>
        ` : ``}
        </div>
        <a class="feedr-article__text-container" href="#">
          <h3 class="feedr-article__title">${article.title}</h3>
          <p class="feedr-article__description">${article.description}</p>
          <div class="feedr-article__source">
            <h4 class="feedr-article__source-name">${article.source.name}</h4>
          </div>
        </a>
      </article>
    `;
  },
  formatSourceFilters: (sources) => sources.map(source => `<li class="feedr-sources__source"><button class="feedr-sources__button">${source}</button></li>`),

};

feedr.init();