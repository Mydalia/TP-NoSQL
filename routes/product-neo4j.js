const express = require('express');
const router = express.Router();

const products = require('../models/product-neo4j');

router.post('/', async(req, res, next) => {
    // #swagger.tags = ['Neo4j/Products']
    try {
        if(req.body.number && req.body.batch) {
            res.status(201).json(await products.createMany(req.body.number, req.body.batch));
        } else {
            res.status(201).json(await products.create(req.body.email, req.body.name));
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
