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
    feedr.resultsContainer = document.getElementById('main');
    feedr.sourceContainer = document.querySelector('.sources');
    feedr.modalContainer = document.querySelector('#popUp');
    feedr.searchInput = document.querySelector('#search');
  },
  addListeners: () => {
    const closeModalButton = feedr.modalContainer.querySelector('.closePopUp');
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
    const articleCards = feedr.resultsContainer.querySelectorAll('.article');
    articleCards.forEach(card => card.addEventListener('click', e => {
      const title = e.currentTarget.querySelector('h3').innerText;
      feedr.toggleModal(results.find(result => result.data.title === title));
    }));
  },
  updateSources: (sources) => {
    feedr.sourceContainer.innerHTML = feedr.formatSourceFilters(sources).join('');
    const sourceButtons = feedr.sourceContainer.querySelectorAll('li');
    const selectedSourceDisplay = document.querySelector('.selected-source');
    sourceButtons.forEach(button => {
      button.addEventListener('click', e => {
        feedr.clickedSource = e.currentTarget.innerText;
        selectedSourceDisplay.innerText = feedr.clickedSource;
      });
    });
  },
  toggleModal: (content) => {
    const modalContent = feedr.modalContainer.querySelector('.container');
    modalContent.innerHTML = '';
    feedr.modalContainer.classList.toggle('hidden');
    feedr.modalContainer.classList.toggle('loader');
    modalContent.innerHTML = feedr.formatModal(content);
  },
  formatModal: (article) => {
    const { title, content, source, url } = article.data;
    return `
      <h1>${title}</h1>
      <p>
        ${content}
      </p>
      <a href="${url}" class="popUpAction" target="_blank">Read more from ${source.name}</a>
    `;
  },
  formatFeedPost: (article) => {
    return `
    <article class="article">
      <section class="featuredImage">
        <img src="${article.urlToImage}" alt="" />
      </section>
      <section class="articleContent">
        <h3>${article.title}</h3>
        <p>${article.description}</p>
        <h6>${article.source.name}</h6>
      </section>
      <section class="impressions">
        526
      </section>
      <div class="clearfix"></div>
    </article>
    `;
  },
  formatSourceFilters: (sources) => sources.map(source => `<li>${source}</li>`),

};

feedr.init();