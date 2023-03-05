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
///////////////////////////////////////

// GUIDE:
// forkify-v2.netlify.app
// 1 Write user stories. Fromat:
//   As a [type of user] I want [an action] so that [a beneit]
// 2 Come up with the features of the app (functionalities)
// 3 Create a flowchart part 1: search, click on pagination button,
//   select recipe, page loads with recipe id
// 4 Create package.json, delete the "main" propery. Setup a scripts and run parcel
// 5 Install parcel (as dev-dependecy) and run it
// 6 In index.html replace defer with type="module" in the <script> tag
// 7 Load a recipe from API (page: forkify-api.herokuapp.com/v2)
// 8 Handle error if ID not found
// 9 Render recipe
// 10 Implement loading spinner
// 11 Implement polyfilling
// 12 Implement event listening for hash change
// 13 Implement listen for the load event
//    (make sure to handle if there's no hash on page load)
// 14 Refactor for MVC
// 15 Implement fractions (fractional, fracty).
// 16 After refactoring, check the original architecture to compare because
// the rest of the code is going to be based on this.
// 17 Implement the configuration and helper modules
// 18 Implement a request time out
// 19 Implement real workld error message
// 20 A default error message will be stored in all the views
// 21 Get search results data
// 22 Connect with the controller
// 23 Get input query
// 24 Create resultsView.js. before configurating refactor with a View parent class
// 25 Handle error if no results for query found
// 26 Implement pagination buttons
// 27 Refactor the code with a new generateMarkupButton function
// 28 Add event listeners to these buttons
// 29 Return to the flowchart, implement new features (change servings, bookmarks
//    store bookmarks, on page load - read saved bookmarks)
// 30 Implement update servings function
// 31 Connect the buttons
// 32 Handle servings can't be < 1
// 33 Implement the update function to update DOM only where necessary.
//    Make sure it's located in the View parent class because it's going to be needed
//    In multiple places. Also make sure that the function is wokring with the data pirvate property
//    The function receives some data (that need's changing) then #data = data
//    And then work with the #data property.
// 34 Use the same function to update the search results view highlighting the
//    current viewing recipe
// 35 check if the page number resets after a search
// 36 Implement bookmarks: bookmark button
// 37 Add the btn--bookmark class to the button in markup and work with that
// 38 Make the button icon keep filled state after switching to another recipe
//    and than back to the bookmarked one (by checking if the bookmark is already
//    stored in the bookmark array)
// 39 Unbookmark
// 40 Implement bookmarks preview. Simiral code to the resultsView so just copy
///  everything for a start
// 41 check if the bookmarks view is updating the highlights according to the
//    current recipe in view
// 42 Implement a child preview view - previewView (a child for the results view
//    and bookmarks view). This will neeed refactoring. Basically the
//    _generateMarkupPreview() moves to the previewView, and the _generateMarkup
//     needs to be refactored. You can't use the generateMarkupPreview direcly in
//    generateMarkup function because the #data needs to be set first, so there's
//    a need for calling the render() function which sets the #data property. This
//    will also need refactoring the render() to recieve a argument render = true
//    if the argument if false then return the markup string and not render.
// 43 Store bookmarks in local storage. No need to export the function because it
//    can be called in the other two function (add and delete)
// 44 To i the data on load use an init() function. There's probaly going
//    to be an error because of the updating. The app tries to update bookmarks
//    But they need to be rendered first
// 45 Implement clearBookmarks() function to empty local storage during the dev
//    faze
// 46 Create a new view for addingg a new recipe. It's a bit different because
//    the window exist just that it's hidden. Parent element should be .upload
//    because it's the main element we are interested in
// 47 Button listener should be implemented the same way using a addHandler
//    function to make it consistent. This function won't be called in controler.js
//    but in the constructor funtion of the class. Don't foret super() because it's
//    a child class we are working in. Might get an error because of the this keyword
//    in the eddEventListener
// 48 Configure the upload button. Get all the data using the form data API
// 49 We need to get the data to the model.js because the API call happen there.
//    Use the publisher-subscriber to pass the data to the controler.js
// 50 Convert data of entries to an object
// 51 Make an uploadRecipe data in model.js
// 52 Format the data from the form
// 53 Make sure to compare with the receiving data to match the type of values as well
// 54 Make sure if our app splits the ingredient entry by comas (,) that there
//    are 3 parts (make sure the input is correct). The error should be caught and
//    propagated down to eventualy gets displayed to the UI. Also make sure to manage
//    the whitespace here and check with a ingredient name that consist of 2 or
//    more words
// 55 Create a sendJSON helper function
// 56 After sending the data, the API will immediately return the data so it again
//    needs to be reformated to camelCase. Since we are doiing this when getting]
//    the data already, create a separate function createRecipeObject
// 57 Make sure to also store the API key if there's one
// 58 Bookmark and Render that new recipe to the recipeView after uploading
// 59 Render a success message and close the modal window after 2 seconds
// 60 Implement the loading spinner
// 61 Change the url in the browser after loading the new recipe and re-render
//    bookmarks
// 62 Refactor getJSON and sendJSON - AJAX function (url, uploadData = undefined)
// 63 Change the URL's so when getting the search results it also gets user's recipes
// 64 Mark user's recipes with the user icon
// 65 Make sure the user icon displays also in the resultsView
// 66 Createa some documentation

// TODO for later:
// Remove comments
// Update flowchart and architechture and update them here

// CHALLANGES
// 1. Display the number of pages between the pagination buttons
// 2. ability,for the user to sort the search results by the duration or by the
//    number of ingredients of the found recipes. (check video first) This might
//    not be nice to impelemnt if there is no specific info during the api call
// 3. Ingredient validation in view, before submitting the form
// 4. Improve recipe igredient input: separate in multiple fields and allow more than
//    6 ingredients;

// Harder

//1. shopping list feature - button on reipe to add ingredients to a list. See
//   the old course version
//2. Weekly meal plan - assing recipoes to the next 7 days and show on weekly calendar
//3. Get nutrition data: on each ingredient from snoopacular API
//   (https://spoonacular.com/food-api) and calculate total calories

/////////////USER STORIES//////////////////

// 1. As a user, I want to search for recipes so that I can browse through the the list
// 2. As a user, I want to see recipe previews on the search list so I can easily find what I need.
// 3. As a user, I want to select a recipe from the search list so that I can see the full overview of the recipe.
// 4. As a user, I want to be able to change the serving size, so I can see the updated amount of ingredient quantity.
// 4. As a user, I want to bookmark recepies so that I can review them later.
// 5. As a user, I want to add new recipes so that I have all my recipes at one place
// 6. As a user, I want to be able to remove the recipes that I uploaded, so that I can get rid of any recipe mistakes.

////////////////FEATERURES/////////////////

// Search bar
// List of search results with previews
// Preview of the selected recipe
// Add/remove bookmark button
// New recipe Upload form
