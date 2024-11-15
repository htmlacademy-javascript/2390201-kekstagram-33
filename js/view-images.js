// Модуль просмотра изображений
import {PHOTOS_QUANTITY, createPhotos} from './data.js';
import {showBigPictureHandler} from './view-big-picture.js';

const photos = createPhotos(PHOTOS_QUANTITY);

const pictures = document.querySelector('.pictures');

const newPictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

// Функция showThumbnails отображает на странице превью загруженных в массив photos изображений
const showThumbnails = () => {
  const picturesFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const newPicture = newPictureTemplate.cloneNode(true);

    const newPictureImage = newPicture.querySelector('.picture__img');
    newPictureImage.src = photo.url;
    newPictureImage.alt = photo.description;

    const newPictureLikes = newPicture.querySelector('.picture__likes');
    newPictureLikes.textContent = photo.likes;

    const newPictureComments = newPicture.querySelector('.picture__comments');
    newPictureComments.textContent = photo.comments.length;

    showBigPictureHandler(newPicture, photo);
    picturesFragment.appendChild(newPicture);
  });

  pictures.appendChild(picturesFragment);
};

export {showThumbnails};
