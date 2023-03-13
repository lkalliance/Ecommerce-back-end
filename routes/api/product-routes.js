const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const prodData = await Product.findAll({ include: [{ model: Category }, { model: Tag }]});
    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err);
  } 
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const prodData = await Product.findByPk(req.params.id, { include: [{ model: Category }, { model: Tag }]});
    if (!prodData) {
      res.status(404).json({message: "No product found with that id!"});
      return;
    }
    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const prodData = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: prodData.id,
          tag_id
        }
      });
      await ProductTag.bulkCreate(productTagIdArr);
    } 
    res.status(200).json(prodData);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
    return;
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const prodData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    if (!prodData) {
      res.status(404).json({message: "No product found with that id!"});
      return;
    }
    
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id }});
    const productTagIds = productTags.map( ({ tag_id }) => tag_id );
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id
        }
      });
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
    const created = await ProductTag.bulkCreate(newProductTags);
    const removed = await ProductTag.destroy({ where: { id: productTagsToRemove }});
    res.status(200).json([created, removed])
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const prodData = await Product.destroy({
      where: {
        id: req.params.id,
      }
    });
    if (!prodData) {
      res.status(404).json({message: "No product found with that id!"});
      return;
    }
    res.status(200).json(prodData);
    return;
  } catch (err) {
    res.status(400).json(err);
    return;
  }
});

module.exports = router;
