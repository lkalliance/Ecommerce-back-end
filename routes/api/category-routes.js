const router = require('express').Router();
const { Category, Product } = require('../../models');

/* -- CRUD routes for "/api/categories" -- */

router.get('/', async (req, res) => {
  try {
    // find and return all categories, with associated products
    const catData = await Category.findAll({ include: [{ model: Product }]});

    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }   
});

router.get('/:id', async (req, res) => {
  try {
    // find and return a single category, with associated products
    const catData = await Category.findByPk(req.params.id, { include: [{ model: Product }] });

    if (!catData) {
      // does a product exist with that id
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json(catData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // add a new category and return the category added
    const catData = await Category.create(req.body);

    res.status(200).json(catData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // edit a single category and return confirmation
    const catData = await Category.update(req.body, {
      where: { id: req.params.id }
    });

    if (!catData[0]) {
      // does a category exist with that id
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    res.status(200).json({ message: "Category edited" });
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    // delete a single category and return confirmation
    const catData = await Category.destroy({
      where: { id: req.params.id }
    });

    if (!catData) {
      // does a category exist with that id
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }
    
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
