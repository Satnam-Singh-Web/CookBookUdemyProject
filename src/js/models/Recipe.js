import axois from axois;
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    asyn getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rID=${this.id}`);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }
}