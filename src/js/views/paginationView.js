import View from './View';

class PaginationView extends View {
  _parentContainer = document.querySelector('.pagination');

  _generateMarkup() {
    const currentPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resPerPage
    );

    // only one page
    if (numOfPages === 1) return '';

    // 1st page and there are others
    if (currentPage === 1) return this.#generateMarkupButton(currentPage, true);

    // last page
    if (currentPage === numOfPages)
      return this.#generateMarkupButton(currentPage);

    // if not 1st page and there are others
    if (currentPage != numOfPages)
      return this.#generateMarkupButton(currentPage).concat(
        this.#generateMarkupButton(currentPage, true)
      );
  }
  /**
   * Generates a pagination button markup depending on the type (previous/next), and the page that's currently rendered
   * @param {Number} currentPage The page that's currently rendered
   * @param {boolean} [next=true] If next=false generate markup for PREVIOUS page button, if next=true generate markup for NEXT page button
   * @returns {String} Button markup
   */
  #generateMarkupButton(currentPage, next = false) {
    return `
    <button data-goto-page="${
      next ? currentPage + 1 : currentPage - 1
    }" class="btn--inline pagination__btn--${next ? 'next' : 'prev'}">
        <svg class="search__icon">
        <use href="src/img/icons.svg#icon-arrow-left"></use>
        </svg>
        <span>Page ${next ? currentPage + 1 : currentPage - 1}</span>
    </button>
`;
  }
  /**
   * On pagination button click, calls the handler function passing in the number of the page to render
   * @param {Function} handler Callback that gets called when one of the pagination buttons is clicked
   * @this {Object} PaginationView instance
   */
  addHandlerRenderPage(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      handler(+btn.dataset.gotoPage);
    });
  }
}

export default new PaginationView();
