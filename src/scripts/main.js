'use strict';

document.addEventListener('contextmenu', (e) => e.preventDefault());

const showNotification = (message, type) => {
  const notificationHTML = `<div class="${type}" data-qa="notification">${message}</div>`;

  document.body.insertAdjacentHTML('afterbegin', notificationHTML);
};

const success = (message) => showNotification(message, 'success');
const error = (message) => showNotification(message, 'error');

// First Promise: Resolves on left click or rejects after 3 seconds.
const firstPromise = new Promise((resolve, reject) => {
  const onLeftClick = (e) => {
    if (e.button === 0) {
      resolve();
      document.removeEventListener('click', onLeftClick);
    }
  };

  document.addEventListener('click', onLeftClick);

  const rejectAfterTimeout = () => {
    reject(new Error('First promise was rejected'));
    document.removeEventListener('click', onLeftClick);
  };

  setTimeout(rejectAfterTimeout, 3000);
});

// Second Promise: Resolves on either left click or right click.
const secondPromise = new Promise((resolve) => {
  const onClickOrRightClick = (e) => {
    if (e.button === 0 || e.button === 2) {
      resolve();
      document.removeEventListener('click', onClickOrRightClick);
      document.removeEventListener('contextmenu', onClickOrRightClick);
    }
  };

  document.addEventListener('click', onClickOrRightClick);
  document.addEventListener('contextmenu', onClickOrRightClick);
});

// Third Promise: Resolves when both left and right clicks happen.
const thirdPromise = new Promise((resolve) => {
  let leftClickHappened = false;
  let rightClickHappened = false;

  const onLeftClick = (e) => {
    if (e.button === 0) {
      leftClickHappened = true;
      checkBothClicks();
    }
  };

  const onRightClick = (e) => {
    if (e.button === 2) {
      rightClickHappened = true;
      checkBothClicks();
    }
  };

  const checkBothClicks = () => {
    if (leftClickHappened && rightClickHappened) {
      resolve();
      document.removeEventListener('click', onLeftClick);
      document.removeEventListener('contextmenu', onRightClick);
    }
  };

  document.addEventListener('click', onLeftClick);
  document.addEventListener('contextmenu', onRightClick);
});

// Handling Promises
firstPromise
  .then(() => success('First promise was resolved'))
  .catch((err) => error(err.message));

secondPromise.then(() => success('Second promise was resolved'));

thirdPromise.then(() => success('Third promise was resolved'));
