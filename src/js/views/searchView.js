import View from './View.js';

class SearchView extends View {
  #form = document.querySelector('.search');
  constructor() {
    super();
  }

  /**
   * Calls the handler function after submiting the search query
   * @param {Function} handler The callback that get's called on submit
   * @this {Object} SearchView instance
   */
  addHandlerRender(handler) {
    this.#form.addEventListener('submit', function (e) {
      e.preventDefault();

      const searchField = this.querySelector('.search__field');
      const query = searchField.value;
      searchField.value = '';
      searchField.blur();
      handler(query);
    });
  }
}

export default new SearchView();
