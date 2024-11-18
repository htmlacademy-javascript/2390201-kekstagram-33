// Модуль формирования данных для работы Кексограм

/* Домашнее задание к разделу 4:

В файле main.js напишите необходимые функции для создания массива из 25 сгенерированных объектов. Каждый объект массива — описание фотографии, опубликованной пользователем.

Структура каждого объекта должна быть следующей:

- id, число — идентификатор опубликованной фотографии. Это число от 1 до 25. Идентификаторы не должны повторяться.

- url, строка — адрес картинки вида photos/{{i}}.jpg, где {{i}} — это число от 1 до 25. Адреса картинок не должны повторяться.

- description, строка — описание фотографии. Описание придумайте самостоятельно.

- likes, число — количество лайков, поставленных фотографии. Случайное число от 15 до 200.

- comments, массив объектов — список комментариев, оставленных другими пользователями к этой фотографии. Количество комментариев к каждой фотографии — случайное число от 0 до 30. Все комментарии генерируются случайным образом. Пример описания объекта с комментарием:

{
  id: 135,
  avatar: 'img/avatar-6.svg',
  message: 'В целом всё неплохо. Но не всё.',
  name: 'Артём',
}

У каждого комментария есть идентификатор — id — любое число. Идентификаторы не должны повторяться.

Поле avatar — это строка, значение которой формируется по правилу img/avatar-{{случайное число от 1 до 6}}.svg. Аватарки подготовлены в директории img.

Для формирования текста комментария — message — вам необходимо взять одно или два случайных предложения из представленных ниже:

Всё отлично!
В целом всё неплохо. Но не всё.
Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.
Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.
Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.
Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!

Имена авторов также должны быть случайными. Набор имён для комментаторов составьте сами. Подставляйте случайное имя в поле name.
 */
import { getRandomInteger, getRandomArrayElement } from './util.js';

const PHOTOS_QUANTITY = 25;

const MIN_MAX = {
  minAvatars : 1,
  maxAvatars: 6,
  minComments: 0,
  maxComments: 30,
  minLikes: 15,
  maxLikes: 200,
};

const PHOTOS_DESCRIPTIONS = [
  'Пляж отеля',
  'Указатель на пляж',
  'Море, холмы, пляж',
  'Девушка-фотограф в бикини',
  'Прикольная еда из риса',
  'Чёрный суперкар McLaren 650S',
  'Одна клубника на деревянной тарелке',
  'Клюквенный морс в двух кружках',
  'Встречаем самолёт над пляжем',
  'Подставка для обуви',
  'Проход к пляжу между двух изгородей',
  'Белая двухдверная Ауди',
  'Экзотический салат',
  'Смешной котик в виде суши',
  'Положил ноги на подлокотник дивана',
  'Летим над облаками, видим другой самолёт',
  'Хор с аккомпаниаторами на сцене',
  'Красный Шевроле Импала внутри кирпичного лофта',
  'Женщина стоит в тапочках перед дверью',
  'Площадка с пальмами в окружении бунгало',
  'Курица с рисом на деревянной тарелке',
  'Закат на пляже',
  'Суровый краб',
  'Файер-шоу на концерте',
  'Бегемот вынырнул рядом с Ленд-Ровером',
];

const COMMENT_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const COMMENTATORS_NAMES = [
  'Сергей',
  'Мария',
  'Пётр',
  'Елена',
  'Артём',
  'Наталья',
  'Роман',
  'Ирина',
  'Евгенй',
  'Людмила',
];

let currentCommentId = 0; // Сквозной по всему модулю номер комментария к фото

// Функция createMessage формирует текст к комментарию, склеивая messageNumber случайных предложений из COMMENT_MESSAGES
const createMessage = (messageNumber) => {
  let message = '';
  for (let i = 0; i < messageNumber; i++) {
    message = `${getRandomArrayElement(COMMENT_MESSAGES)} ${message}`;
  }
  return message;
};

// Функция createComment содаёт объект, описывающий комментарий к фотографии
const createComment = () => {
  currentCommentId++;
  return {
    id: currentCommentId,

    avatar: `img/avatar-${ getRandomInteger(MIN_MAX.minAvatars, MIN_MAX.maxAvatars).toString() }.svg`,
    message: createMessage(getRandomInteger (1, 2)),
    name: getRandomArrayElement(COMMENTATORS_NAMES),
  };
};

// Функция createPublishedPhoto содаёт объект, описывающий публикуемую фотографию
const createPublishedPhoto = (photoId) => {
  const commentsArray = [];

  const commentsNumber = getRandomInteger(MIN_MAX.minComments, MIN_MAX.maxComments);
  for (let i = 0; i < commentsNumber; i++) {
    commentsArray[i] = createComment (currentCommentId);
  }

  return {
    id: photoId,
    url: `photos/${ photoId.toString() }.jpg`,
    description: PHOTOS_DESCRIPTIONS[photoId - 1],
    likes: getRandomInteger(MIN_MAX.minLikes, MIN_MAX.maxLikes),
    comments: commentsArray,
  };
};

//Функция createPhotos создаёт массив публикуемых фотографий

const createPhotos = (photosQuantity) => Array.from({ length: photosQuantity }, (undefinedValue, photoCounter) => createPublishedPhoto(photoCounter + 1));

export {PHOTOS_QUANTITY, createPhotos};
