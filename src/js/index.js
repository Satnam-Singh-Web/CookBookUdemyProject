// https://www.food2fork.com/api/search
//6f9c0cce0f49620d1933ecaf6afac9a2
import Search from './models/Search';
import Recipe from './models/Recipe'
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
/**
 * Global state of the app
 * --Search object
 * --Current recipe object
 * --Shopping lisst object
 * --Liked recipes
 */
const state = {};

const controlSearch = async() => {
    //1. query from the view
    const query = searchView.getInput();

    console.log(query);
    if (query) {
        //2. new search object and add to state
        state.search = new Search(query);
        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            //4. Search for recipes
            await state.search.getResults();
            //5. Render result on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
            clearLoader();
        }
    }
};
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

// const recipe = new Recipe(46956);
// recipe.getRecipe();
// console.log(recipe);
const controlRecipe = async() => {
    const id = window.location.hash.replace('#', '');
    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //Create new recipe object
        state.recipe = new Recipe(id);
        try {

            //Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate servings and time 
            state.recipe.calcTime();
            state.recipe.calcServing();
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error);
        }

    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));