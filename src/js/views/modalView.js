import View from './View.js';

export default class ModalView extends View {
  _overlay = document.querySelector('.overlay');

  toggleModalWindow() {
    this._overlay.classList.toggle('hidden');
    this._parentContainer.classList.toggle('hidden');
  }
  hideModalWindow() {
    this._overlay.classList.add('hidden');
    this._parentContainer.classList.add('hidden');
  }
}
