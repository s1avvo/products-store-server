import { v4 as uuid } from "uuid";
import { pool } from "../utils/db";
import { FieldPacket, RowDataPacket } from "mysql2";
import { GoodsEntity } from "../types";
import { ValidationErrors } from "../utils/errors";

type GoodsRecordsResult = [GoodsRecords[], FieldPacket[]];

const date = new Date();
const offset = date.getTime() - date.getTimezoneOffset() * 60000;
const dateTimeNow = new Date(offset).toISOString();
export class GoodsRecords implements GoodsEntity {
  public readonly idItem?: string;
  public amount: number;
  public readonly date: string;
  public readonly person: string;
  public readonly productId: string;

  constructor(obj: GoodsEntity) {
    const { idItem, amount, person, date, productId } = obj;

    this.idItem = idItem ?? uuid();
    this.amount = amount;
    this.date = date ?? dateTimeNow;
    this.person = person;
    this.productId = productId;
  }

  // static async _load(): Promise<GoodsRecords[]> {
  //   const data = await readFile("data/amount.json", "utf8");
  //
  //   return JSON.parse(data).map((prod: any) => {
  //     if (prod.minus > 0)
  //       return new GoodsRecords({
  //         ...prod,
  //         idItem: prod.id,
  //         amount: prod.minus,
  //         date: prod.data,
  //       });
  //   });
  // }

  async insertGoodsIssue(): Promise<string> {
    await pool.execute(
      "INSERT INTO `goods_issue` VALUES(:idItem, :amount, :date, :person, :productId)",
      this
    );

    return this.productId;
  }

  async insertGoodsReception(): Promise<string> {
    await pool.execute(
      "INSERT INTO `goods_reception` VALUES(:idItem, :amount, :date, :person, :productId)",
      this
    );

    return this.productId;
  }

  static async updateQtyGoodsIssue(
    amount: number,
    productId: string
  ): Promise<number> {
    const [result] = (await pool.execute(
      "UPDATE `products` SET `qty` = `qty` - :qty WHERE `id`= :productId",
      {
        productId,
        qty: amount,
      }
    )) as RowDataPacket[];

    if (result.affectedRows === 0)
      throw new ValidationErrors(`GoodsIssue update failed!`);

    return result.affectedRows;
  }

  static async updateQtyGoodsReception(
    amount: number,
    productId: string
  ): Promise<void> {
    const [result] = (await pool.execute(
      "UPDATE `products` SET `qty` = `qty` + :qty WHERE `id`= :productId",
      {
        productId,
        qty: amount,
      }
    )) as RowDataPacket[];

    if (result.affectedRows === 0)
      throw new ValidationErrors(`GoodsReception update failed!`);

    return result.affectedRows;
  }

  static async getProductDetailGoodsIssue(id: string): Promise<GoodsRecords[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `goods_issue` WHERE `productId` = :id",
      {
        id,
      }
    )) as GoodsRecordsResult;

    return results.map((obj) => new GoodsRecords(obj));
  }

  static async getProductDetailGoodsReception(
    id: string
  ): Promise<GoodsRecords[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `goods_reception` WHERE `productId` = :id",
      {
        id,
      }
    )) as GoodsRecordsResult;

    return results.map((obj) => new GoodsRecords(obj));
  }
}