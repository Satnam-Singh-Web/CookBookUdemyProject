// https://www.food2fork.com/api/search
//6f9c0cce0f49620d1933ecaf6afac9a2
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView'
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
        //4. Search for recipes
        await state.search.getResults();
        //5. Render result on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}
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