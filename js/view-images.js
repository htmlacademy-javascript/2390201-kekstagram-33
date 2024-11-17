// Модуль просмотра изображений
import {PHOTOS_QUANTITY, createPhotos} from './data.js';
import {showBigPictureWindow} from './view-big-picture.js';

const photos = createPhotos(PHOTOS_QUANTITY);

const pictures = document.querySelector('.pictures');

const newPictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

// Функция showThumbnails отображает на главной странице миниатюры загруженных в массив photos изображений
const showThumbnails = () => {
  const picturesFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const newPicture = newPictureTemplate.cloneNode(true);
    newPicture.dataset.id = photo.id;
    newPicture.querySelector('.picture__likes').textContent = photo.likes;
    newPicture.querySelector('.picture__comments').textContent = photo.comments.length;
    const newPictureImage = newPicture.querySelector('.picture__img');
    newPictureImage.src = photo.url;
    newPictureImage.alt = photo.description;
    picturesFragment.appendChild(newPicture);
  });

  pictures.appendChild(picturesFragment);
};

//Обработчик клика по миниатюре (класс - picture__img), который вызывает окно просмотра изображения.
const onMiniatureClick = (evt) => {
  if (evt.target.matches('.picture__img')) {
    const clickedPicture = evt.target.closest('.picture'); //т.к. dataset.id был назначен на родителя миниатюры (класс - picture)
    if (clickedPicture) {
      const photoId = parseInt(clickedPicture.dataset.id, 10);
      const photo = photos.find((element) => element.id === photoId);
      if (typeof photo !== 'undefined') {
        showBigPictureWindow(photo);
      }
    }
  }
};

// Делегируем обработчик родительскому для picture контейнеру pictures
pictures.addEventListener('click', onMiniatureClick);

export {showThumbnails};
