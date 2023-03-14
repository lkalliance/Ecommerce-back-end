const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

/* -- CRUD routes for "/api/tags" -- */

router.get('/', async (req, res) => {
  try {
    // find and return all tags, with associated products
    const tagData = await Tag.findAll({ include: [{ model: Product }]});
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  } 
});

router.get('/:id', async (req, res) => {
  try {
    // find and return a single tag, with associated products
    const tagData = await Tag.findByPk(req.params.id, { include: [{ model: Product }]});
    if (!tagData) {
      // does a tag exist with this id
      res.status(404).json({message: "No tag found with that id!"});
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // add a new tag and return the added tag
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    // edit a single tag and return confirmation 
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      }
    });
    if (!tagData) {
      // does a tag exist with that id
      res.status(404).json({message: "No tag found with that id!"});
      return;
    }
    res.status(200).json({ message: (tagData[0]==1) ? "Tag edited" : "Tag not edited" });
  } catch (err) {
    res.status(400).json(err);
  }});

router.delete('/:id', async (req, res) => {
  try {
    // delete a single tag and return confirmation
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    });
    if (!tagData) {
      // does a tag exist with this id
      res.status(404).json({message: "No tag found with that id!"});
      return;
    }
    res.status(200).json({ message: (tagData==1) ? "Tag deleted" : "Tag not deleted" });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
