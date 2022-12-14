import ApiService from './apiService';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const loadMoreButton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

const apiService = new ApiService();

searchForm.addEventListener('submit', onFormSearch);
loadMoreButton.addEventListener('click', onLoadMore);

async function onFormSearch(e) {
  try {
    e.preventDefault();
    cleaningPage();
    loadMoreButton.style.display = 'none';

    const searchQuery = e.currentTarget.elements.searchQuery.value;
    if (!searchQuery) {
      Notiflix.Notify.info('Please type something!');
      loadMoreButton.style.display = 'none';
      return;
    }
    apiService.query = searchQuery;
    apiService.resetPage();

    const data = await apiService.fetchImages();
    const images = await data.hits;

    if (images.length) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    render(images);

    if (!images.length) {
      cleaningPage();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.style.display = 'none';
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    const data = await apiService.fetchImages();
    const images = await data.hits;
    render(images);
    pageScrolling();

    if (
      apiService.getCurrentPage() === Math.ceil(data.totalHits / images.length)
    ) {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    if (!images.length) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreButton.style.display = 'none';
      return;
    }
    if (apiService.hits > apiService.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreButton.style.display = 'none';
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

function render(images) {
  const markup = images
    .map(image => {
      return `<div class="photo-card">
      <a href="${image.largeImageURL}">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" class="gallery__image" /> </a>
    <div class="info">
      <p class="info-item">
        <b>Likes <span class="info-number">${image.likes}</span> </b>
      </p>
      <p class="info-item">
        <b>Views <span class="info-number">${image.views}</span> </b>
      </p>
      <p class="info-item">
        <b>Comments <span class="info-number">${image.comments}</span></b>
      </p>
      <p class="info-item">
        <b>Downloads <span class="info-number">${image.downloads}</span </b>
      </p>
    </div>
  </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  loadMoreButton.style.display = 'flex';

  let galleryLightBox = new SimpleLightbox('.photo-card a', {
    captionDelay: 250,
  });
  galleryLightBox.refresh();
}

function pageScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function cleaningPage() {
  gallery.innerHTML = '';
}
