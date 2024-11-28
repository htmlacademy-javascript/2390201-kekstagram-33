// Модуль открытия окна просмотра изображения по клику на миниатюре, и закрытия этого окна (задания 8.14, 8.15)
import {lockBodyScroll, unlockBodyScroll} from './util.js';

const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const bigPictureCaption = bigPicture.querySelector('.social__caption');
const bigPictureLikes = bigPicture.querySelector('.likes-count');
const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');

const bigPictureComments = bigPicture.querySelector('.social__comments');
const commentsCountDiv = bigPicture.querySelector('.social__comment-count');
const commentsShownSpan = bigPicture.querySelector('.social__comment-shown-count');
const commentsTotalSpan = bigPicture.querySelector('.social__comment-total-count');
const commentsLoaderButton = bigPicture.querySelector('.comments-loader');
let commentsShownCount = 0;
const commentsShownPortion = 5; //Сколько комментариев выводим по кнопке "Загрузить ещё"
let currentPhoto = null; //объект с данными по текущему фото для передачи в обработчик добавления комментариев по кнопке

const commentTemplate = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');

//--- Раздел закрытия окна просмотра изображения
const removeEventListeners = () => {
  bigPictureCloseButton.removeEventListener('click', onCloseButtonClick);
  document.removeEventListener('keydown', onDocumentKeyDown);
  commentsLoaderButton.removeEventListener('click', loadCommentsPortion);
};

const closeBigPictureWindow = () => {
  bigPicture.classList.add('hidden');
  bigPictureComments.innerHTML = '';
  commentsShownCount = 0;
  currentPhoto = null;
  unlockBodyScroll();
  removeEventListeners();
};

function onCloseButtonClick () {
  closeBigPictureWindow();
}

function onDocumentKeyDown (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPictureWindow();
  }
}

//--- Раздел открытия окна просмотра изображения по клику на миниатюре. Во всех процедурах параметр photo - объект с данными по изображению, соответствующему миниатюре.
const hideCommentsCountDiv = () => {
  commentsCountDiv.classList.add('hidden');
};

const showCommentsCountDiv = () => {
  commentsCountDiv.classList.remove('hidden');
};

const hideCommentsLoaderButton = () =>{
  commentsLoaderButton.classList.add('hidden');
};

const showCommentsLoaderButton = () =>{
  commentsLoaderButton.classList.remove('hidden');
};

//Загружает на страницу очередную порцию комментариев в количестве commentsShownPortion из массива currentPhoto.comments
function loadCommentsPortion () {
  const commentsLoadTopIndex = commentsShownCount + commentsShownPortion - 1;
  while ((commentsShownCount < currentPhoto.comments.length) && (commentsShownCount <= commentsLoadTopIndex)) {
    const newComment = commentTemplate.cloneNode(true);
    newComment.querySelector('.social__picture').src = currentPhoto.comments[commentsShownCount].avatar;
    newComment.querySelector('.social__text').textContent = currentPhoto.comments[commentsShownCount].message;
    bigPictureComments.appendChild(newComment);
    commentsShownCount++;
  }
  if (commentsShownCount === currentPhoto.comments.length) {
    hideCommentsLoaderButton (); //Загрузили все комментарии к фото - скрыли кнопку
  }
  commentsShownSpan.textContent = commentsShownCount;
}

const addPictureComments = (photo) => {
  currentPhoto = photo;
  if (currentPhoto.comments.length !== 0) {
    commentsTotalSpan.textContent = currentPhoto.comments.length;
    showCommentsCountDiv ();
    showCommentsLoaderButton ();
    loadCommentsPortion();
    commentsLoaderButton.addEventListener('click', loadCommentsPortion);
  } else {
    hideCommentsCountDiv ();
    hideCommentsLoaderButton ();
  }
};

const fillBigPicture = (photo) => {
  bigPictureImage.src = photo.url;
  bigPictureCaption.textContent = photo.description;
  bigPictureLikes.textContent = photo.likes;
  addPictureComments(photo);
};

//Открытие окна просмотра изображения
const showBigPictureWindow = (photo) => {
  bigPicture.classList.remove('hidden');
  fillBigPicture(photo);
  lockBodyScroll();
  bigPictureCloseButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeyDown);
};

export {showBigPictureWindow};
