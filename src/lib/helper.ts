import { ITEMS_PER_PAGE } from "./constants";

export const getPageCount = (itemCount: number) => {
    return Math.ceil(itemCount/ITEMS_PER_PAGE);
}
