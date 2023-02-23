import { ProductEntity } from "./product.entity";

export interface CreateProduct extends Omit<ProductEntity, "id" | "qty"> {
  id?: string;
}

export interface QtyUpdate {
  id: string;
  qty: number;
}

export interface DataSheetUpdate {
  id: string;
  productDataSheet: number;
}
