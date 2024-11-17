// Модуль открытия окна просмотра изображения по клику на миниатюре, и закрытия этого окна (задания 8.14, 8.15)

const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const bigPictureCaption = bigPicture.querySelector('.social__caption');
const bigPictureLikes = bigPicture.querySelector('.likes-count');
const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');

const bigPictureComments = bigPicture.querySelector('.social__comments');
const commentsShownSpan = bigPicture.querySelector('.social__comment-shown-count');
const commentsTotalSpan = bigPicture.querySelector('.social__comment-total-count');
const commentsLoaderButton = bigPicture.querySelector('.comments-loader');
let commentsShownCount = 0;
const commentsShownPortion = 5; //Сколько комментариев выводим по кнопке "Загрузить ещё"

const commentTemplate = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');

//--- Управление прокруткой контейнера с миниатюрами позади окна изображения - требование 5 задания 8.1
const keksogramBody = document.querySelector('body');
//Запрещает прокрутку
const lockBodyScroll = () =>{
  keksogramBody.classList.add('modal-open');
};
//Разрешает прокрутку
const unlockBodyScroll = () =>{
  keksogramBody.classList.remove('modal-open');
};

//--- Раздел закрытия окна просмотра изображения

const closeBigPictureWindow = () => {
  bigPicture.classList.add('hidden');
  bigPictureComments.innerHTML = '';
  commentsShownCount = 0;
};

const onDocumentKeyDown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPictureWindow();
    unlockBodyScroll();
    document.removeEventListener('keydown', onDocumentKeyDown);
  }
};

bigPictureCloseButton.onclick = () => {
  closeBigPictureWindow();
  unlockBodyScroll();
  document.removeEventListener('keydown', onDocumentKeyDown);
};

//--- Раздел открытия окна просмотра изображения по клику на миниатюре. Во всех процедурах параметр photo - объект с данными по изображению, соответствующему миниатюре.

//Загружает на страницу очередную порцию комментариев в количестве commentsShownPortion из массива comments
const loadCommentsPortion = (comments) => {
  const commentsLoadTopIndex = commentsShownCount + commentsShownPortion - 1;
  while ((commentsShownCount < comments.length) && (commentsShownCount <= commentsLoadTopIndex)) {
    const newComment = commentTemplate.cloneNode(true);
    newComment.querySelector('.social__picture').src = comments[commentsShownCount].avatar;
    newComment.querySelector('.social__text').textContent = comments[commentsShownCount].message;
    bigPictureComments.appendChild(newComment);
    commentsShownCount++;
  }
  commentsShownSpan.textContent = commentsShownCount;
};

const addPictureComments = (photo) => {
  if (photo.comments.length !== 0) {
    commentsTotalSpan.textContent = photo.comments.length;
    loadCommentsPortion(photo.comments);
    commentsLoaderButton.onclick = () => loadCommentsPortion(photo.comments);
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
  document.addEventListener('keydown', onDocumentKeyDown);
};

export {showBigPictureWindow};
