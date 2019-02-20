// https://www.food2fork.com/api/search
//6f9c0cce0f49620d1933ecaf6afac9a2
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Likes from './models/Likes';

/**
 * Global state of the app
 * --Search object
 * --Current recipe object
 * --Shopping lisst object
 * --Liked recipes
 */
const state = {};
window.state = state;

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

        //Highlight selected recipe
        if (state.search) {
            searchView.highlightSelected(id);
        }
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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (error) {
            console.log(error);
        }

    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

const controlList = () => {

    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

};

//Handle delete and update  list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delte from state
        state.list.deleteItem(id);

        //Delete from Ui
        listView.deleteItem(id);
    } //Update the count  
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});
/** 
 *
 * List Controller
 *
 */
state.likes = new Likes();

likesView.toggleLikeMenu(state.likes.getNumberLikes());
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // user has not liked current recipe
    if (!state.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,

        );
        //Toogle the like button
        likesView.toggleLikedBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);
        console.log(state.likes);
        //User has liked current recipe
    } else {
        //remove like to the state
        state.likes.deleteLike(curretntID);
        //Toggle the like button
        likesView.toggleLikedBtn(false);


        //remove from the UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumberLikes());
};

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-dec,.btn-dec *')) {
        if (state.recipe.serving > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-inc,.btn-inc *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }

});