import ModalView from './modalView';

class DeletePromptView extends ModalView {
  _parentContainer = document.querySelector('.delete-recipe-window');
  #btnConfirm = this._parentContainer.querySelector('.btn-confirm');
  #btnDeny = this._parentContainer.querySelector('.btn-deny');

  constructor() {
    super();
    this._addHandlerDeny();
  }
  /**
   * Calls the handler function after confirming recipe removal and closes the prompt window
   * @param {Function} handler The function that gets called on confirm button click
   * @this {Object} DeletePreviewView instance
   */
  addHandlerConfirm(handler) {
    this.#btnConfirm.addEventListener('click', e => {
      handler();
      this.toggleModalWindow();
    });
  }
  /**
   * Closes the prompt window without any actions
   * @this {Object} DeletePromptView instance
   */
  _addHandlerDeny() {
    this.#btnDeny.addEventListener('click', this.toggleModalWindow.bind(this));
  }
}

export default new DeletePromptView();
