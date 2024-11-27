// Модуль вывода сообщений для пользователя
//--- Вывод сообщения об ошибке
const ALERT_SHOW_TIME = 5000;
const uploadErrorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
const downloadErrorTemplate = document.querySelector('#data-error')
  .content
  .querySelector('.data-error');

const addMessageToBody = (errorMessage) => {
  document.body.append(errorMessage);
  setTimeout(() => {
    errorMessage.remove();
  }, ALERT_SHOW_TIME);
};

const showUploadError = () => {
  addMessageToBody(uploadErrorTemplate.cloneNode(true));
};

const showDownloadError = () => {
  addMessageToBody(downloadErrorTemplate.cloneNode(true));
};

export {showUploadError, showDownloadError};
