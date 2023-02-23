import { Router } from "express";
import { ProductRecords } from "../records/product.records";
import { GoodsRecords } from "../records/goods.records";

import { downloadFromS3, getS3FilesList } from "../utils/aws-s3";
import { Readable } from "stream";
export const viewRouter = Router();

viewRouter
  .get("/products", async (req, res) => {
    res.status(200).json(await ProductRecords.getAllProducts());
  })
  .get("/products/:id", async (req, res) => {
    res.status(200).json(await ProductRecords.getOneProduct(req.params.id));
  })
  .get("/products-goods-issue-frequently", async (req, res) => {
    res
      .status(200)
      .json(await ProductRecords.getMostFrequentlyIssuedProducts());
  })
  .get("/products-goods-reception-frequently", async (req, res) => {
    res
      .status(200)
      .json(await ProductRecords.getMostFrequentlyOrderedProducts());
  })
  .get("/products-goods-issue-recently", async (req, res) => {
    res.status(200).json(await ProductRecords.getRecentlyIssuedProducts());
  })
  .get("/products-goods-reception-recently", async (req, res) => {
    res.status(200).json(await ProductRecords.getRecentlyOrderedProducts());
  })
  .get("/details/:id", async (req, res) => {
    const goodsIssue = await GoodsRecords.getProductDetailGoodsIssue(
      req.params.id
    );
    const goodsReception = await GoodsRecords.getProductDetailGoodsReception(
      req.params.id
    );

    res.status(200).json({
      goodsIssue,
      goodsReception,
    });
  })
  .get("/download/:filename", async (req, res) => {
    const listFilesFromBucket = await getS3FilesList();
    const existInBucket = listFilesFromBucket.filter((file) =>
      file.includes(req.params.filename)
    );

    if (existInBucket.length === 0) {
      res
        .status(404)
        .send("Dla tego produktu nie istnieje karta charakterystyki");
      return;
    }

    const data = await downloadFromS3(req.params.filename);
    const file = data.Body as Readable;
    res.attachment(req.params.filename);
    file.pipe(res);
  });
