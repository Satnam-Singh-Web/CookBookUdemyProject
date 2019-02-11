import axios from 'axios';


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {

        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '6f9c0cce0f49620d1933ecaf6afac9a2';
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            //console.log(res);
            this.result = res.data.recipes;
            // console.log(this.results);
        } catch (error) {
            console.log(error);
        }
    }
}