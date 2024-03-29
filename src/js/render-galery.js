
import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchPictures } from './fetch-api';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
const inputForm = document.querySelector('input');

searchForm.addEventListener('submit', handleSearch);
btnLoadMore.addEventListener('click', handleLoadMore);



btnLoadMore.classList.add('.visually-hidden');

console.log(btnLoadMore.classList);
let page = 1;
let searchData = '';
let hits = 0;

// пошук картинок
async function handleSearch(e) {
  e.preventDefault();
  clearGallery();
  hideLoadMoreButton();

  try {
    searchData = inputForm.value.trim();
    page = 1;

    if (!searchData) {
      return;
    }

    const response = await fetchPictures(searchData, page);
    hits = response.hits.length;

    if (response.totalHits > 40) {
      showLoadMoreButton();
    }

    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

      renderGallery(response.hits);
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
  }
}

// отримання картинок
async function handleLoadMore() {
  page += 1;

  try {
    const response = await fetchPictures(searchData, page);
    renderGallery(response.hits);

    hits += response.hits.length;
    if (hits === response.totalHits) {
      hideLoadMoreButton();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error(error);
  }
}

// показати кнопку Load More
function showLoadMoreButton() {
  btnLoadMore.classList.add('.visually-hidden');
}

// сховати кнопку Load More
function hideLoadMoreButton() {
  btnLoadMore.classList.remove('.visually-hidden');
}

// очищення розмітки
function clearGallery() {
  gallery.innerHTML = '';
  hits = 0;
}

// рендер розмітки
function renderGallery(hits) {
  const galleryMarkup = hits
    .map(hit => {
      return `<div class="photo-card">
      <a class="gallery__item" href="${hit.largeImageURL}" rel="noopener noreferrer">
        <img class="gallery__image" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>${hit.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${hit.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${hit.downloads}
          </p>
        </div>
      </a>
    </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', galleryMarkup);
  simpleLightbox.refresh();
}

const simpleLightbox = new SimpleLightbox('.gallery a ', {
  captionsData: 'alt',
  captionDelay: 250,
});
