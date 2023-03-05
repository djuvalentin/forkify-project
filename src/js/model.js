import { AJAXCall, timeout } from './helpers.js';
import { API_KEY, TIMEOUT_SEC, RESULTS_PER_PAGE, API_URL } from './config.js';

export const state = {
  search: {
    results: [],
    query: '',
    page: 1,
    resPerPage: RESULTS_PER_PAGE,
  },
  recipe: {},
  bookmarks: [],
};
const createRecipeObject = function (recipe) {
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    bookmarked: state.bookmarks.some(b => b.id === recipe.id) ? true : false,
    ...(recipe.key && { key: recipe.key }),
  };
};

const createUploadObject = function (data) {
  try {
    const recipe = Object.fromEntries(data.entries());

    const ingredients = Array.from(data.entries())
      .filter(input => input[0].includes('ingredient') && input[1] != '')
      .map(input => {
        const ings = input[1].split(',').map(value => value.trim());
        if (ings.length != 3)
          throw new Error(
            'Invalid fromat. Please try again using `Quantity, Unit, Descritpion` type format.'
          );

        const [quantity, unit, description] = ings;
        return {
          quantity: +quantity || null,
          unit,
          description,
        };
      });

    return {
      ingredients: ingredients,
      title: recipe.title,
      source_url: recipe.sourceUrl,
      image_url: recipe.image,
      publisher: recipe.publisher,
      servings: +recipe.servings,
      cooking_time: +recipe.cookingTime,
    };
  } catch (err) {
    throw err;
  }
};

const updateLocalStorage = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
const clearLocalStorage = function () {
  localStorage.clear();
};

/**
 * Get's the recipe with the same ID as provided from the API and stores it in the state
 * @param {String} id The ID of the recipe
 */
export const getRecipe = async function (id) {
  try {
    const data = await AJAXCall(`${API_URL}/${id}?key=${API_KEY}`);

    const { recipe } = data.data;
    state.recipe = createRecipeObject(recipe);
  } catch (err) {
    throw err;
  }
};

/**
 * Get's search results for the provided query from the API and stores them in the state
 * @param {String} query Search query
 */
export const getSearchResults = async function (query) {
  try {
    const data = await AJAXCall(`${API_URL}?search=${query}&key=${API_KEY}`);

    if (!data.results) {
      state.search.results = [];
      state.search.query = query;
      throw new Error(`No search results for your query: '${query}'`);
    }

    const { recipes } = data.data;

    // Store data in state
    state.search.results = recipes.map(result => {
      return {
        publisher: result.publisher,
        imageUrl: result.image_url,
        title: result.title,
        id: result.id,
        ...(result.key && { key: result.key }),
      };
    });

    state.search.query = query;
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

/**
 * Returns a part of the search results array that should be rendered depending on the page number passed in as an argument
 * @param {Number} page The number of the page of the search results to be rendered
 * @returns {Array} Array of search results to be rendered depending on the number of the page provided
 */
export const getSearchResultsPage = function (page = state.search.page) {
  const start = (page - 1) * state.search.resPerPage;
  const end = page * state.search.resPerPage;

  state.search.page = page;
  return state.search.results.slice(start, end);
};

/**
 * Changes the number of servings of the current recipe in the state
 * @param {Number} newServings The new number of servings
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    if (ing.quantity)
      ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

export const bookmark = function (recipe = state.recipe) {
  recipe.bookmarked = true;
  state.bookmarks.push(recipe);

  updateLocalStorage();
};

export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  if (index < 0) return;

  state.recipe.bookmarked = false;
  state.bookmarks.splice(index, 1);

  updateLocalStorage();
};

export const restoreLocalStorage = function () {
  state.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
};

/**
 * Uploads a recipe object created from the input data to the API. Then the returned recipe object get's stored into the state
 * @param {FormData} inputData a FormData Object
 */
export const uploadRecipe = async function (inputData) {
  try {
    const uploadObject = createUploadObject(inputData);
    const data = await Promise.race([
      AJAXCall(`${API_URL}?key=${API_KEY}`, 'POST', uploadObject),
      timeout(TIMEOUT_SEC),
    ]);
    if (data.status === 'fail') throw new Error(data.message);

    const { recipe } = data.data;
    state.recipe = createRecipeObject(recipe);
  } catch (err) {
    throw err;
  }
};

/**
 * Deletes the recipe with the same ID provided from the API. Works only if the recipe is user-created
 * @param {String} id Recipe ID
 */
export const deleteUserRecipe = async function (id) {
  try {
    await AJAXCall(`${API_URL}/${id}?key=${API_KEY}`, 'DELETE');
  } catch (err) {
    throw err;
  }
};

const init = function () {
  restoreLocalStorage();
};

init();
// clearLocalStorage();
