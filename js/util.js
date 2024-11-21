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

//--- Управление прокруткой контейнера с миниатюрами позади окна изображения
const keksogramBody = document.querySelector('body');
//Запрещает прокрутку
const lockBodyScroll = () =>{
  keksogramBody.classList.add('modal-open');
};
//Разрешает прокрутку
const unlockBodyScroll = () =>{
  keksogramBody.classList.remove('modal-open');
};

export {getRandomInteger, getRandomArrayElement, makeElement, lockBodyScroll, unlockBodyScroll};
