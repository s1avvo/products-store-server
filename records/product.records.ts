import { v4 as uuid } from "uuid";
import { pool } from "../utils/db";
import { FieldPacket } from "mysql2";
import { ProductEntity } from "../types";
import { ValidationErrors } from "../utils/errors";

type ProductRecordsResult = [ProductRecords[], FieldPacket[]];

export class ProductRecords implements ProductEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly secondName: string;
  public qty: number;
  public readonly place: string;
  public readonly unit: string;
  public readonly productDataSheet: number;
  public readonly active: number;
  public readonly createdAt: string;

  constructor(obj: ProductEntity) {
    const {
      id,
      name,
      secondName,
      qty,
      place,
      unit,
      productDataSheet,
      active,
      createdAt,
    } = obj;

    this.id = id ?? uuid();
    this.name = name;
    this.secondName = secondName;
    this.qty = qty ?? 0;
    this.unit = unit;
    this.place = place;
    this.productDataSheet = productDataSheet ?? 0;
    this.active = active ?? 1;
    this.createdAt = createdAt;
  }

  async insertProduct(): Promise<ProductEntity> {
    await pool.execute(
      "INSERT INTO `products` VALUES(:id, :name, :secondName,:qty, :unit, :place, :productDataSheet, :active, :createdAt)",
      this
    );
    return this;
  }

  async updateProduct() {
    if (!this.id) throw new ValidationErrors(`Wrong ID: ${this.id}`);

    await pool.execute(
      "UPDATE `products` SET `name` = :name, `secondName` = :secondName, `unit` = :unit, `place` = :place, `productDataSheet` = :productDataSheet, `active` = :active, `createdAt` = :createdAt WHERE `id`= :id",
      this
    );
  }

  async deleteProduct(): Promise<string> {
    if (!this.id) throw new ValidationErrors(`Wrong ID: ${this.id}`);

    await pool.execute("DELETE FROM `products` WHERE `id` = :id", {
      id: this.id,
    });

    return this.id;
  }

  static async getAllProducts(): Promise<ProductRecords[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `products` ORDER BY `name` ASC;"
    )) as ProductRecordsResult;

    return results.map((obj) => new ProductRecords(obj));
  }

  static async getOneProduct(id: string): Promise<ProductRecords> | null {
    const [results] = (await pool.execute(
      "SELECT * FROM `products` WHERE `id` = :id",
      {
        id,
      }
    )) as ProductRecordsResult;

    if (results.length === 0)
      throw new ValidationErrors(`Can't find this ID: ${id}`);

    return results.length === 0 ? null : new ProductRecords(results[0]);
  }

  static async getMostFrequentlyIssuedProducts(): Promise<ProductRecords[]> {
    const [results] = (await pool.execute(
      "SELECT `products`.*, count(*) as `count` FROM `products` JOIN `goods_issue` ON `products`.`id` = `goods_issue`.`productId` group by `products`.`id` ORDER BY `count` DESC LIMIT 25"
    )) as ProductRecordsResult;

    return results.map((obj) => new ProductRecords(obj));
  }

  static async getMostFrequentlyOrderedProducts(): Promise<ProductRecords[]> {
    const [results] = (await pool.execute(
      "SELECT `products`.*, count(*) as `count` FROM `products` JOIN `goods_reception` ON `products`.`id` = `goods_reception`.`productId` group by `products`.`id` ORDER BY `count` DESC LIMIT 25"
    )) as ProductRecordsResult;

    return results.map((obj) => new ProductRecords(obj));
  }

  static async getRecentlyIssuedProducts(): Promise<ProductRecords[]> {
    const [results] = (await pool.execute(
      "SELECT `products`.* FROM `products` JOIN `goods_issue` ON `products`.`id` = `goods_issue`.`productId` ORDER BY `goods_issue`.`date` DESC LIMIT 25"
    )) as ProductRecordsResult;

    return results.map((obj) => new ProductRecords(obj));
  }

  static async getRecentlyOrderedProducts(): Promise<ProductRecords[]> {
    const [results] = (await pool.execute(
      "SELECT `products`.* FROM `products` JOIN `goods_reception` ON `products`.`id` = `goods_reception`.`productId` ORDER BY `goods_reception`.`date` DESC LIMIT 25"
    )) as ProductRecordsResult;

    return results.map((obj) => new ProductRecords(obj));
  }
}
