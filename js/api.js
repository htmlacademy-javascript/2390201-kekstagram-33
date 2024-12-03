//Модуль взаимодействия с сервером для загрузки фотографий других пользователей и отправки фотографий
const GET_DATA_URL = 'https://32.javascript.htmlacademy.pro/kekstagram/data';
const SEND_DATA_URL = 'https://32.javascript.htmlacademy.pro/kekstagram';
const SEND_DATA_METHOD = 'POST';

const getData = () => fetch(GET_DATA_URL)
  .then((response) => response.json());

const sendData = (body) => fetch(SEND_DATA_URL,
  {
    method: SEND_DATA_METHOD,
    body,
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error();
    }
  })
  .catch(() => {
    throw new Error();
  });

export {getData, sendData};
