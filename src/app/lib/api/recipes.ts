import { createCrud } from './crud';

const crud = createCrud('/api/recipes');

export const getRecipes = crud.get;
export const createRecipe = crud.create;
export const updateRecipe = crud.update;
export const deleteRecipe = crud.delete;
