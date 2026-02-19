import { createCrud } from './crud';

const crud = createCrud('/api/inventory');

export const getInventory = crud.get;
export const createInventoryItem = crud.create;
export const updateInventoryItem = crud.update;
export const deleteInventoryItem = crud.delete;
