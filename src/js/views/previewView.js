import View from './View';
import icons from '../../img/icons.svg';

class PreviewView extends View {
  _generateMarkup() {
    return `
          <li class="preview">
            <a class="preview__link ${
              this._data.id === window.location.hash.substring(1)
                ? 'preview__link--active'
                : ''
            }" href="#${this._data.id}">
                <figure class="preview__fig">
                <img src="${this._data.imageUrl}" alt="${this._data.title}" />
                </figure>
                <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
                
                ${
                  this._data.key
                    ? `<div class="preview__user-generated"><svg><use href="${icons}#icon-user"></use></svg></div>`
                    : ''
                }
                
                </div>
            </a>
            </li>`;
  }
}

export default new PreviewView();
