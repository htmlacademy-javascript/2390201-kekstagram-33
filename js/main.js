// Модуль - "точка входа" js-модулей

import {getData} from './api.js';
import {showThumbnails} from './view-images.js';
import {showDownloadError} from './user-messages.js';
import {uploadImages} from './upload-images.js';
import {addPhotosFilter} from './add-photos-filter.js';

getData()
  .then((photos) => {
    showThumbnails(photos);
    addPhotosFilter(photos);
  })
  .catch(() => {
    showDownloadError();
  });

uploadImages();

