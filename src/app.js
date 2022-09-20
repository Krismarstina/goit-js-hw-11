import NewsApiService from './newsApiService';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

const newsApiService = new NewsApiService();

searchForm.addEventListener('submit', onFormSearch);
loadMoreButton.addEventListener('click', onLoadMore);

function onFormSearch(e) {
  e.preventDefault();
  newsApiService
    .fetchTotalHits()
    .then(data =>
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
    );
  newsApiService.inputValue = e.currentTarget.elements.searchQuery.value;
  newsApiService.resetPage();
  newsApiService
    .fetchArticles()
    .then(render)
    .catch(error => console.log(error));
}

function onLoadMore() {
  newsApiService.fetchArticles().then(render);
  newsApiService.fetchTotalHits().then(totalHits);
}

function totalHits(data) {
  const totalHits = data.totalHits;
  const lengthOfArrayOfImages = data.hits.length;
  console.log(newsApiService.getCurrentPage());

  if (
    newsApiService.getCurrentPage() ===
    Math.ceil(totalHits / lengthOfArrayOfImages)
  ) {
    loadMoreButton.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function render(images) {
  if (!images.length) {
    gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  loadMoreButton.style.display = 'flex';

  const markup = images
    .map(image => {
      return `<div class="photo-card">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" class="gallery__image" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${image.likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${image.views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${image.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${image.downloads}</b>
      </p>
    </div>
  </div>`;
    })
    .join('');
  return (gallery.innerHTML = markup);
}
