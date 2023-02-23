import { GoodsEntity } from "./goods.entity";

export type CreateProductGoods = Omit<GoodsEntity, "date">;
