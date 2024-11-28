// Модуль вывода сообщений для пользователя
const DOWNLOAD_ALERT_SHOW_TIME = 5000;

//---Вывод и удаление сообщения об успешной отправке фотографии
const uploadSuccessTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');
const uploadSuccessMessage = uploadSuccessTemplate.cloneNode(true);
const uploadSuccessButton = uploadSuccessMessage.querySelector('.success__button');

const closeUploadSuccessWindow = () => {
  uploadSuccessButton.removeEventListener('click',onUploadSuccessButtonClick);
  document.removeEventListener('keydown', onUploadSuccessEscDown);
  document.removeEventListener('click', onUploadSuccessMouseCancel);
  uploadSuccessMessage.remove();
};

function onUploadSuccessButtonClick () {
  closeUploadSuccessWindow();
}

function onUploadSuccessEscDown (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeUploadSuccessWindow();
  }
}

function onUploadSuccessMouseCancel (evt) {
  if (!evt.target.matches('.success__inner')) {
    closeUploadSuccessWindow();
  }
}

const showUploadSuccess = () => {
  uploadSuccessButton.addEventListener('click',onUploadSuccessButtonClick);
  document.addEventListener('keydown', onUploadSuccessEscDown);
  document.addEventListener('click', onUploadSuccessMouseCancel);
  document.body.append(uploadSuccessMessage);
};

//---Вывод и удаление сообщения о неудачной отправке фотографии
const uploadErrorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');
const uploadErrorMessage = uploadErrorTemplate.cloneNode(true);
const uploadErrorButton = uploadErrorMessage.querySelector('.error__button');

const closeUploadErrorWindow = () => {
  uploadErrorButton.removeEventListener('click',onUploadErrorButtonClick);
  document.removeEventListener('keydown', onUploadErrorEscDown);
  document.removeEventListener('click', onUploadErrorMouseCancel);
  uploadErrorMessage.remove();
};

function onUploadErrorButtonClick () {
  closeUploadErrorWindow();
}

function onUploadErrorEscDown (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    evt.stopPropagation();
    closeUploadErrorWindow();
  }
}

function onUploadErrorMouseCancel (evt) {
  if (!evt.target.matches('.error__inner')) {
    closeUploadErrorWindow();
  }
}

const showUploadError = () => {
  uploadErrorButton.addEventListener('click',onUploadErrorButtonClick);
  document.addEventListener('keydown', onUploadErrorEscDown);
  document.addEventListener('click', onUploadErrorMouseCancel);
  document.body.append(uploadErrorMessage);
};

//---Вывод и удаление сообщения о неудачной загрузке фотографий других пользователей
const downloadErrorTemplate = document.querySelector('#data-error')
  .content
  .querySelector('.data-error');
const downloadErrorMessage = downloadErrorTemplate.cloneNode(true);

const showDownloadError = () => {
  document.body.append(downloadErrorMessage);
  setTimeout(() => {
    downloadErrorMessage.remove();
  }, DOWNLOAD_ALERT_SHOW_TIME);
};

export {showUploadSuccess, showUploadError, showDownloadError};
