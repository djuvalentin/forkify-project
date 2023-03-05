import ModalView from './modalView';

class AddRecipeView extends ModalView {
  _parentContainer = document.querySelector('.add-recipe-window');
  _errorMessage = 'Unable to upload recipe';
  _message = 'Recipe uploaded successfully';
  #btnAdd = document.querySelector('.nav__btn--add-recipe');
  #btnCloseForm = document.querySelector('.btn--close-modal');
  #form = this._parentContainer.querySelector('form');

  constructor() {
    super();
    // Toggle Form
    this.#addHandlerToggleModal(
      this.#btnAdd,
      this.#btnCloseForm,
      this._overlay
    );
  }
  #addHandlerToggleModal(...els) {
    els.forEach(el =>
      el.addEventListener('click', this.toggleModalWindow.bind(this))
    );
  }
  /**
   * Collect the form data and calls the handler function by passing in the form data as an argument
   * @param {Function} handler The callback that's called with the form data
   * @this {Object} AddRecipeView instance
   */
  addHandlerSubmitForm(handler) {
    this.#form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get data
      const newRecipeData = new FormData(this);

      // Call  handler
      handler(newRecipeData);
    });
  }
  /**
   * Re-appends the form and the close-button to the parent element
   * @param {boolean} [clearFields=true] If false, do not clear the input fields
   * @this {Object} AddRecipeView instance
   */
  resetWindow(clearFields = true) {
    console.log(this);
    this._clearContainer();

    // Re-append children
    this._parentContainer.append(this.#btnCloseForm, this.#form);

    // Clear form input fields
    if (!clearFields) return;
    Array.from(this.#form.querySelectorAll('input')).forEach(
      input => (input.value = '')
    );
  }
}

export default new AddRecipeView();
