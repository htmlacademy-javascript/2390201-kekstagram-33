// Модуль загрузки изображений, отвечает за работу с формой загрузки (задание 9.1)
import {lockBodyScroll, unlockBodyScroll} from './util.js';

const imgUploadForm = document.querySelector('.img-upload__form');
const imgUploadInput = imgUploadForm.querySelector('.img-upload__input');
const imgUploadOverlay = imgUploadForm.querySelector('.img-upload__overlay');
const imgUploadCancelButton = imgUploadForm.querySelector('.img-upload__cancel');

const textHashtagsInput = imgUploadForm.querySelector('.text__hashtags');
const textDescriptionInput = imgUploadForm.querySelector('.text__description');
const hashtagErrorMessage = '1. Хэштег начинается с символа # (решётка);<br>2. Строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.;<br>3. Хэштеги разделяются пробелами;<br>4. Максимальная длина одного хэштега 20 символов, минимальная - 2 символа, включая решётку;<br>5. Один и тот же хэштег не может быть использован дважды, при этом хэштеги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом;<br>6. нельзя указать больше пяти хэштегов;<br>7. Лишние пробелы при вводе хэштегов будут удалены.';
const MAX_HSHTAGS_NUMBER = 5;
const MAX_HSHTAGS_LENGTH = 20;
const hashtagTemplate = /^#[a-zа-яё0-9]{1,19}$/i;

const scaleControlSmaller = imgUploadForm.querySelector('.scale__control--smaller');
const scaleControlBigger = imgUploadForm.querySelector('.scale__control--bigger');
const scaleControlValue = imgUploadForm.querySelector('.scale__control--value');
const imageUploadPreview = imgUploadForm.querySelector('.img-upload__preview img');
const IMG_SCALE_MIN = 25;
const IMG_SCALE_MAX = 100;
const IMG_SCALE_DEFAULT = 100;
const IMG_SCALE_STEP = 25;
let scaleCurrent = IMG_SCALE_DEFAULT;

const imgUploadEffectLevel = imgUploadForm.querySelector('.img-upload__effect-level');
const effectLevelValue = imgUploadForm.querySelector('.effect-level__value');
const effectLevelSlider = imgUploadForm.querySelector('.effect-level__slider');
const effectsList = imgUploadForm.querySelector('.effects__list');
let currentEffect = 'none';
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
      if (hashtag.length > MAX_HSHTAGS_LENGTH) {
        hashtagTooLong = true; // Поймали слишком длинный хэштег
      }
      if (!hashtagTemplate.test(hashtag)) {
        hashtagFormatIsWrong = true; // Поймали несоответствие шаблону
      }
      hashtags[hastagsNumber] = hashtag.toUpperCase();
      hastagsNumber++;
    }
  });
  return !((hastagsNumber > MAX_HSHTAGS_NUMBER) || hashtagsDuplicate || hashtagTooLong || hashtagFormatIsWrong);
}

// Валидируем только поле хештега, поле комментариев валидируется на форме в html
pristine.addValidator(textHashtagsInput, validateHashtag, hashtagErrorMessage);

function onImgUploadFormSubmit (evt) {
  evt.preventDefault();
  if (pristine.validate()) {
    imgUploadForm.submit();
  }
}

//--- Раздел изменения масштаба изображения
const setScaleValue = (scaleValue) => {
  scaleControlValue.value = `${ scaleValue }%`;

  if (scaleValue > 0 && scaleValue < 100) {
    imageUploadPreview.style.transform = `scale(0.${ scaleValue })`;
  } else {
    imageUploadPreview.style.transform = 'scale(1)';
  }
}

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
}

//--- Раздел наложения эффектов на изображение
const showEffectName = (effect) => {
  return SliderEffects[effect].FILTER_NAME;
};

noUiSlider.create(effectLevelSlider, {
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
  console.log(imageUploadPreview.style.filter);
};

effectLevelSlider.noUiSlider.on('update', () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  effectLevelValue.value = sliderValue;
  setSliderEffectStyle(currentEffect, sliderValue)
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
  effectLevelSlider.noUiSlider.set(SliderEffects[effect].FILTER_MIN);
  //Параметры разметки
  effectLevelValue.value = SliderEffects[effect].FILTER_MIN;
  setSliderEffectStyle(effect, SliderEffects[effect].FILTER_MIN);
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
};

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
};

const closeImageEditForm = () => {
  clearFormInputs ();
  imgUploadOverlay.classList.add('hidden');
  unlockBodyScroll();
  removeCloseFormListeners();
  removeImgScaleListeners ();
  effectsList.removeEventListener('click', onEffectButtonClick);
  imgUploadForm.removeEventListener('submit', onImgUploadFormSubmit);
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
