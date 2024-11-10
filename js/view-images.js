// Модуль просмотра изображений
import {PHOTOS_QUANTITY, publishedPhotos} from './data.js';
const photos = publishedPhotos(PHOTOS_QUANTITY);

const pictures = document.querySelector('.pictures');

const newPictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

// Функция showThumbnails отображает на странице превью загруженных в массив photos изображений
const showThumbnails = () => {
  const picturesFragment = document.createDocumentFragment();

  photos.forEach(({url, description, likes, comments}) => {
    const newPicture = newPictureTemplate.cloneNode(true);

    const newPictureImage = newPicture.querySelector('.picture__img');
    newPictureImage.src = url;
    newPictureImage.alt = description;

    const newPictureLikes = newPicture.querySelector('.picture__likes');
    newPictureLikes.textContent = likes;

    const newPictureComments = newPicture.querySelector('.picture__comments');
    newPictureComments.textContent = comments.length;

    picturesFragment.appendChild(newPicture);
  });

  pictures.appendChild(picturesFragment);
};

export {showThumbnails};
