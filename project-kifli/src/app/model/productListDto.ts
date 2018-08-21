import { Product } from "./product";
import { Category } from "./category";

export class ProductListDto {
    products: Product[];
    categories: Category[];
    page: number;
    totalPages: number;
}
