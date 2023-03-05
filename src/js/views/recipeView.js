import View from './View.js';
import icons from '../../img/icons.svg';
import fracty from '../../../node_modules/fracty/fracty.js';

class RecipeView extends View {
  _parentContainer = document.querySelector('.recipe');
  _errorMessage = '💥 Unable to load recipe';
  _message = 'Recipe deleted successfully!';

  constructor() {
    super();
    // this.#addHandlerToggleUserIcon();
  }

  /**
   * Loops over the array of ingredients, creates a markup for each, then joins all the markups into one string and returns it
   * @returns {String} Markup string of all the ingredients
   * @this {Object} RecipeView instance
   */
  _generateIngredientsMarkup() {
    return this._data.ingredients
      .map(
        ing => `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              Number.isFinite(ing.quantity) ? fracty(ing.quantity) : ''
            }</div>
            <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
            </div>
        </li>`
      )
      .join('');
  }
  _generateMarkup() {
    return `
        <figure class="recipe__fig">
            <img src="${this._data.imageUrl}" alt="${
      this._data.title
    }" class="recipe__img" />
                <h1 class="recipe__title">
                    <span>${this._data.title}</span>
                </h1>
        </figure>
        
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="${icons}#icon-clock"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${
                  this._data.cookingTime
                }</span>
                <span class="recipe__info-text">minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="${icons}#icon-users"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${
                  this._data.servings
                }</span>
                <span class="recipe__info-text">servings</span>

                <div class="recipe__info-buttons">
                    <button data-update-to="${
                      this._data.servings - 1
                    }" class="btn--tiny btn--servings btn--decrease-servings">
                        <svg>
                            <use href="${icons}#icon-minus-circle"></use>
                        </svg>
                    </button>
                    <button data-update-to="${
                      this._data.servings + 1
                    }" class="btn--tiny btn--servings btn--increase-servings">
                        <svg>
                            <use href="${icons}#icon-plus-circle"></use>
                        </svg>
                    </button>
                </div>
            </div>
        
            <div class="recipe__user-generated">
            ${
              this._data.key
                ? `<button class="recipe__delete-button">
                    <svg class="user__icon"><use href="${icons}#icon-user"></use></svg>
                    <svg class="alert-circle__icon"><use href="${icons}#icon-minus-circle"></use></svg>
                  </button>`
                : ''
            }
            </div>
                <button class="btn--round btn--bookmark">
                    <svg class="">
                        <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
                    </svg>
                </button>
            </div>
        
            <div class="recipe__ingredients">
                <h2 class="heading--2">Recipe ingredients</h2>
                <ul class="recipe__ingredient-list">
                    ${this._generateIngredientsMarkup()}
                </ul>
            </div>
        
        <div class="recipe__directions">
            <h2 class="heading--2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__publisher">${
                  this._data.publisher
                }</span>. Please check out
                directions at their website.
            </p>
            <a class="btn--small recipe__btn" href="${
              this._data.sourceUrl
            }"target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </a>
        </div>`;
  }
  /**
   * Calls the handler function on page load or url hashchange and passing in a ID as an argument
   * @param {Function} handler The callback that get's called on page load or hashchange
   */
  addHandlerRender(handler) {
    ['load', 'hashchange'].forEach(ev =>
      window.addEventListener(ev, function () {
        if (!window.location.hash) return;
        const id = window.location.hash.substring(1);
        handler(id);
      })
    );
  }
  /**
   * Calls the handler function on one of the 'servings' button click
   * @param {Function} handler The callback that get's called when a 'servings' button gets clicked
   * @this {Object} RecipeView instance
   */
  addHandlerServings(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--servings');
      if (!btn || +btn.dataset.updateTo < 1) return;
      handler(+btn.dataset.updateTo);
    });
  }
  /**
   * Calls the handler function on a 'bookmark' button click
   * @param {Function} handler callback that get's called after clicking on the 'bookmark' button
   * @this {Object} RecipeView instance
   */
  addHandlerBookmarkRecipe(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
  /**
   * Calls the handler function on a 'delete recipe' button click
   * @param {Function} handler Callback that get's called when the 'delete recipe' button is clicked
   * @this {Object} RecipeView instance
   */
  addHandlerDeletePrompt(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.recipe__delete-button');
      if (!btn) return;
      handler();
    });
  }

  //FIXME: After mouseover the user icon, the bookmark button doesn't work properly
  // because the update method from the View can update this element

  //UPDATE: FIXED, implemented using css. Leaving just in case until everything gets tested
  // TODO: after tested - remove the function below and remove the constructor call

  // /**
  //  * Toggles between the user and the minus icons on the rendered recipe
  //  * @this {Object} RecipeView instance
  //  */
  // #addHandlerToggleUserIcon() {
  //   this._parentContainer.addEventListener('mouseover', function (e) {
  //     const btn = e.target.closest('.recipe__delete-button');
  //     if (!btn) return;
  //     btn.querySelector('.user__icon').classList.add('hidden');
  //     btn.querySelector('.alert-circle__icon').classList.remove('hidden');
  //   });
  //   this._parentContainer.addEventListener('mouseout', function (e) {
  //     const btn = e.target.closest('.recipe__delete-button');
  //     if (!btn) return;
  //     btn.querySelector('.user__icon').classList.remove('hidden');
  //     btn.querySelector('.alert-circle__icon').classList.add('hidden');
  //   });
  // }
}

export default new RecipeView();
