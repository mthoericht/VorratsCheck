import { createCrud } from './crud';

const crud = createCrud('/api/wishlist');

export const getWishlist = crud.get;
export const createWishlistItem = crud.create;
export const updateWishlistItem = crud.update;
export const deleteWishlistItem = crud.delete;
