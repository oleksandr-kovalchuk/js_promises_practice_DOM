'use strict';

document.addEventListener('contextmenu', (e) => e.preventDefault());

const showNotification = (message, type) => {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `<div class="${type}" data-qa="notification">${message}</div>`,
  );
};

const success = (message) => showNotification(message, 'success');
const error = (message) => showNotification(message, 'error');

const firstPromise = new Promise((resolve, reject) => {
  const clickHandler = (e) => {
    if (e.button === 0) {
      resolve();
      document.removeEventListener('click', clickHandler);
    }
  };

  document.addEventListener('click', clickHandler);

  setTimeout(() => {
    reject(new Error('First promise was rejected'));
    document.removeEventListener('click', clickHandler);
  }, 3000);
});

const secondPromise = new Promise((resolve) => {
  const clickHandler = (e) => {
    if (e.button === 0 || e.button === 2) {
      resolve();
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('contextmenu', clickHandler);
    }
  };

  document.addEventListener('click', clickHandler);
  document.addEventListener('contextmenu', clickHandler);
});

const thirdPromise = new Promise((resolve) => {
  let leftClickHappened = false;
  let rightClickHappened = false;

  const leftClickHandler = (e) => {
    if (e.button === 0) {
      leftClickHappened = true;
      checkBothClicks();
    }
  };

  const rightClickHandler = (e) => {
    if (e.button === 2) {
      rightClickHappened = true;
      checkBothClicks();
    }
  };

  const checkBothClicks = () => {
    if (leftClickHappened && rightClickHappened) {
      resolve();
      document.removeEventListener('click', leftClickHandler);
      document.removeEventListener('contextmenu', rightClickHandler);
    }
  };

  document.addEventListener('click', leftClickHandler);
  document.addEventListener('contextmenu', rightClickHandler);
});

firstPromise
  .then(() => success('First promise was resolved'))
  .catch((err) => error(err.message));

secondPromise.then(() => success('Second promise was resolved'));

thirdPromise.then(() => success('Third promise was resolved'));
