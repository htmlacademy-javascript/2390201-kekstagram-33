//Модуль взаимодействия с сервером для загрузки фотографий других пользователей и отправки фотографий
const getData = () => fetch(
  'https://32.javascript.htmlacademy.pro/kekstagram/data')
  .then((response) => response.json());

const sendData = (body) => fetch(
  'https://32.javascript.htmlacademy.pro/kekstagram',
  {
    method: 'POST',
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
