import { Router } from "express";
import { ProductRecords } from "../records/product.records";
import { GoodsRecords } from "../records/goods.records";
import { verifyToken } from "../utils/auth";

import { getS3FilesList, uploadToS3 } from "../utils/aws-s3";
import { UploadedFile } from "express-fileupload";
import { ValidationErrors } from "../utils/errors";

export const listRouter = Router();

listRouter
  .post("/add", verifyToken, async (req, res) => {
    const product = new ProductRecords(req.body);
    await product.insertProduct();

    res.status(201).json(product);
  })
  .post("/goods-issue/:productId", verifyToken, async (req, res) => {
    const { amount, productId } = req.body;

    const goods = new GoodsRecords(req.body);
    const id = await goods.insertGoodsIssue();

    if (id !== undefined)
      await GoodsRecords.updateQtyGoodsIssue(amount, productId);

    res.status(200).json(id);
  })
  .post("/goods-reception/:productId", verifyToken, async (req, res) => {
    const { amount, productId } = req.body;

    const goods = new GoodsRecords(req.body);
    const id = await goods.insertGoodsReception();

    if (id !== undefined)
      await GoodsRecords.updateQtyGoodsReception(amount, productId);

    res.status(200).json(id);
  })

  .put("/update", verifyToken, async (req, res) => {
    const product = new ProductRecords(req.body);
    await product.updateProduct();
    res.status(200).json(product);
  })
  .delete("/delete", verifyToken, async (req, res) => {
    const product = await ProductRecords.getOneProduct(req.body.id);
    if (!product) throw new ValidationErrors("Product does not exist!");
    await product.deleteProduct();
    res.end();
  })
  .post("/upload/:productId", verifyToken, async (req, res) => {
    const uploaded = req.files.uploaded as UploadedFile;

    if (!uploaded || Object.keys(req.files).length === 0) {
      res.status(400).send("Plik nie został załadowany!");
      return;
    }

    const listFilesFromBucket = await getS3FilesList();
    const existInBucket = listFilesFromBucket.filter((file) =>
      file.includes(uploaded.name)
    );

    if (existInBucket.length > 0) {
      res.send("Dla tego produktu już istnieje karta charakterystyki.");
      return;
    }

    await uploadToS3(uploaded);

    res.json({ ok: "Plik został załadowany." });
  });
