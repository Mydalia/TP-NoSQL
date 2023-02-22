const express = require('express');
const router = express.Router();

const products = require('../models/product-neo4j');

router.post('/', async(req, res, next) => {
    // #swagger.tags = ['Neo4j/Products']
    try {
        if (req.body.number && req.body.batch) {
            res.status(201).json(await products.createMany(req.body.number, req.body.batch));
        } else {
            res.status(201).json(await products.create(req.body.email, req.body.name));
        }
    } catch (e) {
        next(e);
    }
});

router.get('/:id/getFollowersByProduct', async(req, res, next) => {
    // #swagger.tags = ['Neo4j/Products']
    try {
        if (req.query.userId && req.query.maxLevels) {
            res.status(200).json(await products.getFollowersByProduct(req.params.id, req.query.userId, req.query.maxLevels));
        } else {
            res.status(200).json({ error: 'Missing query parameter' });
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
