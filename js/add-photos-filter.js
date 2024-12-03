//Модуль добавляет возможноть фильтрации фотографий других пользователей
import {showThumbnails, removeThumbnails} from './view-images.js';
import {debounce} from './util.js';

const RANDOM_PHOTO_NUMBER = 10;
const DEBOUNCE_DELAY = 500;

const imgFilters = document.querySelector('.img-filters');
const defaultButton = document.getElementById('filter-default');
const randomButton = document.getElementById('filter-random');
const discussedButton = document.getElementById('filter-discussed');

function removeButtonsActiveState() {
  defaultButton.classList.remove('img-filters__button--active');
  randomButton.classList.remove('img-filters__button--active');
  discussedButton.classList.remove('img-filters__button--active');
}

//--- Обработка клика по кнопке "по умолчанию" - выдать фото в порядке получения с сервера
function showDefaultPhotos(photos) {
  removeThumbnails();
  showThumbnails(photos);
}

//Пробрасываем функцию cb в неименованный обработчик клика кнопки - специальный синтаксис
function setDefaultButtonClick(cb) {
  defaultButton.addEventListener('click', () => {
    removeButtonsActiveState();
    defaultButton.classList.add('img-filters__button--active');
    cb();
  });
}

//--- Обработка клика по кнопке "случайные" - выдать случайные фото в количестве RANDOM_PHOTO_NUMBER
function showRandomPhotos(photos) {
  removeThumbnails();
  showThumbnails(photos
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, RANDOM_PHOTO_NUMBER)
  );
}

function setRandomButtonClick(cb) {
  randomButton.addEventListener('click', () => {
    removeButtonsActiveState();
    randomButton.classList.add('img-filters__button--active');
    cb();
  });
}

//--- Обработка клика по кнопке "обсуждаемые" - выдать фото в порядке убывания количества комментариев
function comparePhotos(photoA, photoB) {
  return photoB.comments.length - photoA.comments.length;
}

function showDiscussedPhotos(photos) {
  removeThumbnails();
  showThumbnails(photos
    .slice()
    .sort(comparePhotos)
  );
}

function setDiscussedButtonClick(cb) {
  discussedButton.addEventListener('click', () => {
    removeButtonsActiveState();
    discussedButton.classList.add('img-filters__button--active');
    cb();
  });
}

//Добавляет фильтрацию на массив фотографий photos
function addPhotosFilter(photos) {
  imgFilters.classList.remove('img-filters--inactive');
  setDefaultButtonClick(debounce(
    () => showDefaultPhotos(photos),
    DEBOUNCE_DELAY,
  ));
  setRandomButtonClick(debounce(
    () => showRandomPhotos(photos),
    DEBOUNCE_DELAY,
  ));
  setDiscussedButtonClick(debounce(
    () => showDiscussedPhotos(photos),
    DEBOUNCE_DELAY,
  ));
}

export {addPhotosFilter};
