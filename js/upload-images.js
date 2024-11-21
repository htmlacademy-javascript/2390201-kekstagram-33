// Модуль загрузки изображений, отвечает за работу с формой загрузки (задание 9.1)
import {lockBodyScroll, unlockBodyScroll} from './util.js';

const imgUploadForm = document.querySelector('.img-upload__form');
const imgUploadInput = imgUploadForm.querySelector('.img-upload__input');
const imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
const imgUploadCancelButton = imgUploadForm.querySelector('.img-upload__cancel');
const textHashtagsInput = imgUploadForm.querySelector('.text__hashtags');
const textDescriptionInput = imgUploadForm.querySelector('.text__description');
const hashtagErrorMessage = '1. Хэштег начинается с символа # (решётка);<br>2. Строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.;<br>3. Хэштеги разделяются пробелами;<br>4. Максимальная длина одного хэштега 20 символов, минимальная - 2 символа, включая решётку;<br>5. Один и тот же хэштег не может быть использован дважды, при этом хэштеги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом;<br>6. нельзя указать больше пяти хэштегов;<br>7. Лишние пробелы при вводе хэштегов будут удалены.';
const maxHashtagsNumber = 5;
const maxHashtagsLength = 20;
const hashtagTemplate = /^#[a-zа-яё0-9]{1,19}$/i;

//--- Раздел валидации и отправки формы
const pristine = new Pristine(imgUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  // successClass: 'form__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'p',
  errorTextClass: 'form__error'
});

// Валидатор хэштега для pristine. Возвращает true, если хэштег валиден, false - в противном случае.
function validateHashtag (value) {
  let hashtagsDuplicate = false;
  let hashtagTooLong = false;
  let hashtagFormatIsWrong = false;
  //Разделяем строку из поля ввода на массив отдельных хэштегов, удаляя в foreach пустые элементы '', которые образуются из лишних пробелов. Отлавливаем некорректный ввод.
  let hastagsNumber = 0;
  const hashtags = [];
  value.trim().split(' ').forEach((hashtag) => {
    if (hashtag !== '') {
      if (hashtags.includes(hashtag.toUpperCase())) {
        hashtagsDuplicate = true; //Поймали совпадение хештегов
      }
      if (hashtag.length > maxHashtagsLength) {
        hashtagTooLong = true; // Поймали слишком длинный хэштег
      }
      if (!hashtagTemplate.test(hashtag)) {
        hashtagFormatIsWrong = true; // Поймали несоответствие шаблону
      }
      hashtags[hastagsNumber] = hashtag.toUpperCase();
      hastagsNumber++;
    }
  });
  return !((hastagsNumber > maxHashtagsNumber) || hashtagsDuplicate || hashtagTooLong || hashtagFormatIsWrong);
}

// Валидируем только поле хештега, поле комментариев валидируется на форме в html
pristine.addValidator(textHashtagsInput, validateHashtag, hashtagErrorMessage);

function onImgUploadFormSubmit (evt) {
  evt.preventDefault();
  if (pristine.validate()) {
    imgUploadForm.submit();
  }
}

//--- Раздел закрытия формы добавления изображения
const removeCloseFormListeners = () => {
  imgUploadCancelButton.removeEventListener('click', onCloseButtonClick);
  document.removeEventListener('keydown', onDocumentKeyDown);
};

const clearFormInruts = () => {
  imgUploadInput.value = null;
  textHashtagsInput.value = '';
  textDescriptionInput.value = '';
};

const closeImageEditForm = () => {
  clearFormInruts ();
  imgUploadOverlay.classList.add('hidden');
  unlockBodyScroll();
  removeCloseFormListeners();
};

function onCloseButtonClick () {
  closeImageEditForm();
}

function onDocumentKeyDown (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeImageEditForm();
  }
}

//--- Раздел отображения формы добавления изображения
const showImageEditForm = () => {
  imgUploadOverlay.classList.remove('hidden');
  lockBodyScroll();
};

const addCloseFormListeners = () => {
  imgUploadCancelButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeyDown);
};

function onUploadInputChange () {
  showImageEditForm();
  addCloseFormListeners();
}

//Основная функция модуля - загрузка изображений
const uploadImages = () => {
  imgUploadInput.addEventListener('change', onUploadInputChange);
  imgUploadForm.addEventListener('submit', onImgUploadFormSubmit);
};

export {uploadImages};
