// Модуль вспомогательных утилит
//Функция getRandomInteger возвращает случайное целое число в диапазоне от a до b
const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

//Функция getRandomArrayElement возвращает случайноный элемент массива elements
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

//Создаёт элемент разметки с тэгом tagName, классом className и текстом text для добавления в DOM через appendChild
const makeElement = function (tagName, className, text) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

const isEscapeKey = (evt) => evt.key === 'Escape';

// Функция устранения "дребезга" на время timeoutDelay при вызове функции callback
const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Определяет, является ли файл картинкой
const fileIsImage = (fileName) => {
  const FILE_TYPES = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'];
  return FILE_TYPES.some((it) => fileName.endsWith(it));
};


//--- Управление прокруткой контейнера с миниатюрами позади окна изображения
//Запрещает прокрутку
const lockBodyScroll = () =>{
  document.body.classList.add('modal-open');
};
//Разрешает прокрутку
const unlockBodyScroll = () =>{
  document.body.classList.remove('modal-open');
};

export {getRandomInteger, getRandomArrayElement, makeElement, isEscapeKey, debounce,fileIsImage, lockBodyScroll, unlockBodyScroll};
