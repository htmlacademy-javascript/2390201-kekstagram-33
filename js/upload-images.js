// Модуль загрузки изображений, отвечает за работу с формой загрузки (задания 9.13, 9.15)
import {isEscapeKey, fileIsImage, lockBodyScroll, unlockBodyScroll} from './util.js';
import {sendData} from './api.js';
import {showUploadError, showUploadSuccess} from './user-messages.js';

const SubmitButtonText = {
  IDLE: 'Сохранить',
  SENDING: 'Сохраняю...'
};

const MAX_HASHTAGS_NUMBER = 5;
const HASHTAG_TEMPLATE = /^#[a-zа-яё0-9]{0,19}$/i;
const MessagesHashtagError = {
  DUPLICATE: 'Один и тот же хэштег не может быть использован дважды, при этом хэштеги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом',
  BAD_FORMAT: 'Хэштег начинается с символа # (решётка). Строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д. Минимальная длина хэштега - 2 символа, включая решётку, максимальная - 20',
  SHORT_HASHTAG: 'Хэштег не может состоять только из символа (решётка). Минимальная длина хэштега - 2 символа',
  TOO_MANY: `Хэштегов не должно быть больше ${ MAX_HASHTAGS_NUMBER }`
};
const MAX_COMMENT_LENGTH = 140;
const COMMENT_ERROR_MESSAGE = `Длина комментария не должна быть больше ${ MAX_COMMENT_LENGTH } символов.`;

const DEFAULT_IMAGE_URL = 'img/upload-default-image.jpg';

const IMG_SCALE_BOTTOM = 0;
const IMG_SCALE_TOP = 100;
const IMG_SCALE_MIN = 25;
const IMG_SCALE_MAX = 100;
const IMG_SCALE_DEFAULT = 100;
const IMG_SCALE_STEP = 25;
const SliderEffects = {
  chrome: {
    FILTER_NAME:'grayscale',
    FILTER_MIN: 0,
    FILTER_MAX: 1,
    FILTER_STEP: 0.1,
    FILTER_SUFFIX:'',
  },
  sepia: {
    FILTER_NAME:'sepia',
    FILTER_MIN: 0,
    FILTER_MAX: 1,
    FILTER_STEP: 0.1,
    FILTER_SUFFIX:'',
  },
  marvin: {
    FILTER_NAME:'invert',
    FILTER_MIN: 0,
    FILTER_MAX: 100,
    FILTER_STEP: 1,
    FILTER_SUFFIX:'%',
  },
  phobos: {
    FILTER_NAME:'blur',
    FILTER_MIN: 0,
    FILTER_MAX: 3,
    FILTER_STEP: 0.1,
    FILTER_SUFFIX:'px',
  },
  heat: {
    FILTER_NAME:'brightness',
    FILTER_MIN: 1,
    FILTER_MAX: 3,
    FILTER_STEP: 0.1,
    FILTER_SUFFIX:'',
  },
};

const imgUploadForm = document.querySelector('.img-upload__form');
const imgUploadInput = imgUploadForm.querySelector('.img-upload__input');
const imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
const imgUploadCancelButton = imgUploadForm.querySelector('.img-upload__cancel');
const imgUploadSubmitButton = imgUploadForm.querySelector('.img-upload__submit');

const textHashtagsInput = imgUploadForm.querySelector('.text__hashtags');
const textDescriptionInput = imgUploadForm.querySelector('.text__description');
let hashtagErrorMessage = '';

const scaleControlSmaller = imgUploadForm.querySelector('.scale__control--smaller');
const scaleControlBigger = imgUploadForm.querySelector('.scale__control--bigger');
const scaleControlValue = imgUploadForm.querySelector('.scale__control--value');
const imageUploadPreview = imgUploadForm.querySelector('.img-upload__preview img');

const imgUploadEffectLevel = imgUploadForm.querySelector('.img-upload__effect-level');
const effectLevelValue = imgUploadForm.querySelector('.effect-level__value');
const effectLevelSlider = imgUploadForm.querySelector('.effect-level__slider');
const effectsList = imgUploadForm.querySelector('.effects__list');
const effectsPreviews = effectsList.querySelectorAll('.effects__preview');
const originalEffectButton = imgUploadForm.querySelector('[value="none"]');
let currentEffect = 'none';
let scaleCurrent = IMG_SCALE_DEFAULT;

//--- Раздел валидации и отправки формы
const pristine = new Pristine(imgUploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'form__error'
});

//-- Валидация хэштега
// Валидатор хэштега для pristine. Возвращает true, если хэштег валиден, false - в противном случае.
function validateHashtag (value) {
  let hashtagsDuplicate = false;
  let hashtagFormatIsWrong = false;
  let onlyHashInHashtag = false;
  //Разделяем строку из поля ввода на массив отдельных хэштегов, удаляя в foreach пустые элементы '', которые образуются из лишних пробелов. Отлавливаем некорректный ввод.
  let hastagsNumber = 0;
  const hashtags = [];
  value.trim().split(' ').forEach((hashtag) => {
    if (hashtag !== '') {
      if (hashtags.includes(hashtag.toUpperCase())) {
        hashtagsDuplicate = true; //Поймали совпадение хештегов
        hashtagErrorMessage = MessagesHashtagError.DUPLICATE;
      }
      if (!HASHTAG_TEMPLATE.test(hashtag)) {
        hashtagFormatIsWrong = true; // Поймали несоответствие шаблону
        hashtagErrorMessage = MessagesHashtagError.BAD_FORMAT;
      }
      if (hashtag === '#') {
        onlyHashInHashtag = true; //Хэштег из одной решётки
        hashtagErrorMessage = MessagesHashtagError.SHORT_HASHTAG;
      }
      hashtags[hastagsNumber] = hashtag.toUpperCase();
      hastagsNumber++;
    }
  });
  if (hastagsNumber > MAX_HASHTAGS_NUMBER) {
    hashtagErrorMessage = MessagesHashtagError.TOO_MANY;
  }
  return !((hastagsNumber > MAX_HASHTAGS_NUMBER) || hashtagsDuplicate || hashtagFormatIsWrong || onlyHashInHashtag);
}

const hashtagErrorMessageFunction = () => hashtagErrorMessage;

pristine.addValidator(textHashtagsInput, validateHashtag, hashtagErrorMessageFunction);

//-- Валидация комментария
function validateComment (value) {
  return value.length <= MAX_COMMENT_LENGTH;
}

pristine.addValidator(textDescriptionInput, validateComment, COMMENT_ERROR_MESSAGE);

//--- Раздел замены изображения "по умолчанию" в разделе превью, на загруженное пользователем.
const setNewUploadPreview = () => {
  const uploadFileName = imgUploadInput.files[0].name.toLowerCase();
  if (fileIsImage(uploadFileName)) {
    const uploadFileUrl = URL.createObjectURL(imgUploadInput.files[0]);
    imageUploadPreview.src = uploadFileUrl;
    effectsPreviews.forEach((preview) => {
      preview.style.backgroundImage = `url("${uploadFileUrl}")`;
    });
  }
};

const setDefaultUploadPreview = () => {
  imageUploadPreview.src = DEFAULT_IMAGE_URL;
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url("../${DEFAULT_IMAGE_URL}")`;
  });
};

//--- Раздел изменения масштаба изображения
const setScaleValue = (scaleValue) => {
  scaleControlValue.value = `${ scaleValue }%`;

  if (scaleValue > IMG_SCALE_BOTTOM && scaleValue < IMG_SCALE_TOP) {
    imageUploadPreview.style.transform = `scale(0.${ scaleValue })`;
  } else {
    imageUploadPreview.style.transform = 'scale(1)';
  }
};

function onScaleSmallerClick () {
  scaleCurrent = scaleCurrent - IMG_SCALE_STEP;
  if (scaleCurrent < IMG_SCALE_MIN) {
    scaleCurrent = IMG_SCALE_MIN;
  }
  setScaleValue(scaleCurrent);
}

function onScaleBiggerClick () {
  scaleCurrent = scaleCurrent + IMG_SCALE_STEP;
  if (scaleCurrent > IMG_SCALE_MAX) {
    scaleCurrent = IMG_SCALE_MAX;
  }
  setScaleValue(scaleCurrent);
}

const addImgScaleListeners = () =>{
  scaleControlSmaller.addEventListener('click', onScaleSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleBiggerClick);
};

const removeImgScaleListeners = () =>{
  scaleControlSmaller.removeEventListener('click', onScaleSmallerClick);
  scaleControlBigger.removeEventListener('click', onScaleBiggerClick);
};

//--- Раздел наложения эффектов на изображение
noUiSlider.create((effectLevelSlider), {
  range: {
    min: 0,
    max: 1,
  },
  start: 0,
  step: 0.1,
  connect: 'lower',
  format: {
    to: function (value) {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(1);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});

const setSliderEffectStyle = (effect, currentValue) => {
  if (effect === 'none') {
    imageUploadPreview.style.filter = '';
  } else {
    imageUploadPreview.style.filter = `${ SliderEffects[effect].FILTER_NAME }(${ currentValue }${ SliderEffects[effect].FILTER_SUFFIX })`;
  }
};

effectLevelSlider.noUiSlider.on('update', () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  effectLevelValue.value = sliderValue;
  setSliderEffectStyle(currentEffect, sliderValue);
});

const setSliderEffectParameters = (effect) => {
  currentEffect = effect;
  //Параметры элемента слайдера
  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: SliderEffects[effect].FILTER_MIN,
      max: SliderEffects[effect].FILTER_MAX
    },
    step: SliderEffects[effect].FILTER_STEP
  });
  effectLevelSlider.noUiSlider.set(SliderEffects[effect].FILTER_MAX);
  //Параметры разметки
  effectLevelValue.value = SliderEffects[effect].FILTER_MAX;
  setSliderEffectStyle(effect, SliderEffects[effect].FILTER_MAX);
};

const changeSliderEffect = (effect) => {
  if (effect === 'none') {
    imgUploadEffectLevel.classList.add('visually-hidden');
    imageUploadPreview.style.filter = '';
  } else {
    imgUploadEffectLevel.classList.remove('visually-hidden');
    setSliderEffectParameters(effect);
  }
};

function onEffectButtonClick (evt) {
  if (evt.target.matches('.effects__radio')) {
    changeSliderEffect(evt.target.value);
  }
}

//--- Раздел закрытия формы добавления изображения
const removeCloseFormListeners = () => {
  imgUploadCancelButton.removeEventListener('click', onCloseButtonClick);
  document.removeEventListener('keydown', onDocumentKeyDown);
};

const clearFormInputs = () => {
  textHashtagsInput.value = '';
  textDescriptionInput.value = '';
  scaleCurrent = IMG_SCALE_DEFAULT;
  imgUploadInput.value = null;
  pristine.reset();
};

function closeImageEditForm () {
  clearFormInputs ();
  setDefaultUploadPreview();
  imgUploadOverlay.classList.add('hidden');
  unlockBodyScroll();
  removeCloseFormListeners();
  removeImgScaleListeners ();
  originalEffectButton.checked = true;
  effectsList.removeEventListener('click', onEffectButtonClick);
  imgUploadForm.removeEventListener('submit', onImgUploadFormSubmit);
}

function onCloseButtonClick () {
  closeImageEditForm();
}

function onDocumentKeyDown (evt) {
  if (isEscapeKey(evt)) {
    if (!evt.target.matches('.text__hashtags') && !evt.target.matches('.text__description')) {
      evt.preventDefault();
      closeImageEditForm();
    }
  }
}

const blockUploadSubmitButton = () => {
  imgUploadSubmitButton.disabled = true;
  imgUploadSubmitButton.textContent = SubmitButtonText.SENDING;
};

const unblockUploadSubmitButton = () => {
  imgUploadSubmitButton.disabled = false;
  imgUploadSubmitButton.textContent = SubmitButtonText.IDLE;
};

// Обработчик отправки формы
function onImgUploadFormSubmit (evt) {
  evt.preventDefault();
  if (pristine.validate()) {
    blockUploadSubmitButton();
    sendData(new FormData(evt.target))
      .then(() => {
        showUploadSuccess();
        closeImageEditForm();
      })
      .catch(() => {
        showUploadError();
      })
      .finally(unblockUploadSubmitButton);
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
  setNewUploadPreview();
  addImgScaleListeners ();
  setScaleValue(IMG_SCALE_DEFAULT);
  changeSliderEffect ('none');
  effectsList.addEventListener('click', onEffectButtonClick);
  imgUploadForm.addEventListener('submit', onImgUploadFormSubmit);
}

//Основная функция модуля - загрузка изображений
const uploadImages = () => {
  imgUploadInput.addEventListener('change', onUploadInputChange);
};

export {uploadImages};
