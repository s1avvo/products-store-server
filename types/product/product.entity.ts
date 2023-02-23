export interface ProductEntity {
  id: string;
  name: string;
  secondName: string;
  qty: number;
  unit: string;
  place: string;
  productDataSheet: number;
  active: number;
  createdAt?: string;
}

export type NewProductEntity = Omit<ProductEntity, "id" | "createdAt">;
