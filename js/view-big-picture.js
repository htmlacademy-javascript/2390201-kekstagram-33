// Модуль открытия окна просмотра изображения по клику на миниатюре, и закрытия этого окна (задание 8.1)

const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const bigPictureCaption = bigPicture.querySelector('.social__caption');
const bigPictureLikes = bigPicture.querySelector('.likes-count');
const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');

const bigPictureComments = bigPicture.querySelector('.social__comments');
const bigPictureCommentsCount = bigPicture.querySelector('.social__comment-count');
const commentShownCount = bigPicture.querySelector('.social__comment-shown-count');
const commentTotalCount = bigPicture.querySelector('.social__comment-total-count');
const bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');

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

const addPictureComments = (photo) => {
  const commentsCount = photo.comments.length;
  if (commentsCount !== 0) {
    commentShownCount.textContent = commentsCount;
    commentTotalCount.textContent = commentsCount;

    photo.comments.forEach((comment) => {
      const newComment = commentTemplate.cloneNode(true);
      newComment.querySelector('.social__picture').src = comment.avatar;
      newComment.querySelector('.social__text').textContent = comment.message;
      bigPictureComments.appendChild(newComment);
    });
  }
};

const fillBigPicture = (photo) => {
  bigPictureImage.src = photo.url;
  bigPictureCaption.textContent = photo.description;
  bigPictureLikes.textContent = photo.likes;
  addPictureComments(photo);
};

//Требование 4 задания 8.1
const hideCommentsCountAndLoader = () => {
  bigPictureCommentsCount.classList.add('hidden');
  bigPictureCommentsLoader.classList.add('hidden');
};

//Открытие окна просмотра изображения
const showBigPictureWindow = (photo) => {
  bigPicture.classList.remove('hidden');
  fillBigPicture(photo);
  hideCommentsCountAndLoader();
  lockBodyScroll();
  document.addEventListener('keydown', onDocumentKeyDown);
};

export {showBigPictureWindow};
