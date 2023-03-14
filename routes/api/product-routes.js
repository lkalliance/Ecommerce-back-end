const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

/* -- CRUD routes for "/api/products" -- */

router.get('/', async (req, res) => {
  try {
    // find and return all products, with categories and associated tags
    const prodData = await Product.findAll({ include: [{ model: Category }, { model: Tag }] });

    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err);
  } 
});

router.get('/:id', async (req, res) => {
  try {
    // find and return a single product, with categories and associated tags
    const prodData = await Product.findByPk(req.params.id, { include: [{ model: Category }, { model: Tag }] });

    if (!prodData) {
      // does a product exist with this id
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // add a new product and return the product added
    const prodData = await Product.create(req.body);

    if (req.body.tagIds.length) {
      // if tags are included, add them to the ProductTag table
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return { product_id: prodData.id, tag_id }
      });
      await ProductTag.bulkCreate(productTagIdArr);
    } 

    res.status(200).json(prodData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // edit a single product and return confirmation
    const prodData = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    if (!prodData[0]) {
      // does a product exist with that id
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }
    if (req.body.tagIds.length) {
      // get the existing tags and convert to an array
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id }});
      const productTagIds = productTags.map( ({ tag_id }) => tag_id );

      // compare updated tag list to existing tags and identify new ones to add
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return { product_id: req.params.id, tag_id }
        });

      // compare updated tag list to existing tags and identify ones to delete
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // add the new tags, remove the deleted ones
      const created = await ProductTag.bulkCreate(newProductTags);
      const removed = await ProductTag.destroy({ where: { id: productTagsToRemove } });
    }
    res.status(200).json({ message: "Product updated" });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // delete a single product and return confirmation
    const prodData = await Product.destroy({
      where: { id: req.params.id }
    });

    if (!prodData) {
      // does a product exist with this id
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }
    
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
