const express = require("express");
const { Product } = require("../models/product");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");
const { isAdmin } = require("../middleware/auth");

//CREATE PRODUCT
router.post("/", isAdmin, async (req, res) => {
  const { name, brand, desc, price, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "onlineShop",
      })

      if (uploadRes) {
        const product = new Product({
          name,
          brand,
          desc,
          price,
          image: uploadRes,
        })
        const savedProduct = await product.save()

        res.status(200).send(savedProduct);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).send(products)
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Edit Product
router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.productImg) {
    try {
      const destroyResponse = await cloudinary.uploader.destroy(
        req.body.product.image.public_id
      );
      if (destroyResponse) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.productImg,
          {
            upload_preset: "onlineShop",
          }
        );
        if (uploadedResponse) {
          const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                ...req.body.product,
                image: uploadedResponse,
              },
            },
            { new: true }
          );
          res.status(200).send(updatedProduct);
        };
      };
    } catch (error) {
      res.status(500).send(err);
    };
  } else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body.product },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
})

//Delete
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found :( ");

    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );
      if (destroyResponse) {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedProduct);
      }
    } else {
      console.log("Action cancelled. Failed to delete product image.");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;