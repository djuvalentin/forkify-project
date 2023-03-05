import icons from '../../img/icons.svg';
import { createFragmet } from '../helpers';

export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to rendered
   * @param {boolean} [render=true]  If false, return the markup instead of rendering it
   * @returns {undefined | string} A markup string is retuned if render=false
   * @this {Object} View instance
   */
  render(data, render = true) {
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clearContainer();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
  /**
   * Updates the existing DOM element using the recieved object
   * @param {Object | Object[]} data The data that's used to update the DOM element
   * @this {Object} View instance
   */
  update(data) {
    this._data = data;
    const markup = this._generateMarkup();

    const currentElementsList = Array.from(
      this._parentContainer.querySelectorAll('*')
    );

    const newElementsList = Array.from(
      createFragmet(markup).querySelectorAll('*')
    );

    currentElementsList.forEach((el, i) => {
      if (el.classList.contains('recipe__user-generated')) {
      }
      if (!el.isEqualNode(newElementsList[i])) {
        const newEl = newElementsList[i];
        if (el.firstChild?.nodeValue.trim()) el.textContent = newEl.textContent;

        Array.from(el.attributes).forEach((att, i) => {
          el.setAttribute(newEl.attributes[i].name, newEl.attributes[i].value);
        });
      }
    });
  }
  renderError(message = this._errorMessage) {
    this._clearContainer();

    const markup = this.#generateMessgeMarkup(message, true);

    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    this._clearContainer();

    const markup = this.#generateMessgeMarkup(message);
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
  /**
   * Generates a markup message
   * @param {String} message The message to be rendered
   * @param {boolean} [error=false] If true, render an error styled message
   * @returns {String} The message markup
   */
  #generateMessgeMarkup(message, error = false) {
    return `
    <div class="${error ? 'error' : 'message'}">
      <div>
        <svg>
          <use href="${icons}#${
      error ? 'icon-alert-triangle' : 'icon-smile'
    }"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;
  }

  _clearContainer() {
    this._parentContainer.textContent = '';
  }

  loadSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;

    this._clearContainer();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
  /**
   * Pushes the recipe ID into the URL's hash
   * @param {String} id ID of the recipe to be pushed into the URL
   */
  updatePageURL(id) {
    const hash = id ? `#${id}` : '#';
    window.history.pushState(null, '', `${hash}`);
    // window.location.hash = `${id}`;
  }
}
