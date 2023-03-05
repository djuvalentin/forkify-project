import { TIMEOUT_SEC } from './config';

/**
 * Returns a DOM element created from the HTML markup passed in as an argument
 * @param {String} htmlSring HTML markup to create the DOM element from
 * @returns {HTMLElement} DOM element
 */
export const createFragmet = function (htmlSring) {
  return document.createRange().createContextualFragment(htmlSring);
};

/**
 * Delays the next line of execution in an async function by the numbers of seconds entered as an argument
 * @param {Number} s A positive number that represents the number of seconds
 * @returns {Promise} A promise that resolves after the specified number of seconds
 */
export const wait = function (s) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, s * 1000);
  });
};

/**
 * Rejects after a specified number of seconds passed into the function as an argument
 * @param {Number} s Number of seconds after which the promise get's rejected
 * @returns {Promise} A Promise that rejects after the specified number of seconds
 */
export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Makes an AJAX call with the JSON format and returns a Promise with the resolved value of the parsed response. The resolved value is a JS Object
 * @param {String} url The URL of the AJAX call
 * @param {String} [method='GET'] 'GET' | 'POST' | 'DELETE'
 * @param {undefined | Object} data Only required when using the 'POST' method
 * @returns {Promise} Promise with the resolved value of JS Object
 */
export const AJAXCall = async function (url, method = 'GET', data = undefined) {
  try {
    const options = data
      ? {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      : {};
    options.method = method;

    const response = await Promise.race([
      fetch(url, options),
      timeout(TIMEOUT_SEC),
    ]);

    if (method === 'DELETE' && response.ok) return;

    const responseData = await response.json();

    if (!response.ok) throw new Error(responseData.message);

    return responseData;
  } catch (err) {
    throw err;
  }
};
