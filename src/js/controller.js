import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchResultsView from './views/searchResultsView.js';
import BookmarksView from './views/bookmarksView.js';
import SearchView from './views/searchView.js';
import PaginationView from './views/paginationView.js';
import AddRecipeView from './views/addRecipeView.js';
import DeletePromptView from './views/deletePromptView.js';
import { wait } from './helpers.js';
import { HIDE_MESSAGE_SEC, AESTETIC_WAIT_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

const controlRecipe = async function (id) {
  try {
    // Load spinner
    RecipeView.loadSpinner();

    // Get recipe data
    await model.getRecipe(id);

    // Render recipe
    RecipeView.render(model.state.recipe);

    // Update search results view
    model.state.search.results.length
      ? SearchResultsView.update(
          model.getSearchResultsPage(model.state.search.page)
        )
      : '';

    // Update bookmarks view
    model.state.bookmarks.length
      ? BookmarksView.update(model.state.bookmarks)
      : '';
  } catch (err) {
    RecipeView.renderError(`Recipe not found: ${err.message}`);
    console.error(`Recipe not found: ${err.message}`);
  }
};

const controlSearchResults = async function (query) {
  try {
    // Load spinner
    SearchResultsView.loadSpinner();
    // Get search results
    await model.getSearchResults(query);

    // Render search results
    SearchResultsView.render(model.getSearchResultsPage());

    // Render pagination buttons
    PaginationView.render(model.state.search);
  } catch (err) {
    console.error(err.message);

    SearchResultsView.renderError(err.message);

    // Remove pagination buttons
    PaginationView._clearContainer();
  }
};

const controlPagination = function (page) {
  // Render search results page
  SearchResultsView.render(model.getSearchResultsPage(page));

  // Render pagination buttons
  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings
  model.updateServings(newServings);

  // Update recipe view
  RecipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  // Add to or remove form bookmarks

  model.state.recipe.bookmarked
    ? model.removeBookmark(model.state.recipe.id)
    : model.bookmark(model.state.recipe);

  // Update recipe view
  RecipeView.update(model.state.recipe);
  // Render recipe preview in the bookmark view
  model.state.bookmarks.length
    ? BookmarksView.render(model.state.bookmarks)
    : BookmarksView.renderMessage();
};

const controlAddRecipe = async function (newRecipeData) {
  try {
    //  Load spinner
    AddRecipeView.loadSpinner();

    // Upload recipe
    await model.uploadRecipe(newRecipeData);

    // Update url
    RecipeView.updatePageURL(model.state.recipe.id);

    // Add recipe to bookmarks
    model.bookmark(model.state.recipe);

    // Render bookmarks
    BookmarksView.render(model.state.bookmarks);

    // Render Recipe
    RecipeView.render(model.state.recipe);

    // Render Success message
    AddRecipeView.renderMessage();

    // Hide add recipoe window
    await wait(HIDE_MESSAGE_SEC);
    AddRecipeView.hideModalWindow();

    // Reset form
    await wait(AESTETIC_WAIT_SEC);
    AddRecipeView.resetWindow();
  } catch (err) {
    console.error(err.message);

    AddRecipeView.renderError(`💥💥💥 Something went wrong: ${err.message}`);

    // Reset Form
    await wait(HIDE_MESSAGE_SEC);
    AddRecipeView.resetWindow(false);
  }
};

const controlDeletePrompt = function () {
  // Show Delete prompt window
  DeletePromptView.toggleModalWindow();
};

const controlDeleteUserRecipe = async function () {
  try {
    // delete recipe from API
    await model.deleteUserRecipe(model.state.recipe.id);

    // Remove recipe from bookmarks
    model.removeBookmark(model.state.recipe.id);

    // re-render Bookmarks
    model.state.bookmarks.length
      ? BookmarksView.render(model.state.bookmarks)
      : BookmarksView.renderMessage();

    // re-render Search results
    model.state.search.results.length
      ? controlSearchResults(model.state.search.query)
      : '';

    // Clear windows hash
    RecipeView.updatePageURL();

    // Render message
    RecipeView.renderMessage();
  } catch (err) {
    console.error(`💥💥 Deleting failed: ${err.message}`);
    RecipeView.renderError(`💥💥 Deleting failed: ${err.message}`);
  }
};

const init = function () {
  model.state.bookmarks.length && BookmarksView.render(model.state.bookmarks);

  RecipeView.addHandlerRender(controlRecipe);
  RecipeView.addHandlerServings(controlServings);
  RecipeView.addHandlerBookmarkRecipe(controlBookmark);
  RecipeView.addHandlerDeletePrompt(controlDeletePrompt);
  SearchView.addHandlerRender(controlSearchResults);
  PaginationView.addHandlerRenderPage(controlPagination);
  AddRecipeView.addHandlerSubmitForm(controlAddRecipe);
  DeletePromptView.addHandlerConfirm(controlDeleteUserRecipe);
};

init();
