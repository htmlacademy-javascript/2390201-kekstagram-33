// Модуль - "точка входа" js-модулей

import {getData} from './api.js';
import {showThumbnails} from './view-images.js';
import {showDownloadError} from './user-messages.js';
import {uploadImages} from './upload-images.js';

getData()
  .then((photos) => {
    showThumbnails(photos);
  })
  .catch(() => {
    showDownloadError();
  });

uploadImages();

