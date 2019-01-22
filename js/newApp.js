// import request from 'request-promise';
const API_KEY = 'a37019e049d14ac89306295511da15ec';
const API_ENDPOINT = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;

const feedr = {
  defineElements: () => {
    console.log('defining elements');
    feedr.resultsContainer = document.getElementById('main');
    feedr.sourceContainer = document.querySelector('.sources');
    feedr.modalContainer = document.querySelector('#popUp');
    feedr.searchInput = document.querySelector('#search');
  },
  addListeners: () => {
    console.log('Adding event listeners');
    const closeModalButton = feedr.modalContainer.querySelector('.closePopUp');
    closeModalButton.addEventListener('click', feedr.toggleModal);
    feedr.searchInput.addEventListener('change', e => {
      feedr.searchTerm = e.currentTarget.value;
      console.log(feedr.searchTerm);
    });
  },
  init: () => {
    feedr.defineElements();
    feedr.addListeners();
  },
  getNews: () => {
    let searchTerm = feedr.searchTerm.length > 0 ? feedr.getSearchTerm() : '&country=us';
    request(`${API_ENDPOINT}${searchTerm}`)
      .then((data) => {
        const articles = JSON.parse(data);
      });
  },
  toggleModal: () => {
    feedr.modalContainer.classList.toggle('hidden');
    // sets modal controls
      // click article to open
      // click close button to close
  },
  getSearchTerm: () => {
    feedr.searchTerm = '';
    feedr.searchInput.addEventListener('change', e => {
      e.preventDefault();
      feedr.searchTerm = e.currentTarget.value;
    })
    return `&q=${feedr.searchTerm}`;
  },
  formatFeedPost: (article) => {
    return `
      <article class="article">
        <section class="featured-image">
          <img src="${article.urlToImage} alt="" />
        </section>
        <section class="article-content">
          <a href="${article.url}"><h3>${article.title}</h3></a>
          <p>${article.description}</p>
          <h6>${article.source.name}</h6>
        </section>
        <section class="impressions">
          ${'526'}
        </section>
      </article>
    `;
  },
  formatSourceFilters: (sources) => sources.map(source => `<li><button>${source}</button></li>`),

};

feedr.init();